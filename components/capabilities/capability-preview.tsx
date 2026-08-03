"use client";

import { useEffect, useRef, useState } from "react";

import { extractAverageColor } from "../../packages/color-extraction/src";
import {
  CommandPalette,
  type CommandPaletteItem,
} from "../../packages/command-palette/src/CommandPalette";
import { ConnectionBeam } from "../../packages/connection-beam/src/ConnectionBeam";
import {
  CollapsibleSidebar,
  type SidebarItem,
} from "../../packages/collapsible-sidebar/src/CollapsibleSidebar";
import {
  FileUploadDropzone,
  type UploadState,
} from "../../packages/file-upload-dropzone/src/FileUploadDropzone";
import {
  SortableList,
  type SortableListItem,
} from "../../packages/sortable-list/src/SortableList";
import { SkeletonLoader } from "../../packages/skeleton-loader/src/SkeletonLoader";
import {
  PromptComposer,
  type PromptAttachment,
} from "../../packages/prompt-composer/src/PromptComposer";
import {
  ToastStack,
  type ToastStackItem,
} from "../../packages/toast-stack/src/ToastStack";
import { ImageDesktopPet } from "../../packages/image-desktop-pet/src/ImageDesktopPet";
import {
  TextSelectionToolbar,
  type SelectionToolbarActionEvent,
} from "../../packages/text-selection-toolbar/src/TextSelectionToolbar";
import {
  CircularThemeReveal,
  type CircularTheme,
} from "../../packages/circular-theme-reveal/src/CircularThemeReveal";
import { MorphingDialog } from "../../packages/morphing-dialog/src/MorphingDialog";
import {
  AIReasoningPanel,
  type ReasoningStatus,
} from "../../packages/ai-reasoning-panel/src/AIReasoningPanel";
import {
  AIActionApprovalCard,
  type ApprovalStatus,
} from "../../packages/ai-action-approval-card/src/AIActionApprovalCard";
import {
  StreamingChat,
  type StreamingChatStatus,
} from "../../packages/streaming-chat/src/StreamingChat";

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
      <div className="capability-preview-heading"><span>图片 → 配色</span><span>本地预览</span></div>
      <button className="capability-upload" onClick={() => inputRef.current?.click()} type="button">
        <span aria-hidden="true">＋</span><strong>拖入图片，提取主要颜色</strong><small>或点击选择图片</small>
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
      <div className="capability-preview-heading"><span>玻璃拟态卡片 · Glass Surface</span><span>可调参数</span></div>
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
          <span>第 001 期 · 玻璃拟态</span><strong>让表面变得可复用。</strong><small>模糊 {blur}px · 指针高光</small>
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
      <div className="capability-preview-heading"><span>卡片高光</span><span>指针跟随</span></div>
      <div className="highlight-demo" onPointerMove={(event) => { const rect = event.currentTarget.getBoundingClientRect(); setPosition({ x: ((event.clientX - rect.left) / rect.width) * 100, y: ((event.clientY - rect.top) / rect.height) * 100 }); }} style={{ background: `radial-gradient(circle at ${position.x}% ${position.y}%, rgb(255 255 255 / 0.35), transparent 32%), linear-gradient(135deg, #111827, #334155)` }}><span>移动指针预览</span><strong>让细节产生空间感。</strong><small>指针 → 径向高光</small></div>
    </div>
  );
}

