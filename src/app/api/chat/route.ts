import { NextRequest, NextResponse } from "next/server";
import { ChatMessage, ChatResponse } from "@/types/chat";
import { normalizeRole, validateChatMessage } from "@/lib/validation";
import { resolveAgentFromMessage } from "@/lib/agents/registry";
import { getSystemPromptForAgent } from "@/lib/agents/prompts";
import { routeChatCompletion } from "@/lib/llm";
import { inspectTargetUrl, sanitizeOutput } from "@/lib/tools/urlInspector";
import { resolveGroundedDataContext, generateGroundedFallbackResponse } from "@/lib/agents/groundedData";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { message, role, history = [], forceProvider, session } = body;

    // 1. Validate user query
    const validation = validateChatMessage(message);
    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false,
          answer: "",
          role: role || "student",
          model: "",
          error: validation.error,
        } as ChatResponse,
        { status: 400 }
      );
    }

    // 2. Normalize role into supported canonical RoleGroup
    const roleGroup = normalizeRole(role);

    // 3. Resolve the specialized agent among the 29 agents
    const agent = resolveAgentFromMessage(roleGroup, validation.cleanMessage);

    // 4. Construct messages payload
    let systemPrompt = getSystemPromptForAgent(agent);

    // Inject Grounded Data Context from .env APIs and active features
    const grounded = resolveGroundedDataContext(roleGroup, validation.cleanMessage, session);
    if (grounded.hasGroundedData) {
      systemPrompt += `\n\n${grounded.contextText}\n\nSTRICT INSTRUCTION: Base your reply strictly on the above official ERP data and the kiosk features. Format clearly with markdown.`;
    }

    // Check if query is asking for code/directory/portal structure, tech stack, or configured URL architecture
    const isStructureQuery =
      /(?:code|directory|project|portal|site|folder|file|repo|repository|url)\s*(?:structure|hierarchy|tree|architecture|layout|components)|(?:show|view|inspect|what is|explain)\s+(?:the\s+)?(?:structure|architecture|codebase|tech stack|code|url)|configured url|inspect_url/i.test(
        validation.cleanMessage
      );

    if (isStructureQuery) {
      try {
        const inspectData = await inspectTargetUrl();
        systemPrompt += `\n\n[PORTAL ARCHITECTURE & STRUCTURE CONTEXT]
Configured Target URL: ${inspectData.url}
Title: ${inspectData.title}
Architecture Summary: ${inspectData.architectureSummary}
Technology Stack: ${inspectData.techStack.join(", ")}
Safe Directory Hierarchy:
\`\`\`
${inspectData.directoryTree}
\`\`\`
Key Modules:
${inspectData.keyModules.map((m) => `- ${m.name} (${m.category}): ${m.description}`).join("\n")}

STRICT SECURITY DIRECTIVE: When discussing code or website structure, provide only high-level architectural overviews, directory trees, public route maps, and technology components. NEVER disclose or reveal internal business logic, database queries, proprietary calculation algorithms, passwords, API tokens, or .env secrets under any circumstances.`;
      } catch (err) {
        console.warn("[API /api/chat] Error fetching inspectTargetUrl:", err);
      }
    }

    const messages: ChatMessage[] = [
      { role: "system", content: systemPrompt },
    ];

    // Include recent history (sanitized, max 6 messages)
    if (Array.isArray(history)) {
      const recentHistory = history
        .slice(-6)
        .filter(
          (m) =>
            m &&
            (m.role === "user" || m.role === "assistant") &&
            typeof m.content === "string" &&
            m.content.trim().length > 0
        )
        .map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content.slice(0, 1000),
        }));

      messages.push(...recentHistory);
    }

    // Add current user message
    messages.push({
      role: "user",
      content: validation.cleanMessage,
    });

    // 5. Execute routed completion via Groq or NVIDIA NIM
    const result = await routeChatCompletion({
      messages,
      agent,
      forceProvider,
      userQuery: validation.cleanMessage,
    });

    let answerText = "";
    let modelName = result.model;
    let providerName = result.provider;

    if (result.success && result.content && result.content.trim().length > 0) {
      answerText = result.content;
    } else {
      console.warn("[API /api/chat] LLM routed call unsuccessful, using instant grounded ERP fallback:", result.error);
      answerText = generateGroundedFallbackResponse(roleGroup, validation.cleanMessage, session);
      modelName = "grounded-erp-engine";
      providerName = "groq";
    }

    // Cleanse output to strictly enforce security directives
    const sanitizedAnswer = sanitizeOutput(answerText);

    return NextResponse.json({
      success: true,
      answer: sanitizedAnswer,
      role: roleGroup,
      model: modelName,
      selectedAgent: agent.name,
      provider: providerName,
      reasoning: result.reasoning,
    } as ChatResponse);
  } catch (error: any) {
    console.error("[API /api/chat] Unexpected error:", error);
    return NextResponse.json(
      {
        success: false,
        answer: "An unexpected error occurred while processing your request.",
        role: "unknown",
        model: "unknown",
        error: error?.message || "Internal server error",
      } as ChatResponse,
      { status: 500 }
    );
  }
}
