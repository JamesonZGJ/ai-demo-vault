"use client";

import { useEffect } from "react";

export type SidebarItem = {
  badge?: string;
  icon: string;
  id: string;
  label: string;
};

export type CollapsibleSidebarProps = {
  activeId: string;
  collapsed: boolean;
  items: SidebarItem[];
  mobileOpen: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
  onMobileOpenChange: (open: boolean) => void;
  onSelect: (id: string) => void;
};

export function getNextSidebarState(collapsed: boolean) {
  return !collapsed;
}

export function CollapsibleSidebar({
  activeId,
  collapsed,
  items,
  mobileOpen,
  onCollapsedChange,
  onMobileOpenChange,
  onSelect,
}: CollapsibleSidebarProps) {
  useEffect(() => {
    if (!mobileOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onMobileOpenChange(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen, onMobileOpenChange]);

  const chooseItem = (id: string) => {
    onSelect(id);
    onMobileOpenChange(false);
  };

  return (
    <div className="collapsible-sidebar-module">
      <button
        aria-controls="collapsible-sidebar-panel"
        aria-expanded={mobileOpen}
        className="sidebar-mobile-trigger"
        onClick={() => onMobileOpenChange(true)}
        type="button"
      >
        ☰ 打开导航
      </button>

      {mobileOpen ? (
        <button
          aria-label="关闭导航"
          className="sidebar-mobile-backdrop"
          onClick={() => onMobileOpenChange(false)}
          type="button"
        />
      ) : null}

      <aside
        className={[
          "collapsible-sidebar-panel",
          collapsed ? "is-collapsed" : "",
          mobileOpen ? "is-mobile-open" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        id="collapsible-sidebar-panel"
      >
        <div className="collapsible-sidebar-brand">
          <span aria-hidden="true">B</span>
          <strong>Builder</strong>
          <button
            aria-controls="collapsible-sidebar-navigation"
            aria-expanded={!collapsed}
            aria-label={collapsed ? "展开侧边栏" : "收起侧边栏"}
            onClick={() => onCollapsedChange(getNextSidebarState(collapsed))}
            type="button"
          >
            {collapsed ? "›" : "‹"}
          </button>
        </div>

        <nav
          aria-label="产品导航"
          className="collapsible-sidebar-navigation"
          id="collapsible-sidebar-navigation"
        >
          {items.map((item) => {
            const active = item.id === activeId;
            return (
              <button
                aria-current={active ? "page" : undefined}
                aria-label={collapsed ? item.label : undefined}
                className={active ? "is-active" : ""}
                key={item.id}
                onClick={() => chooseItem(item.id)}
                title={collapsed ? item.label : undefined}
                type="button"
              >
                <span aria-hidden="true" className="sidebar-item-icon">
                  {item.icon}
                </span>
                <span className="sidebar-item-label">{item.label}</span>
                {item.badge ? (
                  <span className="sidebar-item-badge">{item.badge}</span>
                ) : null}
              </button>
            );
          })}
        </nav>

        <div className="collapsible-sidebar-account">
          <span aria-hidden="true">林</span>
          <span>
            <strong>林小筑</strong>
            <small>个人工作区</small>
          </span>
        </div>
      </aside>
    </div>
  );
}