function MagicCardPreview() {
  const [pointer, setPointer] = useState({ x: 50, y: 45 });
  const [spotlightSize, setSpotlightSize] = useState(32);
  const [glow, setGlow] = useState(0.72);
  const [tilt, setTilt] = useState(1.8);
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div className="capability-preview capability-preview-magic-card">
      <div className="capability-preview-heading"><span>玻璃光斑卡片 · Magic Card</span><span>指针跟随</span></div>
      <div
        className="magic-card-stage"
        onPointerEnter={() => setIsHovering(true)}
        onPointerLeave={() => {
          setIsHovering(false);
          setPointer({ x: 50, y: 45 });
        }}
        onPointerMove={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          setPointer({ x: ((event.clientX - rect.left) / rect.width) * 100, y: ((event.clientY - rect.top) / rect.height) * 100 });
        }}
      >
        <div className="magic-card-grid" />
        <div
          className="magic-card-demo"
          style={{
            background: `radial-gradient(circle at ${pointer.x}% ${pointer.y}%, rgb(183 255 232 / ${glow}), transparent ${spotlightSize}%), linear-gradient(145deg, rgb(255 255 255 / .2), rgb(255 255 255 / .04))`,
            borderColor: `rgb(191 255 235 / ${Math.min(glow + 0.08, 1)})`,
            boxShadow: `0 28px 70px rgb(4 12 28 / .34), 0 0 ${Math.round(spotlightSize * 0.55)}px rgb(125 255 219 / ${glow * 0.42})`,
            transform: `perspective(900px) rotateX(${isHovering ? (pointer.y - 50) * -tilt / 50 : 0}deg) rotateY(${isHovering ? (pointer.x - 50) * tilt / 50 : 0}deg) translateY(${isHovering ? -3 : 0}px)`,
          }}
        >
          <span className="magic-card-demo-kicker">第 002 期 · 玻璃光斑</span>
          <strong>移动指针。</strong>
          <p>边框跟着光亮起来。</p>
          <span className="magic-card-demo-meta">光斑 · 边框 · 倾斜</span>
        </div>
      </div>
      <div className="magic-card-controls" aria-label="光斑卡片参数">
        <label className="capability-slider">光斑 <input max="52" min="18" onChange={(event) => setSpotlightSize(Number(event.target.value))} type="range" value={spotlightSize} /><output>{spotlightSize}%</output></label>
        <label className="capability-slider">强度 <input max="0.95" min="0.28" onChange={(event) => setGlow(Number(event.target.value))} step="0.01" type="range" value={glow} /><output>{Math.round(glow * 100)}%</output></label>
        <label className="capability-slider">倾斜 <input max="3" min="0" onChange={(event) => setTilt(Number(event.target.value))} step="0.1" type="range" value={tilt} /><output>{tilt.toFixed(1)}°</output></label>
      </div>
    </div>
  );
}

const streamingChatResponse =
  "流式回答会一段一段出现，用户不用等完整结果。新内容到达后，消息区域会自动滚动到末尾。";

function StreamingChatPreview() {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const waitingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [status, setStatus] = useState<StreamingChatStatus>("idle");
  const [visibleCharacters, setVisibleCharacters] = useState(0);

  function clearStreamingTimers() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (waitingTimerRef.current) clearTimeout(waitingTimerRef.current);
    intervalRef.current = null;
    waitingTimerRef.current = null;
  }

  useEffect(() => clearStreamingTimers, []);

  function startDemo() {
    clearStreamingTimers();
    setVisibleCharacters(0);
    setStatus("waiting");

    waitingTimerRef.current = setTimeout(() => {
      setStatus("streaming");
      intervalRef.current = setInterval(() => {
        setVisibleCharacters((current) => {
          const next = Math.min(current + 2, streamingChatResponse.length);
          if (next === streamingChatResponse.length) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            intervalRef.current = null;
            setStatus("complete");
          }
          return next;
        });
      }, 70);
    }, 520);
  }

  return (
    <div className="capability-preview capability-preview-streaming-chat">
      <div className="capability-preview-heading">
        <span>流式聊天回复 · Streaming Chat</span>
        <span>本地状态演示</span>
      </div>
      <div className="streaming-chat-preview-stage">
        <StreamingChat
          prompt="为什么 AI 回复要一边生成，一边显示？"
          response={streamingChatResponse}
          status={status}
          visibleCharacters={visibleCharacters}
        />
        <button
          className="streaming-chat-preview-start"
          onClick={startDemo}
          type="button"
        >
          {status === "idle" ? "开始演示" : "重新演示"}
        </button>
      </div>
      <p className="streaming-chat-preview-note">
        预览只模拟本地文本流，不调用模型，也不会发送消息。
      </p>
    </div>
  );
}

