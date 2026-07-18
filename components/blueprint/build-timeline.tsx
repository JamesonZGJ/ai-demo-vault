import type { BuildTimelineStep } from "../../lib/blueprints/types";

const difficultyLabels = {
  high: "高难度",
  low: "低难度",
  medium: "中等难度",
} as const;

export function BuildTimeline({ steps }: { steps: BuildTimelineStep[] }) {
  return (
    <section aria-labelledby="build-timeline-title" className="build-timeline-section">
      <div className="detail-section-heading compact">
        <span>06</span>
        <div>
          <p>从资料到上线</p>
          <h2 id="build-timeline-title">Build Timeline</h2>
        </div>
      </div>
      <p className="build-timeline-intro">按这个顺序把 Blueprint 变成可以邀请首批用户体验的产品。预计耗时和难度是实施估计，不是交付承诺。</p>
      <ol className="build-timeline-list">
        {steps.map((item) => (
          <li className="build-timeline-item" key={item.step}>
            <div aria-hidden="true" className="build-timeline-marker">{String(item.step).padStart(2, "0")}</div>
            <div className="build-timeline-card">
              <div className="build-timeline-card-heading">
                <div>
                  <span className="state-kicker">{item.title}</span>
                  <h3>{item.titleZh}</h3>
                </div>
                <span className={`build-timeline-difficulty build-timeline-difficulty-${item.difficulty}`}>
                  {difficultyLabels[item.difficulty]}
                </span>
              </div>
              <p>{item.description}</p>
              <dl className="build-timeline-meta">
                <div><dt>预计耗时</dt><dd>{item.estimate}</dd></div>
                <div><dt>阶段产出</dt><dd>{item.output}</dd></div>
              </dl>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
