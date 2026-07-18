"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("公开页面加载失败", error.digest ?? "no-digest");
  }, [error]);

  return (
    <main className="state-page" id="main-content" tabIndex={-1}>
      <div className="state-panel" role="alert">
        <span className="state-kicker">加载失败</span>
        <h1>暂时无法加载内容</h1>
        <p>请求没有成功完成。请重试；我们不会把失败伪装成空结果。</p>
        <button className="button button-primary" onClick={reset} type="button">
          重试
        </button>
      </div>
    </main>
  );
}
