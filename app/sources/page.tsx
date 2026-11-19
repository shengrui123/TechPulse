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
        <div className="sources-document">
          <nav className="sources-breadcrumb" aria-label="面包屑"><a href="/">首页</a><span>/</span><span>信源标准</span></nav>
          <header className="sources-document-header">
            <p>WORLD PULSE · EDITORIAL STANDARDS</p>
            <h1>信源标准</h1>
            <p className="sources-document-subtitle">关于我们的新闻来源与编辑原则</p>
          </header>
          <article className="sources-document-body">
            <p className="sources-intro">WorldPulse 从具备国际采编能力、公开编辑规范或长期专业记录的新闻机构中选取报道。已提供官方 RSS 的媒体直接读取其 RSS，其余来源由 Google News RSS 补充索引；条目会核对原媒体网址、标题与来源。</p>
            <p>纳入名单不代表任何媒体永远正确，也不代表认同其所有观点。我们鼓励读者查看原始报道，结合不同来源理解新闻。</p>
            <section className="sources-document-section" id="principles">
              <h2>A. 编辑与查核原则</h2>
              <ol className="sources-principles-list">
                {principles.map(([number, title, description]) => <li key={number}><strong>{title}。</strong>{description}</li>)}
              </ol>
            </section>
            <section className="sources-document-section" id="directory">
              <h2>B. 全球信源名单</h2>
              <p>目前收录 {trustedSources.length} 家新闻机构，涵盖国际通讯社、公共媒体、综合报刊、财经媒体和调查新闻机构。</p>
              {sourceGroups.map((group) => (
                <section className="sources-text-group" id={group.id} key={group.id}>
                  <h3>{group.title}</h3>
                  <p>{group.description}</p>
                  <ul>{group.sources.map((source) => <li key={source.name}><a href={source.url} target="_blank" rel="noreferrer">{source.name}</a><span> · {source.region} · {source.focus}</span></li>)}</ul>
                </section>
              ))}
            </section>
          </article>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