function ConnectionBeamPreview() {
  const containerRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);
  const dataRef = useRef<HTMLDivElement>(null);
  const toolsRef = useRef<HTMLDivElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const [duration, setDuration] = useState(2.4);
  const [curvature, setCurvature] = useState(0.45);
  const [reverse, setReverse] = useState(false);

  return (
    <div className="capability-preview capability-preview-connection-beam">
      <div className="capability-preview-heading"><span>连接光束 · Connection Beam</span><span>响应式路径</span></div>
      <div className="connection-beam-stage" ref={containerRef}>
        <ConnectionBeam containerRef={containerRef} curvature={curvature} duration={duration} fromRef={inputRef} reverse={reverse} toRef={centerRef} />
        <ConnectionBeam containerRef={containerRef} curvature={curvature} duration={duration + 0.35} fromRef={dataRef} reverse={reverse} toRef={centerRef} />
        <ConnectionBeam containerRef={containerRef} curvature={curvature} duration={duration + 0.7} fromRef={toolsRef} reverse={reverse} toRef={centerRef} />
        <ConnectionBeam containerRef={containerRef} curvature={curvature} duration={duration + 0.15} fromRef={centerRef} reverse={reverse} toRef={outputRef} />
        <div className="connection-beam-node connection-beam-node-input" ref={inputRef}><span>输入</span><strong>提示词</strong></div>
        <div className="connection-beam-node connection-beam-node-data" ref={dataRef}><span>数据</span><strong>知识库</strong></div>
        <div className="connection-beam-node connection-beam-node-tools" ref={toolsRef}><span>工具</span><strong>API</strong></div>
        <div className="connection-beam-node connection-beam-node-center" ref={centerRef}><span>处理</span><strong>AI</strong></div>
        <div className="connection-beam-node connection-beam-node-output" ref={outputRef}><span>输出</span><strong>结果</strong></div>
      </div>
      <div className="connection-beam-controls" aria-label="连接光束参数">
        <label className="capability-slider">速度 <input max="4" min="0.9" onChange={(event) => setDuration(Number(event.target.value))} step="0.1" type="range" value={duration} /><output>{duration.toFixed(1)}s</output></label>
        <label className="capability-slider">弯曲 <input max="0.8" min="0" onChange={(event) => setCurvature(Number(event.target.value))} step="0.05" type="range" value={curvature} /><output>{Math.round(curvature * 100)}%</output></label>
        <button className="connection-beam-direction" onClick={() => setReverse((value) => !value)} type="button">方向：{reverse ? "向外" : "向内"}</button>
      </div>
    </div>
  );
}

const commandPaletteItems: CommandPaletteItem[] = [
  {
    description: "创建一个空白工作区",
    group: "项目",
    id: "new-project",
    keywords: ["create", "workspace", "新建"],
    label: "新建项目",
    shortcut: "N",
  },
  {
    description: "打开最近编辑的项目",
    group: "项目",
    id: "recent-project",
    keywords: ["recent", "history", "最近"],
    label: "最近项目",
    shortcut: "R",
  },
  {
    description: "查找页面、文件和知识条目",
    group: "搜索",
    id: "search-everything",
    keywords: ["find", "knowledge", "搜索"],
    label: "全局搜索",
    shortcut: "S",
  },
  {
    description: "切换浅色与深色外观",
    group: "界面",
    id: "toggle-theme",
    keywords: ["theme", "dark", "外观", "主题"],
    label: "切换主题",
    shortcut: "T",
  },
  {
    description: "进入偏好与账户设置",
    group: "系统",
    id: "open-settings",
    keywords: ["settings", "preference", "偏好"],
    label: "打开设置",
    shortcut: "⌘ ,",
  },
];

function CommandPalettePreview() {
  return (
    <div className="capability-preview capability-preview-command-palette">
      <div className="capability-preview-heading">
        <span>命令面板 · Command Palette</span>
        <span>键盘完整操作</span>
      </div>
      <CommandPalette
        commands={commandPaletteItems}
        defaultOpen
        triggerLabel="打开命令面板"
      />
    </div>
  );
}

function FileUploadDropzonePreview() {
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState(0);
  const [state, setState] = useState<UploadState>("idle");
  const timersRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);

  const clearTimers = () => {
    timersRef.current.forEach((timer) => clearTimeout(timer));
    timersRef.current = [];
  };

  useEffect(() => clearTimers, []);

  const startLocalPreview = (nextFiles: File[]) => {
    clearTimers();
    setFiles(nextFiles);
    setProgress(18);
    setState("uploading");

    timersRef.current = [
      setTimeout(() => setProgress(46), 260),
      setTimeout(() => setProgress(78), 620),
      setTimeout(() => {
        setProgress(100);
        setState("success");
      }, 980),
    ];
  };

  return (
    <div className="capability-preview capability-preview-file-upload">
      <div className="capability-preview-heading">
        <span>智能文件上传区</span>
        <span>本地状态预览</span>
      </div>
      <p className="file-upload-preview-note">
        文件不会离开浏览器，仅用于演示选择、校验、进度和完成反馈。
      </p>
      <FileUploadDropzone
        accept="image/*,.pdf"
        files={files}
        onFilesSelected={startLocalPreview}
        onRemove={() => {
          clearTimers();
          setFiles([]);
          setProgress(0);
          setState("idle");
        }}
        progress={progress}
        state={state}
      />
    </div>
  );
}

