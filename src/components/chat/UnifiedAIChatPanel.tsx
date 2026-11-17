"use client";

import React, { useState, useEffect, useRef } from "react";
import MarkdownResponse from "@/components/chat/MarkdownResponse";
import RoleAIFeatureExplorer from "@/components/shared/RoleAIFeatureExplorer";
import { ROLE_AI_METADATA, RoleAIMetadata } from "@/config/roleAiFeatures";
import { getAiAssistantName, getInstituteName, getUserSession } from "@/lib/session";
import {
  Sparkles,
  Send,
  RefreshCw,
  ArrowLeft,
  Bot,
  User,
  Trash2,
  Zap,
  CheckCircle2,
  X,
  MessageSquare,
  HelpCircle,
} from "lucide-react";

export type UnifiedRole =
  | "student_parent"
  | "teacher_staff"
  | "visitor_applicant"
  | "alumni_ex_employee";

export interface UnifiedAIChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  time: string;
  suggestions?: string[];
}

export interface UnifiedAIChatPanelProps {
  role: UnifiedRole;
  title?: string;
  subtitle?: string;
  onBack?: () => void;
  variant?: "fullscreen" | "modal" | "embedded";
  userName?: string;
  initialPrompt?: string;
  className?: string;
}

export default function UnifiedAIChatPanel({
  role,
  title,
  subtitle,
  onBack,
  variant = "fullscreen",
  userName,
  initialPrompt,
  className = "",
}: UnifiedAIChatPanelProps) {
  const aiName = getAiAssistantName();
  const schoolName = getInstituteName();
  const meta: RoleAIMetadata = ROLE_AI_METADATA[role] || ROLE_AI_METADATA.student_parent;

  // Generate initial welcome message based on role and user context
  const getInitialMessage = (): UnifiedAIChatMessage => {
    let welcome = `Namaste! I am **${aiName}**, your dedicated AI Assistant for ${schoolName}.`;
    if (userName) {
      welcome = `Namaste **${userName}**! I am **${aiName}**, your dedicated AI Assistant for ${schoolName}.`;
    }

    if (role === "student_parent") {
      welcome += ` I can assist with your attendance records, exam scorecards, daily timetable, and fee ledgers. Explore the topics on the left or type your question below!`;
    } else if (role === "teacher_staff") {
      welcome += ` I can help with teaching schedules, lesson planning, student evaluation analytics, leave tracking, and CBSE compliance. Tap any topic on the left or ask me directly!`;
    } else if (role === "visitor_applicant") {
      welcome += ` Welcome to our campus! Ask me anything regarding admissions, age eligibility, fee structures, campus walking directions, or scheduling an appointment.`;
    } else if (role === "alumni_ex_employee") {
      welcome += ` Welcome back! I can assist with transcript archives, duplicate certificates, batch reunions, student mentorship, and former faculty records.`;
    }

    // Default suggestions from role features
    const initialSuggestions = meta.features
      .flatMap((f) => f.prompts)
      .slice(0, 4);

    return {
      id: "msg-init",
      sender: "bot",
      text: welcome,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      suggestions: initialSuggestions,
    };
  };

  const [chatMessages, setChatMessages] = useState<UnifiedAIChatMessage[]>([getInitialMessage()]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isTyping]);

  // Handle initial prompt if provided
  useEffect(() => {
    if (initialPrompt && initialPrompt.trim()) {
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt]);

  // Compute prominent quick prompts from role metadata
  const quickPrompts = React.useMemo(() => {
    return meta.features.flatMap((f) => f.prompts).slice(0, 6);
  }, [meta]);

  const handleSendMessage = async (textToSend?: string) => {
    if (isTyping) return;
    const query = (textToSend || chatInput).trim();
    if (!query) return;

    const userMsg: UnifiedAIChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setChatInput("");
    setIsTyping(true);

    try {
      // Map history for /api/chat
      const history = chatMessages.slice(-6).map((m) => ({
        role: m.sender === "user" ? "user" : "assistant",
        content: m.text,
      }));

      const session = getUserSession();

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          role,
          history,
          session,
        }),
      });

      const data = await res.json();
      const botAnswer =
        data.answer ||
        data.content ||
        "I could not retrieve an answer at this moment. Please try asking again or check the administrative desk.";

      // Select dynamic suggestions related to the role
      const randomSuggestions = meta.features
        .flatMap((f) => f.prompts)
        .filter((p) => p.toLowerCase() !== query.toLowerCase())
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

      const botMsg: UnifiedAIChatMessage = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: botAnswer,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        suggestions: randomSuggestions,
      };

      setChatMessages((prev) => [...prev, botMsg]);
    } catch {
      const errorMsg: UnifiedAIChatMessage = {
        id: `bot-err-${Date.now()}`,
        sender: "bot",
        text: "We are currently experiencing connectivity delay with the campus AI server. Please try your request once more in a few moments.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setChatMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearHistory = () => {
    setChatMessages([getInitialMessage()]);
  };

  const displayTitle = title || `${aiName} • ${meta.roleLabel}`;
  const displaySubtitle = subtitle || meta.subtitle;

  return (
    <div
      className={`unified-ai-chat-root ${variant === "fullscreen" ? "student-fullscreen-page" : ""} ${className}`}
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        position: "relative",
      }}
    >
      {/* Background Orbs in fullscreen mode */}
      {variant === "fullscreen" && (
        <>
          <div className="kiosk-orb kiosk-orb-one" />
          <div className="kiosk-orb kiosk-orb-two" />
        </>
      )}

      {/* SUBNAV / HEADER */}
      <div
        className="student-screen-subnav"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.85rem 1.5rem",
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(14px)",
          borderBottom: `1.5px solid ${meta.borderColor}`,
          borderRadius: variant === "fullscreen" ? "0 0 16px 16px" : "16px 16px 0 0",
          boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {onBack && (
            <button
              onClick={onBack}
              className="student-back-to-dash-btn"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "0.45rem 0.85rem",
                borderRadius: "10px",
                border: "1px solid #e2e8f0",
                background: "#ffffff",
                fontSize: "0.78rem",
                fontWeight: 700,
                color: "#334155",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: "12px",
                background: meta.lightBg,
                color: meta.primaryColor,
                border: `1.5px solid ${meta.borderColor}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 4px 12px ${meta.primaryColor}22`,
              }}
            >
              <Sparkles size={20} />
            </div>
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "1.05rem",
                  fontWeight: 800,
                  color: "#0f172a",
                  lineHeight: 1.25,
                }}
              >
                {displayTitle}
              </h2>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.72rem",
                  color: "#64748b",
                  fontWeight: 600,
                }}
              >
                {displaySubtitle}
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {/* Mobile capabilities toggle button */}
          <button
            onClick={() => setShowMobileSidebar(!showMobileSidebar)}
            className="md:hidden"
            style={{
              padding: "0.35rem 0.75rem",
              borderRadius: "8px",
              background: meta.lightBg,
              border: `1px solid ${meta.borderColor}`,
              color: meta.primaryColor,
              fontSize: "0.74rem",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: "4px",
              cursor: "pointer",
            }}
          >
            <Zap size={13} />
            {showMobileSidebar ? "Hide Topics" : "View Topics"}
          </button>

          {/* Telemetry Status Pill */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "0.35rem 0.75rem",
              borderRadius: "9999px",
              background: "#ecfdf5",
              color: "#059669",
              border: "1px solid #a7f3d0",
              fontSize: "0.72rem",
              fontWeight: 800,
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#10b981",
                boxShadow: "0 0 6px #10b981",
              }}
            />
            <span>{aiName} Engine Online</span>
          </div>

          {/* Clear conversation button */}
          <button
            onClick={handleClearHistory}
            title="Clear conversation history"
            style={{
              padding: "0.35rem 0.65rem",
              borderRadius: "8px",
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              color: "#64748b",
              fontSize: "0.72rem",
              fontWeight: 600,
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            <Trash2 size={13} />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* MAIN TWO-COLUMN BODY */}
      <div
        className="student-screen-scroll-body"
        style={{
          flex: 1,
          minHeight: 0,
          padding: "1rem",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div
          className="ai-space-screen-layout"
          style={{
            flex: 1,
            minHeight: 0,
            display: "grid",
            gridTemplateColumns: variant === "modal" ? "1fr" : "330px 1fr",
            gap: "1rem",
            height: "100%",
          }}
        >
          {/* LEFT SIDEBAR: ROLE AI FEATURE CAPABILITIES EXPLORER */}
          {variant !== "modal" && (
            <aside
              style={{
                height: "100%",
                minHeight: 0,
                display: "flex",
                flexDirection: "column",
              }}
              className={`${showMobileSidebar ? "block" : "hidden md:flex"}`}
            >
              <RoleAIFeatureExplorer
                role={role}
                onSelectPrompt={(prompt) => {
                  handleSendMessage(prompt);
                  setShowMobileSidebar(false);
                }}
              />
            </aside>
          )}

          {/* RIGHT COLUMN: INTERACTIVE CHAT STREAM & INPUT CONSOLE */}
          <div
            className="ai-space-chat-card"
            style={{
              height: "100%",
              minHeight: 0,
              display: "flex",
              flexDirection: "column",
              background: "rgba(255, 255, 255, 0.94)",
              backdropFilter: "blur(14px)",
              borderRadius: "20px",
              border: `1.5px solid ${meta.borderColor}`,
              boxShadow: "0 10px 32px rgba(15, 23, 42, 0.05)",
              overflow: "hidden",
            }}
          >
            {/* Chat Messages Stream */}
            <div
              className="ai-chat-messages-stream"
              style={{
                flex: 1,
                minHeight: 0,
                overflowY: "auto",
                padding: "1.25rem",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                background: "#f8fafc",
              }}
            >
              {chatMessages.map((msg) => {
                const isUser = msg.sender === "user";
                return (
                  <div
                    key={msg.id}
                    className={`ai-msg-row ${isUser ? "ai-msg-row-user" : "ai-msg-row-bot"}`}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.65rem",
                      maxWidth: "85%",
                      alignSelf: isUser ? "flex-end" : "flex-start",
                      flexDirection: isUser ? "row-reverse" : "row",
                    }}
                  >
                    {/* Avatar Bubble */}
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "10px",
                        background: isUser ? meta.primaryColor : "#ffffff",
                        color: isUser ? "#ffffff" : meta.primaryColor,
                        border: isUser ? "none" : `1.5px solid ${meta.borderColor}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                      }}
                    >
                      {isUser ? <User size={16} /> : <Bot size={17} />}
                    </div>

                    {/* Message Bubble + Meta */}
                    <div
                      className="ai-msg-content-wrap"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.25rem",
                        maxWidth: "100%",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "0.66rem",
                          fontWeight: 700,
                          color: "#64748b",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.4rem",
                          justifyContent: isUser ? "flex-end" : "flex-start",
                          padding: "0 4px",
                        }}
                      >
                        <span>{isUser ? userName || "You" : aiName}</span>
                        <span>•</span>
                        <span>{msg.time}</span>
                      </div>

                      <div
                        className={`ai-bubble ${isUser ? "ai-bubble-user" : "ai-bubble-bot"}`}
                        style={{
                          padding: "0.85rem 1.15rem",
                          borderRadius: "16px",
                          background: isUser
                            ? `linear-gradient(135deg, ${meta.primaryColor} 0%, ${meta.primaryColor}dd 100%)`
                            : "#ffffff",
                          color: isUser ? "#ffffff" : "#1e293b",
                          border: isUser ? "none" : "1px solid rgba(226, 232, 240, 0.95)",
                          boxShadow: isUser
                            ? `0 4px 14px ${meta.primaryColor}33`
                            : "0 2px 8px rgba(0, 0, 0, 0.04)",
                          fontSize: "0.83rem",
                          lineHeight: 1.55,
                        }}
                      >
                        <MarkdownResponse content={msg.text} isUser={isUser} />
                      </div>

                      {/* Interactive Suggestions under Bot Replies */}
                      {!isUser && msg.suggestions && msg.suggestions.length > 0 && (
                        <div
                          className="ai-msg-suggestions-bar"
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "0.35rem",
                            marginTop: "0.35rem",
                          }}
                        >
                          {msg.suggestions.map((sug, sIdx) => (
                            <button
                              key={sIdx}
                              onClick={() => handleSendMessage(sug)}
                              disabled={isTyping}
                              style={{
                                background: meta.lightBg,
                                border: `1px solid ${meta.borderColor}`,
                                color: meta.primaryColor,
                                padding: "0.28rem 0.65rem",
                                borderRadius: "9999px",
                                fontSize: "0.71rem",
                                fontWeight: 700,
                                cursor: "pointer",
                                transition: "all 0.15s ease",
                                textAlign: "left",
                              }}
                            >
                              💡 {sug}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Typing indicator */}
              {isTyping && (
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "0.55rem 0.95rem",
                    background: "#ffffff",
                    border: `1.5px solid ${meta.borderColor}`,
                    borderRadius: "12px",
                    color: meta.primaryColor,
                    fontSize: "0.76rem",
                    fontWeight: 700,
                    width: "fit-content",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  }}
                >
                  <RefreshCw size={14} className="animate-spin" />
                  <span>{aiName} is thinking &amp; formulating response...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts Bar */}
            <div
              className="ai-quick-prompts-bar"
              style={{
                padding: "0.45rem 1rem",
                background: "#f8fafc",
                borderTop: "1px solid #f1f5f9",
                display: "flex",
                alignItems: "center",
                gap: "0.45rem",
                overflowX: "auto",
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  fontSize: "0.68rem",
                  fontWeight: 800,
                  color: "#94a3b8",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <Zap size={11} style={{ color: meta.primaryColor }} />
                Prompts:
              </span>
              {quickPrompts.map((prompt, pIdx) => (
                <button
                  key={pIdx}
                  onClick={() => handleSendMessage(prompt)}
                  disabled={isTyping}
                  className="ai-quick-prompt-btn"
                  style={{
                    whiteSpace: "nowrap",
                    background: "#ffffff",
                    border: "1px solid #e2e8f0",
                    padding: "0.3rem 0.75rem",
                    borderRadius: "9999px",
                    fontSize: "0.71rem",
                    fontWeight: 700,
                    color: "#334155",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    flexShrink: 0,
                  }}
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Chat Input Bar */}
            <div
              className="ai-chat-input-bar"
              style={{
                padding: "0.75rem 1rem",
                background: "#ffffff",
                borderTop: "1px solid rgba(226, 232, 240, 0.8)",
                display: "flex",
                alignItems: "center",
                gap: "0.65rem",
                flexShrink: 0,
              }}
            >
              <input
                type="text"
                className="ai-chat-text-input"
                placeholder={`Ask ${aiName} about your ${meta.roleLabel.toLowerCase()} inquiries...`}
                value={chatInput}
                disabled={isTyping}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                style={{
                  flex: 1,
                  background: "#f8fafc",
                  border: "1.5px solid #cbd5e1",
                  borderRadius: "9999px",
                  padding: "0.55rem 1.15rem",
                  fontSize: "0.82rem",
                  color: "#1e293b",
                  outline: "none",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => (e.target.style.borderColor = meta.primaryColor)}
                onBlur={(e) => (e.target.style.borderColor = "#cbd5e1")}
              />
              <button
                className="ai-chat-send-btn"
                onClick={() => handleSendMessage()}
                disabled={isTyping || !chatInput.trim()}
                title={`Send to ${aiName}`}
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  background: !chatInput.trim() || isTyping ? "#94a3b8" : meta.primaryColor,
                  color: "#ffffff",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: !chatInput.trim() || isTyping ? "not-allowed" : "pointer",
                  transition: "all 0.2s ease",
                  flexShrink: 0,
                  boxShadow:
                    !chatInput.trim() || isTyping
                      ? "none"
                      : `0 3px 12px ${meta.primaryColor}44`,
                }}
              >
                <Send size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
