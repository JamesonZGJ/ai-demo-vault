import Link from "next/link";

import type { BlueprintProduct } from "../../lib/blueprints/types";
import { ColorSnapProductPreview } from "./colorsnap-product-preview";

export function BlueprintCard({
  library = false,
  product,
}: {
  library?: boolean;
  product: BlueprintProduct;
}) {
  const href = library
    ? `/account/library/${product.slug}`
    : `/blueprints/${product.slug}`;
  return (
    <article className="blueprint-card">
      <Link
        aria-label={`查看《${product.name}》蓝图详情`}
        className="blueprint-card-media"
        href={href}
      >
        <ColorSnapProductPreview compact />
      </Link>
      <div className="blueprint-card-body">
        <div className="blueprint-card-meta">
          <span>Blueprint #{String(product.number).padStart(3, "0")}</span>
          <span>{library ? "已获取试用访问权" : "预发布样品"}</span>
        </div>
        <div>
          <h3>
            <Link href={href}>{product.name}</Link>
          </h3>
          <p>{product.tagline}</p>
        </div>
        <div className="blueprint-card-score-row">
          <div><span>Blueprint Score</span><strong>{product.blueprintScore.overall}</strong></div>
          <div><span>Launch assets</span><strong>07</strong></div>
          <small>Editorial estimate · not market data</small>
        </div>
        <ul className="blueprint-card-includes" aria-label="资料样品包含">
          {product.deliverables.slice(0, 4).map((deliverable) => (
            <li key={deliverable.kind}>{deliverable.title}</li>
          ))}
          <li>另含 {product.deliverables.length - 4} 类资料</li>
        </ul>
        <div className="blueprint-card-footer">
          <div>
            <small>{library ? "Access" : "Edition"}</small>
            <strong>{library ? "Preview access" : "Preview edition"}</strong>
          </div>
          <Link className="button button-primary" href={href}>
            {library ? "Open dashboard" : "Explore Blueprint"}
          </Link>
        </div>
      </div>
    </article>
  );
}
