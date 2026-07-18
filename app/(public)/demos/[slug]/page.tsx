import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PublicAnalytics } from "../../../../components/analytics/public-analytics";
import { ColorSnapDemoPreview } from "../../../../components/blueprint/colorsnap-demo-preview";
import { ClaimBadge } from "../../../../components/demo/claim-badge";
import { FavoriteControl } from "../../../../components/demo/favorite-control";
import { ApprovedMedia } from "../../../../components/media/approved-media";
import {
  caseKindLabels,
  difficultyLabels,
  maturityLabels,
  regionLabels,
  sourceCodeStatusLabels,
  technologyDisclosureLabels,
} from "../../../../lib/demos/labels";
import { getPublishedDemoBySlug } from "../../../../lib/demos/detail";
import { getFavoriteState } from "../../../../lib/demos/favorite-state";
import { getPublishedSlugs } from "../../../../lib/demos/search";
import type { DemoClaim } from "../../../../lib/demos/types";
import { getBlueprintBySlug } from "../../../../lib/blueprints/catalog";
import { isLocalBlueprintPilot, isStaticPreviewMode } from "../../../../lib/env";

interface DetailPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  if (isStaticPreviewMode()) return getPublishedSlugs();

  const demos = await getPublishedSlugs();
  return [
    ...demos.map(({ slug }) => ({ slug })),
    ...(isLocalBlueprintPilot() ? [{ slug: "colorsnap" }] : []),
  ];
}

const publisherRoleLabels: Record<string, string> = {
  contracting_entity: "合同主体",
  developer: "开发方",
  service_operator: "服务运营方",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    dateStyle: "medium",
    timeZone: "Asia/Hong_Kong",
  }).format(new Date(value));
}

export async function generateMetadata({ params }: DetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  if (slug === "colorsnap") {
    const product = await getBlueprintBySlug("colorsnap-blueprint");
    if (product) {
      return {
        description: "ColorSnap 非 AI 前端原型的免费 Demo 与事实边界。",
        robots: { follow: false, index: false },
        title: "ColorSnap 免费 Demo",
      };
    }
  }
  const demo = await getPublishedDemoBySlug(slug);

  if (!demo) {
    return {
      title: "没有找到这个案例",
    };
  }

  return {
    alternates: { canonical: `/demos/${demo.slug}` },
    description: demo.summary,
    openGraph: {
      description: demo.summary,
      images: [{ alt: demo.cover.alt, url: demo.cover.url }],
      title: demo.name,
      type: "article",
      url: `/demos/${demo.slug}`,
    },
    title: demo.name,
  };
}

