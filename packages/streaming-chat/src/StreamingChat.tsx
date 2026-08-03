"use client";

import { useEffect, useRef } from "react";

export type StreamingChatStatus =
  | "idle"
  | "waiting"
  | "streaming"
  | "complete"
  | "error";

export type StreamingChatStateMeta = {
  label: string;
  tone: "neutral" | "active" | "success" | "error";
};

export type StreamingChatProps = {
  assistantName?: string;
  prompt: string;
  response: string;
  status: StreamingChatStatus;
  visibleCharacters?: number;
};

export function getStreamingChatStateMeta(
  status: StreamingChatStatus,
): StreamingChatStateMeta {
  const states: Record<StreamingChatStatus, StreamingChatStateMeta> = {
    complete: { label: "生成完成", tone: "success" },
    error: { label: "生成失败", tone: "error" },
    idle: { label: "等待发送", tone: "neutral" },
    streaming: { label: "正在生成", tone: "active" },
    waiting: { label: "等待回复", tone: "active" },
  };

  return states[status];
}

export function getVisibleStreamingText(text: string, visibleCharacters: number) {
  return text.slice(0, Math.max(0, visibleCharacters));
}

export function StreamingChat({
  assistantName = "AI 助手",
  prompt,
  response,
  status,
  visibleCharacters = response.length,
}: StreamingChatProps) {
  const endRef = useRef<HTMLDivElement>(null);
  const state = getStreamingChatStateMeta(status);
  const visibleResponse = getVisibleStreamingText(response, visibleCharacters);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [status, visibleResponse]);

  return (
    <section className="streaming-chat" data-status={status}>
      <div className="streaming-chat-header">
        <div>
          <span aria-hidden="true" className="streaming-chat-avatar">AI</span>
          <strong>{assistantName}</strong>
        </div>
        <span className="streaming-chat-state" data-tone={state.tone}>
          <i aria-hidden="true" />
          <span aria-live="polite">{state.label}</span>
        </span>
      </div>

      <div className="streaming-chat-transcript">
        <article className="streaming-chat-message is-user">
          <small>你</small>
          <p>{prompt}</p>
        </article>

        {status !== "idle" ? (
          <article className="streaming-chat-message is-assistant">
            <small>{assistantName}</small>
            {status === "waiting" ? (
              <span aria-label="正在等待回复" className="streaming-chat-dots">
                <i />
                <i />
                <i />
              </span>
            ) : (
              <p aria-live="polite">
                {visibleResponse}
                {status === "streaming" ? (
                  <span aria-hidden="true" className="streaming-chat-cursor" />
                ) : null}
              </p>
            )}
          </article>
        ) : null}
        <div ref={endRef} />
      </div>
    </section>
  );
}
