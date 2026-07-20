"use client";

import { useRef, useState } from "react";

import { extractAverageColor } from "../../packages/color-extraction/src";

function ColorExtractionPreview() {
  const [palette, setPalette] = useState(["#506f88", "#d3b89c", "#f5efe6"]);
  const inputRef = useRef<HTMLInputElement>(null);

  function readImage(file: File) {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 1;
      canvas.height = 1;
      const context = canvas.getContext("2d");
      if (!context) return;
      context.drawImage(image, 0, 0, 1, 1);
      const extracted = extractAverageColor(context.getImageData(0, 0, 1, 1));
      const { r, g, b } = extracted.rgb;
      const toHex = (value: number) => value.toString(16).padStart(2, "0");
      setPalette([extracted.hex, `#${toHex(Math.min(r + 30, 255))}${toHex(Math.min(g + 24, 255))}${toHex(Math.min(b + 18, 255))}`, "#f5efe6"]);
      URL.revokeObjectURL(image.src);
    };
    image.src = URL.createObjectURL(file);
  }

  return (
    <div className="capability-preview capability-preview-color">
      <div className="capability-preview-heading"><span>IMAGE → PALETTE</span><span>LOCAL PREVIEW</span></div>
      <button className="capability-upload" onClick={() => inputRef.current?.click()} type="button">
        <span aria-hidden="true">＋</span><strong>Drop an image to extract color</strong><small>or click to choose a file</small>
      </button>
      <input accept="image/*" className="sr-only" onChange={(event) => { const file = event.target.files?.[0]; if (file) readImage(file); }} ref={inputRef} type="file" />
      <div className="capability-palette" aria-label="提取出的颜色">
        {palette.map((color) => <span key={color} style={{ backgroundColor: color }}><b>{color}</b></span>)}
      </div>
    </div>
  );
}

function GlassSurfacePreview() {
  const [blur, setBlur] = useState(18);
  const [opacity, setOpacity] = useState(0.16);
  const [borderOpacity, setBorderOpacity] = useState(0.3);
  const [shadowOpacity, setShadowOpacity] = useState(0.28);
  const [glowOpacity, setGlowOpacity] = useState(0.26);
  const [pointer, setPointer] = useState({ x: 50, y: 45 });
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div className="capability-preview capability-preview-glass">
      <div className="capability-preview-heading"><span>玻璃拟态卡片 · GLASS CARD</span><span>可调参数</span></div>
      <div
        className="glass-preview-stage"
        onPointerEnter={() => setIsHovering(true)}
        onPointerLeave={() => {
          setIsHovering(false);
          setPointer({ x: 50, y: 45 });
        }}
        onPointerMove={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          setPointer({ x: ((event.clientX - rect.left) / rect.width) * 100, y: ((event.clientY - rect.top) / rect.height) * 100 });
        }}
        style={{ background: `radial-gradient(circle at ${pointer.x}% ${pointer.y}%, rgb(255 255 255 / ${glowOpacity}), transparent 36%), radial-gradient(circle at 70% 25%, #d8b38a, transparent 35%), radial-gradient(circle at 30% 80%, #699999, transparent 42%), #1e2c3e` }}
      >
        <div className="glass-preview-orb glass-preview-orb-one" />
        <div className="glass-preview-orb glass-preview-orb-two" />
        <div className="glass-preview-panel" style={{ backdropFilter: `blur(${blur}px)`, WebkitBackdropFilter: `blur(${blur}px)`, background: `rgb(255 255 255 / ${opacity})`, borderColor: `rgb(255 255 255 / ${borderOpacity})`, boxShadow: `0 24px 64px rgb(0 0 0 / ${shadowOpacity}), inset 0 1px 0 rgb(255 255 255 / ${Math.min(borderOpacity + 0.1, 1)})`, transform: `translate(-50%, -50%) perspective(1000px) rotateX(${isHovering ? (pointer.y - 50) * -0.045 : 0}deg) rotateY(${isHovering ? (pointer.x - 50) * 0.045 : 0}deg) translateY(${isHovering ? -2 : 0}px)` }}>
          <span>BUILD BLOCK · 001</span><strong>让表面变得可复用。</strong><small>blur {blur}px · pointer glow</small>
        </div>
      </div>
      <div className="glass-preview-controls" aria-label="玻璃拟态参数">
        <label className="capability-slider">模糊 <input max="32" min="4" onChange={(event) => setBlur(Number(event.target.value))} type="range" value={blur} /><output>{blur}px</output></label>
        <label className="capability-slider">透明度 <input max="0.32" min="0.08" onChange={(event) => setOpacity(Number(event.target.value))} step="0.01" type="range" value={opacity} /><output>{Math.round(opacity * 100)}%</output></label>
        <label className="capability-slider">边框 <input max="0.65" min="0.12" onChange={(event) => setBorderOpacity(Number(event.target.value))} step="0.01" type="range" value={borderOpacity} /><output>{Math.round(borderOpacity * 100)}%</output></label>
        <label className="capability-slider">阴影 <input max="0.45" min="0.08" onChange={(event) => setShadowOpacity(Number(event.target.value))} step="0.01" type="range" value={shadowOpacity} /><output>{Math.round(shadowOpacity * 100)}%</output></label>
        <label className="capability-slider">高光 <input max="0.4" min="0.08" onChange={(event) => setGlowOpacity(Number(event.target.value))} step="0.01" type="range" value={glowOpacity} /><output>{Math.round(glowOpacity * 100)}%</output></label>
      </div>
    </div>
  );
}

function CardHighlightPreview() {
  const [position, setPosition] = useState({ x: 50, y: 45 });
  return (
    <div className="capability-preview capability-preview-card">
      <div className="capability-preview-heading"><span>CARD HIGHLIGHT</span><span>POINTER AWARE</span></div>
      <div className="highlight-demo" onPointerMove={(event) => { const rect = event.currentTarget.getBoundingClientRect(); setPosition({ x: ((event.clientX - rect.left) / rect.width) * 100, y: ((event.clientY - rect.top) / rect.height) * 100 }); }} style={{ background: `radial-gradient(circle at ${position.x}% ${position.y}%, rgb(255 255 255 / 0.35), transparent 32%), linear-gradient(135deg, #111827, #334155)` }}><span>HOVER TO MOVE</span><strong>Details feel physical.</strong><small>pointer → radial highlight</small></div>
    </div>
  );
}

function FlipCardPreview() {
  const [flipped, setFlipped] = useState(false);
  return (
    <div className="capability-preview capability-preview-flip">
      <div className="capability-preview-heading"><span>FLIP CARD</span><span>PLANNED PREVIEW</span></div>
      <button className={`flip-demo-card${flipped ? " is-flipped" : ""}`} onClick={() => setFlipped((value) => !value)} type="button"><span>{flipped ? "BACK / REWARD" : "FRONT / PROMPT"}</span><strong>{flipped ? "Reveal the useful state." : "Tap to preview"}</strong><small>{flipped ? "click to return" : "one interaction, two surfaces"}</small></button>
    </div>
  );
}

export function CapabilityPreview({ slug }: { slug: string }) {
  if (slug === "color-extraction") return <ColorExtractionPreview />;
  if (slug === "glass-surface") return <GlassSurfacePreview />;
  if (slug === "card-highlight") return <CardHighlightPreview />;
  if (slug === "flip-card") return <FlipCardPreview />;
  return <div className="capability-preview capability-preview-planned"><span className="state-kicker">PREVIEW IN PREPARATION</span><strong>This Capability is mapped in the catalog.</strong><p>The interactive preview will be published after its self-owned implementation is verified.</p></div>;
}
