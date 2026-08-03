"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

export type CommandPaletteItem = {
  id: string;
  label: string;
  description?: string;
  group: string;
  keywords?: string[];
  shortcut?: string;
};

export type CommandPaletteProps = {
  commands: CommandPaletteItem[];
  defaultOpen?: boolean;
  emptyLabel?: string;
  onRun?: (command: CommandPaletteItem) => void;
  placeholder?: string;
  triggerLabel?: string;
};

const normalize = (value: string) => value.trim().toLocaleLowerCase();

function commandScore(command: CommandPaletteItem, query: string) {
  const label = normalize(command.label);
  const group = normalize(command.group);
  const description = normalize(command.description ?? "");
  const keywords = (command.keywords ?? []).map(normalize);

  if (label === query) return 100;
  if (label.startsWith(query)) return 90;
  if (keywords.some((keyword) => keyword === query)) return 82;
  if (keywords.some((keyword) => keyword.startsWith(query))) return 76;
  if (label.includes(query)) return 70;
  if (keywords.some((keyword) => keyword.includes(query))) return 64;
  if (group.includes(query)) return 54;
  if (description.includes(query)) return 44;
  return -1;
}

export function filterCommandItems(
  commands: CommandPaletteItem[],
  query: string,
) {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return commands;

  return commands
    .map((command, index) => ({
      command,
      index,
      score: commandScore(command, normalizedQuery),
    }))
    .filter(({ score }) => score >= 0)
    .sort((left, right) => right.score - left.score || left.index - right.index)
    .map(({ command }) => command);
}

export function moveCommandIndex(
  currentIndex: number,
  itemCount: number,
  direction: 1 | -1,
) {
  if (itemCount <= 0) return -1;
  const safeIndex = currentIndex < 0 ? 0 : currentIndex;
  return (safeIndex + direction + itemCount) % itemCount;
}

const optionId = (listId: string, commandId: string) =>
  `${listId}-${commandId.replace(/[^a-zA-Z0-9_-]/g, "-")}`;

export function CommandPalette({
  commands,
  defaultOpen = false,
  emptyLabel = "没有找到相关命令",
  onRun,
  placeholder = "搜索命令、页面或操作",
  triggerLabel = "打开命令面板",
}: CommandPaletteProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [lastRun, setLastRun] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const skipInitialFocusRef = useRef(defaultOpen);
  const skipInitialScrollRef = useRef(defaultOpen);
  const listId = useId();

  const filteredCommands = useMemo(
    () => filterCommandItems(commands, query),
    [commands, query],
  );
  const safeActiveIndex =
    filteredCommands.length === 0
      ? -1
      : Math.min(activeIndex, filteredCommands.length - 1);
  const activeCommand =
    safeActiveIndex >= 0 ? filteredCommands[safeActiveIndex] : null;

  const closePalette = () => {
    setOpen(false);
    setQuery("");
    setActiveIndex(0);
  };

  const runCommand = (command: CommandPaletteItem) => {
    setLastRun(command.label);
    onRun?.(command);
    closePalette();
  };

  useEffect(() => {
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      const isCommandShortcut =
        (event.metaKey || event.ctrlKey) && event.key.toLocaleLowerCase() === "k";
      if (isCommandShortcut) {
        event.preventDefault();
        if (open) {
          closePalette();
        } else {
          setOpen(true);
        }
        return;
      }
      if (open && event.key === "Escape") {
        event.preventDefault();
        closePalette();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    if (skipInitialFocusRef.current) {
      skipInitialFocusRef.current = false;
      return;
    }
    inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (safeActiveIndex < 0) return;
    if (skipInitialScrollRef.current) {
      skipInitialScrollRef.current = false;
      return;
    }
    optionRefs.current[safeActiveIndex]?.scrollIntoView({ block: "nearest" });
  }, [safeActiveIndex]);

  const onInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) =>
        moveCommandIndex(
          index,
          filteredCommands.length,
          event.key === "ArrowDown" ? 1 : -1,
        ),
      );
      return;
    }
    if (event.key === "Enter" && activeCommand) {
      event.preventDefault();
      runCommand(activeCommand);
    }
  };

  return (
    <div className="command-palette-root">
      <div className="command-palette-launcher">
        <button
          className="command-palette-trigger"
          onClick={() => setOpen(true)}
          type="button"
        >
          <span>{triggerLabel}</span>
          <kbd>⌘ K</kbd>
        </button>
        <p aria-live="polite" className="command-palette-status">
          {lastRun ? `刚刚执行：${lastRun}` : "支持鼠标与键盘操作"}
        </p>
      </div>

      {open ? (
        <div
          aria-label="命令面板"
          aria-modal="true"
          className="command-palette-backdrop"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) closePalette();
          }}
          role="dialog"
        >
          <div className="command-palette-panel">
            <div className="command-palette-input-row">
              <span aria-hidden="true">⌕</span>
              <input
                aria-activedescendant={
                  activeCommand ? optionId(listId, activeCommand.id) : undefined
                }
                aria-autocomplete="list"
                aria-controls={listId}
                aria-expanded="true"
                onChange={(event) => {
                  setQuery(event.target.value);
                  setActiveIndex(0);
                }}
                onKeyDown={onInputKeyDown}
                placeholder={placeholder}
                ref={inputRef}
                role="combobox"
                value={query}
              />
              <kbd>ESC</kbd>
            </div>

            <div className="command-palette-list" id={listId} role="listbox">
              {filteredCommands.length === 0 ? (
                <div className="command-palette-empty">{emptyLabel}</div>
              ) : (
                filteredCommands.map((command, index) => {
                  const previous = filteredCommands[index - 1];
                  const showGroup = !previous || previous.group !== command.group;
                  const selected = index === safeActiveIndex;
                  return (
                    <div className="command-palette-entry" key={command.id}>
                      {showGroup ? (
                        <div className="command-palette-group">
                          {command.group}
                        </div>
                      ) : null}
                      <button
                        aria-selected={selected}
                        className={`command-palette-item${selected ? " is-selected" : ""}`}
                        id={optionId(listId, command.id)}
                        onClick={() => runCommand(command)}
                        onPointerMove={() => setActiveIndex(index)}
                        ref={(node) => {
                          optionRefs.current[index] = node;
                        }}
                        role="option"
                        type="button"
                      >
                        <span>
                          <strong>{command.label}</strong>
                          {command.description ? (
                            <small>{command.description}</small>
                          ) : null}
                        </span>
                        {command.shortcut ? <kbd>{command.shortcut}</kbd> : null}
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            <div className="command-palette-footer">
              <span>↑↓ 选择</span>
              <span>↵ 执行</span>
              <span>ESC 关闭</span>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
