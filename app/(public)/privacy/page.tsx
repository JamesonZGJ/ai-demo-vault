import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/privacy" },
  description: "AI Demo Marketplace 的公开访问统计、账号数据边界与内容来源规则。",
  title: "数据与隐私说明",
};

export default function PrivacyPage() {
  return (
    <main className="site-shell prose-page" id="main-content" tabIndex={-1}>
      <header className="prose-page-header">
        <span className="eyebrow">数据与隐私</span>
        <h1>只收集验证产品是否被看见所需的最少数据</h1>
        <p>
              公开访问统计、账号收藏和 Capability 来源是三类不同数据。我们不把它们混在一起，也不把访问量包装成留存、热度或商业成功。
        </p>
      </header>

      <div className="prose-layout">
        <nav aria-label="本页目录" className="prose-toc">
          <a href="#traffic">公开页面统计</a>
          <a href="#excluded">明确排除</a>
          <a href="#accounts">账号与收藏</a>
          <a href="#editorial-method">内容与来源</a>
          <a href="#limits">数据能说明什么</a>
        </nav>

        <div className="prose-content">
          <section id="traffic">
            <h2>公开页面统计</h2>
            <p>
              首页、案例库和已发布案例详情可以发送匿名聚合的页面访问、访客与来源信息。查询参数会在发送前移除，统计只用于了解哪些公开内容被访问以及访问来自哪里。
            </p>
          </section>

          <section id="excluded">
            <h2>明确排除</h2>
            <p>
              登录、注册、邮件确认、个人收藏和本隐私页面不发送页面分析事件。分析事件不包含邮箱、用户 ID、收藏内容、密码、认证令牌或管理密钥。
            </p>
          </section>

          <section id="accounts">
            <h2>账号与收藏</h2>
            <p>
              账号由 Supabase Auth 处理。收藏关系保存在业务数据库，用户只能读取和修改自己的收藏。卡片显示的收藏整数来自真实账号收藏关系，不从访问统计或外部平台数字推算。
            </p>
          </section>

          <section id="editorial-method">
            <h2>内容与来源</h2>
            <p>
              公开事实必须关联核验来源；编辑推断和产品假设会明确标注。Capability Package 必须来自本站自研重实现，并记录许可证、归属和可再分发范围；没有这些信息时只展示 Preview。
            </p>
          </section>

          <section id="limits">
            <h2>数据能说明什么</h2>
            <p>
              匿名访问可以证明页面被打开和访问来源，真实收藏可以说明用户愿意保存案例。两者都不能单独证明长期留存、付费意愿、市场规模或投资价值。
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
