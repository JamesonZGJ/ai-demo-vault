import Link from "next/link";

import type { BlueprintProduct } from "../../lib/blueprints/types";
import { ColorSnapProductPreview } from "./colorsnap-product-preview";

function BoundaryColumn({ items, title }: { items: string[]; title: string }) {
  return (
    <article>
      <h3>{title}</h3>
      <ul>
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </article>
  );
}

export function ColorSnapDemoPreview({ product }: { product: BlueprintProduct }) {
  return (
    <main className="site-shell detail-page pilot-demo-page" id="main-content" tabIndex={-1}>
      <nav aria-label="面包屑" className="breadcrumbs">
        <Link href="/">首页</Link>
        <span aria-hidden="true">/</span>
        <Link href="/demos">免费 Demo</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">ColorSnap</span>
      </nav>

      <header className="pilot-demo-hero">
        <div>
          <div className="tag-row">
            <span className="tag">Blueprint #001 免费入口</span>
            <span className="tag">非 AI 原型</span>
            <span className="tag">本地预发布</span>
          </div>
          <h1>ColorSnap</h1>
          <p>把现实中的颜色转成带照片、色值与故事的可收藏双面色卡。</p>
          <div className="hero-actions">
            <Link className="button button-primary" href={`/blueprints/${product.slug}`}>
              查看 ColorSnap Blueprint
            </Link>
            <a className="button button-secondary" href="#demo-breakdown">查看事实拆解</a>
          </div>
        </div>
        <ColorSnapProductPreview />
      </header>

      <section className="pilot-notice" role="note">
        <strong>真实性说明</strong>
        <p>这是站长提交的前端原型预览。已运行验证的是本地交互闭环，不是 AI、真实社区或商业结果；当前不含 AI、后端、账号或支付。</p>
      </section>

      <section className="detail-section" id="demo-breakdown">
        <div className="detail-section-heading compact">
          <span>01</span>
          <div><p>看产品</p><h2>原型解决什么问题</h2></div>
        </div>
        <div className="blueprint-copy-grid">
          <article><h3>用户任务</h3><p>捕捉现实中的颜色，把一次短暂观察保存成可检索、可组合、可分享的视觉记录。</p></article>
          <article><h3>核心闭环</h3><p>抽取目标色 → 导入照片 → 手动采样 → 计算色差 → 生成色卡 → 本地收藏或分享。</p></article>
          <article><h3>技术事实</h3><p>单文件 HTML/CSS/JavaScript，使用 Canvas、FileReader、MediaDevices、localStorage 与 CIEDE2000。</p></article>
          <article><h3>商业状态</h3><p>当前提交材料未提供、本站也尚未核验用户、收入、留存或付费意愿数据。主题色包与专业导出仍是待验证假设。</p></article>
        </div>
      </section>

      <section className="detail-section">
        <div className="detail-section-heading compact">
          <span>02</span>
          <div><p>看边界</p><h2>已实现、模拟与缺失能力</h2></div>
        </div>
        <div className="blueprint-boundary-grid">
          <BoundaryColumn items={product.demoFacts.implemented} title="已运行或代码实现" />
          <BoundaryColumn items={product.demoFacts.simulated} title="明确模拟" />
          <BoundaryColumn items={product.demoFacts.missing} title="明确缺失" />
        </div>
      </section>

      <section className="blueprint-conversion-panel">
        <div>
          <span className="eyebrow">Demo 是入口，Blueprint 是商品</span>
          <h2>想复刻这个方向，需要的不只是一个页面链接。</h2>
          <p>Blueprint 把产品拆解、商业假设、UI、PRD、Prompt、技术和营销验证整理成七类资料样品。</p>
        </div>
        <Link className="button button-primary" href={`/blueprints/${product.slug}`}>
          查看 Blueprint #001
        </Link>
      </section>
    </main>
  );
}
