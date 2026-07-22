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
    <span>《每天拆一个 AI 产品》</span><span>第 003 期</span>
  </div>
);

const Backdrop = ({ dark = false }: { dark?: boolean }) => (
  <AbsoluteFill style={{ backgroundColor: dark ? "#0d1421" : "#f7f7f4", backgroundImage: dark ? "radial-gradient(circle at 76% 18%, rgba(44,105,224,.32), transparent 34%), radial-gradient(circle at 12% 82%, rgba(159,231,213,.18), transparent 30%)" : "radial-gradient(circle at 84% 12%, rgba(29,78,216,.08), transparent 27%), radial-gradient(circle at 14% 84%, rgba(6,118,71,.08), transparent 30%)" }} />
);

type ChatPanelProps = { frame: number; top: number; left: number; width: number; height: number; dark?: boolean; stage?: "waiting" | "streaming" | "complete"; compact?: boolean };

const ChatPanel = ({ frame, top, left, width, height, dark = false, stage = "streaming", compact = false }: ChatPanelProps) => {
  const response = "流式回答会一段一段出现，用户不用等完整结果。";
  const progress = stage === "waiting" ? 0 : stage === "complete" ? 1 : move(frame, 18, 112, 0.06, 1);
  const visible = Math.max(0, Math.min(response.length, Math.floor(response.length * progress)));
  const pulseFrame = frame % 24;
  const bubbleText = response.slice(0, visible);
  const textColor = dark ? "#eef5ff" : "#17233a";
  const muted = dark ? "#9cadc5" : "#667085";
  const panelBackground = dark ? "rgba(20,32,52,.88)" : "rgba(255,255,255,.9)";
  const border = dark ? "rgba(184,207,255,.26)" : "#d8dde6";
  return (
    <div style={{ position: "absolute", top, left, width, height, opacity: enter(frame, 6, 16), translate: `0px ${rise(frame, 6, 28, 42)}px` }}>
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", borderRadius: compact ? 22 : 28, border: `1px solid ${border}`, background: panelBackground, boxShadow: dark ? "0 34px 90px rgba(0,0,0,.34)" : "0 28px 78px rgba(27,48,83,.16)", backdropFilter: "blur(18px)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: compact ? "22px 26px" : "26px 32px", borderBottom: `1px solid ${border}`, color: muted, fontSize: compact ? 20 : 23, fontWeight: 800 }}>
          <span>对话</span><span style={{ color: dark ? "#a7f3d0" : "#1d4ed8" }}>{stage === "complete" ? "已完成" : stage === "waiting" ? "等待中" : "生成中"}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: compact ? 18 : 24, padding: compact ? 26 : 34 }}>
          <div style={{ alignSelf: "flex-end", maxWidth: "78%", padding: compact ? "15px 18px" : "18px 22px", borderRadius: "22px 22px 7px 22px", background: dark ? "#2d5bb3" : "#e8f0ff", color: dark ? "#f5f8ff" : "#16346f", fontSize: compact ? 21 : 25, lineHeight: 1.35, fontWeight: 650 }}>解释一下流式聊天。</div>
          <div style={{ alignSelf: "flex-start", maxWidth: "88%", minHeight: compact ? 90 : 112, padding: compact ? "16px 19px" : "20px 23px", borderRadius: "22px 22px 22px 7px", background: dark ? "rgba(255,255,255,.1)" : "#f1f4f8", color: textColor, fontSize: compact ? 21 : 25, lineHeight: 1.45, fontWeight: 600 }}>
            {stage === "waiting" ? <span style={{ display: "inline-flex", gap: 8, color: muted }}>{[0, 1, 2].map((dot) => <span key={dot} style={{ opacity: interpolate((pulseFrame + dot * 6) % 24, [0, 12, 23], [0.28, 1, 0.28], clamp) }}>●</span>)}</span> : <>{bubbleText}<span style={{ display: "inline-block", width: compact ? 10 : 12, height: compact ? 24 : 29, marginLeft: 8, verticalAlign: "-5px", background: dark ? "#a7f3d0" : "#1d4ed8", opacity: stage === "complete" ? 0.2 : 0.9 }} /></>}
          </div>
        </div>
        <div style={{ position: "absolute", left: compact ? 26 : 32, right: compact ? 26 : 32, bottom: compact ? 22 : 28, display: "flex", gap: 10, alignItems: "center", color: muted, fontSize: compact ? 18 : 21, fontWeight: 700 }}><span style={{ width: compact ? 12 : 14, height: compact ? 12 : 14, borderRadius: "50%", background: stage === "complete" ? "#56b88a" : "#6797ff", boxShadow: stage === "complete" ? "0 0 14px rgba(86,184,138,.45)" : "0 0 14px rgba(103,151,255,.45)" }} />{stage === "complete" ? "可以继续提问" : stage === "waiting" ? "正在准备回答" : "正在生成内容"}</div>
      </div>
    </div>
  );
};

