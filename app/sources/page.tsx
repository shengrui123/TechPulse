import type { Metadata } from "next";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import { sourceGroups, trustedSources } from "../data/sources";

export const metadata: Metadata = {
  title: "信源标准 | WorldPulse",
  description:
    "WorldPulse 全球新闻信源名单与编辑查核原则，涵盖国际通讯社、公共媒体、综合报刊、财经媒体和调查新闻机构。",
};

const principles = [
  ["01", "原文优先", "保留原始报道链接、发布时间与媒体名称。"],
  ["02", "交叉查核", "重大争议至少比对两家不同地区或所有权结构的来源。"],
  ["03", "新闻与评论分开", "事实报道、社论、专栏与分析不会混为同一证据层级。"],
  ["04", "持续修正", "原始来源更新或更正后，中文整理同步标示变化。"],
];

export default function SourcesPage() {
  return (
    <>
      <SiteHeader />
      <main className="sources-page">
        <header className="page-shell sources-hero">
          <p className="eyebrow">EDITORIAL SOURCES · {trustedSources.length}</p>
          <h1>可信不是标签，而是一套可以检查的过程。</h1>
          <p>
            WorldPulse
            从具备国际采编能力、公开编辑规范或长期专业记录的新闻机构中选取报道。已提供官方 RSS
            的媒体直接读取其 RSS，其余来源才由 Google News RSS
            补充索引；所有条目仍会核对原媒体网址、标题与来源。纳入名单不代表任何媒体永远正确，也不代表认同其所有观点。
          </p>
        </header>

        <section className="source-principles">
          <div className="page-shell principle-grid">
            {principles.map(([number, title, description]) => (
              <article key={number}>
                <span>{number}</span>
                <h2>{title}</h2>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="page-shell source-directory">
          <div className="section-heading">
            <h2>全球信源名单</h2>
            <span>{trustedSources.length} 家 · 持续审查与更新</span>
          </div>

          {sourceGroups.map((group) => (
            <section className="source-group" id={group.id} key={group.id}>
              <header>
                <h2>{group.title}</h2>
                <p>{group.description}</p>
              </header>
              <div className="source-list">
                {group.sources.map((source) => (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="source-item"
                    key={source.name}
                  >
                    <strong>{source.shortName}</strong>
                    <div>
                      <h3>{source.name}</h3>
                      <p>{source.focus}</p>
                    </div>
                    <span>{source.region}</span>
                    <i aria-hidden="true">↗</i>
                  </a>
                ))}
              </div>
            </section>
          ))}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
