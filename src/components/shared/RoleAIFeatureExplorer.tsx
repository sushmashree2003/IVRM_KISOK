"use client";

import React, { useState, useMemo } from "react";
import { getAiAssistantName } from "@/lib/session";
import {
  ROLE_AI_METADATA,
  RoleAIFeatureItem,
  RoleAIMetadata,
} from "@/config/roleAiFeatures";
import {
  Sparkles,
  UserCheck,
  GraduationCap,
  Receipt,
  CalendarDays,
  BookOpen,
  Clock,
  HeartHandshake,
  Award,
  Activity,
  Calendar,
  ShieldCheck,
  HelpCircle,
  CheckCircle2,
  Compass,
  Info,
  FileText,
  Building2,
  Search,
  Filter,
  ArrowRight,
  Zap,
  Layers,
} from "lucide-react";

interface RoleAIFeatureExplorerProps {
  role: "student_parent" | "teacher_staff" | "visitor_applicant" | "alumni_ex_employee";
  onSelectPrompt: (prompt: string) => void;
  selectedFeatureId?: string;
  className?: string;
}

// Icon renderer with safe fallbacks
const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>> = {
  UserCheck,
  GraduationCap,
  Receipt,
  CalendarDays,
  BookOpen,
  Clock,
  HeartHandshake,
  Award,
  Activity,
  Calendar,
  ShieldCheck,
  HelpCircle,
  CheckCircle2,
  Compass,
  Info,
  FileText,
  Building2,
  Sparkles,
  Layers,
};

