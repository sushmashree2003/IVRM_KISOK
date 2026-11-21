"use client";

import React, { useState, useEffect } from "react";
import {
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowLeft,
  KeyRound,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Keyboard,
  Delete,
  Building2,
} from "lucide-react";
import { getInstituteLogo, getInstituteName, getAiAssistantName } from "@/lib/session";

interface AdminPasswordGateProps {
  onSuccess: () => void;
  onBackToKiosk: () => void;
}

export default function AdminPasswordGate({
  onSuccess,
  onBackToKiosk,
}: AdminPasswordGateProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [showVirtualKeyboard, setShowVirtualKeyboard] = useState(false);
  const [isShift, setIsShift] = useState(true); // Default shift on for initial uppercase like SGS...

  const [schoolLogo, setSchoolLogo] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [aiName, setAiName] = useState("");

  useEffect(() => {
    setSchoolLogo(getInstituteLogo());
    setSchoolName(getInstituteName() || "Campus Smart Kiosk");
    setAiName(getAiAssistantName() || "Campus AI");

    fetch("/api/branding", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data) return;
        if (data.logo) setSchoolLogo(data.logo);
        if (data.name) setSchoolName(data.name);
        if (data.aiName) setAiName(data.aiName);
      })
      .catch(() => {});
  }, []);

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!password.trim()) {
      setErrorMessage("Please enter the administrator password.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/admin/verify-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess(true);
        sessionStorage.setItem("kiosk_admin_auth", "authenticated");
        setTimeout(() => {
          onSuccess();
        }, 500);
      } else {
        setErrorMessage(data.message || "Invalid administrator password. Access denied.");
      }
    } catch {
      // Fallback: check environment variable directly if API is unreachable
      const fallbackPass = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "SGSNov@321";
      if (password === fallbackPass) {
        setSuccess(true);
        sessionStorage.setItem("kiosk_admin_auth", "authenticated");
        setTimeout(() => {
          onSuccess();
        }, 500);
      } else {
        setErrorMessage("Invalid administrator password. Access denied.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (char: string) => {
    setPassword((prev) => prev + char);
    setErrorMessage("");
  };

  const handleBackspace = () => {
    setPassword((prev) => prev.slice(0, -1));
    setErrorMessage("");
  };

  const handleClear = () => {
    setPassword("");
    setErrorMessage("");
  };

  // Keyboard layout rows
  const row1 = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "@", "#", "$", "!"];
  const rowLetters1 = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
  const rowLetters2 = ["A", "S", "D", "F", "G", "H", "J", "K", "L"];
  const rowLetters3 = ["Z", "X", "C", "V", "B", "N", "M", ".", "_", "-"];

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
        position: "relative",
        overflowX: "hidden",
        overflowY: "auto",
        padding: "1.5rem",
        boxSizing: "border-box",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Background Ambience Elements */}
      <div
        style={{
          position: "absolute",
          top: "-15%",
          right: "-10%",
          width: "550px",
          height: "550px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(234, 88, 12, 0.15) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-15%",
          left: "-10%",
          width: "550px",
          height: "550px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Main Glassmorphic Security Card */}
      <div
        style={{
          width: "100%",
          maxWidth: showVirtualKeyboard ? "780px" : "480px",
          transition: "max-width 0.25s ease",
          background: "rgba(30, 41, 59, 0.96)",
          borderRadius: "24px",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(234, 88, 12, 0.2)",
          padding: "2rem",
          position: "relative",
          zIndex: 10,
          color: "#fff",
        }}
      >
        {/* Top Header / Branding */}
        <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "72px",
              height: "72px",
              borderRadius: "20px",
              background: "linear-gradient(135deg, rgba(234, 88, 12, 0.25) 0%, rgba(234, 88, 12, 0.08) 100%)",
              border: "1.5px solid rgba(234, 88, 12, 0.4)",
              marginBottom: "1rem",
              boxShadow: "0 8px 24px rgba(234, 88, 12, 0.2)",
            }}
          >
            {schoolLogo ? (
              <img
                src={schoolLogo}
                alt="School Logo"
                style={{ width: "48px", height: "48px", objectFit: "contain", borderRadius: "8px" }}
              />
            ) : (
              <Building2 size={36} style={{ color: "#ea580c" }} />
            )}
          </div>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "rgba(234, 88, 12, 0.15)",
              border: "1px solid rgba(234, 88, 12, 0.35)",
              borderRadius: "9999px",
              padding: "4px 12px",
              fontSize: "0.78rem",
              fontWeight: 800,
              color: "#fb923c",
              letterSpacing: "0.05em",
              marginBottom: "0.5rem",
              textTransform: "uppercase",
            }}
          >
            <ShieldCheck size={14} /> Restricted Area
          </div>

          <h2
            style={{
              margin: "0 0 0.35rem 0",
              fontSize: "1.45rem",
              fontWeight: 800,
              color: "#f8fafc",
              letterSpacing: "-0.02em",
            }}
          >
            Admin Security Verification
          </h2>

          <p
            style={{
              margin: 0,
              fontSize: "0.86rem",
              color: "#94a3b8",
              lineHeight: 1.4,
            }}
          >
            {schoolName} • Kiosk CMS & Configuration
          </p>
        </div>

        {/* Verification Form */}
        <form onSubmit={handleVerify}>
          <div style={{ marginBottom: "1.25rem" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.82rem",
                fontWeight: 700,
                color: "#cbd5e1",
                marginBottom: "0.5rem",
                letterSpacing: "0.02em",
              }}
            >
              Enter Administrator Password:
            </label>

            <div
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                background: "rgba(15, 23, 42, 0.75)",
                borderRadius: "14px",
                border: errorMessage
                  ? "1.5px solid #ef4444"
                  : "1.5px solid rgba(255, 255, 255, 0.15)",
                transition: "all 0.2s ease",
              }}
            >
              <div style={{ paddingLeft: "14px", color: "#64748b" }}>
                <KeyRound size={18} />
              </div>

              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMessage("");
                }}
                placeholder="Enter admin password"
                autoFocus
                disabled={loading || success}
                style={{
                  width: "100%",
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "#f8fafc",
                  fontSize: "1.05rem",
                  padding: "14px 12px",
                  fontFamily: "inherit",
                }}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#94a3b8",
                  padding: "0 14px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                }}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div
                style={{
                  marginTop: "0.6rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  color: "#f87171",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  animation: "fadeIn 0.2s ease",
                }}
              >
                <AlertCircle size={15} />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div
                style={{
                  marginTop: "0.6rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  color: "#4ade80",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                }}
              >
                <CheckCircle2 size={16} />
                <span>Access granted! Unlocking Admin Portal...</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: "10px", marginTop: "1.5rem" }}>
            <button
              type="button"
              onClick={onBackToKiosk}
              style={{
                flex: "1",
                padding: "12px 16px",
                borderRadius: "12px",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                background: "rgba(255, 255, 255, 0.05)",
                color: "#cbd5e1",
                fontSize: "0.92rem",
                fontWeight: 700,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                transition: "all 0.15s ease",
              }}
            >
              <ArrowLeft size={16} /> Return to Kiosk
            </button>

            <button
              type="submit"
              disabled={loading || success}
              style={{
                flex: "1.4",
                padding: "12px 18px",
                borderRadius: "12px",
                border: "none",
                background: "linear-gradient(135deg, #ea580c 0%, #c2410c 100%)",
                color: "#ffffff",
                fontSize: "0.95rem",
                fontWeight: 800,
                cursor: loading || success ? "not-allowed" : "pointer",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                boxShadow: "0 4px 16px rgba(234, 88, 12, 0.35)",
                transition: "all 0.15s ease",
                opacity: loading || success ? 0.8 : 1,
              }}
            >
              {loading ? (
                <>
                  <RefreshCw size={16} className="animate-spin" /> Verifying...
                </>
              ) : success ? (
                <>
                  <CheckCircle2 size={16} /> Unlocked
                </>
              ) : (
                <>
                  <Lock size={16} /> Verify & Enter
                </>
              )}
            </button>
          </div>

          {/* Virtual Touchscreen Keyboard Toggle */}
          <div style={{ textAlign: "center", marginTop: "1.25rem" }}>
            <button
              type="button"
              onClick={() => setShowVirtualKeyboard(!showVirtualKeyboard)}
              style={{
                background: "transparent",
                border: "none",
                color: "#94a3b8",
                fontSize: "0.82rem",
                fontWeight: 600,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 12px",
                borderRadius: "8px",
                transition: "color 0.15s ease",
              }}
            >
              <Keyboard size={15} />
              <span>{showVirtualKeyboard ? "Hide On-Screen Keyboard" : "Touchscreen On-Screen Keyboard"}</span>
            </button>
          </div>

          {/* On-Screen Touch Keyboard for Kiosks */}
          {showVirtualKeyboard && (
            <div
              style={{
                marginTop: "1rem",
                padding: "1rem",
                background: "rgba(15, 23, 42, 0.9)",
                borderRadius: "16px",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                userSelect: "none",
              }}
            >
              {/* Row 1: Numbers & Symbols */}
              <div style={{ display: "flex", gap: "6px", justifyContent: "center", marginBottom: "6px" }}>
                {row1.map((char) => (
                  <button
                    key={char}
                    type="button"
                    onClick={() => handleKeyPress(char)}
                    style={{
                      flex: 1,
                      height: "40px",
                      borderRadius: "8px",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      background: "rgba(255, 255, 255, 0.06)",
                      color: "#f8fafc",
                      fontSize: "0.95rem",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    {char}
                  </button>
                ))}
              </div>

              {/* Row 2: Letters Q-P */}
              <div style={{ display: "flex", gap: "6px", justifyContent: "center", marginBottom: "6px" }}>
                {rowLetters1.map((char) => {
                  const displayChar = isShift ? char : char.toLowerCase();
                  return (
                    <button
                      key={char}
                      type="button"
                      onClick={() => handleKeyPress(displayChar)}
                      style={{
                        flex: 1,
                        height: "40px",
                        borderRadius: "8px",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        background: "rgba(255, 255, 255, 0.06)",
                        color: "#f8fafc",
                        fontSize: "0.95rem",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      {displayChar}
                    </button>
                  );
                })}
              </div>

              {/* Row 3: Letters A-L */}
              <div style={{ display: "flex", gap: "6px", justifyContent: "center", marginBottom: "6px", padding: "0 14px" }}>
                {rowLetters2.map((char) => {
                  const displayChar = isShift ? char : char.toLowerCase();
                  return (
                    <button
                      key={char}
                      type="button"
                      onClick={() => handleKeyPress(displayChar)}
                      style={{
                        flex: 1,
                        height: "40px",
                        borderRadius: "8px",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        background: "rgba(255, 255, 255, 0.06)",
                        color: "#f8fafc",
                        fontSize: "0.95rem",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      {displayChar}
                    </button>
                  );
                })}
              </div>

              {/* Row 4: Shift, Z-M, Backspace */}
              <div style={{ display: "flex", gap: "6px", justifyContent: "center", marginBottom: "6px" }}>
                <button
                  type="button"
                  onClick={() => setIsShift(!isShift)}
                  style={{
                    flex: 1.5,
                    height: "40px",
                    borderRadius: "8px",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    background: isShift ? "rgba(234, 88, 12, 0.35)" : "rgba(255, 255, 255, 0.06)",
                    color: isShift ? "#fb923c" : "#94a3b8",
                    fontSize: "0.85rem",
                    fontWeight: 800,
                    cursor: "pointer",
                  }}
                >
                  ⇧ Shift
                </button>

                {rowLetters3.map((char) => {
                  const isAlpha = /[A-Z]/.test(char);
                  const displayChar = isAlpha ? (isShift ? char : char.toLowerCase()) : char;
                  return (
                    <button
                      key={char}
                      type="button"
                      onClick={() => handleKeyPress(displayChar)}
                      style={{
                        flex: 1,
                        height: "40px",
                        borderRadius: "8px",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        background: "rgba(255, 255, 255, 0.06)",
                        color: "#f8fafc",
                        fontSize: "0.95rem",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      {displayChar}
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={handleBackspace}
                  style={{
                    flex: 1.5,
                    height: "40px",
                    borderRadius: "8px",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    background: "rgba(239, 68, 68, 0.2)",
                    color: "#f87171",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Delete size={18} />
                </button>
              </div>

              {/* Row 5: Clear and Space */}
              <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
                <button
                  type="button"
                  onClick={handleClear}
                  style={{
                    flex: 1,
                    height: "36px",
                    borderRadius: "8px",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    background: "rgba(255, 255, 255, 0.06)",
                    color: "#94a3b8",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Clear All
                </button>
                <button
                  type="button"
                  onClick={() => handleKeyPress(" ")}
                  style={{
                    flex: 3,
                    height: "36px",
                    borderRadius: "8px",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    background: "rgba(255, 255, 255, 0.06)",
                    color: "#cbd5e1",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Space
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
