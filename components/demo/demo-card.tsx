import Link from "next/link";
import type { ReactNode } from "react";

import { ApprovedMedia } from "../media/approved-media";
import {
  difficultyLabels,
  maturityLabels,
  regionLabels,
} from "../../lib/demos/labels";
import type { DemoCardData } from "../../lib/demos/types";

interface DemoCardProps {
  demo: DemoCardData;
  eagerMedia?: boolean;
  favoriteControl?: ReactNode;
  featured?: boolean;
}

function BookmarkIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M6.75 4.75a2 2 0 0 1 2-2h6.5a2 2 0 0 1 2 2v16l-5.25-3.5-5.25 3.5v-16Z" />
    </svg>
  );
}

export function DemoCard({
  demo,
  eagerMedia = false,
  favoriteControl,
  featured = false,
}: DemoCardProps) {
  const visibleTools = demo.tools.slice(0, 2);
  const remainingTools = demo.tools.length - visibleTools.length;
  const detailHref = `/demos/${encodeURIComponent(demo.slug)}`;
  const mediaSizes = featured
    ? "(max-width: 720px) 100vw, (max-width: 1180px) 100vw, 55vw"
    : "(max-width: 720px) 100vw, (max-width: 1180px) 50vw, 33vw";
  const productMedia = (
    <ApprovedMedia
      eager={eagerMedia}
      media={demo.productPreview}
      sizes={mediaSizes}
    />
  );

  return (
    <article className={featured ? "demo-card demo-card-featured" : "demo-card"}>
      {demo.productPreview.kind === "image" ? (
        <Link
          aria-label={`查看《${demo.name}》案例`}
          className="demo-card-media"
          href={detailHref}
        >
          {productMedia}
        </Link>
      ) : (
        <div className="demo-card-media">{productMedia}</div>
      )}

      <div className="demo-card-body">
        <div className="demo-card-eyebrow">
          <span>{demo.category.name}</span>
          <span aria-hidden="true">·</span>
          <span>{regionLabels[demo.publisherRegion]}</span>
        </div>

        <div>
          <h3>
            <Link href={detailHref}>{demo.name}</Link>
          </h3>
          <p className="demo-card-tagline">{demo.tagline}</p>
        </div>

        <div className="tag-row" aria-label="案例属性">
          <span className="tag">{maturityLabels[demo.maturity]}</span>
          <span className="tag">{difficultyLabels[demo.difficulty]}</span>
          <span className="tag">来源：{demo.sourcePlatform}</span>
        </div>

        <div className="tool-row" aria-label="已核验开发工具">
          {visibleTools.length > 0 ? (
            <>
              {visibleTools.map((tool) => (
                <span key={tool.slug}>{tool.name}</span>
              ))}
              {remainingTools > 0 ? <span>+{remainingTools}</span> : null}
            </>
          ) : (
            <span>技术工具未公开</span>
          )}
        </div>

        <div className="demo-card-footer">
          <div className="potential-score">
            <span>商业潜力·编辑判断</span>
            <strong>{demo.commercialPotential.score}/5</strong>
          </div>
          <div className="favorite-area">
            <span
              aria-label={`${demo.favoriteCount} 人收藏`}
              className="favorite-count"
            >
              <BookmarkIcon />
              {demo.favoriteCount}
            </span>
            {favoriteControl ?? (
              <Link
                aria-label={`收藏《${demo.name}》`}
                className="favorite-login-link"
                href={`/login?returnTo=${encodeURIComponent(detailHref)}`}
              >
                收藏
              </Link>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