export default function RoleAIFeatureExplorer({
  role,
  onSelectPrompt,
  selectedFeatureId,
  className = "",
}: RoleAIFeatureExplorerProps) {
  const aiName = getAiAssistantName();
  const meta: RoleAIMetadata | undefined = ROLE_AI_METADATA[role];
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activePromptClicked, setActivePromptClicked] = useState<string | null>(null);

  // Compute available categories for this role
  const categories = useMemo(() => {
    if (!meta) return ["All"];
    const cats = Array.from(new Set(meta.features.map((f) => f.category)));
    return ["All", ...cats];
  }, [meta]);

  // Filter features based on category and search query
  const filteredFeatures = useMemo(() => {
    if (!meta) return [];
    return meta.features.filter((f) => {
      const matchesCategory =
        selectedCategory === "All" || f.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        f.name.toLowerCase().includes(q) ||
        f.category.toLowerCase().includes(q) ||
        f.prompts.some((p) => p.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [meta, selectedCategory, searchQuery]);

  const handlePromptClick = (prompt: string) => {
    setActivePromptClicked(prompt);
    onSelectPrompt(prompt);
    setTimeout(() => setActivePromptClicked(null), 1200);
  };

  if (!meta) {
    return (
      <div style={{ padding: "1.5rem", textAlign: "center", color: "#64748b" }}>
        No AI topics registered for this role.
      </div>
    );
  }

  return (
    <div
      className={`role-ai-feature-explorer ${className}`}
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "rgba(255, 255, 255, 0.94)",
        backdropFilter: "blur(14px)",
        borderRadius: "20px",
        border: `1.5px solid ${meta.borderColor}`,
        boxShadow: "0 10px 32px rgba(15, 23, 42, 0.05)",
        overflow: "hidden",
      }}
    >
      {/* Top Banner / Role Identity */}
      <div
        style={{
          padding: "1rem 1.25rem 0.85rem",
          background: `linear-gradient(135deg, ${meta.lightBg} 0%, #ffffff 100%)`,
          borderBottom: `1px solid ${meta.borderColor}`,
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem", marginBottom: "0.4rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "10px",
                background: meta.primaryColor,
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 4px 12px ${meta.primaryColor}33`,
              }}
            >
              <Sparkles size={18} />
            </div>
            <div>
              <h3
                style={{
                  fontFamily: "Outfit, sans-serif",
                  fontSize: "0.98rem",
                  fontWeight: 800,
                  color: "#0f172a",
                  margin: 0,
                  lineHeight: 1.2,
                }}
              >
                Topics &amp; Questions
              </h3>
              <span style={{ fontSize: "0.7rem", color: "#64748b", fontWeight: 600 }}>
                {meta.roleLabel}
              </span>
            </div>
          </div>

          {/* Topics Count Pill */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              padding: "0.28rem 0.65rem",
              borderRadius: "9999px",
              fontSize: "0.68rem",
              fontWeight: 800,
              background: meta.lightBg,
              color: meta.primaryColor,
              border: `1px solid ${meta.borderColor}`,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: meta.primaryColor,
              }}
            />
            {meta.features.length} Topics
          </div>
        </div>

        <p
          style={{
            fontSize: "0.74rem",
            color: "#475569",
            margin: "0 0 0.75rem 0",
            lineHeight: 1.45,
          }}
        >
          {meta.subtitle}
        </p>

        {/* Search & Category Filter Controls */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {/* Search bar */}
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Search
              size={14}
              style={{
                position: "absolute",
                left: "10px",
                color: "#94a3b8",
                pointerEvents: "none",
              }}
            />
            <input
              type="text"
              placeholder={`Search topics or questions...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "0.42rem 0.75rem 0.42rem 2rem",
                borderRadius: "10px",
                border: "1px solid #cbd5e1",
                background: "#ffffff",
                fontSize: "0.76rem",
                color: "#1e293b",
                outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = meta.primaryColor)}
              onBlur={(e) => (e.target.style.borderColor = "#cbd5e1")}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                style={{
                  position: "absolute",
                  right: "8px",
                  background: "transparent",
                  border: "none",
                  fontSize: "0.75rem",
                  color: "#94a3b8",
                  cursor: "pointer",
                  fontWeight: 800,
                }}
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Pills */}
          <div
            style={{
              display: "flex",
              gap: "0.35rem",
              overflowX: "auto",
              paddingBottom: "2px",
              scrollbarWidth: "none",
            }}
          >
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: "0.26rem 0.65rem",
                    borderRadius: "9999px",
                    border: isSelected
                      ? `1px solid ${meta.primaryColor}`
                      : "1px solid #e2e8f0",
                    background: isSelected ? meta.primaryColor : "#ffffff",
                    color: isSelected ? "#ffffff" : "#475569",
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Feature & Question List Body */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "0.85rem 1rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
          background: "#f8fafc",
        }}
      >
        {filteredFeatures.length === 0 ? (
          <div
            style={{
              padding: "2rem 1rem",
              textAlign: "center",
              color: "#94a3b8",
              fontSize: "0.8rem",
            }}
          >
            <Filter size={24} style={{ margin: "0 auto 0.5rem", opacity: 0.5 }} />
            No topics match &quot;{searchQuery}&quot; in category &quot;{selectedCategory}&quot;.
          </div>
        ) : (
          filteredFeatures.map((feature) => {
            const IconComponent = ICON_MAP[feature.iconName] || Sparkles;
            const isHighlighted = selectedFeatureId === feature.id;

            return (
              <div
                key={feature.id}
                style={{
                  background: "#ffffff",
                  borderRadius: "14px",
                  border: isHighlighted
                    ? `2px solid ${meta.primaryColor}`
                    : "1px solid #e2e8f0",
                  padding: "0.85rem",
                  boxShadow: isHighlighted
                    ? `0 6px 18px ${meta.primaryColor}22`
                    : "0 2px 8px rgba(0, 0, 0, 0.03)",
                  transition: "all 0.2s ease",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.6rem",
                }}
              >
                {/* Feature Header (Topic) */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.55rem",
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "10px",
                      background: `${feature.accentColor}18`,
                      color: feature.accentColor,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <IconComponent size={16} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: 800,
                        color: "#1e293b",
                        margin: 0,
                        lineHeight: 1.25,
                      }}
                    >
                      {feature.name}
                    </h4>
                    <span
                      style={{
                        fontSize: "0.64rem",
                        fontWeight: 700,
                        color: "#64748b",
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                      }}
                    >
                      {feature.category}
                    </span>
                  </div>
                </div>

                {/* Interactive Questions List */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.35rem",
                  }}
                >
                  {feature.prompts.map((prompt, pIdx) => {
                    const isClicked = activePromptClicked === prompt;
                    return (
                      <button
                        key={pIdx}
                        onClick={() => handlePromptClick(prompt)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "8px",
                          padding: "0.45rem 0.75rem",
                          borderRadius: "10px",
                          border: isClicked
                            ? `1.5px solid ${meta.primaryColor}`
                            : "1px solid #e2e8f0",
                          background: isClicked ? meta.lightBg : "#ffffff",
                          color: isClicked ? meta.primaryColor : "#334155",
                          fontSize: "0.74rem",
                          fontWeight: 700,
                          cursor: "pointer",
                          textAlign: "left",
                          transition: "all 0.15s ease",
                          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.03)",
                          width: "100%",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = meta.primaryColor;
                          e.currentTarget.style.color = meta.primaryColor;
                          e.currentTarget.style.background = meta.lightBg;
                        }}
                        onMouseLeave={(e) => {
                          if (!isClicked) {
                            e.currentTarget.style.borderColor = "#e2e8f0";
                            e.currentTarget.style.color = "#334155";
                            e.currentTarget.style.background = "#ffffff";
                          }
                        }}
                      >
                        <span>{prompt}</span>
                        <ArrowRight
                          size={12}
                          style={{
                            color: meta.primaryColor,
                            opacity: isClicked ? 1 : 0.6,
                            flexShrink: 0,
                          }}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Info */}
      <div
        style={{
          padding: "0.6rem 1rem",
          background: "#ffffff",
          borderTop: "1px solid #e2e8f0",
          fontSize: "0.68rem",
          color: "#64748b",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <Sparkles size={12} style={{ color: meta.primaryColor }} />
          Tap any question to ask {aiName}
        </span>
        <span style={{ fontWeight: 700, color: meta.primaryColor }}>
          {meta.features.length} Topics
        </span>
      </div>
    </div>
  );
}
