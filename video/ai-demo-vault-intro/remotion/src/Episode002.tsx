import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Easing, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";

const FPS = 30;
const sec = (seconds: number) => seconds * FPS;
const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const enter = (frame: number, start: number, duration = 16) => interpolate(frame, [start, start + duration], [0, 1], clamp);
const rise = (frame: number, start: number, end: number, distance: number) => interpolate(frame, [start, end], [distance, 0], { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) });
const move = (frame: number, start: number, end: number, from: number, to: number) => interpolate(frame, [start, end], [from, to], { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) });

const Header = ({ dark = false }: { dark?: boolean }) => (
  <div style={{ position: "absolute", top: 108, left: 76, right: 76, display: "flex", justifyContent: "space-between", alignItems: "center", color: dark ? "#a7f3d0" : "#1d4ed8", fontSize: 22, fontWeight: 850, letterSpacing: ".1em" }}>
    <span>《每天拆一个 AI 产品》</span><span>第 002 期</span>
  </div>
);

const Backdrop = ({ dark = false }: { dark?: boolean }) => (
  <AbsoluteFill style={{ backgroundColor: dark ? "#0d1421" : "#f7f7f4", backgroundImage: dark ? "radial-gradient(circle at 72% 18%, rgba(44,105,224,.32), transparent 34%), radial-gradient(circle at 14% 82%, rgba(159,231,213,.18), transparent 30%)" : "radial-gradient(circle at 84% 12%, rgba(29,78,216,.08), transparent 27%), radial-gradient(circle at 14% 84%, rgba(6,118,71,.08), transparent 30%)" }} />
);

type CardProps = { frame: number; top: number; left: number; width: number; height: number; dark?: boolean; compact?: boolean };

const SpotlightCard = ({ frame, top, left, width, height, dark = true, compact = false }: CardProps) => {
  const pointerX = move(frame, 18, 110, width * 0.18, width * 0.82);
  const pointerY = move(frame, 18, 110, height * 0.78, height * 0.28);
  const glow = move(frame, 8, 28, 0.2, 0.78);
  const rotate = move(frame, 34, 105, -1.5, 1.2);
  return (
    <div style={{ position: "absolute", top, left, width, height, opacity: enter(frame, 7, 17), translate: `0px ${rise(frame, 7, 32, 48)}px`, rotate: `${rotate}deg` }}>
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", borderRadius: compact ? 24 : 32, border: `1px solid rgb(191 255 235 / ${0.46 + glow * 0.32})`, background: dark ? "linear-gradient(145deg, rgba(255,255,255,.16), rgba(255,255,255,.04))" : "linear-gradient(145deg, rgba(255,255,255,.82), rgba(255,255,255,.34))", boxShadow: dark ? "0 40px 90px rgba(4,12,28,.4)" : "0 28px 72px rgba(15,23,42,.16)", backdropFilter: "blur(16px)" }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at ${pointerX}px ${pointerY}px, rgb(183 255 232 / ${glow}), transparent 32%), radial-gradient(circle at 84% 15%, rgba(92,126,255,.28), transparent 40%)` }} />
        <div style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "end", height: "100%", padding: compact ? 32 : 44, color: dark ? "#f8fafc" : "#111827" }}>
          <span style={{ color: dark ? "#a7f3d0" : "#17674f", fontSize: compact ? 20 : 24, fontWeight: 850, letterSpacing: ".12em" }}>BUILD BLOCK #002</span>
          <div style={{ marginTop: 18, fontSize: compact ? 37 : 48, lineHeight: 1.04, fontWeight: 900, letterSpacing: "-.05em" }}>Move your cursor.</div>
          <div style={{ marginTop: 13, color: dark ? "#cbd5e1" : "#52606d", fontSize: compact ? 21 : 25, fontWeight: 600 }}>The border follows the light.</div>
          <div style={{ display: "flex", gap: 10, marginTop: 26 }}>{["Spotlight", "Border", "Tilt"].map((tag) => <span key={tag} style={{ padding: "10px 14px", borderRadius: 999, border: `1px solid ${dark ? "rgba(255,255,255,.2)" : "#d6d6d0"}`, color: dark ? "#c8f8e8" : "#425466", fontSize: compact ? 18 : 20, fontWeight: 750 }}>{tag}</span>)}</div>
        </div>
      </div>
    </div>
  );
};

