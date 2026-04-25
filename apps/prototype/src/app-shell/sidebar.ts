/**
 * Sidebar wiring for the dev shell. Marks the active link based on
 * `window.location.pathname`.
 */

export function updateSidebarActive(): void {
  const path = window.location.pathname;
  document.querySelectorAll<HTMLAnchorElement>('.sidebar-nav .sidebar-item').forEach((anchor) => {
    const match =
      anchor.pathname === path ||
      (path === '/' && anchor.pathname === '/index.html') ||
      (path === '/index.html' && anchor.pathname === '/');
    anchor.classList.toggle('active', match);
  });
}