const initialSortableItems: SortableListItem[] = [
  {
    description: "定义角色、边界与输出格式",
    id: "system-prompt",
    meta: "提示词",
    title: "整理系统提示",
  },
  {
    description: "补充检索结果与参考资料",
    id: "knowledge",
    meta: "上下文",
    title: "接入知识内容",
  },
  {
    description: "运行主要生成任务",
    id: "generation",
    meta: "模型",
    title: "生成第一版结果",
  },
  {
    description: "检查格式并准备发布",
    id: "review",
    meta: "输出",
    title: "校验最终结果",
  },
];

function SortableListPreview() {
  const [items, setItems] = useState(initialSortableItems);

  return (
    <div className="capability-preview capability-preview-sortable-list">
      <div className="capability-preview-heading">
        <span>拖拽排序列表</span>
        <span>指针与键盘可用</span>
      </div>
      <p className="sortable-list-preview-note">
        拖动左侧手柄调整步骤；也可以点击上下按钮，或聚焦手柄后按方向键。
      </p>
      <SortableList
        ariaLabel="AI 工作流步骤"
        items={items}
        onChange={setItems}
      />
    </div>
  );
}

function SkeletonLoaderPreview() {
  const [loading, setLoading] = useState(true);

  return (
    <div className="capability-preview capability-preview-skeleton-loader">
      <div className="capability-preview-heading">
        <span>骨架屏加载</span>
        <span>结构保持稳定</span>
      </div>
      <button
        className="skeleton-preview-toggle"
        onClick={() => setLoading((value) => !value)}
        type="button"
      >
        {loading ? "显示真实内容" : "重新查看加载"}
      </button>
      <SkeletonLoader label="项目摘要正在加载" loading={loading} rows={4}>
        <article className="skeleton-preview-content">
          <div className="skeleton-preview-avatar">AI</div>
          <div>
            <span>项目摘要</span>
            <strong>内容结构已经准备完成</strong>
            <p>标题、说明和操作出现后，卡片尺寸保持不变。</p>
          </div>
          <div className="skeleton-preview-actions">
            <button type="button">继续编辑</button>
            <button type="button">查看结果</button>
          </div>
        </article>
      </SkeletonLoader>
    </div>
  );
}

const initialPromptAttachments: PromptAttachment[] = [
  { id: "brief", label: "产品需求.pdf", type: "PDF · 本地示例" },
];

function PromptComposerPreview() {
  const [attachments, setAttachments] = useState(initialPromptAttachments);
  const [submitted, setSubmitted] = useState("");
  const [value, setValue] = useState("把这份需求整理成三个清晰的产品方案");
  const [working, setWorking] = useState(false);

  return (
    <div className="capability-preview capability-preview-prompt-composer">
      <div className="capability-preview-heading">
        <span>智能聊天输入框</span>
        <span>本地交互预览</span>
      </div>
      <div className="prompt-composer-preview-stage">
        <span className="prompt-composer-preview-label">新对话</span>
        <strong>今天想完成什么？</strong>
        <PromptComposer
          attachments={attachments}
          onChange={setValue}
          onRemoveAttachment={(id) =>
            setAttachments((current) =>
              current.filter((attachment) => attachment.id !== id),
            )
          }
          onStop={() => setWorking(false)}
          onSubmit={(prompt) => {
            setSubmitted(prompt);
            setWorking(true);
          }}
          value={value}
          working={working}
        />
        <p aria-live="polite" className="prompt-composer-preview-status">
          {working
            ? "已进入生成中状态；点击方形按钮可以停止。"
            : submitted
              ? `已在本地提交：“${submitted}”`
              : "Enter 发送，Shift + Enter 换行。"}
        </p>
      </div>
    </div>
  );
}