const CoverScene = () => { const frame = useCurrentFrame(); return <AbsoluteFill><Backdrop dark /><Header dark /><div style={{ position: "absolute", top: 370, left: 76, right: 76, opacity: enter(frame, 8, 18), translate: `0px ${rise(frame, 8, 30, 34)}px` }}><div style={{ color: "#a7f3d0", fontSize: 24, fontWeight: 800, letterSpacing: ".14em" }}>第 003 期</div><div style={{ marginTop: 34, color: "#f7f7f4", fontSize: 102, lineHeight: 1.02, fontWeight: 900, letterSpacing: "-.065em" }}>流式聊天<br /><span style={{ color: "#a7f3d0" }}>回复</span></div><div style={{ marginTop: 36, maxWidth: 780, color: "#c8cbc7", fontSize: 34, lineHeight: 1.3, fontWeight: 600 }}>AI 输出为什么要一段一段出现</div></div><ChatPanel frame={frame} top={1080} left={78} width={924} height={520} dark stage="streaming" compact /></AbsoluteFill>; };

const FeedbackScene = () => { const frame = useCurrentFrame(); return <AbsoluteFill><Backdrop /><Header /><div style={{ position: "absolute", top: 250, left: 76, right: 76, opacity: enter(frame, 6, 16) }}><div style={{ color: "#1d4ed8", fontSize: 22, fontWeight: 850, letterSpacing: ".12em" }}>先看反馈</div><div style={{ marginTop: 26, fontSize: 68, lineHeight: 1.05, fontWeight: 900, letterSpacing: "-.055em" }}>为什么要一边生成，<br />一边显示？</div><div style={{ marginTop: 22, color: "#575754", fontSize: 30, fontWeight: 600 }}>等待过程也需要反馈。</div></div><ChatPanel frame={frame} top={800} left={78} width={924} height={560} stage="waiting" /><div style={{ position: "absolute", top: 1450, left: 78, right: 78, display: "flex", gap: 14, opacity: enter(frame, 52, 14) }}>{["立即回应", "状态清楚"].map((label) => <span key={label} style={{ flex: 1, padding: 20, textAlign: "center", border: "1px solid #d6d6d0", borderRadius: 16, background: "rgba(255,255,255,.78)", color: "#26374b", fontSize: 27, fontWeight: 800 }}>{label}</span>)}</div></AbsoluteFill>; };

const BreakdownScene = () => { const frame = useCurrentFrame(); const parts = ["输入", "请求", "流式文本", "自动滚动", "完成状态"]; return <AbsoluteFill><Backdrop dark /><Header dark /><div style={{ position: "absolute", top: 280, left: 76, right: 76, color: "#f7f7f4", fontSize: 66, lineHeight: 1.05, fontWeight: 900, letterSpacing: "-.055em", opacity: enter(frame, 6, 16) }}>把聊天拆成五个<br /><span style={{ color: "#a7f3d0" }}>清楚的部分。</span></div><div style={{ position: "absolute", left: 78, right: 78, top: 720, display: "flex", flexDirection: "column", gap: 18 }}>{parts.map((part, index) => <div key={part} style={{ display: "flex", alignItems: "center", gap: 18, opacity: enter(frame, 24 + index * 11, 12), translate: `0px ${rise(frame, 24 + index * 11, 42 + index * 11, 32)}px` }}><div style={{ width: 74, height: 74, borderRadius: 22, display: "flex", alignItems: "center", justifyContent: "center", color: index === 2 ? "#0d1421" : "#d9f8ed", background: index === 2 ? "#a7f3d0" : "rgba(255,255,255,.09)", border: `1px solid ${index === 2 ? "#a7f3d0" : "rgba(255,255,255,.2)"}`, fontSize: 25, fontWeight: 900 }}>{String(index + 1).padStart(2, "0")}</div><div style={{ flex: 1, padding: "22px 25px", borderRadius: 19, background: index === 2 ? "rgba(167,243,208,.16)" : "rgba(255,255,255,.07)", border: `1px solid ${index === 2 ? "rgba(167,243,208,.58)" : "rgba(255,255,255,.16)"}`, color: "#f7f7f4", fontSize: 31, fontWeight: 800 }}>{part}</div>{index < parts.length - 1 ? <span style={{ position: "absolute", left: 34, top: 76, width: 5, height: 18, background: "rgba(167,243,208,.6)" }} /> : null}</div>)}</div></AbsoluteFill>; };

