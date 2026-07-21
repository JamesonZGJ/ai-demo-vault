import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Easing, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";

const FPS = 30;
const sec = (seconds: number) => seconds * FPS;
const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const ease = (frame: number, from: number, to: number, a: number, b: number) =>
  interpolate(frame, [from, to], [a, b], { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) });

const opacityIn = (frame: number, start: number, duration = 18) =>
  interpolate(frame, [start, start + duration], [0, 1], clamp);

const Backdrop = ({ dark = false }: { dark?: boolean }) => (
  <AbsoluteFill
    style={{
      backgroundColor: dark ? "#0d1421" : "#f7f7f4",
      backgroundImage: dark
        ? "radial-gradient(circle at 75% 18%, rgba(44,105,224,.34), transparent 35%), radial-gradient(circle at 12% 82%, rgba(159,231,213,.18), transparent 30%)"
        : "radial-gradient(circle at 84% 12%, rgba(29,78,216,.08), transparent 27%), radial-gradient(circle at 14% 84%, rgba(6,118,71,.08), transparent 30%)",
    }}
  />
);

const Header = ({ dark = false }: { dark?: boolean }) => (
  <div style={{ position: "absolute", top: 108, left: 76, right: 76, display: "flex", justifyContent: "space-between", alignItems: "center", color: dark ? "#9fe7d5" : "#1d4ed8", fontSize: 22, fontWeight: 850, letterSpacing: ".1em" }}>
    <span>《每天拆一个 AI 产品》</span><span>第 001 期</span>
  </div>
);

const GlassCard = ({ frame, top = 520, left = 78, width = 924, height = 520, tilt = true }: { frame: number; top?: number; left?: number; width?: number; height?: number; tilt?: boolean }) => {
  const enter = opacityIn(frame, 8, 18);
  const y = ease(frame, 8, 34, 46, 0);
  const pointerX = ease(frame, 28, 120, -80, width * 0.72);
  const pointerY = ease(frame, 28, 120, height * 0.72, height * 0.28);
  const rotate = tilt ? ease(frame, 38, 120, -1.3, 0.9) : 0;
  return (
    <div style={{ position: "absolute", top, left, width, height, opacity: enter, translate: `0px ${y}px`, rotate: `${rotate}deg` }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 36, overflow: "hidden", border: "1px solid rgba(255,255,255,.7)", background: "linear-gradient(145deg, rgba(255,255,255,.68), rgba(255,255,255,.16))", boxShadow: "0 40px 100px rgba(15,23,42,.33), inset 0 1px 0 rgba(255,255,255,.95)", backdropFilter: "blur(22px)" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 24% 8%, rgba(255,255,255,.9), transparent 30%), radial-gradient(circle at 88% 12%, rgba(86,156,255,.5), transparent 36%), linear-gradient(135deg, rgba(255,255,255,.45), rgba(209,220,236,.12))" }} />
        <div style={{ position: "absolute", left: pointerX, top: pointerY, width: 250, height: 250, transform: "translate(-50%, -50%)", borderRadius: "50%", background: "radial-gradient(circle, rgba(176,255,239,.7), rgba(79,141,255,.16) 48%, transparent 70%)", filter: "blur(4px)", opacity: ease(frame, 22, 42, 0.2, 0.76) }} />
        <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 22, padding: "48px 48px", color: "#101827" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 24, fontWeight: 800, letterSpacing: ".11em", color: "#37506e" }}>界面拆解</span>
            <span style={{ padding: "8px 14px", borderRadius: 999, background: "rgba(255,255,255,.48)", border: "1px solid rgba(255,255,255,.7)", fontSize: 20, fontWeight: 800, color: "#26704e" }}>可读</span>
          </div>
          <div style={{ fontSize: 48, lineHeight: 1.08, fontWeight: 850, letterSpacing: "-.04em" }}>把复杂结果，<br />变成清晰下一步。</div>
          <div style={{ maxWidth: 620, fontSize: 25, lineHeight: 1.45, color: "#43516a", fontWeight: 600 }}>半透明表面、轻微模糊与克制高光，让信息浮在界面之上。</div>
          <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
            {["摘要", "建议", "引用"].map((tag, index) => <span key={tag} style={{ padding: "13px 18px", borderRadius: 14, background: index === 1 ? "rgba(255,255,255,.74)" : "rgba(255,255,255,.34)", border: "1px solid rgba(255,255,255,.66)", color: "#33415a", fontSize: 22, fontWeight: 750 }}>{tag}</span>)}
          </div>
        </div>
      </div>
    </div>
  );
};