const sidebarItems: SidebarItem[] = [
  { icon: "⌂", id: "overview", label: "项目概览" },
  { badge: "3", icon: "✦", id: "agents", label: "智能助手" },
  { icon: "▧", id: "knowledge", label: "知识内容" },
  { icon: "◫", id: "history", label: "生成记录" },
  { icon: "⚙", id: "settings", label: "工作区设置" },
];

function CollapsibleSidebarPreview() {
  const [activeId, setActiveId] = useState("overview");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="capability-preview capability-preview-collapsible-sidebar">
      <div className="capability-preview-heading">
        <span>可折叠侧边栏</span>
        <span>桌面与移动端</span>
      </div>
      <div className="collapsible-sidebar-preview-stage">
        <CollapsibleSidebar
          activeId={activeId}
          collapsed={collapsed}
          items={sidebarItems}
          mobileOpen={mobileOpen}
          onCollapsedChange={setCollapsed}
          onMobileOpenChange={setMobileOpen}
          onSelect={setActiveId}
        />
        <div className="sidebar-preview-main">
          <span>当前页面</span>
          <strong>
            {sidebarItems.find(({ id }) => id === activeId)?.label}
          </strong>
          <p>收起后仍保留图标、当前项和辅助提示。</p>
        </div>
      </div>
    </div>
  );
}

const initialToastItems: ToastStackItem[] = [
  {
    description: "3 个页面已经同步到当前项目。",
    id: "toast-3",
    progress: 0.84,
    title: "内容已保存",
    variant: "success",
  },
  {
    description: "背景任务仍在继续，可以先处理其他内容。",
    id: "toast-2",
    progress: 0.58,
    title: "正在生成预览",
  },
  {
    actionLabel: "查看",
    description: "请确认图片尺寸后重新上传。",
    id: "toast-1",
    progress: 0.34,
    title: "有 1 个文件需要处理",
    variant: "warning",
  },
];

function ToastStackPreview() {
  const [expanded, setExpanded] = useState(false);
  const [items, setItems] = useState(initialToastItems);
  const [status, setStatus] = useState("这是本地交互预览，不会发送网络请求。");
  const nextId = useRef(4);

  function addToast() {
    const id = `toast-${nextId.current}`;
    nextId.current += 1;
    setItems((current) => [
      {
        description: "新状态已加入队列，旧通知自动后退。",
        id,
        progress: 1,
        title: `任务 ${id.replace("toast-", "#")} 已完成`,
        variant: "success",
      },
      ...current,
    ]);
    setStatus("已添加一条本地通知。");
  }

  return (
    <div className="capability-preview capability-preview-toast-stack">
      <div className="capability-preview-heading">
        <span>堆叠通知</span>
        <span>新增 · 展开 · 补位</span>
      </div>
      <div className="toast-stack-preview-toolbar">
        <button onClick={addToast} type="button">
          添加通知
        </button>
        <button onClick={() => setExpanded((value) => !value)} type="button">
          {expanded ? "收起通知" : "展开通知"}
        </button>
      </div>
      <div className="toast-stack-preview-stage">
        <ToastStack
          expanded={expanded}
          items={items}
          onAction={(id) => setStatus(`已处理 ${id} 的本地操作。`)}
          onDismiss={(id) => {
            setItems((current) => current.filter((item) => item.id !== id));
            setStatus("通知已关闭，后续项目自动补位。");
          }}
        />
      </div>
      <p aria-live="polite" className="toast-stack-preview-status">
        {status}
      </p>
    </div>
  );
}

