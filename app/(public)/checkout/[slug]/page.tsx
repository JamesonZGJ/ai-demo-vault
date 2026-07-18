import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ColorSnapProductPreview } from "../../../../components/blueprint/colorsnap-product-preview";
import { getBlueprintBySlug, hasBlueprintAccess } from "../../../../lib/blueprints/catalog";
import { isLocalBlueprintPilot } from "../../../../lib/env";
import { createClient } from "../../../../lib/supabase/server";
import { acquireBlueprintPilot } from "./actions";

export const metadata: Metadata = {
  robots: { follow: false, index: false },
  title: "模拟购买 Blueprint",
};

const errors: Record<string, string> = {
  "ack-required": "请先确认本次操作不会扣款或创建支付交易。",
  "claim-failed": "模拟获取没有完成，请检查本地试用环境后重试。",
};

export default async function BlueprintCheckoutPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  if (!isLocalBlueprintPilot()) notFound();
  const { slug } = await params;
  const query = await searchParams;
  const product = await getBlueprintBySlug(slug);
  if (!product) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const hasAccess = user ? await hasBlueprintAccess(product.id) : false;
  const returnTo = `/checkout/${product.slug}`;

  return (
    <main className="site-shell checkout-page" id="main-content" tabIndex={-1}>
      <nav aria-label="面包屑" className="breadcrumbs">
        <Link href={`/blueprints/${product.slug}`}>{product.name}</Link>
        <span aria-hidden="true">/</span><span aria-current="page">模拟购买</span>
      </nav>
      <div className="checkout-layout">
        <section className="checkout-summary">
          <span className="eyebrow">Blueprint #001</span>
          <h1>确认模拟购买</h1>
          <p>这一步只验证“选择商品 → 获得资料访问权”的产品流程，不连接任何支付渠道。</p>
          <ColorSnapProductPreview compact />
          <dl>
            <div><dt>商品</dt><dd>{product.name}</dd></div>
            <div><dt>版本</dt><dd>{product.version}</dd></div>
            <div><dt>正式价格</dt><dd>未决定</dd></div>
            <div><dt>本次扣款</dt><dd>不适用（本次无扣款）</dd></div>
          </dl>
        </section>
        <section className="checkout-confirmation" aria-labelledby="checkout-confirmation-title">
          <span className="state-kicker">本地预发布</span>
          <h2 id="checkout-confirmation-title">获取七类资料样品</h2>
          <ul>{product.deliverables.map((item) => <li key={item.kind}>{item.title}</li>)}</ul>
          {query.error && errors[query.error] ? (
            <p className="form-error" role="alert">{errors[query.error]}</p>
          ) : null}
          {hasAccess ? (
            <>
              <p className="pilot-success" role="status">你已经获得这份本地试用资料。</p>
              <Link className="button button-primary" href={`/account/library/${product.slug}`}>
                进入我的资料
              </Link>
            </>
          ) : user ? (
            <form action={acquireBlueprintPilot} className="pilot-acquisition-form">
              <input name="slug" type="hidden" value={product.slug} />
              <label className="acknowledgement-field">
                <input name="acknowledgement" required type="checkbox" value="accepted" />
                <span>我确认：本次操作不会扣款，不创建真实订单、支付交易或客户许可。</span>
              </label>
              <button className="button button-primary" type="submit">
                确认模拟购买并获取资料
              </button>
            </form>
          ) : (
            <>
              <p>登录后才能把试用访问权保存到你的账号。</p>
              <Link className="button button-primary" href={`/login?${new URLSearchParams({ returnTo })}`}>
                登录后继续
              </Link>
            </>
          )}
          <p className="checkout-fine-print">完成后只会出现“模拟获取完成”，不会显示支付成功或已付款。</p>
        </section>
      </div>
    </main>
  );
}
