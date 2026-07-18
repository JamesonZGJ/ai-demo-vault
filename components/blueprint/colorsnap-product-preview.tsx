export function ColorSnapProductPreview({ compact = false }: { compact?: boolean }) {
  return (
    <div
      aria-label="ColorSnap 移动端原型示意：每日色彩卡包与现实寻色任务"
      className={compact ? "colorsnap-preview colorsnap-preview-compact" : "colorsnap-preview"}
      role="img"
    >
      <div className="colorsnap-preview-topline">
        <span>ColorSnap</span>
        <span>DAILY PACK</span>
      </div>
      <div className="colorsnap-card-stack" aria-hidden="true">
        <div className="colorsnap-pack-card colorsnap-pack-card-back" />
        <div className="colorsnap-pack-card colorsnap-pack-card-middle" />
        <div className="colorsnap-pack-card colorsnap-pack-card-front">
          <small>REAL WORLD COLOR HUNT</small>
          <strong>Find it.<br />Keep it.</strong>
          <span>#506F88</span>
        </div>
      </div>
      <div className="colorsnap-preview-footer">
        <span>手动取色</span>
        <span>CIEDE2000</span>
        <span>本地收藏</span>
      </div>
    </div>
  );
}