function ImageDesktopPetPreview() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [imageSrc, setImageSrc] = useState(
    "/assets/desktop-pet/sample-pet.png",
  );
  const [petKey, setPetKey] = useState(0);
  const [status, setStatus] = useState(
    "拖动角色，或聚焦后使用方向键移动。",
  );

  useEffect(() => {
    return () => {
      if (imageSrc.startsWith("blob:")) URL.revokeObjectURL(imageSrc);
    };
  }, [imageSrc]);

  function chooseImage(file: File) {
    if (!file.type.startsWith("image/")) {
      setStatus("请选择 PNG、JPG 或 WebP 图片。");
      return;
    }
    setImageSrc(URL.createObjectURL(file));
    setPetKey((current) => current + 1);
    setStatus("图片只在当前浏览器中预览，不会上传。");
  }

  function resetPet() {
    setPetKey((current) => current + 1);
    setStatus("已恢复默认位置。");
  }

  return (
    <div className="capability-preview capability-preview-image-pet">
      <div className="capability-preview-heading">
        <span>图片桌宠</span>
        <span>换图 · 拖拽 · 待机</span>
      </div>
      <div className="image-pet-preview-toolbar">
        <button onClick={() => inputRef.current?.click()} type="button">
          选择本地图片
        </button>
        <button onClick={resetPet} type="button">
          恢复默认位置
        </button>
        <input
          accept="image/png,image/jpeg,image/webp"
          className="sr-only"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) chooseImage(file);
            event.currentTarget.value = "";
          }}
          ref={inputRef}
          type="file"
        />
      </div>
      <div className="image-pet-preview-stage">
        <div className="image-pet-window-bar">
          <span aria-hidden="true">● ● ●</span>
          <strong>本地桌面预览</strong>
          <small>透明 PNG 效果最佳</small>
        </div>
        <div aria-hidden="true" className="image-pet-desktop-copy">
          <span>今天的任务</span>
          <strong>拖动桌宠，看看边界反馈</strong>
        </div>
        <ImageDesktopPet
          alt="图片桌宠"
          key={petKey}
          onPositionChange={() => setStatus("当前位置已更新。")}
          src={imageSrc}
        />
      </div>
      <p aria-live="polite" className="image-pet-preview-status">
        {status} 普通照片可以载入；这个模块不声称自动移除复杂背景。
      </p>
    </div>
  );
}

const selectionToolbarActions = [
  { id: "rewrite", label: "改写" },
  { id: "shorten", label: "精简" },
  { id: "explain", label: "解释" },
] as const;

function TextSelectionToolbarPreview() {
  const [status, setStatus] = useState(
    "请在文稿中选中一段文字。",
  );

  function handleAction(event: SelectionToolbarActionEvent) {
    const action = selectionToolbarActions.find(
      (item) => item.id === event.actionId,
    );
    setStatus(
      `已模拟“${action?.label ?? event.actionId}”：选中了 ${event.selectedText.length} 个字符。`,
    );
  }

  return (
    <div className="capability-preview capability-preview-selection-toolbar">
      <div className="capability-preview-heading">
        <span>文本选区工具栏</span>
        <span>选择 · 定位 · 保留</span>
      </div>
      <div className="selection-toolbar-preview-stage">
        <div className="selection-toolbar-preview-window">
          <div className="selection-toolbar-preview-topbar">
            <span>AI 写作工作台</span>
            <small>选中文字查看操作</small>
          </div>
          <TextSelectionToolbar
            actions={[...selectionToolbarActions]}
            onAction={handleAction}
          >
            <p>优秀的编辑工具会把操作放在内容附近，让用户保持当前阅读节奏。</p>
            <p>选中这段文字，工具栏会跟随选区出现；取消选择以后，它会自动隐藏。</p>
            <p>真正接入模型时，请在业务层处理请求、取消、错误和内容写回。</p>
          </TextSelectionToolbar>
        </div>
      </div>
      <p aria-live="polite" className="selection-toolbar-preview-status">
        {status} 当前预览只演示交互，不调用模型。
      </p>
    </div>
  );
}

function FlipCardPreview() {
  const [flipped, setFlipped] = useState(false);
  return (
    <div className="capability-preview capability-preview-flip">
      <div className="capability-preview-heading"><span>双面翻卡</span><span>计划中的预览</span></div>
      <button className={`flip-demo-card${flipped ? " is-flipped" : ""}`} onClick={() => setFlipped((value) => !value)} type="button"><span>{flipped ? "背面 / 奖励" : "正面 / 提示"}</span><strong>{flipped ? "查看揭示后的状态。" : "点击预览翻面"}</strong><small>{flipped ? "点击返回" : "一次交互，两面内容"}</small></button>
    </div>
  );
}