const CoverScene = () => {
  const frame = useCurrentFrame();
  return <AbsoluteFill><Backdrop dark /><Header dark /><div style={{ position: "absolute", top: 390, left: 76, right: 76, opacity: enter(frame, 8, 18), translate: `0px ${rise(frame, 8, 30, 34)}px` }}><div style={{ color: "#a7f3d0", fontSize: 24, fontWeight: 800, letterSpacing: ".14em" }}>BUILD BLOCK #002</div><div style={{ marginTop: 34, color: "#f7f7f4", fontSize: 104, lineHeight: 1.02, fontWeight: 900, letterSpacing: "-.065em" }}>玻璃光斑<br /><span style={{ color: "#a7f3d0" }}>卡片</span></div><div style={{ marginTop: 36, maxWidth: 760, color: "#c8cbc7", fontSize: 34, lineHeight: 1.3, fontWeight: 600 }}>拆解 AI 产品里的 Magic Card 效果</div></div><SpotlightCard frame={frame} top={1120} left={78} width={924} height={470} compact /></AbsoluteFill>;
};

const ReferenceScene = () => {
  const frame = useCurrentFrame();
  return <AbsoluteFill><Backdrop /><Header /><div style={{ position: "absolute", top: 250, left: 76, right: 76, opacity: enter(frame, 6, 16) }}><div style={{ color: "#1d4ed8", fontSize: 22, fontWeight: 850, letterSpacing: ".12em" }}>参考交互 / MAGIC UI</div><div style={{ marginTop: 26, fontSize: 68, lineHeight: 1.05, fontWeight: 900, letterSpacing: "-.055em" }}>光斑跟着指针走。</div><div style={{ marginTop: 22, color: "#575754", fontSize: 30, fontWeight: 600 }}>官方文档提供在线预览，仓库当前约 21.6k Stars。</div></div><SpotlightCard frame={frame} top={790} left={78} width={924} height={500} dark={false} /><div style={{ position: "absolute", left: 78, right: 78, top: 1400, display: "flex", gap: 14, opacity: enter(frame, 45, 14) }}><span style={{ flex: 1, padding: 20, textAlign: "center", border: "1px solid #d6d6d0", borderRadius: 16, background: "rgba(255,255,255,.78)", color: "#26374b", fontSize: 26, fontWeight: 800 }}>在线 Demo</span><span style={{ flex: 1, padding: 20, textAlign: "center", border: "1px solid #d6d6d0", borderRadius: 16, background: "rgba(255,255,255,.78)", color: "#26374b", fontSize: 26, fontWeight: 800 }}>公开来源</span></div></AbsoluteFill>;
};

const AnatomyScene = () => {
  const frame = useCurrentFrame();
  const labels = [
    { key: "Spotlight", text: "跟随指针", top: 760, left: 88, color: "#1d4ed8" },
    { key: "Border", text: "亮起边缘", top: 1170, left: 600, color: "#067647" },
    { key: "Reset", text: "离开归位", top: 1400, left: 130, color: "#9b5b16" },
  ];
  return <AbsoluteFill><Backdrop dark /><Header dark /><div style={{ position: "absolute", top: 280, left: 76, right: 76, color: "#f7f7f4", fontSize: 66, lineHeight: 1.05, fontWeight: 900, letterSpacing: "-.055em", opacity: enter(frame, 6, 16) }}>舒服感来自三个<br /><span style={{ color: "#a7f3d0" }}>明确的反馈。</span></div><SpotlightCard frame={frame} top={680} left={78} width={924} height={520} /><div style={{ position: "absolute", inset: 0 }}>{labels.map((label, index) => { const start = 30 + index * 13; return <div key={label.key} style={{ position: "absolute", top: label.top, left: label.left, opacity: enter(frame, start, 12), display: "flex", alignItems: "center", gap: 14, color: "#f8fafc" }}><span style={{ width: 16, height: 16, borderRadius: "50%", background: label.color, boxShadow: `0 0 18px ${label.color}` }} /><span style={{ fontSize: 28, fontWeight: 800 }}>{label.key}</span><span style={{ color: "#c8cbc7", fontSize: 24, fontWeight: 600 }}>{label.text}</span></div>; })}</div></AbsoluteFill>;
};

