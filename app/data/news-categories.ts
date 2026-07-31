export const newsCategories = [
  { id: "world", label: "国际" },
  { id: "politics", label: "政治" },
  { id: "economy", label: "经济" },
  { id: "society", label: "社会" },
  { id: "technology", label: "科技" },
  { id: "climate-culture", label: "气候与文化" },
] as const;

export type NewsCategory = (typeof newsCategories)[number]["id"];

export const categoryLabels: Record<NewsCategory, string> = Object.fromEntries(
  newsCategories.map((category) => [category.id, category.label]),
) as Record<NewsCategory, string>;

const categoryKeywords: Record<NewsCategory, RegExp> = {
  world:
    /国际|全球|外交|战争|冲突|峰会|制裁|边境|联合国|北约|欧盟|亚洲|欧洲|非洲|中东|美洲|world|global|international|diploma|war|conflict|summit|sanction|border|united nations|nato|european union/i,
  politics:
    /政治|政府|总统|总理|议会|选举|投票|政党|政策|内阁|法院|司法|法律|部长|politic|government|president|prime minister|parliament|election|vote|policy|cabinet|court|minister/i,
  economy:
    /经济|财经|金融|市场|股市|债券|货币|通胀|利率|贸易|关税|企业|银行|投资|就业|econom|finance|market|stock|bond|currency|inflation|interest rate|trade|tariff|business|bank|investment|jobs?/i,
  society:
    /社会|教育|医疗|健康|犯罪|事故|灾害|住房|移民|家庭|劳工|人权|社区|人口|social|education|health|crime|accident|disaster|housing|migrant|family|labour|labor|human rights|community|population/i,
  technology:
    /科技|技术|人工智能|机器人|芯片|半导体|互联网|软件|太空|网络安全|数据|电动车|technology|tech|artificial intelligence|\bai\b|robot|chip|semiconductor|internet|software|space|cyber|data|electric vehicle/i,
  "climate-culture":
    /气候|环境|能源|碳排|天气|高温|洪水|风暴|野火|生态|文化|艺术|电影|音乐|文学|体育|旅游|climate|environment|energy|carbon|weather|heat|flood|storm|wildfire|culture|art|film|music|literature|sport|travel/i,
};

export function isNewsCategory(value: string | undefined): value is NewsCategory {
  return newsCategories.some((category) => category.id === value);
}

export function matchesNewsCategory(
  category: NewsCategory,
  title: string,
  summary: string,
): boolean {
  return categoryKeywords[category].test(`${title} ${summary}`);
}
