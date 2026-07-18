"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export function MobileNavigation({
  blueprintPilot,
  loggedIn,
}: {
  blueprintPilot: boolean;
  loggedIn: boolean;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const restoreFocusRef = useRef(true);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (dialogRef.current?.open) {
      restoreFocusRef.current = false;
      dialogRef.current.close();
    }
  }, [pathname]);

  function close() {
    restoreFocusRef.current = true;
    dialogRef.current?.close();
  }

  function closeForNavigation(targetPath: string) {
    restoreFocusRef.current = pathname === targetPath;
    dialogRef.current?.close();
  }

  return (
    <div className="mobile-navigation">
      <button
        aria-haspopup="dialog"
        className="icon-button"
        onClick={() => dialogRef.current?.showModal()}
        ref={triggerRef}
        type="button"
      >
        <span aria-hidden="true" className="menu-icon">
          <span />
          <span />
        </span>
        <span className="sr-only">打开导航</span>
      </button>
      <dialog
        aria-labelledby="mobile-navigation-title"
        className="mobile-navigation-dialog"
        onClose={() => {
          if (restoreFocusRef.current) triggerRef.current?.focus();
          restoreFocusRef.current = true;
        }}
        ref={dialogRef}
      >
        <div className="mobile-navigation-header">
          <strong id="mobile-navigation-title">导航</strong>
          <button className="icon-button" onClick={close} type="button">
            <span aria-hidden="true">×</span>
            <span className="sr-only">关闭导航</span>
          </button>
        </div>
        <nav aria-label="移动端主导航">
          {blueprintPilot ? (
            <Link href="/blueprints" onClick={() => closeForNavigation("/blueprints")}>App Blueprints</Link>
          ) : null}
          <Link href="/explore" onClick={() => closeForNavigation("/explore")}>Search Capabilities</Link>
          <Link href="/bundles" onClick={() => closeForNavigation("/bundles")}>Bundles</Link>
          {loggedIn ? <Link href="/library" onClick={() => closeForNavigation("/library")}>My Library</Link> : null}
          <Link href="/demos" onClick={() => closeForNavigation("/demos")}>Reference Demos</Link>
          {loggedIn ? (
            <Link href="/favorites" onClick={() => closeForNavigation("/favorites")}>
              我的收藏
            </Link>
          ) : null}
          {loggedIn ? (
            <form
              action="/auth/signout"
              method="post"
              onSubmit={() => {
                restoreFocusRef.current = false;
                dialogRef.current?.close();
              }}
            >
              <button type="submit">退出</button>
            </form>
          ) : (
            <Link href="/login" onClick={() => closeForNavigation("/login")}>登录</Link>
          )}
        </nav>
      </dialog>
    </div>
  );
}