const RebuildScene = () => { const frame = useCurrentFrame(); const tags = ["输入框", "消息列表", "逐段追加", "自动滚动", "完成状态"]; return <AbsoluteFill><Backdrop /><Header /><div style={{ position: "absolute", top: 260, left: 76, right: 76, opacity: enter(frame, 6, 16) }}><div style={{ color: "#1d4ed8", fontSize: 22, fontWeight: 850, letterSpacing: ".12em" }}>重新实现</div><div style={{ marginTop: 24, fontSize: 66, lineHeight: 1.05, fontWeight: 900, letterSpacing: "-.055em" }}>内容到达，<br />就立即插入。</div></div><div style={{ position: "absolute", left: 78, right: 78, top: 760, borderRadius: 24, overflow: "hidden", border: "1px solid #303d52", background: "#101827", boxShadow: "0 30px 80px rgba(15,23,42,.3)", opacity: enter(frame, 15, 16), translate: `0px ${rise(frame, 15, 40, 40)}px` }}><div style={{ display: "flex", justifyContent: "space-between", padding: "24px 30px", color: "#a7f3d0", borderBottom: "1px solid #283852", fontSize: 22, fontWeight: 800, letterSpacing: ".1em" }}><span>聊天状态</span><span>实时更新</span></div><div style={{ padding: "38px 36px 44px", display: "grid", gap: 19, color: "#e5eefc", fontSize: 29, lineHeight: 1.4, fontWeight: 700 }}><div><span style={{ color: "#89b4fa" }}>状态</span>：<span style={{ color: "#a7f3d0" }}>生成中</span></div><div><span style={{ color: "#89b4fa" }}>消息</span>：逐段追加</div><div><span style={{ color: "#89b4fa" }}>列表</span>：自动滚动</div></div></div><div style={{ position: "absolute", left: 78, right: 78, top: 1320, display: "flex", flexWrap: "wrap", gap: 13, opacity: enter(frame, 55, 14) }}>{tags.map((tag, index) => <span key={tag} style={{ padding: "15px 18px", borderRadius: 14, border: `1px solid ${index === 2 ? "#1d4ed8" : "#d6d6d0"}`, background: index === 2 ? "#eff6ff" : "#ffffff", color: index === 2 ? "#1d4ed8" : "#111111", fontSize: 24, fontWeight: 800 }}>{tag}</span>)}</div></AbsoluteFill>; };

const ResultScene = () => { const frame = useCurrentFrame(); return <AbsoluteFill><Backdrop dark /><Header dark /><div style={{ position: "absolute", top: 280, left: 76, right: 76, color: "#f7f7f4", fontSize: 66, lineHeight: 1.05, fontWeight: 900, letterSpacing: "-.055em", opacity: enter(frame, 6, 16) }}>等待也有<br /><span style={{ color: "#a7f3d0" }}>明确反馈。</span></div><ChatPanel frame={frame} top={760} left={78} width={924} height={540} dark stage="complete" /><div style={{ position: "absolute", top: 1430, left: 78, right: 78, display: "flex", gap: 13, opacity: enter(frame, 44, 14) }}>{["加载状态", "持续流入", "恢复正常"].map((label, index) => <span key={label} style={{ flex: 1, padding: "17px 10px", textAlign: "center", borderRadius: 14, border: `1px solid ${index === 1 ? "#a7f3d0" : "rgba(255,255,255,.2)"}`, color: index === 1 ? "#0d1421" : "#d7e4f5", background: index === 1 ? "#a7f3d0" : "rgba(255,255,255,.08)", fontSize: 23, fontWeight: 800 }}>{label}</span>)}</div></AbsoluteFill>; };