const CodexScene = () => {
  const frame = useCurrentFrame();
  const tags = ["Pointer", "Spotlight", "Border", "Tilt", "Reduced Motion"];
  return <AbsoluteFill><Backdrop /><Header /><div style={{ position: "absolute", top: 260, left: 76, right: 76, opacity: enter(frame, 6, 16) }}><div style={{ color: "#1d4ed8", fontSize: 22, fontWeight: 850, letterSpacing: ".12em" }}>CODEX 重新实现</div><div style={{ marginTop: 24, fontSize: 66, lineHeight: 1.05, fontWeight: 900, letterSpacing: "-.055em" }}>把一个光效<br />拆成五个参数。</div></div><div style={{ position: "absolute", left: 78, right: 78, top: 750, borderRadius: 24, overflow: "hidden", border: "1px solid #303d52", background: "#101827", boxShadow: "0 30px 80px rgba(15,23,42,.3)", opacity: enter(frame, 15, 16), translate: `0px ${rise(frame, 15, 40, 40)}px` }}><div style={{ display: "flex", justifyContent: "space-between", padding: "24px 30px", color: "#a7f3d0", borderBottom: "1px solid #283852", fontSize: 22, fontWeight: 800, letterSpacing: ".1em" }}><span>MAGIC-CARD.TSX</span><span>CODEX</span></div><div style={{ padding: "38px 36px 44px", display: "grid", gap: 16, color: "#e5eefc", fontFamily: "Consolas, monospace", fontSize: 27, lineHeight: 1.4 }}><div><span style={{ color: "#89b4fa" }}>const</span> pointer = getPosition(event);</div><div>background = radialGradient(pointer);</div><div>border + glow + tilt + reset</div></div></div><div style={{ position: "absolute", left: 78, right: 78, top: 1320, display: "flex", flexWrap: "wrap", gap: 13, opacity: enter(frame, 55, 14) }}>{tags.map((tag, index) => <span key={tag} style={{ padding: "15px 18px", borderRadius: 14, border: `1px solid ${index === 0 ? "#1d4ed8" : "#d6d6d0"}`, background: index === 0 ? "#eff6ff" : "#ffffff", color: index === 0 ? "#1d4ed8" : "#111111", fontSize: 24, fontWeight: 800 }}>{tag}</span>)}</div></AbsoluteFill>;
};

const RebuildScene = () => {
  const frame = useCurrentFrame();
  return <AbsoluteFill><Backdrop dark /><Header dark /><div style={{ position: "absolute", top: 270, left: 76, right: 76, color: "#f7f7f4", fontSize: 66, lineHeight: 1.05, fontWeight: 900, letterSpacing: "-.055em", opacity: enter(frame, 6, 16) }}>这是自研复刻。<br /><span style={{ color: "#a7f3d0" }}>每一次移动都有反馈。</span></div><SpotlightCard frame={frame} top={770} left={78} width={924} height={510} /><div style={{ position: "absolute", top: 1400, left: 78, right: 78, display: "flex", alignItems: "center", gap: 16, opacity: enter(frame, 46, 14) }}><span style={{ width: 28, height: 28, borderRadius: "50%", background: "#a7f3d0", boxShadow: "0 0 30px rgba(167,243,208,.75)" }} /><span style={{ color: "#c8cbc7", fontSize: 28, fontWeight: 700 }}>指针移动 · 光斑跟随 · 离开归位</span></div></AbsoluteFill>;
};

const CompareScene = () => {
  const frame = useCurrentFrame();
  return <AbsoluteFill><Backdrop /><Header /><div style={{ position: "absolute", top: 270, left: 76, right: 76, opacity: enter(frame, 6, 16) }}><div style={{ color: "#1d4ed8", fontSize: 22, fontWeight: 850, letterSpacing: ".12em" }}>参考规律 / 自研版本</div><div style={{ marginTop: 24, fontSize: 66, lineHeight: 1.05, fontWeight: 900, letterSpacing: "-.055em" }}>看起来相似，<br />接入方式完全可控。</div></div><div style={{ position: "absolute", left: 78, right: 78, top: 770, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, opacity: enter(frame, 14, 16) }}><div style={{ height: 500, borderRadius: 24, border: "1px solid #d6d6d0", background: "linear-gradient(145deg,#e9f1ef,#b8cfca)", display: "flex", alignItems: "end", padding: 28, color: "#24443b" }}><div><span style={{ fontSize: 18, fontWeight: 800, letterSpacing: ".1em" }}>REFERENCE</span><strong style={{ display: "block", fontSize: 32, marginTop: 12 }}>公开交互规律</strong></div></div><div style={{ height: 500, borderRadius: 24, border: "1px solid #bcebd7", background: "linear-gradient(145deg,#15263b,#2f6d65)", display: "flex", alignItems: "end", padding: 28, color: "#f8fafc" }}><div><span style={{ color: "#a7f3d0", fontSize: 18, fontWeight: 800, letterSpacing: ".1em" }}>AI DEMO VAULT</span><strong style={{ display: "block", fontSize: 32, marginTop: 12 }}>自研组件</strong></div></div></div></AbsoluteFill>;
};

