"use client";

import React, { useState } from "react";
import {
  ShieldAlert,
  Lock,
  Eye,
  EyeOff,
  X,
  Minimize2,
  Maximize2,
  KeyRound,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Keyboard,
  Delete,
} from "lucide-react";

interface AdminExitFullscreenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AdminExitFullscreenModal({
  isOpen,
  onClose,
  onSuccess,
}: AdminExitFullscreenModalProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [showVirtualKeyboard, setShowVirtualKeyboard] = useState(false);
  const [isShift, setIsShift] = useState(true);

  if (!isOpen) return null;

  const handleVerify = async (action: "minimize" | "exit-fullscreen") => {
    if (!password.trim()) {
      setErrorMessage("Please enter the administrator password.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    let authorized = false;

    try {
      const res = await fetch("/api/admin/verify-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        authorized = true;
      } else {
        setErrorMessage(data.message || "Invalid administrator password. Access denied.");
      }
    } catch {
      // Offline fallback: check environment variable directly if API is unreachable
      const fallbackPass = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "SGSNov@321";
      if (password === fallbackPass) {
        authorized = true;
      } else {
        setErrorMessage("Invalid administrator password. Access denied.");
      }
    }

    if (authorized) {
      setSuccess(true);
      setTimeout(() => {
        // Execute native window minimize or exit fullscreen
        if (action === "minimize") {
          if (typeof window !== "undefined" && (window as any).kioskNative?.minimizeApp) {
            (window as any).kioskNative.minimizeApp();
          } else if (typeof window !== "undefined" && (window as any).kioskNative?.toggleFullscreen) {
            (window as any).kioskNative.toggleFullscreen();
          } else if (document.exitFullscreen) {
            document.exitFullscreen().catch(() => {});
          }
        } else {
          if (typeof window !== "undefined" && (window as any).kioskNative?.exitFullscreen) {
            (window as any).kioskNative.exitFullscreen();
          } else if (typeof window !== "undefined" && (window as any).kioskNative?.toggleFullscreen) {
            (window as any).kioskNative.toggleFullscreen();
          } else if (document.exitFullscreen) {
            document.exitFullscreen().catch(() => {});
          }
        }

        if (onSuccess) onSuccess();
        onClose();
        setPassword("");
        setSuccess(false);
        setLoading(false);
      }, 400);
    } else {
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

  // Keyboard layout matrices
  const row1 = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "@", "#", "$"];
  const rowLetters1 = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
  const rowLetters2 = ["A", "S", "D", "F", "G", "H", "J", "K", "L"];
  const rowLetters3 = ["Z", "X", "C", "V", "B", "N", "M", ".", "_", "-"];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999999,
        background: "rgba(10, 15, 29, 0.88)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        animation: "fadeIn 0.2s ease",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: showVirtualKeyboard ? "740px" : "480px",
          transition: "max-width 0.25s ease",
          background: "rgba(30, 41, 59, 0.98)",
          borderRadius: "22px",
          border: "1.5px solid rgba(254, 215, 170, 0.4)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.6)",
          padding: "1.75rem",
          position: "relative",
          zIndex: 10,
          color: "#fff",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Modal button */}
        <button
          type="button"
          onClick={onClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            background: "rgba(255, 255, 255, 0.08)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            borderRadius: "50%",
            width: "34px",
            height: "34px",
            display: "grid",
            placeItems: "center",
            color: "#94a3b8",
            cursor: "pointer",
          }}
          title="Cancel and stay in fullscreen"
        >
          <X size={16} />
        </button>

        {/* Modal Header */}
        <div style={{ textAlign: "center", marginBottom: "1.25rem" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "56px",
              height: "56px",
              borderRadius: "16px",
              background: "rgba(234, 88, 12, 0.18)",
              border: "1.5px solid rgba(234, 88, 12, 0.45)",
              marginBottom: "0.75rem",
            }}
          >
            <ShieldAlert size={28} style={{ color: "#ea580c" }} />
          </div>

          <h3
            style={{
              margin: "0 0 0.35rem 0",
              fontSize: "1.3rem",
              fontWeight: 800,
              color: "#f8fafc",
            }}
          >
            Administrator Authorization
          </h3>

          <p
            style={{
              margin: 0,
              fontSize: "0.82rem",
              color: "#94a3b8",
              lineHeight: 1.4,
            }}
          >
            Enter administrator credentials to minimize or exit fullscreen mode.
          </p>
        </div>

        {/* Password Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleVerify("minimize");
          }}
        >
          <div style={{ marginBottom: "1rem" }}>
            <div
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                background: "rgba(15, 23, 42, 0.8)",
                borderRadius: "12px",
                border: errorMessage
                  ? "1.5px solid #ef4444"
                  : "1.5px solid rgba(255, 255, 255, 0.15)",
              }}
            >
              <div style={{ paddingLeft: "12px", color: "#ea580c" }}>
                <KeyRound size={17} />
              </div>

              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMessage("");
                }}
                placeholder="Enter administrator password..."
                autoFocus
                disabled={loading || success}
                style={{
                  width: "100%",
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "#f8fafc",
                  fontSize: "1rem",
                  padding: "12px 10px",
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
                  padding: "0 12px",
                  cursor: "pointer",
                }}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div
                style={{
                  marginTop: "0.5rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  color: "#f87171",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                }}
              >
                <AlertCircle size={14} />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div
                style={{
                  marginTop: "0.5rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  color: "#4ade80",
                  fontSize: "0.82rem",
                  fontWeight: 700,
                }}
              >
                <CheckCircle2 size={15} />
                <span>Access verified! Executing window command...</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: "8px", marginTop: "1rem" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: "10px 14px",
                borderRadius: "10px",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                background: "rgba(255, 255, 255, 0.05)",
                color: "#cbd5e1",
                fontSize: "0.86rem",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={() => handleVerify("exit-fullscreen")}
              disabled={loading || success}
              style={{
                flex: 1.1,
                padding: "10px 14px",
                borderRadius: "10px",
                border: "1px solid rgba(234, 88, 12, 0.4)",
                background: "rgba(234, 88, 12, 0.18)",
                color: "#fdba74",
                fontSize: "0.86rem",
                fontWeight: 700,
                cursor: loading || success ? "not-allowed" : "pointer",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "5px",
              }}
            >
              <Maximize2 size={14} /> Exit Fullscreen
            </button>

            <button
              type="button"
              onClick={() => handleVerify("minimize")}
              disabled={loading || success}
              style={{
                flex: 1.3,
                padding: "10px 14px",
                borderRadius: "10px",
                border: "none",
                background: "linear-gradient(135deg, #ea580c 0%, #c2410c 100%)",
                color: "#ffffff",
                fontSize: "0.88rem",
                fontWeight: 800,
                cursor: loading || success ? "not-allowed" : "pointer",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                boxShadow: "0 4px 14px rgba(234, 88, 12, 0.35)",
              }}
            >
              {loading ? (
                <>
                  <RefreshCw size={14} className="animate-spin" /> Verifying...
                </>
              ) : (
                <>
                  <Minimize2 size={14} /> Minimize Screen
                </>
              )}
            </button>
          </div>

          {/* Virtual Touchscreen Keyboard Toggle */}
          <div style={{ textAlign: "center", marginTop: "1rem" }}>
            <button
              type="button"
              onClick={() => setShowVirtualKeyboard(!showVirtualKeyboard)}
              style={{
                background: "transparent",
                border: "none",
                color: "#94a3b8",
                fontSize: "0.78rem",
                fontWeight: 600,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                padding: "4px 8px",
              }}
            >
              <Keyboard size={14} />
              <span>{showVirtualKeyboard ? "Hide Touch Keypad" : "Touchscreen Keypad"}</span>
            </button>
          </div>

          {/* On-Screen Touch Keyboard for Kiosks */}
          {showVirtualKeyboard && (
            <div
              style={{
                marginTop: "0.75rem",
                padding: "0.75rem",
                background: "rgba(15, 23, 42, 0.95)",
                borderRadius: "14px",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                userSelect: "none",
              }}
            >
              {/* Row 1: Numbers & Symbols */}
              <div style={{ display: "flex", gap: "4px", justifyContent: "center", marginBottom: "5px" }}>
                {row1.map((char) => (
                  <button
                    key={char}
                    type="button"
                    onClick={() => handleKeyPress(char)}
                    style={{
                      flex: 1,
                      height: "36px",
                      borderRadius: "6px",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      background: "rgba(255, 255, 255, 0.07)",
                      color: "#f8fafc",
                      fontSize: "0.88rem",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    {char}
                  </button>
                ))}
              </div>

              {/* Row 2: Letters Q-P */}
              <div style={{ display: "flex", gap: "4px", justifyContent: "center", marginBottom: "5px" }}>
                {rowLetters1.map((char) => {
                  const displayChar = isShift ? char : char.toLowerCase();
                  return (
                    <button
                      key={char}
                      type="button"
                      onClick={() => handleKeyPress(displayChar)}
                      style={{
                        flex: 1,
                        height: "36px",
                        borderRadius: "6px",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        background: "rgba(255, 255, 255, 0.07)",
                        color: "#f8fafc",
                        fontSize: "0.88rem",
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
              <div style={{ display: "flex", gap: "4px", justifyContent: "center", marginBottom: "5px", padding: "0 10px" }}>
                {rowLetters2.map((char) => {
                  const displayChar = isShift ? char : char.toLowerCase();
                  return (
                    <button
                      key={char}
                      type="button"
                      onClick={() => handleKeyPress(displayChar)}
                      style={{
                        flex: 1,
                        height: "36px",
                        borderRadius: "6px",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        background: "rgba(255, 255, 255, 0.07)",
                        color: "#f8fafc",
                        fontSize: "0.88rem",
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
              <div style={{ display: "flex", gap: "4px", justifyContent: "center", marginBottom: "5px" }}>
                <button
                  type="button"
                  onClick={() => setIsShift(!isShift)}
                  style={{
                    flex: 1.4,
                    height: "36px",
                    borderRadius: "6px",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    background: isShift ? "rgba(234, 88, 12, 0.35)" : "rgba(255, 255, 255, 0.07)",
                    color: isShift ? "#fb923c" : "#94a3b8",
                    fontSize: "0.8rem",
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
                        height: "36px",
                        borderRadius: "6px",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        background: "rgba(255, 255, 255, 0.07)",
                        color: "#f8fafc",
                        fontSize: "0.88rem",
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
                    flex: 1.4,
                    height: "36px",
                    borderRadius: "6px",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    background: "rgba(239, 68, 68, 0.2)",
                    color: "#f87171",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Delete size={16} />
                </button>
              </div>

              {/* Row 5: Clear and Space */}
              <div style={{ display: "flex", gap: "4px", justifyContent: "center" }}>
                <button
                  type="button"
                  onClick={handleClear}
                  style={{
                    flex: 1,
                    height: "32px",
                    borderRadius: "6px",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    background: "rgba(255, 255, 255, 0.06)",
                    color: "#94a3b8",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={() => handleKeyPress(" ")}
                  style={{
                    flex: 3,
                    height: "32px",
                    borderRadius: "6px",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    background: "rgba(255, 255, 255, 0.06)",
                    color: "#94a3b8",
                    fontSize: "0.78rem",
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