const CtaScene = () => { const frame = useCurrentFrame(); return <AbsoluteFill><Backdrop dark /><Header dark /><div style={{ position: "absolute", top: 420, left: 76, right: 76, textAlign: "center", opacity: enter(frame, 8, 18) }}><div style={{ color: "#a7f3d0", fontSize: 24, fontWeight: 850, letterSpacing: ".13em" }}>《每天拆一个 AI 产品》</div><div style={{ marginTop: 34, color: "#f7f7f4", fontSize: 78, lineHeight: 1.06, fontWeight: 900, letterSpacing: "-.06em" }}>流式聊天回复<br /><span style={{ color: "#a7f3d0" }}>第 003 期完成</span></div><div style={{ marginTop: 52, color: "#c8cbc7", fontSize: 32, fontWeight: 650 }}>你还想看哪个 AI 产品或交互？</div><div style={{ marginTop: 26, color: "#c8cbc7", fontSize: 28, fontWeight: 600 }}>评论区告诉我，下一期继续拆。</div></div></AbsoluteFill>; };

const captions = [
  { start: 0, end: 4.5, text: "今天拆一个 AI 产品里最常见的交互：\n流式聊天回复。" },
  { start: 4.5, end: 11.5, text: "为什么 AI 回复要一边生成，一边显示？\n因为等待过程也需要反馈。" },
  { start: 11.5, end: 19.5, text: "我把它拆成输入、请求、流式文本、\n自动滚动和完成状态五个部分。" },
  { start: 19.5, end: 29.5, text: "重新实现时，文字到达一段，就立刻插入消息区域，\n列表也跟着向下滚动。" },
  { start: 29.5, end: 36.2, text: "发送后先出现加载状态，内容持续流入；\n生成完成后，状态恢复正常。" },
  { start: 36.2, end: 42, text: "你还想看哪个 AI 产品或交互？\n评论区告诉我，下一期继续拆。" },
];

const CaptionLayer = ({ withCaptions }: { withCaptions: boolean }) => { const frame = useCurrentFrame(); if (!withCaptions) return null; const active = captions.find((caption) => frame >= sec(caption.start) && frame < sec(caption.end)); if (!active) return null; const start = sec(active.start); const end = sec(active.end); const opacity = Math.min(interpolate(frame, [start, start + 8], [0, 1], clamp), interpolate(frame, [end - 7, end], [1, 0], clamp)); return <div style={{ position: "absolute", left: 58, right: 58, bottom: 174, display: "flex", justifyContent: "center", opacity, pointerEvents: "none" }}><div style={{ maxWidth: 900, padding: "18px 26px 20px", border: "1px solid rgba(255,255,255,.16)", borderRadius: 22, background: "rgba(17,17,17,.86)", color: "#fff", fontSize: 34, fontWeight: 650, lineHeight: 1.25, textAlign: "center", whiteSpace: "pre-line", letterSpacing: "-.02em" }}>{active.text}</div></div>; };

export type Episode003Props = { withVoice: boolean; withCaptions: boolean };

export const Episode003: React.FC<Episode003Props> = ({ withVoice, withCaptions }) => <AbsoluteFill style={{ width: 1080, height: 1920, overflow: "hidden", fontFamily: 'Inter, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif' }}><Sequence from={0} durationInFrames={sec(4.5)}><CoverScene /></Sequence><Sequence from={sec(4.5)} durationInFrames={sec(7)}><FeedbackScene /></Sequence><Sequence from={sec(11.5)} durationInFrames={sec(8)}><BreakdownScene /></Sequence><Sequence from={sec(19.5)} durationInFrames={sec(10)}><RebuildScene /></Sequence><Sequence from={sec(29.5)} durationInFrames={sec(6.7)}><ResultScene /></Sequence><Sequence from={sec(36.2)} durationInFrames={sec(5.8)}><CtaScene /></Sequence><CaptionLayer withCaptions={withCaptions} /><Audio src={staticFile("music.wav")} volume={0.14} />{withVoice ? <Audio src={staticFile("episode-003-narration.wav")} volume={0.96} /> : null}</AbsoluteFill>;
