import { expect, test, type Request } from "@playwright/test";

const origin = new URL(process.env.PRODUCTION_BASE_URL!).origin;
const launchSlugs = [
  "anythingllm",
  "cogvideo",
  "funclip",
  "maxkb",
  "novel",
  "open-notebook",
  "opengame",
  "postiz",
  "pptagent",
  "presenton",
  "restorephotos",
  "roomgpt",
];
const privateNoindexPaths = [
  "/login",
  "/register",
  "/auth/check-email",
  "/auth/confirm",
  "/favorites",
];
const analyticsExcludedPaths = [
  "/privacy",
  ...privateNoindexPaths,
  "/account/library",
  "/blueprints",
  "/blueprints/colorsnap-blueprint",
  "/checkout/colorsnap-blueprint",
  "/demos/colorsnap",
  "/demos/not-a-real-demo",
];

function isAnalyticsPayloadRequest(request: Request) {
  const pathname = new URL(request.url()).pathname;
  return pathname.startsWith("/_vercel/insights") && !pathname.endsWith("/script.js");
}

test("公网公开内容、SEO 与草稿边界", async ({ page, request }) => {
  for (const path of ["/", "/demos", "/demos/roomgpt"]) {
    const response = await request.get(path, { maxRedirects: 0 });
    expect(response.status(), path).toBe(200);
    expect(response.url(), path).toBe(new URL(path, origin).toString());
  }

  await page.goto("/");
  await expect(page).toHaveURL(new URL("/", origin).toString());
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "AI Blueprint Marketplace：把产品灵感变成可交付的复刻资料",
    }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "首个 Blueprint 商品样品" })).toBeVisible();
  await expect(page.getByText("首个 Blueprint 还没有通过预览门槛")).toBeVisible();
  await expect(page.getByRole("link", { name: "Blueprint" })).toHaveCount(0);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    new URL("/", origin).toString(),
  );

  await page.goto("/demos");
  await expect(page).toHaveURL(new URL("/demos", origin).toString());
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "先看产品证据，再决定是否购买复刻资料",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("status").filter({ hasText: /^共 12 个公开案例$/u }),
  ).toHaveCount(1);
  await expect(page.locator(".catalog-results article.demo-card")).toHaveCount(12);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    `${origin}/demos`,
  );

  await page.goto("/demos/roomgpt");
  await expect(page).toHaveURL(new URL("/demos/roomgpt", origin).toString());
  await expect(page.getByRole("heading", { level: 1, name: "RoomGPT" })).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 2, name: "真实产品画面" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 2, name: "这个产品为什么成立" }),
  ).toBeVisible();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    `${origin}/demos/roomgpt`,
  );

  for (const path of [
    "/account/library",
    "/account/library/colorsnap-blueprint/download",
    "/blueprints",
    "/blueprints/colorsnap-blueprint",
    "/checkout/colorsnap-blueprint",
    "/demos/colorsnap",
    "/demos/not-a-real-demo",
  ]) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(404);
  }

  const invalid = await request.get("/demos?difficulty=invalid&page=-2", {
    maxRedirects: 0,
  });
  expect(invalid.status()).toBe(307);
  const location = new URL(invalid.headers().location ?? "", origin);
  expect(`${location.pathname}${location.search}`).toBe("/demos");

  const sitemap = await (await request.get("/sitemap.xml")).text();
  for (const slug of launchSlugs) {
    expect(sitemap).toContain(`<loc>${origin}/demos/${slug}</loc>`);
  }
  expect(sitemap).not.toContain("/demos/colorsnap");
  expect(sitemap).not.toContain("/blueprints");

  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain(`Sitemap: ${origin}/sitemap.xml`);
  for (const path of [
    "/account/",
    "/auth/",
    "/blueprints",
    "/checkout/",
    "/favorites",
    "/login",
    "/register",
  ]) {
    expect(robots).toContain(`Disallow: ${path}`);
  }

  for (const path of privateNoindexPaths) {
    await page.goto(path);
    await expect(page.locator('meta[name="robots"]'), path).toHaveCount(1);
    await expect(page.locator('meta[name="robots"]'), path).toHaveAttribute(
      "content",
      /noindex/u,
    );
  }
});

test("公网统计只挂载在成功公开页面且移除敏感查询", async ({ page }) => {
  const marker = "private-marker@example.test";
  const analyticsRequests: string[] = [];
  page.on("request", (request) => {
    if (isAnalyticsPayloadRequest(request)) {
      analyticsRequests.push(`${request.url()} ${request.postData() ?? ""}`);
    }
  });

  await page.goto(`/demos?q=${encodeURIComponent(marker)}`, { waitUntil: "networkidle" });
  await expect(page.locator('script[src*="/_vercel/insights/script.js"]')).toHaveCount(1);
  await expect.poll(() => analyticsRequests.length, { timeout: 10_000 }).toBeGreaterThan(0);
  await page.waitForLoadState("networkidle");
  const publicPayload = analyticsRequests.join("\n");
  expect(publicPayload).not.toContain(marker);
  expect(publicPayload).not.toContain(encodeURIComponent(marker));
  expect(publicPayload).not.toContain("private-marker");

  const beforePrivateNavigation = analyticsRequests.length;
  const privateNavigationRequest = page
    .waitForRequest(isAnalyticsPayloadRequest, { timeout: 3_000 })
    .then((request) => request, () => null);
  await page.getByRole("link", { exact: true, name: "登录" }).click();
  await expect(page).toHaveURL(new URL("/login", origin).toString());
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/u);
  expect(await privateNavigationRequest).toBeNull();
  expect(analyticsRequests).toHaveLength(beforePrivateNavigation);

  for (const path of analyticsExcludedPaths) {
    const beforeDirectNavigation = analyticsRequests.length;
    await page.goto(path, { waitUntil: "networkidle" });
    await expect(page.locator('script[src*="/_vercel/insights/script.js"]')).toHaveCount(0);
    expect(analyticsRequests, path).toHaveLength(beforeDirectNavigation);
  }
});
