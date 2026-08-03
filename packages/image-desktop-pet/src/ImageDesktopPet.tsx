"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
} from "react";

export type PetPosition = {
  x: number;
  y: number;
};

export type PetStageBounds = {
  height: number;
  width: number;
};

export type ImageDesktopPetProps = {
  alt?: string;
  initialPosition?: PetPosition;
  onPositionChange?: (position: PetPosition) => void;
  size?: number;
  src: string;
};

const DEFAULT_POSITION: PetPosition = { x: 48, y: 180 };
const KEYBOARD_STEP = 12;

export function clampPetPosition(
  position: PetPosition,
  bounds: PetStageBounds,
  size: number,
): PetPosition {
  const safeSize = Number.isFinite(size) ? Math.max(1, size) : 1;
  const maxX = Math.max(0, bounds.width - safeSize);
  const maxY = Math.max(0, bounds.height - safeSize);

  return {
    x: Math.min(maxX, Math.max(0, position.x)),
    y: Math.min(maxY, Math.max(0, position.y)),
  };
}

export function getKeyboardPosition(
  position: PetPosition,
  key: string,
  bounds: PetStageBounds,
  size: number,
  step = KEYBOARD_STEP,
): PetPosition {
  const delta = {
    ArrowDown: { x: 0, y: step },
    ArrowLeft: { x: -step, y: 0 },
    ArrowRight: { x: step, y: 0 },
    ArrowUp: { x: 0, y: -step },
  }[key];

  if (!delta) return position;
  return clampPetPosition(
    { x: position.x + delta.x, y: position.y + delta.y },
    bounds,
    size,
  );
}

function getParentBounds(element: HTMLElement): PetStageBounds {
  const parent = element.parentElement;
  if (!parent) return { height: 0, width: 0 };
  const bounds = parent.getBoundingClientRect();
  return { height: bounds.height, width: bounds.width };
}

export function ImageDesktopPet({
  alt = "图片桌宠",
  initialPosition = DEFAULT_POSITION,
  onPositionChange,
  size = 156,
  src,
}: ImageDesktopPetProps) {
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState(initialPosition);
  const petRef = useRef<HTMLButtonElement>(null);
  const dragOrigin = useRef({
    pointerId: -1,
    pointerX: 0,
    pointerY: 0,
    startX: initialPosition.x,
    startY: initialPosition.y,
  });

  function updatePosition(nextPosition: PetPosition) {
    const element = petRef.current;
    if (!element) return;
    const next = clampPetPosition(nextPosition, getParentBounds(element), size);
    setPosition(next);
    onPositionChange?.(next);
  }

  function handlePointerDown(event: PointerEvent<HTMLButtonElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragOrigin.current = {
      pointerId: event.pointerId,
      pointerX: event.clientX,
      pointerY: event.clientY,
      startX: position.x,
      startY: position.y,
    };
    setDragging(true);
  }

  function handlePointerMove(event: PointerEvent<HTMLButtonElement>) {
    if (dragOrigin.current.pointerId !== event.pointerId) return;
    updatePosition({
      x: dragOrigin.current.startX + event.clientX - dragOrigin.current.pointerX,
      y: dragOrigin.current.startY + event.clientY - dragOrigin.current.pointerY,
    });
  }

  function finishPointer(event: PointerEvent<HTMLButtonElement>) {
    if (dragOrigin.current.pointerId !== event.pointerId) return;
    dragOrigin.current.pointerId = -1;
    setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (!event.key.startsWith("Arrow")) return;
    event.preventDefault();
    const element = petRef.current;
    if (!element) return;
    const next = getKeyboardPosition(
      position,
      event.key,
      getParentBounds(element),
      size,
    );
    setPosition(next);
    onPositionChange?.(next);
  }

  useEffect(() => {
    const element = petRef.current;
    const parent = element?.parentElement;
    if (!element || !parent || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(() => {
      setPosition((current) =>
        clampPetPosition(current, getParentBounds(element), size),
      );
    });
    observer.observe(parent);
    return () => observer.disconnect();
  }, [size]);

  return (
    <button
      aria-label={`${alt}，可拖动；方向键也可以移动`}
      className={`image-desktop-pet${dragging ? " is-dragging" : ""}`}
      onKeyDown={handleKeyDown}
      onPointerCancel={finishPointer}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={finishPointer}
      ref={petRef}
      style={
        {
          "--pet-size": `${size}px`,
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        } as CSSProperties
      }
      type="button"
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- 用户本地 Blob URL 无法交给 next/image 优化。 */}
      <img
        alt={alt}
        className="image-desktop-pet-sprite"
        draggable={false}
        src={src}
      />
      <span aria-hidden="true" className="image-desktop-pet-hint">
        拖我
      </span>
    </button>
  );
}
