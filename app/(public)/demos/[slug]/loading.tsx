export default function DetailLoading() {
  return (
    <main aria-busy="true" className="site-shell detail-page" id="main-content" tabIndex={-1}>
      <div className="skeleton skeleton-copy" />
      <div className="skeleton skeleton-heading" />
      <div className="skeleton skeleton-copy" />
      <div aria-hidden="true" className="detail-layout">
        <div>
          <div className="skeleton skeleton-detail-media" />
          <div className="skeleton skeleton-line" />
          <div className="skeleton skeleton-line skeleton-line-short" />
        </div>
        <div className="skeleton skeleton-detail-toc" />
      </div>
      <span className="sr-only">正在加载案例详情</span>
    </main>
  );
}