const CoverScene = () => {
  const frame = useCurrentFrame();
  return <AbsoluteFill><Backdrop dark /><Header dark /><div style={{ position: "absolute", top: 390, left: 76, right: 76, opacity: opacityIn(frame, 8, 18) }}><div style={{ color: "#9fe7d5", fontSize: 24, fontWeight: 800, letterSpacing: ".14em" }}>第 001 期</div><div style={{ marginTop: 38, color: "#f7f7f4", fontSize: 104, lineHeight: 1.02, fontWeight: 900, letterSpacing: "-.065em" }}>玻璃拟态<br /><span style={{ color: "#9fe7d5" }}>卡片</span></div><div style={{ marginTop: 38, maxWidth: 760, color: "#c8cbc7", fontSize: 35, lineHeight: 1.3, fontWeight: 600 }}>拆解 AI 产品里的界面层次</div></div><GlassCard frame={frame} top={1020} left={78} width={924} height={520} tilt={false} /></AbsoluteFill>;
};

const FamiliarScene = () => {
  const frame = useCurrentFrame();
  return <AbsoluteFill><Backdrop /><Header /><div style={{ position: "absolute", top: 260, left: 76, right: 76, opacity: opacityIn(frame, 6, 16) }}><div style={{ color: "#1d4ed8", fontSize: 22, fontWeight: 850, letterSpacing: ".12em" }}>先看感受</div><div style={{ marginTop: 26, fontSize: 68, lineHeight: 1.05, fontWeight: 900, letterSpacing: "-.055em" }}>为什么看起来舒服？</div><div style={{ marginTop: 22, color: "#575754", fontSize: 30, fontWeight: 600 }}>透明、边界和空间反馈一起工作。</div></div><GlassCard frame={frame} top={760} left={78} width={924} height={500} /><div style={{ position: "absolute", left: 78, right: 78, top: 1380, display: "flex", gap: 16, opacity: opacityIn(frame, 40, 14) }}>{["透明表面", "清楚边界", "轻微高光"].map((label) => <span key={label} style={{ flex: 1, padding: "20px 18px", textAlign: "center", border: "1px solid #d6d6d0", borderRadius: 16, background: "rgba(255,255,255,.7)", fontSize: 28, fontWeight: 800, color: "#26374b" }}>{label}</span>)}</div></AbsoluteFill>;
};

const AnatomyScene = () => {
  const frame = useCurrentFrame();
  const labels = [
    { key: "Surface", text: "半透明表面", top: 650, left: 86, color: "#1d4ed8" },
    { key: "Border", text: "细边框分层", top: 1300, left: 640, color: "#067647" },
    { key: "Depth", text: "阴影拉开距离", top: 1380, left: 120, color: "#9b5b16" },
  ];
  return <AbsoluteFill><Backdrop dark /><Header dark /><div style={{ position: "absolute", top: 280, left: 76, right: 76, color: "#f7f7f4", fontSize: 66, lineHeight: 1.05, fontWeight: 900, letterSpacing: "-.055em", opacity: opacityIn(frame, 6, 16) }}>舒服感来自三层关系。</div><GlassCard frame={frame} top={720} left={78} width={924} height={520} tilt={false} />{labels.map((label, index) => { const op = opacityIn(frame, 30 + index * 16, 12); return <div key={label.key} style={{ position: "absolute", top: label.top, left: label.left, opacity: op, display: "flex", alignItems: "center", gap: 14, color: "#f7f7f4" }}><span style={{ width: 16, height: 16, borderRadius: "50%", background: label.color, boxShadow: `0 0 18px ${label.color}` }} /><span style={{ fontSize: 28, fontWeight: 800 }}>{label.key}</span><span style={{ color: "#c8cbc7", fontSize: 24, fontWeight: 600 }}>{label.text}</span></div>; })}</AbsoluteFill>;
};