export default async function DemoDetailPage({ params }: DetailPageProps) {
  const { slug } = await params;
  if (slug === "colorsnap") {
    const product = await getBlueprintBySlug("colorsnap-blueprint");
    if (product) return <ColorSnapDemoPreview product={product} />;
  }
  const demo = await getPublishedDemoBySlug(slug);
  if (!demo) notFound();
  const favoriteState = await getFavoriteState([demo.id]);
  const isFavorited = favoriteState?.has(demo.id) ?? null;
  const returnTo = `/demos/${demo.slug}`;

  const liveLink = demo.links.find(({ kind }) => kind === "live_demo");
  const repositoryLink = demo.links.find(({ kind }) => kind === "repository");
  const primaryClaim = (section: string) => {
    const claim = demo.claims.find(
      (item) => item.isPrimary && item.section === section,
    );
    if (!claim) throw new Error(`公开案例缺少 ${section} 主要主张`);
    return claim;
  };
  const truthBoundaryClaim = primaryClaim("truth_boundary");
  const hasBoundary = Object.values(demo.implementationBoundary).some(
    (items) => items.length > 0,
  );

  return (
    <main className="site-shell detail-page" id="main-content" tabIndex={-1}>
      <nav aria-label="面包屑" className="breadcrumbs">
        <Link href="/">首页</Link>
        <span aria-hidden="true">/</span>
        <Link href="/demos">案例库</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{demo.name}</span>
      </nav>

      <header className="detail-hero">
        <div className="detail-hero-main">
          <div className="tag-row">
            <span className="tag">{demo.category.name}</span>
            <span className="tag">{caseKindLabels[demo.caseKind]}</span>
            <span className="tag">{regionLabels[demo.publisherRegion]}</span>
            <span className="tag">来源：{demo.sourcePlatform}</span>
            <span className="tag">
              {sourceCodeStatusLabels[demo.sourceCodeStatus]}
            </span>
          </div>
          <h1>{demo.name}</h1>
          <p>{demo.tagline}</p>
          <div className="detail-tool-row">
            {demo.tools.length > 0 ? (
              demo.tools.map((tool) => (
                <span key={tool.slug}>{tool.name}</span>
              ))
            ) : (
              <span>技术工具未公开</span>
            )}
            <span>{technologyDisclosureLabels[demo.technologyDisclosure]}</span>
          </div>
        </div>
        <dl className="detail-summary-list">
          <div>
            <dt>成熟度</dt>
            <dd>{maturityLabels[demo.maturity]}</dd>
          </div>
          <div>
            <dt>开发难度</dt>
            <dd>{difficultyLabels[demo.difficulty]}</dd>
          </div>
          <div>
            <dt>商业潜力·编辑判断</dt>
            <dd>{demo.commercialPotential.score}/5</dd>
          </div>
          <div>
            <dt>真实收藏</dt>
            <dd>{demo.favoriteCount}</dd>
          </div>
        </dl>
      </header>

      <section aria-label="案例操作" className="detail-actions">
        <div className="detail-action-buttons">
          {liveLink ? (
            <a
              className="button button-primary"
              href={liveLink.url}
              rel="noreferrer"
              target="_blank"
            >
              在线体验
              <span aria-hidden="true">↗</span>
            </a>
          ) : null}
          {repositoryLink ? (
            <a
              className="button button-secondary"
              href={repositoryLink.url}
              rel="noreferrer"
              target="_blank"
            >
              查看仓库
              <span aria-hidden="true">↗</span>
            </a>
          ) : null}
          <FavoriteControl
            demoId={demo.id}
            demoName={demo.name}
            isFavorited={isFavorited}
            returnTo={returnTo}
          />
        </div>
        <div className="publisher-strip">
          {demo.publishers.map((publisher) => (
            <a
              href={publisher.evidenceUrl}
              key={`${publisher.name}-${publisher.role}`}
              rel="noreferrer"
              target="_blank"
            >
              <span>{publisherRoleLabels[publisher.role] ?? publisher.role}</span>
              <strong>{publisher.name}</strong>
              <small>核验于 {formatDate(publisher.verifiedAt)}</small>
            </a>
          ))}
        </div>
      </section>

      <div className="detail-layout">
        <article className="detail-content">
          <section className="detail-section" id="product">
            <div className="detail-section-heading">
              <span>01</span>
              <div>
                <p>看产品</p>
                <h2>真实产品画面</h2>
              </div>
            </div>
            <div className="product-media-grid">
              <div className="detail-cover-media">
                <ApprovedMedia
                  eager
                  media={demo.cover}
                  sizes="(max-width: 1180px) 100vw, 58vw"
                />
                <span>案例封面</span>
              </div>
              {demo.media.map((media, index) => (
                <ApprovedMedia
                  eager={index === 0}
                  key={media.id}
                  media={media}
                  showCaption
                  sizes="(max-width: 1180px) 100vw, 58vw"
                />
              ))}
            </div>
          </section>

          <section className="detail-section" id="evidence">
            <div className="detail-section-heading">
              <span>02</span>
              <div>
                <p>看证据</p>
                <h2>真实性与公开证据</h2>
              </div>
            </div>
            {demo.evidence.length > 0 ? (
              <div className="evidence-grid">
                {demo.evidence.map((item) => (
                  <a
                    href={item.sourceUrl}
                    key={`${item.kind}-${item.sourceUrl}`}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <strong>{item.label}</strong>
                    <span>核验于 {formatDate(item.verifiedAt)}</span>
                  </a>
                ))}
              </div>
            ) : (
              <p className="truth-note">当前没有额外的开源、采用、定价或商业服务证据。</p>
            )}
            {demo.sourceCodeStatus === "closed_source" ? (
              <p className="truth-note">
                源码状态：闭源。本站不提供下载，也不暗示第三方源码可以购买或转售。
              </p>
            ) : (
              <p className="truth-note">
                源码状态：开源。可用范围以已核验仓库中的许可证和素材权利说明为准。
              </p>
            )}
          </section>

          {hasBoundary ? (
            <section className="detail-section" id="boundary">
              <div className="detail-section-heading compact">
                <span>—</span>
                <div>
                  <p>真实性边界</p>
                  <h2>哪些已经实现，哪些还没有</h2>
                </div>
              </div>
              <ClaimEvidence claim={truthBoundaryClaim} />
              <p className="truth-note">{truthBoundaryClaim.text}</p>
              <div className="boundary-grid">
                <BoundaryList
                  items={demo.implementationBoundary.implemented}
                  label="已实现"
                />
                <BoundaryList
                  items={demo.implementationBoundary.simulated}
                  label="模拟"
                />
                <BoundaryList
                  items={demo.implementationBoundary.missing}
                  label="未实现"
                />
              </div>
            </section>
          ) : null}

          <section className="detail-section" id="breakdown">
            <div className="detail-section-heading">
              <span>03</span>
              <div>
                <p>看拆解</p>
                <h2>这个产品为什么成立</h2>
              </div>
            </div>
            <div className="breakdown-list">
              <BreakdownItem
                claim={primaryClaim("product_overview")}
                label="产品是什么"
              />
              <BreakdownItem
                claim={primaryClaim("why_it_works")}
                label="为什么成立"
              />
              <BreakdownItem
                claim={primaryClaim("pain_points")}
                label="用户痛点"
              />
              <BreakdownItem
                claim={primaryClaim("solution")}
                label="解决方案"
              />
              <BreakdownItem
                claim={primaryClaim("target_users")}
                label="目标用户"
              />
              <BreakdownItem
                claim={primaryClaim("core_features")}
                label="核心功能"
              />
              <BreakdownItem
                claim={primaryClaim("ai_implementation")}
                label="AI 实现"
              />
              <BreakdownItem
                claim={primaryClaim("technical_implementation")}
                label="技术实现"
              />
              <BreakdownItem
                claim={primaryClaim("monetization")}
                label="盈利方式"
              />
            </div>
          </section>

          <section className="detail-section commercial-note" id="commercial-potential">
            <div className="commercial-score-block">
              <span>商业潜力·编辑判断</span>
              <strong>{demo.commercialPotential.score}/5</strong>
            </div>
            <div>
              <h2>{demo.commercialPotential.rationale}</h2>
              <p>{demo.commercialPotential.evidence}</p>
              <small>
                规则 {demo.commercialPotential.rulesVersion} · 核验于{" "}
                {formatDate(demo.commercialPotential.evaluatedAt)}。这是编辑判断，不代表市场验证或投资建议。
              </small>
            </div>
          </section>

          <section className="detail-section" id="adaptation">
            <div className="detail-section-heading">
              <span>04</span>
              <div>
                <p>看改造</p>
                <h2>从现有产品推导一个新机会</h2>
              </div>
            </div>
            <ClaimEvidence claim={primaryClaim("adaptation")} />
            <div className="adaptation-grid">
              <AdaptationItem label="改变谁" text={demo.ventureAdaptation.changeAudience} />
              <AdaptationItem label="改变什么" text={demo.ventureAdaptation.changeContent} />
              <AdaptationItem label="改变场景" text={demo.ventureAdaptation.changeContext} />
              <AdaptationItem
                label="新机会假设"
                text={demo.ventureAdaptation.newOpportunity}
              />
            </div>
          </section>

          <section className="detail-section" id="sources">
            <div className="detail-section-heading compact">
              <span>—</span>
              <div>
                <p>逐条可追溯</p>
                <h2>来源与内容标签</h2>
              </div>
            </div>
            <div className="claim-list">
              {demo.claims.filter((claim) => !claim.isPrimary).map((claim) => (
                <article key={claim.id}>
                  <ClaimBadge kind={claim.kind} />
                  <p>{claim.text}</p>
                  {claim.sourceUrl ? (
                    <a href={claim.sourceUrl} rel="noreferrer" target="_blank">
                      查看依据
                      {claim.verifiedAt ? ` · ${formatDate(claim.verifiedAt)}` : ""}
                    </a>
                  ) : null}
                </article>
              ))}
            </div>
            <div className="source-link-list">
              {demo.links.map((link) => (
                <a href={link.url} key={`${link.kind}-${link.url}`} rel="noreferrer" target="_blank">
                  <span>{link.label}</span>
                  <small>最后核验 {formatDate(link.verifiedAt)}</small>
                </a>
              ))}
            </div>
          </section>

          <footer className="detail-footer-actions">
            <Link className="button button-secondary" href="/demos">
              返回案例库
            </Link>
            <FavoriteControl
              demoId={demo.id}
              demoName={demo.name}
              isFavorited={isFavorited}
              returnTo={returnTo}
            />
          </footer>
        </article>

        <aside className="detail-toc">
          <strong>本页内容</strong>
          <a href="#product">看产品</a>
          <a href="#evidence">看证据</a>
          {hasBoundary ? <a href="#boundary">实现边界</a> : null}
          <a href="#breakdown">看拆解</a>
          <a href="#commercial-potential">商业潜力</a>
          <a href="#adaptation">创业改造</a>
          <a href="#sources">来源</a>
        </aside>
      </div>
      <PublicAnalytics path={`/demos/${demo.slug}`} />
    </main>
  );
}

function BoundaryList({ items, label }: { items: string[]; label: string }) {
  return (
    <article>
      <h3>{label}</h3>
      {items.length > 0 ? (
        <ul>
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : (
        <p>没有记录此类能力。</p>
      )}
    </article>
  );
}

function BreakdownItem({
  claim,
  label,
}: {
  claim: DemoClaim;
  label: string;
}) {
  return (
    <article>
      <div className="breakdown-label">
        <h3>{label}</h3>
        <ClaimEvidence claim={claim} />
      </div>
      <div>
        <p>{claim.text}</p>
      </div>
    </article>
  );
}

function ClaimEvidence({ claim }: { claim: DemoClaim }) {
  return (
    <div className="claim-context">
      <ClaimBadge kind={claim.kind} />
      {claim.sourceUrl && claim.verifiedAt ? (
        <a href={claim.sourceUrl} rel="noreferrer" target="_blank">
          查看依据 · {formatDate(claim.verifiedAt)}
        </a>
      ) : null}
    </div>
  );
}

function AdaptationItem({ label, text }: { label: string; text: string }) {
  return (
    <article>
      <ClaimBadge kind="hypothesis" />
      <h3>{label}</h3>
      <p>{text}</p>
    </article>
  );
}
