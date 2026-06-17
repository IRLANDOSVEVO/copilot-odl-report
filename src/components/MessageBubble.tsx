import React from "react";

export interface MessageBubbleProps {
  role: "user" | "assistant";
  text: string;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ role, text }) => {
  const isUser = role === "user";

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        marginBottom: "12px",
        padding: "0 12px",
      }}
    >
      <div
        style={{
          maxWidth: "75%",
          padding: "10px 16px",
          borderRadius: "12px",
          wordWrap: "break-word",
          whiteSpace: "pre-wrap",
          backgroundColor: isUser ? "#0052CC" : "#E7E8EA",
          color: isUser ? "#FFFFFF" : "#172B4D",
          fontSize: "14px",
          lineHeight: "1.4",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        {text}
      </div>
    </div>
  );
};