const RebuildScene = () => {
  const frame = useCurrentFrame();
  const tags = ["Hover", "Blur", "Shadow", "Border", "Glow"];
  return <AbsoluteFill><Backdrop /><Header /><div style={{ position: "absolute", top: 260, left: 76, right: 76, opacity: opacityIn(frame, 6, 16) }}><div style={{ color: "#1d4ed8", fontSize: 22, fontWeight: 850, letterSpacing: ".12em" }}>重新实现</div><div style={{ marginTop: 24, fontSize: 66, lineHeight: 1.05, fontWeight: 900, letterSpacing: "-.055em" }}>把质感拆成几个参数。</div></div><div style={{ position: "absolute", left: 78, right: 78, top: 760, borderRadius: 24, overflow: "hidden", border: "1px solid #303d52", background: "#101827", boxShadow: "0 30px 80px rgba(15,23,42,.3)", opacity: opacityIn(frame, 15, 16), translate: `0px ${ease(frame, 15, 40, 40, 0)}px` }}><div style={{ display: "flex", justifyContent: "space-between", padding: "24px 30px", color: "#9fe7d5", borderBottom: "1px solid #283852", fontSize: 22, fontWeight: 800, letterSpacing: ".1em" }}><span>GLASS-CARD</span><span>参数</span></div><div style={{ padding: "38px 36px 44px", display: "grid", gap: 16, color: "#e5eefc", fontFamily: "Consolas, monospace", fontSize: 28, lineHeight: 1.35 }}><div><span style={{ color: "#89b4fa" }}>surface</span> = <span style={{ color: "#9fe7d5" }}>rgba(255,255,255,.18)</span>;</div><div><span style={{ color: "#89b4fa" }}>blur</span> = <span style={{ color: "#9fe7d5" }}>22px</span>;</div><div>border + shadow + glow + pointer</div></div></div><div style={{ position: "absolute", left: 78, right: 78, top: 1320, display: "flex", flexWrap: "wrap", gap: 14, opacity: opacityIn(frame, 55, 14) }}>{tags.map((tag, index) => <span key={tag} style={{ padding: "16px 20px", borderRadius: 14, border: `1px solid ${index === 0 ? "#1d4ed8" : "#d6d6d0"}`, background: index === 0 ? "#eff6ff" : "#ffffff", color: index === 0 ? "#1d4ed8" : "#111111", fontSize: 26, fontWeight: 800 }}>{tag}</span>)}</div></AbsoluteFill>;
};

const InteractionScene = () => {
  const frame = useCurrentFrame();
  return <AbsoluteFill><Backdrop dark /><Header dark /><div style={{ position: "absolute", top: 280, left: 76, right: 76, color: "#f7f7f4", fontSize: 66, lineHeight: 1.05, fontWeight: 900, letterSpacing: "-.055em", opacity: opacityIn(frame, 6, 16) }}>让卡片对操作<br /><span style={{ color: "#9fe7d5" }}>产生明确回应。</span></div><GlassCard frame={frame} top={760} left={78} width={924} height={520} /><div style={{ position: "absolute", top: 1400, left: 78, right: 78, display: "flex", alignItems: "center", gap: 16, opacity: opacityIn(frame, 45, 14) }}><span style={{ width: 28, height: 28, borderRadius: "50%", background: "#9fe7d5", boxShadow: "0 0 30px rgba(159,231,213,.75)" }} /><span style={{ color: "#c8cbc7", fontSize: 28, fontWeight: 700 }}>指针移动 · 高光跟随 · 离开归位</span></div></AbsoluteFill>;
};

const ResultScene = () => {
  const frame = useCurrentFrame();
  const items = ["透明度", "模糊", "边框", "高光", "响应式"];
  return <AbsoluteFill><Backdrop /><Header /><div style={{ position: "absolute", top: 270, left: 76, right: 76, opacity: opacityIn(frame, 6, 16) }}><div style={{ color: "#1d4ed8", fontSize: 22, fontWeight: 850, letterSpacing: ".12em" }}>最后看结果</div><div style={{ marginTop: 22, fontSize: 70, lineHeight: 1.05, fontWeight: 900, letterSpacing: "-.055em" }}>一个可以持续调整的界面效果。</div></div><div style={{ position: "absolute", left: 78, right: 78, top: 760, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, opacity: opacityIn(frame, 14, 16), translate: `0px ${ease(frame, 14, 40, 50, 0)}px` }}>{items.map((item, index) => <div key={item} style={{ padding: "28px 24px", border: "1px solid #d6d6d0", borderRadius: 18, background: index < 2 ? "#eff6ff" : "#ffffff", color: index < 2 ? "#1d4ed8" : "#333c4b", fontSize: 28, fontWeight: 800 }}>✓ {item}</div>)}</div><div style={{ position: "absolute", left: 78, right: 78, top: 1390, color: "#067647", fontSize: 28, fontWeight: 800, opacity: opacityIn(frame, 45, 14) }}>移动端保留层次，动效保持克制。</div></AbsoluteFill>;
};

