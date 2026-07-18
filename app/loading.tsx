export default function Loading() {
  return (
    <main aria-busy="true" aria-label="页面正在加载" className="site-shell page-loading" id="main-content" tabIndex={-1}>
      <div className="skeleton skeleton-heading" />
      <div className="skeleton skeleton-copy" />
      <div className="demo-grid" aria-hidden="true">
        {Array.from({ length: 6 }, (_, index) => (
          <div className="skeleton-card" key={index}>
            <div className="skeleton skeleton-media" />
            <div className="skeleton skeleton-line" />
            <div className="skeleton skeleton-line skeleton-line-short" />
          </div>
        ))}
      </div>
      <span className="sr-only">正在加载 Build Blocks Marketplace</span>
    </main>
  );
}
