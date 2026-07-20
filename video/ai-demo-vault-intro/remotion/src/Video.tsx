import React from "react";
import { Audio, Video } from "@remotion/media";
import {
  AbsoluteFill,
  Easing,
  Img,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import "./styles.css";

export type ProductIntroProps = { withVoice: boolean };

const FPS = 30;
const scene = (seconds: number) => seconds * FPS;

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const inOut = (frame: number, start: number, end: number, from: number, to: number) =>
  interpolate(frame, [start, end], [from, to], { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) });

const fade = (frame: number, start: number, duration = 18) =>
  interpolate(frame, [start, start + duration], [0, 1], clamp);

const drift = (frame: number, start: number, duration: number, distance: number) =>
  interpolate(frame, [start, start + duration], [distance, 0], { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) });

const Screenshot = ({
  file,
  width,
  height,
  top,
  left,
  scale = 1,
  x = 0,
  y = 0,
  radius = 28,
  opacity = 1,
}: {
  file: string;
  width: number;
  height: number;
  top?: number;
  left?: number;
  scale?: number;
  x?: number;
  y?: number;
  radius?: number;
  opacity?: number;
}) => (
  <div
    className="screen-frame"
    style={{
      position: "absolute",
      width,
      height,
      top,
      left,
      borderRadius: radius,
      opacity,
      scale,
      translate: `${x}px ${y}px`,
    }}
  >
    <Img src={staticFile(file)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
  </div>
);

const CaptionLayer = ({ frame }: { frame: number }) => {
  const captions = [
    { start: 0, end: 3.5, text: <>每天都在刷到惊艳的 <span className="caption-key">AI Demo</span></> },
    { start: 3.5, end: 6.5, text: <>收藏越来越多</> },
    { start: 6.5, end: 9, text: <>没有源码 · 没有 <span className="caption-key">Prompt</span> · 不知道怎么接入</> },
    { start: 9, end: 12.5, text: <>所以我做了 <span className="caption-key">AI Demo Vault</span></> },
    { start: 12.5, end: 15.5, text: <>把优秀产品拆成可复用的 <span className="caption-key">Build Blocks</span></> },
    { start: 15.5, end: 20, text: <>在线预览 · 源码状态 · Prompt · README</> },
    { start: 20, end: 25, text: <>搜索你现在需要的那一块</> },
    { start: 25, end: 29, text: <>真实交互，重新实现，状态清楚</> },
    { start: 29, end: 33, text: <>从一个可靠模块开始</> },
    { start: 33, end: 36.5, text: <>不必每次面对一张空白页面</> },
    { start: 36.5, end: 39.5, text: <>每天发现 · 持续拆解 · 逐步更新</> },
    { start: 39.5, end: 45, text: <>AI Demo Vault 已上线<br />把你想拆解的 Demo 发给我</> },
  ];

  const active = captions.find((caption) => frame >= scene(caption.start) && frame < scene(caption.end));
  if (!active) return null;
  const start = scene(active.start);
  const end = scene(active.end);
  const opacityIn = interpolate(frame, [start, start + 8], [0, 1], clamp);
  const opacityOut = interpolate(frame, [end - 7, end], [1, 0], clamp);
  const opacity = Math.min(opacityIn, opacityOut);
  const y = interpolate(frame, [start, start + 8], [18, 0], clamp);

  return (
    <div className="caption-shell" style={{ opacity, translate: `0px ${y}px` }}>
      <div className="caption">{active.text}</div>
    </div>
  );
};

const Background = ({ dark = false, accent = false }: { dark?: boolean; accent?: boolean }) => (
  <AbsoluteFill
    style={{
      backgroundColor: dark ? "#111111" : "#f7f7f4",
      backgroundImage: accent
        ? "radial-gradient(circle at 75% 22%, rgba(29,78,216,.16), transparent 34%), radial-gradient(circle at 16% 78%, rgba(6,118,71,.12), transparent 30%)"
        : dark
          ? "radial-gradient(circle at 75% 18%, rgba(29,78,216,.22), transparent 36%), radial-gradient(circle at 15% 82%, rgba(159,231,213,.12), transparent 32%)"
          : "radial-gradient(circle at 85% 10%, rgba(29,78,216,.07), transparent 28%)",
    }}
  />
);

const OpeningScene = () => (
  <AbsoluteFill style={{ backgroundColor: "#111111" }}>
    <Video src={staticFile("hyperframes-opening.mp4")} muted volume={0} objectFit="cover" style={{ width: "100%", height: "100%" }} />
  </AbsoluteFill>
);

const ProblemScene = () => {
  const frame = useCurrentFrame();
  const titleOpacity = fade(frame, 8, 18);
  const items = ["收藏夹 / 01", "收藏夹 / 02", "收藏夹 / 03"];
  return (
    <AbsoluteFill>
      <Background accent />
      <div style={{ position: "absolute", left: 76, top: 240, right: 76 }}>
        <div className="label" style={{ color: "#1d4ed8", opacity: titleOpacity }}>THE PROBLEM</div>
        <div style={{ marginTop: 34, maxWidth: 840, fontSize: 72, fontWeight: 900, lineHeight: 1.04, letterSpacing: "-.05em", opacity: titleOpacity }}>很多 Demo，停在收藏夹里。</div>
      </div>
      <div style={{ position: "absolute", left: 76, right: 76, top: 650, display: "grid", gap: 18 }}>
        {items.map((item, index) => {
          const itemOpacity = fade(frame, 28 + index * 14, 14);
          const itemY = drift(frame, 28 + index * 14, 16, 30);
          return (
            <div key={item} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "28px 30px", border: "1px solid #d6d6d0", borderRadius: 18, backgroundColor: index === 0 ? "#fff" : "#f0f0ec", opacity: itemOpacity, translate: `0px ${itemY}px` }}>
              <span style={{ fontSize: 30, fontWeight: 750, color: index === 0 ? "#111111" : "#8a8a85" }}>{item}</span>
              <span style={{ fontSize: 24, color: "#8a8a85" }}>暂停</span>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 76, right: 76, top: 1150, display: "grid", gap: 20 }}>
        {["没有源码", "没有 Prompt", "不知道怎么接入"].map((text, index) => {
          const opacity = fade(frame, 70 + index * 12, 14);
          const x = interpolate(frame, [70 + index * 12, 88 + index * 12], [-38, 0], clamp);
          return <div key={text} style={{ display: "flex", alignItems: "center", gap: 18, color: index === 1 ? "#1d4ed8" : "#111111", fontSize: 40, fontWeight: 800, opacity, translate: `${x}px 0px` }}><span style={{ width: 18, height: 18, borderRadius: "50%", backgroundColor: index === 1 ? "#1d4ed8" : "#111111" }} />{text}</div>;
        })}
      </div>
    </AbsoluteFill>
  );
};

const RevealScene = () => {
  const frame = useCurrentFrame();
  const cardOpacity = fade(frame, 8, 20);
  const cardY = drift(frame, 8, 28, 70);
  const titleOpacity = fade(frame, 20, 18);
  return (
    <AbsoluteFill>
      <Background dark />
      <div style={{ position: "absolute", left: 76, top: 240, color: "#9fe7d5", fontSize: 22, fontWeight: 850, letterSpacing: ".14em", opacity: titleOpacity }}>AI DEMO VAULT</div>
      <div style={{ position: "absolute", left: 76, top: 320, maxWidth: 860, fontSize: 82, fontWeight: 900, lineHeight: 1.03, letterSpacing: "-.06em", color: "#f7f7f4", opacity: titleOpacity }}>把优秀产品拆成<br /><span style={{ color: "#9fe7d5" }}>可复用的 Build Blocks</span></div>
      <Screenshot file="capture/home.png" width={830} height={850} top={820} left={125} scale={inOut(frame, 20, 130, 0.88, 1)} y={cardY} opacity={cardOpacity} radius={30} />
      <div style={{ position: "absolute", left: 112, right: 90, top: 1700, display: "flex", gap: 14, flexWrap: "wrap", opacity: fade(frame, 48, 18) }}>
        {['UI', 'Animation', 'AI Workflow'].map((chip, index) => <span key={chip} className="chip" style={{ backgroundColor: index === 1 ? "#9fe7d5" : "#1f2937", color: index === 1 ? "#111111" : "#f7f7f4", borderColor: index === 1 ? "#9fe7d5" : "#405064" }}>{chip}</span>)}
      </div>
    </AbsoluteFill>
  );
};

const TourScene = () => {
  const frame = useCurrentFrame();
  const searchScale = inOut(frame, 8, 42, 1.16, 1);
  const searchX = inOut(frame, 8, 42, 24, 0);
  const detailScale = inOut(frame, 112, 230, 1.08, 1);
  const detailY = drift(frame, 112, 65, 36);
  const showDetail = fade(frame, 108, 20);
  const labels = ["Live Demo", "Source ready", "Prompt planned", "Integration Guide", "License"];
  return (
    <AbsoluteFill>
      <Background />
      <div style={{ position: "absolute", left: 76, top: 160, color: "#1d4ed8", fontSize: 22, fontWeight: 850, letterSpacing: ".12em" }}>BROWSE · PREVIEW · REUSE</div>
      <div style={{ position: "absolute", left: 76, top: 220, right: 76, fontSize: 62, fontWeight: 900, lineHeight: 1.05, letterSpacing: "-.05em" }}>先看清楚，再决定要不要接入。</div>
      <div style={{ position: "absolute", left: 45, top: 530, width: 990, height: 620, opacity: fade(frame, 6, 18), scale: searchScale, translate: `${searchX}px 0px`, transformOrigin: "center center" }}>
        <Screenshot file="capture/explore.png" width={990} height={620} top={0} left={0} scale={1} radius={28} />
      </div>
      <div style={{ position: "absolute", left: 76, top: 1200, right: 76, display: "flex", gap: 14, flexWrap: "wrap", opacity: fade(frame, 44, 16) }}>
        {['Glass', 'Hero', 'Chat', 'Animation'].map((chip) => <span key={chip} className="chip" style={{ backgroundColor: chip === 'Glass' ? "#eff6ff" : "#ffffff", borderColor: chip === 'Glass' ? "#1d4ed8" : "#d6d6d0", color: chip === 'Glass' ? "#1d4ed8" : "#111111" }}>{chip}</span>)}
      </div>
      <div style={{ position: "absolute", left: 45, top: 1320, width: 990, height: 470, opacity: showDetail, scale: detailScale, translate: `0px ${detailY}px`, transformOrigin: "center top" }}>
        <Screenshot file="capture/glass-surface.png" width={990} height={470} top={0} left={0} scale={1} radius={28} />
      </div>
      <div style={{ position: "absolute", left: 82, bottom: 270, display: "grid", gap: 10, opacity: showDetail }}>
        {labels.map((label, index) => <div key={label} style={{ color: index === 0 || index === 1 ? "#067647" : "#575754", fontSize: 24, fontWeight: 750 }}>✓ {label}</div>)}
      </div>
    </AbsoluteFill>
  );
};

const BreakdownScene = () => {
  const frame = useCurrentFrame();
  const baseOpacity = fade(frame, 8, 18);
  const blocks = ["Hero", "Glass Card", "Chat UI", "Upload Flow", "Animation"];
  return (
    <AbsoluteFill>
      <Background accent />
      <div style={{ position: "absolute", left: 76, top: 200, color: "#1d4ed8", fontSize: 22, fontWeight: 850, letterSpacing: ".12em", opacity: baseOpacity }}>ONE PRODUCT → MANY BLOCKS</div>
      <div style={{ position: "absolute", left: 76, top: 270, right: 76, fontSize: 64, fontWeight: 900, lineHeight: 1.04, letterSpacing: "-.05em", opacity: baseOpacity }}>做产品，不必每次从空白开始。</div>
      <div style={{ position: "absolute", left: 78, top: 560, width: 924, height: 420, border: "1px solid #d6d6d0", borderRadius: 28, backgroundColor: "#ffffff", opacity: baseOpacity, overflow: "hidden" }}>
        <div style={{ padding: 36, fontSize: 22, color: "#1d4ed8", fontWeight: 800, letterSpacing: ".08em" }}>PRODUCT PREVIEW</div>
        <div style={{ margin: "0 36px", height: 230, borderRadius: 18, background: "radial-gradient(circle at 72% 24%, rgba(29,78,216,.55), transparent 36%), #111827" }} />
        <div style={{ padding: "24px 36px", display: "flex", justifyContent: "space-between", color: "#575754", fontSize: 24, fontWeight: 700 }}><span>Preview</span><span>Inspect</span><span>Reuse</span></div>
      </div>
      <div style={{ position: "absolute", left: 76, right: 76, top: 1120, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        {blocks.map((block, index) => {
          const start = 35 + index * 14;
          const opacity = fade(frame, start, 14);
          const y = drift(frame, start, 18, 36);
          return <div key={block} style={{ minHeight: 110, padding: "28px 26px", display: "flex", alignItems: "center", border: "1px solid #d6d6d0", borderRadius: 18, backgroundColor: "#ffffff", fontSize: 28, fontWeight: 800, opacity, translate: `0px ${y}px` }}>{block}</div>;
        })}
      </div>
      <div style={{ position: "absolute", left: 78, bottom: 220, color: "#575754", fontSize: 28, fontWeight: 650, opacity: fade(frame, 92, 14) }}>可预览 · 可拆解 · 可集成</div>
    </AbsoluteFill>
  );
};

const SourcesScene = () => {
  const frame = useCurrentFrame();
  const titleOpacity = fade(frame, 8, 18);
  const sources = ["X", "GitHub", "Product Hunt", "Showcase"];
  const blocks = ["Color Extraction", "Glass Surface", "Card Highlight"];
  return (
    <AbsoluteFill>
      <Background dark />
      <div style={{ position: "absolute", left: 76, top: 230, color: "#9fe7d5", fontSize: 22, fontWeight: 850, letterSpacing: ".12em", opacity: titleOpacity }}>CONTENT LOOP</div>
      <div style={{ position: "absolute", left: 76, top: 300, right: 76, color: "#f7f7f4", fontSize: 72, fontWeight: 900, lineHeight: 1.04, letterSpacing: "-.05em", opacity: titleOpacity }}>每天发现，持续拆解，逐步更新。</div>
      <div style={{ position: "absolute", left: 76, top: 760, right: 76, display: "grid", gap: 18 }}>
        {sources.map((source, index) => {
          const start = 20 + index * 14;
          const opacity = fade(frame, start, 15);
          const x = interpolate(frame, [start, start + 18], [-80, 0], clamp);
          return <div key={source} style={{ display: "flex", alignItems: "center", gap: 22, color: "#c8cbc7", fontSize: 32, fontWeight: 750, opacity, translate: `${x}px 0px` }}><span style={{ width: 18, height: 18, borderRadius: "50%", backgroundColor: "#9fe7d5" }} />{source}</div>;
        })}
      </div>
      <div style={{ position: "absolute", left: 78, right: 78, top: 1120, height: 2, backgroundColor: "#405064", transformOrigin: "left center", scale: `${inOut(frame, 80, 105, 0, 1)} 1` }} />
      <div style={{ position: "absolute", left: 76, right: 76, top: 1230, display: "grid", gap: 16 }}>
        {blocks.map((block, index) => { const opacity = fade(frame, 82 + index * 12, 14); const x = interpolate(frame, [82 + index * 12, 100 + index * 12], [60, 0], clamp); return <div key={block} style={{ padding: "25px 28px", border: "1px solid #405064", borderRadius: 18, backgroundColor: "#1f2937", color: "#f7f7f4", fontSize: 28, fontWeight: 800, opacity, translate: `${x}px 0px` }}>{block}</div>; })}
      </div>
    </AbsoluteFill>
  );
};

const CtaScene = () => {
  const frame = useCurrentFrame();
  const titleOpacity = fade(frame, 10, 20);
  const urlOpacity = fade(frame, 28, 16);
  const urlScale = interpolate(frame, [48, 65, 82], [0.96, 1.02, 1], clamp);
  return (
    <AbsoluteFill>
      <Background />
      <div style={{ position: "absolute", left: 76, top: 180, color: "#1d4ed8", fontSize: 22, fontWeight: 850, letterSpacing: ".12em", opacity: titleOpacity }}>NOW LIVE</div>
      <div style={{ position: "absolute", left: 76, top: 250, right: 76, fontSize: 84, fontWeight: 900, lineHeight: 1.03, letterSpacing: "-.06em", opacity: titleOpacity }}>AI Demo Vault<br /><span style={{ color: "#1d4ed8" }}>已上线。</span></div>
      <Screenshot file="capture/home.png" width={610} height={520} top={760} left={72} scale={inOut(frame, 10, 68, .92, 1)} opacity={fade(frame, 16, 18)} radius={26} />
      <Screenshot file="capture/blueprints.png" width={310} height={520} top={760} left={700} scale={inOut(frame, 18, 80, .9, 1)} opacity={fade(frame, 24, 18)} radius={26} />
      <div style={{ position: "absolute", left: 76, top: 1400, color: "#575754", fontSize: 32, fontWeight: 700, opacity: urlOpacity }}>把你想让我拆解的 Demo 发给我</div>
      <div className="url" style={{ position: "absolute", left: 76, top: 1480, opacity: urlOpacity, scale: urlScale }}>ai-demo-vault.vercel.app</div>
      <div style={{ position: "absolute", left: 78, bottom: 125, color: "#575754", fontSize: 24, fontWeight: 650, opacity: fade(frame, 50, 16) }}>关注后续的 Build Blocks</div>
    </AbsoluteFill>
  );
};

export const ProductIntro: React.FC<ProductIntroProps> = ({ withVoice }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill className="video-root">
      <Sequence from={0} durationInFrames={scene(4)}><OpeningScene /></Sequence>
      <Sequence from={scene(4)} durationInFrames={scene(5)}><ProblemScene /></Sequence>
      <Sequence from={scene(9)} durationInFrames={scene(4)}><RevealScene /></Sequence>
      <Sequence from={scene(13)} durationInFrames={scene(12)}><TourScene /></Sequence>
      <Sequence from={scene(25)} durationInFrames={scene(7)}><BreakdownScene /></Sequence>
      <Sequence from={scene(32)} durationInFrames={scene(7)}><SourcesScene /></Sequence>
      <Sequence from={scene(39)} durationInFrames={durationInFrames - scene(39)}><CtaScene /></Sequence>
      <CaptionLayer frame={frame} />
      <Audio src={staticFile("music.wav")} volume={0.16} />
      {withVoice ? <Audio src={staticFile("narration.wav")} volume={0.95} /> : null}
    </AbsoluteFill>
  );
};