const CtaScene = () => {
  const frame = useCurrentFrame();
  return <AbsoluteFill><Backdrop dark /><Header dark /><div style={{ position: "absolute", top: 420, left: 76, right: 76, textAlign: "center", opacity: opacityIn(frame, 8, 18) }}><div style={{ color: "#9fe7d5", fontSize: 24, fontWeight: 850, letterSpacing: ".13em" }}>《每天拆一个 AI 产品》</div><div style={{ marginTop: 34, color: "#f7f7f4", fontSize: 78, lineHeight: 1.06, fontWeight: 900, letterSpacing: "-.06em" }}>玻璃拟态卡片<br /><span style={{ color: "#9fe7d5" }}>第 001 期完成</span></div><div style={{ marginTop: 52, color: "#c8cbc7", fontSize: 32, fontWeight: 650 }}>关注 AI 拆解局，下一期继续拆。</div><div style={{ marginTop: 26, color: "#c8cbc7", fontSize: 28, fontWeight: 600 }}>评论区告诉我想看哪个产品或交互。</div></div></AbsoluteFill>;
};

const captions = [
  { start: 0, end: 4.2, text: "第 001 期：玻璃拟态卡片" },
  { start: 4.2, end: 9.2, text: "为什么看起来舒服？\n透明、边界和空间反馈" },
  { start: 9.2, end: 14.2, text: "半透明表面\n让内容和背景保持联系" },
  { start: 14.2, end: 19, text: "细边框 · 阴影 · 高光\n把层级说清楚" },
  { start: 19, end: 25.8, text: "重新实现一遍\n指针跟随 · Hover 反馈" },
  { start: 25.8, end: 33.5, text: "移动时高光跟随\n离开后回到平衡" },
  { start: 33.5, end: 38, text: "移动端保留层次\n动效保持克制" },
  { start: 38, end: 42, text: "关注 AI 拆解局\n评论区告诉我想看哪个" },
];

const CaptionLayer = ({ withCaptions }: { withCaptions: boolean }) => {
  const frame = useCurrentFrame();
  if (!withCaptions) return null;
  const active = captions.find((caption) => frame >= sec(caption.start) && frame < sec(caption.end));
  if (!active) return null;
  const start = sec(active.start);
  const end = sec(active.end);
  const opacity = Math.min(interpolate(frame, [start, start + 8], [0, 1], clamp), interpolate(frame, [end - 7, end], [1, 0], clamp));
  const y = interpolate(frame, [start, start + 8], [18, 0], clamp);
  return <div style={{ position: "absolute", left: 58, right: 58, bottom: 174, display: "flex", justifyContent: "center", opacity, translate: `0px ${y}px`, pointerEvents: "none" }}><div style={{ maxWidth: 900, padding: "18px 26px 20px", border: "1px solid rgba(255,255,255,.16)", borderRadius: 22, background: "rgba(17,17,17,.86)", color: "#fff", fontSize: 34, fontWeight: 650, lineHeight: 1.25, textAlign: "center", whiteSpace: "pre-line", letterSpacing: "-.02em" }}>{active.text}</div></div>;
};

export type Episode001Props = { withVoice: boolean; withCaptions: boolean };

export const Episode001: React.FC<Episode001Props> = ({ withVoice, withCaptions }) => (
  <AbsoluteFill style={{ width: 1080, height: 1920, overflow: "hidden", fontFamily: 'Inter, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif' }}>
    <Sequence from={0} durationInFrames={sec(4.2)}><CoverScene /></Sequence>
    <Sequence from={sec(4.2)} durationInFrames={sec(5)}><FamiliarScene /></Sequence>
    <Sequence from={sec(9.2)} durationInFrames={sec(9.8)}><AnatomyScene /></Sequence>
    <Sequence from={sec(19)} durationInFrames={sec(6.8)}><RebuildScene /></Sequence>
    <Sequence from={sec(25.8)} durationInFrames={sec(7.7)}><InteractionScene /></Sequence>
    <Sequence from={sec(33.5)} durationInFrames={sec(4.5)}><ResultScene /></Sequence>
    <Sequence from={sec(38)} durationInFrames={sec(4)}><CtaScene /></Sequence>
    <CaptionLayer withCaptions={withCaptions} />
    <Audio src={staticFile("music.wav")} volume={0.14} />
    {withVoice ? <Audio src={staticFile("episode-001-narration.wav")} volume={0.96} /> : null}
  </AbsoluteFill>
);