const CtaScene = () => {
  const frame = useCurrentFrame();
  return <AbsoluteFill><Backdrop dark /><Header dark /><div style={{ position: "absolute", top: 410, left: 76, right: 76, textAlign: "center", opacity: enter(frame, 8, 18) }}><div style={{ color: "#a7f3d0", fontSize: 24, fontWeight: 850, letterSpacing: ".13em" }}>BUILD BLOCK #002</div><div style={{ marginTop: 34, color: "#f7f7f4", fontSize: 78, lineHeight: 1.06, fontWeight: 900, letterSpacing: "-.06em" }}>玻璃光斑卡片<br /><span style={{ color: "#a7f3d0" }}>已加入 AI Demo Vault</span></div><div style={{ marginTop: 52, color: "#c8cbc7", fontSize: 32, fontWeight: 650 }}>在线预览 · 自研源码 · Prompt · 接入说明</div><div style={{ marginTop: 44, display: "inline-flex", padding: "20px 28px", borderRadius: 14, background: "#f7f7f4", color: "#111111", fontFamily: "Consolas, monospace", fontSize: 29, fontWeight: 800 }}>ai-demo-vault.vercel.app/explore/magic-card</div></div></AbsoluteFill>;
};

const captions = [
  { start: 0, end: 4.2, text: "第 002 期：玻璃光斑卡片" },
  { start: 4.2, end: 9.2, text: "参考 Magic UI Magic Card\n当前页面显示约 21.6k Stars" },
  { start: 9.2, end: 14.2, text: "光斑跟随指针\n边框亮起" },
  { start: 14.2, end: 18.5, text: "离开后回到中心" },
  { start: 18.5, end: 25.2, text: "Pointer · Spotlight · Border\nTilt · Reduced Motion" },
  { start: 25.2, end: 32.5, text: "用 Codex 重新实现\n代码和参数全部自研" },
  { start: 32.5, end: 37.5, text: "参考交互 / 自研版本" },
  { start: 37.5, end: 42, text: "Build Block #002\n已加入 AI Demo Vault" },
];

const CaptionLayer = ({ withCaptions }: { withCaptions: boolean }) => {
  const frame = useCurrentFrame();
  if (!withCaptions) return null;
  const active = captions.find((caption) => frame >= sec(caption.start) && frame < sec(caption.end));
  if (!active) return null;
  const start = sec(active.start);
  const end = sec(active.end);
  const opacity = Math.min(interpolate(frame, [start, start + 8], [0, 1], clamp), interpolate(frame, [end - 7, end], [1, 0], clamp));
  return <div style={{ position: "absolute", left: 58, right: 58, bottom: 174, display: "flex", justifyContent: "center", opacity, pointerEvents: "none" }}><div style={{ maxWidth: 900, padding: "18px 26px 20px", border: "1px solid rgba(255,255,255,.16)", borderRadius: 22, background: "rgba(17,17,17,.86)", color: "#fff", fontSize: 34, fontWeight: 650, lineHeight: 1.25, textAlign: "center", whiteSpace: "pre-line", letterSpacing: "-.02em" }}>{active.text}</div></div>;
};

export type Episode002Props = { withVoice: boolean; withCaptions: boolean };

export const Episode002: React.FC<Episode002Props> = ({ withVoice, withCaptions }) => (
  <AbsoluteFill style={{ width: 1080, height: 1920, overflow: "hidden", fontFamily: 'Inter, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif' }}>
    <Sequence from={0} durationInFrames={sec(4.2)}><CoverScene /></Sequence>
    <Sequence from={sec(4.2)} durationInFrames={sec(5)}><ReferenceScene /></Sequence>
    <Sequence from={sec(9.2)} durationInFrames={sec(9.3)}><AnatomyScene /></Sequence>
    <Sequence from={sec(18.5)} durationInFrames={sec(6.7)}><CodexScene /></Sequence>
    <Sequence from={sec(25.2)} durationInFrames={sec(7.3)}><RebuildScene /></Sequence>
    <Sequence from={sec(32.5)} durationInFrames={sec(5)}><CompareScene /></Sequence>
    <Sequence from={sec(37.5)} durationInFrames={sec(4.5)}><CtaScene /></Sequence>
    <CaptionLayer withCaptions={withCaptions} />
    <Audio src={staticFile("music.wav")} volume={0.14} />
    {withVoice ? <Audio src={staticFile("episode-002-narration.wav")} volume={0.96} /> : null}
  </AbsoluteFill>
);
