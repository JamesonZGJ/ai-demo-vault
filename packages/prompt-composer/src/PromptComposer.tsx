"use client";

import {
  useLayoutEffect,
  useRef,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";

export type PromptAttachment = {
  id: string;
  label: string;
  type?: string;
};

export type PromptComposerProps = {
  attachments?: PromptAttachment[];
  disabled?: boolean;
  maxLength?: number;
  onChange: (value: string) => void;
  onRemoveAttachment?: (id: string) => void;
  onStop?: () => void;
  onSubmit: (value: string) => void;
  placeholder?: string;
  value: string;
  working?: boolean;
};

export function shouldSubmitPrompt({
  isComposing,
  key,
  shiftKey,
}: {
  isComposing: boolean;
  key: string;
  shiftKey: boolean;
}) {
  return key === "Enter" && !shiftKey && !isComposing;
}

export function resizePromptTextarea(textarea: HTMLTextAreaElement) {
  textarea.style.height = "auto";
  textarea.style.height = `${Math.min(textarea.scrollHeight, 168)}px`;
}

export function PromptComposer({
  attachments = [],
  disabled = false,
  maxLength = 2000,
  onChange,
  onRemoveAttachment,
  onStop,
  onSubmit,
  placeholder = "描述你想生成的内容…",
  value,
  working = false,
}: PromptComposerProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const trimmedValue = value.trim();

  useLayoutEffect(() => {
    if (textareaRef.current) resizePromptTextarea(textareaRef.current);
  }, [value]);

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.currentTarget.value);
    resizePromptTextarea(event.currentTarget);
  };

  const submit = () => {
    if (!disabled && !working && trimmedValue) onSubmit(trimmedValue);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (
      shouldSubmitPrompt({
        isComposing: event.nativeEvent.isComposing,
        key: event.key,
        shiftKey: event.shiftKey,
      })
    ) {
      event.preventDefault();
      submit();
    }
  };

  return (
    <div className={`prompt-composer-module${working ? " is-working" : ""}`}>
      {attachments.length ? (
        <div aria-label="已添加的附件" className="prompt-composer-attachments">
          {attachments.map((attachment) => (
            <span className="prompt-composer-attachment" key={attachment.id}>
              <span aria-hidden="true">▧</span>
              <span>
                <strong>{attachment.label}</strong>
                {attachment.type ? <small>{attachment.type}</small> : null}
              </span>
              {onRemoveAttachment ? (
                <button
                  aria-label={`移除附件“${attachment.label}”`}
                  disabled={disabled || working}
                  onClick={() => onRemoveAttachment(attachment.id)}
                  type="button"
                >
                  ×
                </button>
              ) : null}
            </span>
          ))}
        </div>
      ) : null}

      <textarea
        aria-describedby="prompt-composer-hint"
        disabled={disabled || working}
        maxLength={maxLength}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        ref={textareaRef}
        rows={1}
        value={value}
      />

      <div className="prompt-composer-footer">
        <span className="prompt-composer-tools" aria-hidden="true">
          <span>＋</span>
          <span>⌘</span>
        </span>
        <span id="prompt-composer-hint">
          {working
            ? "正在生成，可以随时停止"
            : `Enter 发送 · Shift + Enter 换行 · ${value.length}/${maxLength}`}
        </span>
        <button
          aria-label={working ? "停止生成" : "发送提示词"}
          className="prompt-composer-submit"
          disabled={disabled || (!working && !trimmedValue)}
          onClick={working ? onStop : submit}
          type="button"
        >
          {working ? "■" : "↑"}
        </button>
      </div>
    </div>
  );
}
