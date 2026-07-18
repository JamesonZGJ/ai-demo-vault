export default function CatalogLoading() {
  return (
    <main aria-busy="true" className="site-shell catalog-page" id="main-content" tabIndex={-1}>
      <div className="skeleton skeleton-heading" />
      <div className="catalog-layout" aria-hidden="true">
        <div className="skeleton skeleton-sidebar" />
        <div className="demo-grid">
          {Array.from({ length: 6 }, (_, index) => (
            <div className="skeleton-card" key={index}>
              <div className="skeleton skeleton-media" />
              <div className="skeleton skeleton-line" />
              <div className="skeleton skeleton-line skeleton-line-short" />
            </div>
          ))}
        </div>
      </div>
      <span className="sr-only">正在加载案例库</span>
    </main>
  );
}
