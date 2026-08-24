export type NewsSource = {
  name: string;
  shortName: string;
  region: string;
  focus: string;
  url: string;
  rssUrl?: string;
  /**
   * Only use "full" after the publisher has granted republication rights.
   * Sources without an explicit policy are displayed as attributed excerpts.
   */
  contentPolicy?: "excerpt" | "full" | "complete";
};

export type SourceGroup = {
  id: string;
  title: string;
  description: string;
  sources: NewsSource[];
};

export const sourceGroups: SourceGroup[] = [
  {
    id: "wires",
    title: "国际通讯社",
    description: "优先用于突发事件、官方表态与跨国事实核对。",
    sources: [
      {
        name: "Reuters",
        shortName: "REUTERS",
        region: "全球",
        focus: "突发、政治、经济与市场",
        url: "https://www.reuters.com/",
        rssUrl:
          "https://feedfoundry-rss.vercel.app/feeds/938754f9bd588c147a53.xml",
        contentPolicy: "complete",
      },
      {
        name: "Associated Press",
        shortName: "AP",
        region: "全球",
        focus: "突发、国际、社会与影像",
        url: "https://apnews.com/",
      },
      {
        name: "Agence France-Presse",
        shortName: "AFP",
        region: "全球",
        focus: "国际、区域与现场报道",
        url: "https://www.afp.com/",
      },
    ],
  },
  {
    id: "public",
    title: "公共与国际媒体",
    description: "补足不同地区的公共议题、国际视角与在地现场。",
    sources: [
      {
        name: "BBC News",
        shortName: "BBC",
        region: "英国 / 全球",
        focus: "国际、政治、社会与公共事务",
        url: "https://www.bbc.co.uk/news",
        rssUrl:
          "https://feedfoundry-rss.vercel.app/feeds/445fc7e3c09155599ac6.xml",
      },
      {
        name: "Deutsche Welle",
        shortName: "DW",
        region: "德国 / 全球",
        focus: "欧洲、国际与多语言报道",
        url: "https://www.dw.com/",
      },
      {
        name: "France 24",
        shortName: "FRANCE 24",
        region: "法国 / 全球",
        focus: "欧洲、非洲与国际新闻",
        url: "https://www.france24.com/en/",
      },
      {
        name: "NHK World-Japan",
        shortName: "NHK WORLD",
        region: "日本 / 亚洲",
        focus: "日本、亚洲与公共事务",
        url: "https://www3.nhk.or.jp/nhkworld/",
      },
      {
        name: "CBC News",
        shortName: "CBC",
        region: "加拿大",
        focus: "加拿大、北美与公共事务",
        url: "https://www.cbc.ca/news",
      },
      {
        name: "ABC News Australia",
        shortName: "ABC AU",
        region: "澳大利亚 / 太平洋",
        focus: "澳大利亚、亚太与气候",
        url: "https://www.abc.net.au/news/",
        rssUrl:
          "https://www.abc.net.au/news/feed/8537074/rss_fulltext.xml",
      },
      {
        name: "Al Jazeera",
        shortName: "AL JAZEERA",
        region: "中东 / 全球",
        focus: "中东、全球南方与国际现场",
        url: "https://www.aljazeera.com/",
        rssUrl: "https://www.aljazeera.com/xml/rss/all.xml",
        contentPolicy: "complete",
      },
      {
        name: "The Reporter",
        shortName: "報導者",
        region: "台湾 / 亚洲",
        focus: "公共议题、调查报道与深度专题",
        url: "https://www.twreporter.org/",
        rssUrl:
          "https://public.twreporter.org/rss/twreporter-rss.xml",
      },
      {
        name: "Central News Agency Taiwan",
        shortName: "中央社",
        region: "台湾 / 全球",
        focus: "国际、两岸、政治与即时新闻",
        url: "https://www.cna.com.tw/",
        rssUrl: "https://feeds.feedburner.com/rsscna/intworld",
      },
    ],
  },
  {
    id: "newspapers",
    title: "综合报刊",
    description: "用于深度调查、政策脉络、社会议题与长期追踪。",
    sources: [
      {
        name: "The New York Times",
        shortName: "NYT",
        region: "美国 / 全球",
        focus: "国际、政治、社会与文化",
        url: "https://www.nytimes.com/",
      },
      {
        name: "The Washington Post",
        shortName: "THE POST",
        region: "美国 / 全球",
        focus: "政治、公共政策与调查",
        url: "https://www.washingtonpost.com/",
      },
      {
        name: "The Guardian",
        shortName: "THE GUARDIAN",
        region: "英国 / 全球",
        focus: "国际、社会、环境与文化",
        url: "https://www.theguardian.com/international",
      },
      {
        name: "El País",
        shortName: "EL PAÍS",
        region: "西班牙 / 拉丁美洲",
        focus: "欧洲、拉美、政治与文化",
        url: "https://english.elpais.com/",
      },
      {
        name: "Le Monde",
        shortName: "LE MONDE",
        region: "法国 / 全球",
        focus: "欧洲、国际、政治与文化",
        url: "https://www.lemonde.fr/en/",
      },
      {
        name: "The Hindu",
        shortName: "THE HINDU",
        region: "印度 / 南亚",
        focus: "印度、南亚与国际事务",
        url: "https://www.thehindu.com/",
      },
      {
        name: "Channel NewsAsia",
        shortName: "CNA",
        region: "新加坡 / 亚洲",
        focus: "东南亚、亚洲与商业",
        url: "https://www.channelnewsasia.com/",
      },
      {
        name: "Initium Media",
        shortName: "INITIUM",
        region: "华语世界 / 全球",
        focus: "华语世界、国际议题与深度报道",
        url: "https://theinitium.com/",
        rssUrl: "https://theinitium.com/rss/",
      },
      {
        name: "United Daily News",
        shortName: "聯合新聞網",
        region: "台湾 / 华语世界",
        focus: "台湾、两岸、国际、财经与社会新闻",
        url: "https://udn.com/news/index",
        rssUrl: "https://udn.com/news/rssfeed/",
      },
      {
        name: "Lianhe Zaobao",
        shortName: "聯合早報",
        region: "新加坡 / 华语世界",
        focus: "新加坡、中国、东南亚与国际新闻",
        url: "https://www.zaobao.com.sg/",
        rssUrl:
          "https://news.google.com/rss/search?q=site%3Awww.zaobao.com.sg&hl=zh-CN&gl=CN&ceid=CN%3Azh-Hans",
      },
    ],
  },
  {
    id: "business",
    title: "财经与全球分析",
    description: "用于市场数据、企业动态、宏观经济与国际趋势分析。",
    sources: [
      {
        name: "Bloomberg",
        shortName: "BLOOMBERG",
        region: "全球",
        focus: "市场、商业、经济与政策",
        url: "https://www.bloomberg.com/",
      },
      {
        name: "Financial Times",
        shortName: "FT",
        region: "英国 / 全球",
        focus: "全球经济、金融与企业",
        url: "https://www.ft.com/",
      },
      {
        name: "The Wall Street Journal",
        shortName: "WSJ",
        region: "美国 / 全球",
        focus: "商业、市场、经济与政策",
        url: "https://www.wsj.com/",
      },
      {
        name: "The Economist",
        shortName: "THE ECONOMIST",
        region: "英国 / 全球",
        focus: "国际政治、经济与观点分析",
        url: "https://www.economist.com/",
      },
      {
        name: "Nikkei Asia",
        shortName: "NIKKEI ASIA",
        region: "日本 / 亚洲",
        focus: "亚洲商业、经济与产业",
        url: "https://asia.nikkei.com/",
      },
    ],
  },
  {
    id: "investigative",
    title: "公共利益与调查新闻",
    description: "用于问责报道、数据调查与公共利益议题的长期追踪。",
    sources: [
      {
        name: "ProPublica",
        shortName: "PROPUBLICA",
        region: "美国",
        focus: "公共利益、问责与数据调查",
        url: "https://www.propublica.org/",
      },
    ],
  },
];

export const trustedSources = sourceGroups.flatMap((group) => group.sources);

function normalizedHost(value: string): string {
  return new URL(value).hostname.replace(/^www\./, "");
}

export function urlMatchesSource(value: string, sourceName: string): boolean {
  try {
    const source = trustedSources.find((item) => item.name === sourceName);
    if (!source) {
      return false;
    }

    const hostname = normalizedHost(value);
    const sourceHost = normalizedHost(source.url);
    return hostname === sourceHost || hostname.endsWith(`.${sourceHost}`);
  } catch {
    return false;
  }
}

export function contentPolicyForUrl(
  value: string,
): "excerpt" | "full" | "complete" {
  try {
    const hostname = normalizedHost(value);
    const source = trustedSources.find((item) => {
      const sourceHost = normalizedHost(item.url);
      return hostname === sourceHost || hostname.endsWith(`.${sourceHost}`);
    });

    return source?.contentPolicy ?? "excerpt";
  } catch {
    return "excerpt";
  }
}