function CircularThemeContent({ theme }: { theme: CircularTheme }) {
  return (
    <div className="circular-theme-preview-content" data-preview-theme={theme}>
      <div className="circular-theme-preview-grid" aria-hidden="true" />
      <div className="circular-theme-preview-copy">
        <span>第 014 期 · 圆形主题切换</span>
        <strong>{theme === "light" ? "让主题跟着点击展开。" : "深色已经完整覆盖。"}</strong>
        <p>点击右上角按钮，观察变化从操作位置扩张到四个角。</p>
      </div>
      <div className="circular-theme-preview-cards" aria-hidden="true">
        <div><span>今日任务</span><strong>12</strong></div>
        <div><span>完成进度</span><strong>68%</strong></div>
        <div><span>运行状态</span><strong>正常</strong></div>
      </div>
    </div>
  );
}

function CircularThemeRevealPreview() {
  const [status, setStatus] = useState("当前为浅色主题");

  return (
    <div className="capability-preview capability-preview-circular-theme">
      <div className="capability-preview-heading">
        <span>圆形主题切换 · Circular Theme Reveal</span>
        <span>点击右上角</span>
      </div>
      <CircularThemeReveal
        className="circular-theme-preview-stage"
        onThemeChange={(theme) =>
          setStatus(`已切换为${theme === "dark" ? "深色" : "浅色"}主题`)
        }
      >
        {(theme) => <CircularThemeContent theme={theme} />}
      </CircularThemeReveal>
      <p aria-live="polite" className="circular-theme-preview-status">
        {status} · 支持键盘与减少动画
      </p>
    </div>
  );
}

function MorphingDialogPreview() {
  return (
    <div className="capability-preview capability-preview-morphing-dialog">
      <div className="capability-preview-heading">
        <span>卡片变形弹窗 · Morphing Dialog</span>
        <span>点击卡片</span>
      </div>
      <div className="morphing-dialog-preview-stage">
        <MorphingDialog
          description="把输入、检索和生成状态放进同一张详情卡。"
          eyebrow="AI MODULE"
          title="AI 回复结构"
          visual={
            <div aria-hidden="true" className="morphing-dialog-preview-visual">
              <span />
              <i />
              <b />
            </div>
          }
        >
          <div className="morphing-dialog-preview-body">
            <div><span>01</span><strong>输入问题</strong><small>保留用户上下文</small></div>
            <div><span>02</span><strong>检索资料</strong><small>显示真实处理阶段</small></div>
            <div><span>03</span><strong>生成回复</strong><small>结果在原位置继续展开</small></div>
          </div>
        </MorphingDialog>
      </div>
      <p className="morphing-dialog-preview-status">
        支持 Esc、点按外部、焦点循环与减少动画。
      </p>
    </div>
  );
}

const reasoningSteps = [
  "识别问题范围",
  "整理可公开信息",
  "组织答案结构",
];

function AIReasoningPanelPreview() {
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const [status, setStatus] = useState<ReasoningStatus>("idle");
  const [visibleSteps, setVisibleSteps] = useState(0);

  function clearTimers() {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }

  useEffect(() => clearTimers, []);

  function startDemo() {
    clearTimers();
    setVisibleSteps(0);
    setStatus("waiting");
    timersRef.current = [
      setTimeout(() => {
        setStatus("streaming");
        setVisibleSteps(1);
      }, 550),
      setTimeout(() => setVisibleSteps(2), 1250),
      setTimeout(() => setVisibleSteps(3), 1950),
      setTimeout(() => setStatus("complete"), 2700),
    ];
  }

  return (
    <div className="capability-preview capability-preview-reasoning-panel">
      <div className="capability-preview-heading">
        <span>AI 思考过程面板 · AI Reasoning Panel</span>
        <span>本地状态演示</span>
      </div>
      <div className="reasoning-panel-preview-stage">
        <div className="reasoning-panel-preview-question">
          <span>用户问题</span>
          <strong>帮我把这份需求整理成发布计划。</strong>
        </div>
        <AIReasoningPanel
          {...(status === "complete" ? { durationLabel: "3.2 秒" } : {})}
          status={status}
          summary="正在整理问题范围、相关信息和答案结构。"
        >
          {reasoningSteps.map((step, index) => (
            <div
              className="reasoning-panel-preview-step"
              data-ready={index < visibleSteps}
              key={step}
            >
              <span aria-hidden="true">{index < visibleSteps ? "✓" : "·"}</span>
              <strong>{step}</strong>
              <small>{index < visibleSteps ? "已完成" : "等待中"}</small>
            </div>
          ))}
        </AIReasoningPanel>
        <button
          className="reasoning-panel-preview-start"
          onClick={startDemo}
          type="button"
        >
          {status === "idle" ? "开始演示" : "重新演示"}
        </button>
      </div>
      <p className="reasoning-panel-preview-note">
        预览只模拟公开状态，不调用模型，也不展示私密思维链。
      </p>
    </div>
  );
}

