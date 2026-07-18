import Link from "next/link";

import type { BlueprintProduct } from "../../lib/blueprints/types";
import { ColorSnapProductPreview } from "./colorsnap-product-preview";

export function ColorSnapDemoTeaser({ product }: { product: BlueprintProduct }) {
  return (
    <article className="pilot-demo-card">
      <Link className="pilot-demo-card-media" href="/demos/colorsnap">
        <ColorSnapProductPreview compact />
      </Link>
      <div>
        <div className="blueprint-card-meta">
          <span>Blueprint #001 免费 Demo</span>
          <span>本地预发布</span>
        </div>
        <h3><Link href="/demos/colorsnap">ColorSnap</Link></h3>
        <p>把现实颜色做成可收藏双面色卡的移动端前端原型；当前不含 AI、后端或真实社区。</p>
        <div className="pilot-demo-card-actions">
          <Link className="button button-secondary" href="/demos/colorsnap">
            浏览免费 Demo
          </Link>
          <Link className="text-link" href={`/blueprints/${product.slug}`}>
            直接看 Blueprint →
          </Link>
        </div>
      </div>
    </article>
  );
}
