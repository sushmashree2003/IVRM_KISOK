"use client";

import React, { useState, useEffect } from "react";
import { Calendar, Clock3 } from "lucide-react";

interface LiveClockProps {
  className?: string;
  style?: React.CSSProperties;
  variant?: "inline" | "chips";
  showIcon?: boolean;
}

export default function LiveClock({
  className = "",
  style = {},
  variant = "inline",
  showIcon = true,
}: LiveClockProps) {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!time) {
    if (variant === "chips") {
      return (
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", ...style }}>
          <div className="command-chip">
            <Calendar size={13} style={{ color: "#ea580c" }} />
            <span>Loading...</span>
          </div>
        </div>
      );
    }
    return (
      <div className={className} style={{ display: "inline-flex", alignItems: "center", gap: "6px", ...style }} suppressHydrationWarning>
        {showIcon && <Calendar size={13} style={{ color: "#ea580c" }} />}
        <span suppressHydrationWarning>Loading...</span>
      </div>
    );
  }

  const dateStr = time.toLocaleDateString("en-US", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });

  const fullDateStr = time.toLocaleDateString("en-US", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const timeStr = time.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  if (variant === "chips") {
    return (
      <>
        <div className="command-chip" suppressHydrationWarning>
          <Calendar size={13} style={{ color: "#ea580c" }} />
          <span suppressHydrationWarning>{fullDateStr}</span>
        </div>
        <div className="command-chip" suppressHydrationWarning>
          <Clock3 size={13} style={{ color: "#ea580c" }} />
          <span suppressHydrationWarning>{timeStr}</span>
        </div>
      </>
    );
  }

  return (
    <div className={className} style={{ display: "inline-flex", alignItems: "center", gap: "6px", ...style }} suppressHydrationWarning>
      {showIcon && <Calendar size={13} style={{ color: "#ea580c" }} />}
      <span suppressHydrationWarning>
        {dateStr} • <b suppressHydrationWarning>{timeStr}</b>
      </span>
    </div>
  );
}
