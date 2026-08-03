"use client";

import {
  useCallback,
  useLayoutEffect,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";

export type SortableListItem = {
  description?: string;
  id: string;
  meta?: string;
  title: string;
};

export type SortableListProps = {
  ariaLabel?: string;
  disabled?: boolean;
  items: SortableListItem[];
  onChange: (items: SortableListItem[]) => void;
};

type DragState = {
  height: number;
  id: string;
  left: number;
  offsetY: number;
  pointerId: number;
  top: number;
  width: number;
};

export function moveSortableIndex<T>(
  items: T[],
  fromIndex: number,
  toIndex: number,
) {
  if (
    fromIndex < 0 ||
    fromIndex >= items.length ||
    toIndex < 0 ||
    toIndex >= items.length ||
    fromIndex === toIndex
  ) {
    return items;
  }

  const nextItems = [...items];
  const [movedItem] = nextItems.splice(fromIndex, 1);
  if (movedItem === undefined) return items;
  nextItems.splice(toIndex, 0, movedItem);
  return nextItems;
}

export function moveSortableItem<T extends { id: string }>(
  items: T[],
  activeId: string,
  overId: string,
) {
  const fromIndex = items.findIndex(({ id }) => id === activeId);
  const toIndex = items.findIndex(({ id }) => id === overId);
  return moveSortableIndex(items, fromIndex, toIndex);
}

export function SortableList({
  ariaLabel = "可排序列表",
  disabled = false,
  items,
  onChange,
}: SortableListProps) {
  const [dragItems, setDragItems] = useState<SortableListItem[] | null>(null);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [statusMessage, setStatusMessage] = useState(
    "拖动手柄，或使用上下按钮调整顺序",
  );
  const dragStateRef = useRef<DragState | null>(null);
  const dragHandleRef = useRef<HTMLButtonElement | null>(null);
  const dragOriginRef = useRef(items);
  const draftItemsRef = useRef(items);
  const itemPositionsRef = useRef(new Map<string, number>());
  const moduleRef = useRef<HTMLDivElement>(null);
  const displayedItems = dragItems ?? items;

  useLayoutEffect(() => {
    const nodes = Array.from(
      moduleRef.current?.querySelectorAll<HTMLElement>("[data-sortable-id]") ??
        [],
    );
    const nextPositions = new Map<string, number>();
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    nodes.forEach((node) => {
      const id = node.dataset.sortableId;
      if (!id) return;
      const nextTop = node.getBoundingClientRect().top;
      const previousTop = itemPositionsRef.current.get(id);
      nextPositions.set(id, nextTop);
      const delta = previousTop === undefined ? 0 : previousTop - nextTop;
      if (delta !== 0 && !reduceMotion) {
        node.animate(
          [
            { transform: `translateY(${delta}px)` },
            { transform: "translateY(0)" },
          ],
          { duration: 180, easing: "cubic-bezier(.2, .8, .2, 1)" },
        );
      }
    });

    itemPositionsRef.current = nextPositions;
  }, [displayedItems]);

  const announcePosition = useCallback(
    (item: SortableListItem, nextItems: SortableListItem[]) => {
      const position = nextItems.findIndex(({ id }) => id === item.id) + 1;
      setStatusMessage(`${item.title} 已移动到第 ${position} 位`);
    },
    [],
  );

  const moveByButton = (item: SortableListItem, direction: -1 | 1) => {
    const fromIndex = displayedItems.findIndex(({ id }) => id === item.id);
    const toIndex = fromIndex + direction;
    const nextItems = moveSortableIndex(displayedItems, fromIndex, toIndex);
    if (nextItems === displayedItems) return;
    draftItemsRef.current = nextItems;
    onChange(nextItems);
    announcePosition(item, nextItems);
  };

  const startDragging = (
    event: ReactPointerEvent<HTMLButtonElement>,
    item: SortableListItem,
  ) => {
    if (disabled || event.button !== 0) return;
    const card = event.currentTarget.closest(
      "[data-sortable-id]",
    ) as HTMLElement | null;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    dragOriginRef.current = displayedItems;
    draftItemsRef.current = displayedItems;
    dragHandleRef.current = event.currentTarget;
    event.currentTarget.setPointerCapture(event.pointerId);
    const nextDragState = {
      height: rect.height,
      id: item.id,
      left: rect.left,
      offsetY: event.clientY - rect.top,
      pointerId: event.pointerId,
      top: rect.top,
      width: rect.width,
    };
    dragStateRef.current = nextDragState;
    setDragState(nextDragState);
    setStatusMessage(`${item.title} 已抓取，移动指针调整位置`);
  };

  const continueDragging = useCallback((event: PointerEvent) => {
    const currentDragState = dragStateRef.current;
    if (!currentDragState || event.pointerId !== currentDragState.pointerId) return;
    event.preventDefault();

    const nextDragState = {
      ...currentDragState,
      top: event.clientY - currentDragState.offsetY,
    };
    dragStateRef.current = nextDragState;
    setDragState(nextDragState);

    const list = moduleRef.current?.querySelector<HTMLOListElement>(
      ".sortable-list",
    );
    if (!list) return;
    const listTop = list.getBoundingClientRect().top;
    const slotCenters = Array.from(
      list.querySelectorAll<HTMLElement>("[data-sortable-id]"),
    )
      .map((node) => node.offsetTop + node.offsetHeight / 2)
      .sort((a, b) => a - b);
    if (slotCenters.length === 0) return;
    const pointerY = event.clientY - listTop;
    const targetIndex = slotCenters.findIndex((center) => pointerY <= center);
    const resolvedToIndex =
      targetIndex === -1 ? slotCenters.length - 1 : targetIndex;
    const fromIndex = draftItemsRef.current.findIndex(
      ({ id }) => id === currentDragState.id,
    );
    const nextItems = moveSortableIndex(
      draftItemsRef.current,
      fromIndex,
      resolvedToIndex,
    );
    if (nextItems === draftItemsRef.current) return;
    draftItemsRef.current = nextItems;
    setDragItems(nextItems);
  }, []);

  const finishDragging = useCallback((event: PointerEvent, cancelled = false) => {
    const currentDragState = dragStateRef.current;
    if (!currentDragState || event.pointerId !== currentDragState.pointerId) return;
    const dragHandle = dragHandleRef.current;
    if (dragHandle?.hasPointerCapture(event.pointerId)) {
      dragHandle.releasePointerCapture(event.pointerId);
    }

    const latestItems = draftItemsRef.current;
    const draggedItem =
      latestItems.find(({ id }) => id === currentDragState.id) ??
      items.find(({ id }) => id === currentDragState.id);
    if (cancelled) {
      draftItemsRef.current = dragOriginRef.current;
      setStatusMessage("已取消本次排序");
    } else {
      onChange(latestItems);
      if (draggedItem) announcePosition(draggedItem, latestItems);
    }
    setDragItems(null);
    dragStateRef.current = null;
    dragHandleRef.current = null;
    setDragState(null);
  }, [announcePosition, items, onChange]);

  const activePointerId = dragState?.pointerId;
  useEffect(() => {
    if (activePointerId === undefined) return;
    const handlePointerMove = (event: PointerEvent) => continueDragging(event);
    const handlePointerUp = (event: PointerEvent) => finishDragging(event);
    const handlePointerCancel = (event: PointerEvent) =>
      finishDragging(event, true);

    window.addEventListener("pointermove", handlePointerMove, { passive: false });
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerCancel);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerCancel);
    };
  }, [activePointerId, continueDragging, finishDragging]);

  const draggedItem = dragState
    ? displayedItems.find(({ id }) => id === dragState.id)
    : null;

  return (
    <div className="sortable-list-module" ref={moduleRef}>
      <ol aria-label={ariaLabel} className="sortable-list">
        {displayedItems.map((item, index) => {
          const isDragging = dragState?.id === item.id;
          return (
            <li
              className={`sortable-list-item${isDragging ? " is-dragging-source" : ""}`}
              data-sortable-id={item.id}
              key={item.id}
            >
              <div className="sortable-list-card">
                <button
                  aria-label={`拖动“${item.title}”，也可以按上下方向键排序`}
                  className="sortable-list-handle"
                  disabled={disabled}
                  onKeyDown={(event) => {
                    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                      event.preventDefault();
                      moveByButton(item, event.key === "ArrowUp" ? -1 : 1);
                    }
                  }}
                  onPointerDown={(event) => startDragging(event, item)}
                  type="button"
                >
                  <span aria-hidden="true">⠿</span>
                </button>

                <span className="sortable-list-position" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span className="sortable-list-copy">
                  <strong>{item.title}</strong>
                  {item.description ? <small>{item.description}</small> : null}
                </span>

                {item.meta ? (
                  <span className="sortable-list-meta">{item.meta}</span>
                ) : null}

                <span className="sortable-list-actions">
                  <button
                    aria-label={`将“${item.title}”上移`}
                    disabled={disabled || index === 0}
                    onClick={() => moveByButton(item, -1)}
                    type="button"
                  >
                    ↑
                  </button>
                  <button
                    aria-label={`将“${item.title}”下移`}
                    disabled={disabled || index === displayedItems.length - 1}
                    onClick={() => moveByButton(item, 1)}
                    type="button"
                  >
                    ↓
                  </button>
                </span>
              </div>
            </li>
          );
        })}
      </ol>

      {dragState && draggedItem ? (
        <div
          aria-hidden="true"
          className="sortable-list-drag-overlay"
          style={{
            height: dragState.height,
            left: dragState.left,
            top: dragState.top,
            width: dragState.width,
          }}
        >
          <div className="sortable-list-card">
            <span className="sortable-list-handle">
              <span>⠿</span>
            </span>
            <span className="sortable-list-position">
              {String(
                displayedItems.findIndex(({ id }) => id === draggedItem.id) + 1,
              ).padStart(2, "0")}
            </span>
            <span className="sortable-list-copy">
              <strong>{draggedItem.title}</strong>
              {draggedItem.description ? (
                <small>{draggedItem.description}</small>
              ) : null}
            </span>
            {draggedItem.meta ? (
              <span className="sortable-list-meta">{draggedItem.meta}</span>
            ) : null}
          </div>
        </div>
      ) : null}

      <p aria-live="polite" className="sortable-list-status">
        {statusMessage}
      </p>
    </div>
  );
}
