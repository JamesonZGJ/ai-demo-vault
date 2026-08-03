"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent,
  type ReactNode,
} from "react";

export type SelectionToolbarAction = {
  id: string;
  label: string;
};

export type SelectionToolbarActionEvent = {
  actionId: string;
  selectedText: string;
};

export type SelectionToolbarRect = {
  bottom: number;
  height: number;
  left: number;
  right: number;
  top: number;
  width: number;
};

export type SelectionToolbarSize = {
  height: number;
  width: number;
};

export type SelectionToolbarPosition = {
  left: number;
  placement: "above" | "below";
  top: number;
};

export type TextSelectionToolbarProps = {
  actions: SelectionToolbarAction[];
  ariaLabel?: string;
  children: ReactNode;
  onAction?: (event: SelectionToolbarActionEvent) => void;
};

const DEFAULT_TOOLBAR_SIZE: SelectionToolbarSize = {
  height: 48,
  width: 320,
};

export function getSelectionToolbarPosition(
  selectionRect: SelectionToolbarRect,
  containerRect: SelectionToolbarRect,
  toolbarSize: SelectionToolbarSize,
  gap = 12,
  padding = 10,
): SelectionToolbarPosition {
  const preferredLeft =
    selectionRect.left -
    containerRect.left +
    selectionRect.width / 2 -
    toolbarSize.width / 2;
  const maxLeft = Math.max(padding, containerRect.width - toolbarSize.width - padding);
  const left = Math.min(maxLeft, Math.max(padding, preferredLeft));
  const above = selectionRect.top - containerRect.top - toolbarSize.height - gap;

  if (above >= padding) {
    return { left, placement: "above", top: above };
  }

  return {
    left,
    placement: "below",
    top: Math.min(
      Math.max(padding, containerRect.height - toolbarSize.height - padding),
      selectionRect.bottom - containerRect.top + gap,
    ),
  };
}

function selectionBelongsToEditor(selection: Selection, editor: HTMLElement) {
  const anchor = selection.anchorNode;
  const focus = selection.focusNode;
  return Boolean(anchor && focus && editor.contains(anchor) && editor.contains(focus));
}

export function TextSelectionToolbar({
  actions,
  ariaLabel = "可编辑示例文稿",
  children,
  onAction,
}: TextSelectionToolbarProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<SelectionToolbarPosition | null>(null);
  const [selectedText, setSelectedText] = useState("");

  const updateSelection = useCallback(() => {
    const editor = editorRef.current;
    const root = rootRef.current;
    const selection = window.getSelection();

    if (
      !editor ||
      !root ||
      !selection ||
      selection.isCollapsed ||
      !selectionBelongsToEditor(selection, editor)
    ) {
      setPosition(null);
      setSelectedText("");
      return;
    }

    const text = selection.toString().trim();
    if (!text) {
      setPosition(null);
      setSelectedText("");
      return;
    }

    const range = selection.getRangeAt(0);
    const boundingRect = range.getBoundingClientRect();
    const selectionRect =
      boundingRect.width > 0 ? boundingRect : range.getClientRects()[0];
    if (!selectionRect) return;

    const rootRect = root.getBoundingClientRect();
    const toolbarRect = toolbarRef.current?.getBoundingClientRect();
    const toolbarSize = toolbarRect
      ? { height: toolbarRect.height, width: toolbarRect.width }
      : DEFAULT_TOOLBAR_SIZE;

    setSelectedText(text);
    setPosition(
      getSelectionToolbarPosition(selectionRect, rootRect, toolbarSize),
    );
  }, []);

  useEffect(() => {
    document.addEventListener("selectionchange", updateSelection);
    window.addEventListener("resize", updateSelection);
    window.addEventListener("scroll", updateSelection, true);
    return () => {
      document.removeEventListener("selectionchange", updateSelection);
      window.removeEventListener("resize", updateSelection);
      window.removeEventListener("scroll", updateSelection, true);
    };
  }, [updateSelection]);

  const measureToolbar = useCallback(
    (node: HTMLDivElement | null) => {
      toolbarRef.current = node;
      if (node) window.requestAnimationFrame(updateSelection);
    },
    [updateSelection],
  );

  function preserveSelection(event: PointerEvent<HTMLDivElement>) {
    event.preventDefault();
  }

  return (
    <div className="text-selection-toolbar-root" ref={rootRef}>
      <div
        aria-label={ariaLabel}
        aria-multiline="true"
        className="text-selection-toolbar-editor"
        contentEditable
        onKeyUp={updateSelection}
        onPointerUp={updateSelection}
        ref={editorRef}
        role="textbox"
        suppressContentEditableWarning
      >
        {children}
      </div>
      {position ? (
        <div
          aria-label="文本操作"
          className="text-selection-toolbar-menu"
          data-placement={position.placement}
          onPointerDown={preserveSelection}
          ref={measureToolbar}
          role="toolbar"
          style={{ left: position.left, top: position.top }}
        >
          {actions.map((action) => (
            <button
              key={action.id}
              onClick={() =>
                onAction?.({
                  actionId: action.id,
                  selectedText,
                })
              }
              type="button"
            >
              {action.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
