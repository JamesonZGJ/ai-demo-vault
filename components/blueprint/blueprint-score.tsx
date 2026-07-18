import type { BlueprintScore as BlueprintScoreData } from "../../lib/blueprints/types";

const metricLabels = [
  { key: "marketDemand", label: "Market Demand", title: "市场需求" },
  { key: "competition", label: "Competition", title: "竞争强度" },
  { key: "buildDifficulty", label: "Build Difficulty", title: "开发难度" },
  { key: "revenuePotential", label: "Revenue Potential", title: "收入潜力" },
  { key: "aiCompatibility", label: "AI Compatibility", title: "AI 适配度" },
] as const;

export function BlueprintScore({ score }: { score: BlueprintScoreData }) {
  return (
    <section aria-labelledby="blueprint-score-title" className="blueprint-score-section">
      <div className="detail-section-heading compact">
        <span>05</span>
        <div>
          <p>复刻价值判断</p>
          <h2 id="blueprint-score-title">Blueprint Score</h2>
        </div>
      </div>
      <div className="blueprint-score-layout">
        <div className="blueprint-score-overall" aria-label={`Blueprint 综合评分 ${score.overall} 分（满分 100）`}>
          <span className="state-kicker">综合评分</span>
          <strong>{score.overall}</strong>
          <span>/100</span>
          <p>用于比较复刻优先级</p>
        </div>
        <div className="blueprint-score-metrics">
          {metricLabels.map(({ key, label, title }) => {
            const value = score[key];
            return (
              <div className="blueprint-score-metric" key={key}>
                <div className="blueprint-score-metric-heading">
                  <span><strong>{label}</strong><small>{title}</small></span>
                  <strong>{value}</strong>
                </div>
                <div
                  aria-label={`${label} ${value} 分`}
                  aria-valuemax={100}
                  aria-valuemin={0}
                  aria-valuenow={value}
                  className="blueprint-score-bar"
                  role="progressbar"
                >
                  <span style={{ width: `${value}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <p className="blueprint-score-note">{score.note}</p>
    </section>
  );
}