function AIActionApprovalCardPreview() {
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const [status, setStatus] = useState<ApprovalStatus>("pending");
  const [result, setResult] = useState<string>();

  function clearTimers() {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }

  useEffect(() => clearTimers, []);

  function resetDemo() {
    clearTimers();
    setStatus("pending");
    setResult(undefined);
  }

  function approveOnce() {
    clearTimers();
    setStatus("approved");
    setResult("这次允许只用于当前请求。");
    timersRef.current = [
      setTimeout(() => {
        setStatus("executing");
        setResult("正在处理本地模拟任务。");
      }, 650),
      setTimeout(() => {
        setStatus("complete");
        setResult("临时导出文件已从模拟任务中移除。");
      }, 1_650),
    ];
  }

  function reject() {
    clearTimers();
    setStatus("rejected");
    setResult("没有执行删除操作。");
  }

  return (
    <div className="capability-preview capability-preview-action-approval">
      <div className="capability-preview-heading">
        <span>AI 操作授权确认卡 · AI Action Approval Card</span>
        <span>本地状态演示</span>
      </div>
      <div className="action-approval-preview-stage">
        <div className="action-approval-preview-context">
          <span>AI 工作台</span>
          <strong>清理本次任务产生的临时文件</strong>
          <small>高风险动作执行前，先把范围和影响说清楚。</small>
        </div>
        <AIActionApprovalCard
          {...(result ? { result } : {})}
          action="删除临时导出文件"
          description="AI 准备执行一个不可自动撤销的动作。"
          onApprove={approveOnce}
          onReject={reject}
          risk="删除后无法从当前任务中恢复"
          status={status}
          target="/exports/draft-preview.png"
        />
        {status !== "pending" ? (
          <button
            className="action-approval-preview-reset"
            onClick={resetDemo}
            type="button"
          >
            重新演示
          </button>
        ) : null}
      </div>
      <p className="action-approval-preview-note">
        当前页面只模拟交互状态，不会删除文件或执行真实操作。
      </p>
    </div>
  );
}

export function CapabilityPreview({ slug }: { slug: string }) {
  if (slug === "color-extraction") return <ColorExtractionPreview />;
  if (slug === "glass-surface") return <GlassSurfacePreview />;
  if (slug === "card-highlight") return <CardHighlightPreview />;
  if (slug === "magic-card") return <MagicCardPreview />;
  if (slug === "streaming-chat") return <StreamingChatPreview />;
  if (slug === "connection-beam") return <ConnectionBeamPreview />;
  if (slug === "command-palette") return <CommandPalettePreview />;
  if (slug === "file-upload-dropzone") return <FileUploadDropzonePreview />;
  if (slug === "sortable-list") return <SortableListPreview />;
  if (slug === "skeleton-loader") return <SkeletonLoaderPreview />;
  if (slug === "prompt-composer") return <PromptComposerPreview />;
  if (slug === "collapsible-sidebar") return <CollapsibleSidebarPreview />;
  if (slug === "toast-stack") return <ToastStackPreview />;
  if (slug === "image-desktop-pet") return <ImageDesktopPetPreview />;
  if (slug === "text-selection-toolbar") return <TextSelectionToolbarPreview />;
  if (slug === "circular-theme-reveal") return <CircularThemeRevealPreview />;
  if (slug === "morphing-dialog") return <MorphingDialogPreview />;
  if (slug === "ai-reasoning-panel") return <AIReasoningPanelPreview />;
  if (slug === "ai-action-approval-card") return <AIActionApprovalCardPreview />;
  if (slug === "flip-card") return <FlipCardPreview />;
  return <div className="capability-preview capability-preview-planned"><span className="state-kicker">预览准备中</span><strong>这个能力模块已经加入内容目录。</strong><p>完成自研实现和验证后，会补充在线交互预览。</p></div>;
}
