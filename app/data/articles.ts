export type Article = {
  slug: string;
  tag: string;
  kicker: string;
  title: string;
  summary: string;
  readTime: string;
  published: string;
  source: string;
  sourceUrl: string;
  region: string;
  paragraphs: string[];
  points: string[];
};

export const articles: Article[] = [
  {
    slug: "ukraine-russian-refineries",
    tag: "国际",
    kicker: "封面故事",
    title: "乌克兰称袭击俄两座大型炼油厂，能源设施再成战事焦点",
    summary:
      "泽连斯基与特朗普会面数小时后，乌方称远程打击彼尔姆与梁赞炼油厂；美联社表示暂无法独立核实。",
    readTime: "6 分钟",
    published: "2026.07.29",
    source: "Associated Press / AP",
    sourceUrl:
      "https://apnews.com/article/4275c2280107aedba37df8704f226ce6",
    region: "欧洲",
    paragraphs: [
      "乌克兰军方表示，远程无人机打击了俄罗斯彼尔姆与梁赞两座大型炼油厂。美联社在报道中注明，这项说法暂时无法获得独立核实。",
      "这次行动发生在乌克兰总统泽连斯基与美国总统特朗普会面数小时后。能源设施持续成为双方试图削弱对方战争能力的重要目标。",
      "炼油设施一旦停产，不只影响军用燃料供应，也可能牵动俄罗斯国内市场、出口收入与维修资源配置。",
      "判断这类战况时，需要把交战方声明与独立证据分开阅读。后续应关注卫星影像、地方政府通报，以及设施实际停产时间。",
    ],
    points: ["乌方称两座大型炼油厂遭远程打击", "AP 暂无法独立核实战果", "能源基础设施仍是战争关键目标"],
  },
  {
    slug: "wildfire-paradox-global-decline",
    tag: "气候",
    kicker: "全球焦点",
    title: "欧美极端野火加剧，为何全球燃烧面积却仍在下降？",
    summary:
      "新研究显示，欧洲与北美的极端火灾更醒目，但非洲与亚洲土地利用变化推动全球燃烧面积长期减少。",
    readTime: "7 分钟",
    published: "2026.07.29",
    source: "Associated Press / AP",
    sourceUrl:
      "https://apnews.com/article/wildfires-climate-change-el-nino-3bed10eb83c2db828eb90617022a66e4",
    region: "全球",
    paragraphs: [
      "美联社报道的一项研究指出，欧洲和北美正在经历更极端、更具破坏性的野火，但从全球总量看，每年被火烧过的土地面积仍呈下降趋势。",
      "这个看似矛盾的结果与地区差异有关。非洲和亚洲部分地区的农业、放牧与土地管理方式改变，减少了经常燃烧的草地面积。",
      "与此同时，气候变暖会提高部分地区出现高温、干燥与强风叠加条件的机会，使火灾更难控制，也更容易威胁人口密集区。",
      "全球燃烧面积下降不等于风险降低。衡量野火影响，还要同时看火势强度、烟霾暴露、生态损失与受影响人口。",
    ],
    points: ["欧美极端野火风险持续上升", "全球燃烧面积受非洲与亚洲趋势拉低", "面积与灾害强度需要分开理解"],
  },
  {
    slug: "us-judges-doj-credibility",
    tag: "调查",
    kicker: "调查报道",
    title: "数百份裁决揭示：美国法官频频质疑司法部陈述",
    summary:
      "ProPublica 审阅大量案件后发现，多名联邦法官曾批评检方不准确陈述事实、遗漏证据或未遵守法院命令。",
    readTime: "9 分钟",
    published: "2026.07.28",
    source: "ProPublica",
    sourceUrl:
      "https://www.propublica.org/article/justice-department-presumption-of-regularity",
    region: "美国",
    paragraphs: [
      "ProPublica 审阅数百起联邦案件，追踪法官如何评价司法部律师在法庭上的陈述与行为。",
      "报道发现，多名法官曾指检方提供不准确或相互矛盾的信息、遗漏关键证据，或没有遵守法院命令。具体责任与影响仍需回到每一宗案件判断。",
      "这项调查关注的是司法体系中的“可信推定”：法院通常假定政府律师会准确陈述事实，但反复出现的问题可能动摇这种制度信任。",
      "比单一争议更重要的是问责机制是否有效，包括内部审查、法庭制裁、信息公开，以及受到错误陈述影响的人能否获得补救。",
    ],
    points: ["调查审阅数百起联邦案件", "多名法官曾批评检方行为", "司法可信度与问责机制成为焦点"],
  },
  {
    slug: "russia-telegram-durov",
    tag: "国际",
    kicker: "最新动态",
    title: "俄罗斯指控 Telegram 创办人杜罗夫，平台管控进一步升级",
    summary:
      "俄方以涉嫌协助乌克兰军事行动为由对杜罗夫提出指控，事件再度牵动通讯平台、国家安全与言论空间。",
    readTime: "6 分钟",
    published: "2026.07.30",
    source: "Associated Press / AP",
    sourceUrl:
      "https://apnews.com/article/russia-telegram-pavel-durov-ukraine-a6efe4692f3415c2046f0893d114174b",
    region: "俄罗斯",
    paragraphs: [
      "俄罗斯当局指控 Telegram 创办人帕维尔·杜罗夫涉嫌协助乌克兰军事行动。相关说法来自俄方，案件事实与法律责任仍有待后续司法程序检验。",
      "Telegram 在俄语世界广泛用于私人通讯、新闻传播与战争信息发布，平台与政府之间长期存在内容控制和数据访问争议。",
      "本案不只涉及个人刑事责任，也触及平台是否应为用户行为负责、政府能要求多大程度的技术配合，以及加密通讯如何被监管。",
    ],
    points: ["俄方对杜罗夫提出指控", "Telegram 是俄语世界重要通讯平台", "平台责任与国家管控再受关注"],
  },
  {
    slug: "venezuela-earthquake-risks",
    tag: "灾害",
    kicker: "最新动态",
    title: "地震后的风险不只来自倒塌：委内瑞拉面对环境与健康隐患",
    summary:
      "建筑碎片、受损工业设施与供水中断可能让灾后危机延长，清理速度与安全标准同样关键。",
    readTime: "7 分钟",
    published: "2026.07.29",
    source: "Associated Press / AP",
    sourceUrl:
      "https://apnews.com/article/venezuela-earthquakes-environment-rubble-health-99a155f55b67b68bfa76d17e1744cb5a",
    region: "拉丁美洲",
    paragraphs: [
      "委内瑞拉地震造成建筑与基础设施受损后，风险评估正从即时搜救延伸到环境和公共卫生。",
      "倒塌建筑产生的粉尘与废料可能含有危险物质，工业设施受损则可能带来泄漏风险。供水、排污和医疗服务中断，也会扩大居民暴露。",
      "灾后清理若只追求速度，可能把风险转移给工人和附近社区。废料分类、防护装备、饮水监测与公开检测结果，都是恢复工作的组成部分。",
    ],
    points: ["灾后风险延伸至环境与公共卫生", "废料和受损设施需要持续监测", "安全清理决定长期恢复质量"],
  },
  {
    slug: "xai-minnesota-deepfake-law",
    tag: "科技",
    kicker: "最新动态",
    title: "xAI 挑战明尼苏达州深度伪造禁令，生成式 AI 监管再起争议",
    summary:
      "马斯克旗下公司起诉州政府，反对禁止利用 AI 制作未经同意私密影像的法律。",
    readTime: "6 分钟",
    published: "2026.07.29",
    source: "Associated Press / AP",
    sourceUrl:
      "https://apnews.com/article/minnesota-artificial-intelligence-nudification-x-elon-musk-deepfake-131184be939d540de093b567b12c9e16",
    region: "美国",
    paragraphs: [
      "xAI 对明尼苏达州提起诉讼，挑战该州针对 AI 生成未经同意私密影像的禁令。",
      "争议一端是受害者隐私、人格权与网络安全，另一端则涉及平台的表达权、技术提供者责任，以及州级法规能管到多远。",
      "生成工具降低了伪造影像的门槛，也让识别、下架和追责更加困难。法院如何界定工具提供者与内容发布者的责任，可能影响其他州的监管设计。",
    ],
    points: ["xAI 起诉明尼苏达州政府", "法律针对未经同意的 AI 私密影像", "裁决可能影响州级 AI 治理"],
  },
  {
    slug: "delhi-electric-vehicle-plan",
    tag: "城市",
    kicker: "政策观察",
    title: "德里推动新一轮电动车计划，在减排目标与民生之间找平衡",
    summary:
      "印度首都希望借电动交通改善空气质量，但充电设施、车辆价格与劳动者转型仍是政策落地的关键。",
    readTime: "6 分钟",
    published: "2026.07.29",
    source: "Associated Press / AP",
    sourceUrl:
      "https://apnews.com/article/ev-delhi-india-climate-renewable-pollution-046240018d61185c470353df2fe9d8ae",
    region: "亚洲",
    paragraphs: [
      "德里正推动新一轮电动车政策，希望减少交通排放并改善长期困扰城市的空气污染。",
      "政策成效取决于充电网络是否跟得上、车辆价格能否被家庭和小型营运者承担，以及电力来源能否持续提高低碳比例。",
      "出租车、三轮车和配送车辆是城市交通转型的重要环节。补贴设计若忽略驾驶者收入与旧车折价，可能让成本集中落在劳动者身上。",
    ],
    points: ["电动交通被纳入空气治理", "充电网络与购车成本影响普及", "转型政策需照顾营运驾驶者"],
  },
  {
    slug: "social-media-addiction-verdict",
    tag: "社会",
    kicker: "深度解读",
    title: "社交媒体成瘾诉讼裁决平台担责，未成年人保护进入新阶段",
    summary:
      "洛杉矶陪审团裁定 Instagram 与 YouTube 在一起案件中负有责任，平台设计与青少年心理健康的法律边界受到检验。",
    readTime: "8 分钟",
    published: "2026.07.29",
    source: "Associated Press / AP",
    sourceUrl:
      "https://apnews.com/article/social-media-addiction-trial-la-5e54075023d837ccdc76c4ca512e925d",
    region: "美国",
    paragraphs: [
      "洛杉矶一个陪审团在社交媒体成瘾案件中裁定 Instagram 与 YouTube 负有责任。这项裁决把平台产品设计与用户伤害之间的因果关系推到法律核心。",
      "争议不只在于平台上有什么内容，也在于推荐算法、通知、连续播放等功能是否刻意延长未成年人的使用时间。",
      "单一陪审团裁决不等于所有类似案件都会得到相同结果，但它可能影响其他诉讼策略、平台风险评估与立法讨论。",
      "真正的政策难题，是在保护未成年人、保存开放网络与避免把全部责任推给家庭之间，建立可执行的边界。",
    ],
    points: ["陪审团裁定两家平台担责", "产品设计成为诉讼核心", "结果可能影响后续案件与监管"],
  },
  {
    slug: "la-hospital-of-emotions",
    tag: "文化",
    kicker: "文化现场",
    title: "洛杉矶废弃医院变身“情绪医院”，艺术家重写医疗空间",
    summary:
      "艺术家把旧病房、走廊与诊疗空间改造成大型展览，让照护、记忆与城市更新彼此碰撞。",
    readTime: "5 分钟",
    published: "2026.07.29",
    source: "Associated Press / AP",
    sourceUrl:
      "https://apnews.com/article/hospital-of-emotions-los-angeles-447ef73ff58723223cbd2c0452756b4f",
    region: "美国",
    paragraphs: [
      "一群艺术家将洛杉矶一座废弃医院转化为大型艺术项目，旧病房与诊疗空间成为讨论情绪、身体和照护经验的现场。",
      "医院原有的空间记忆为作品增加了难以复制的语境。观众不是在中性的白盒展厅观看，而是在曾经承担治疗与告别的建筑中移动。",
      "这类临时再利用也提出城市问题：闲置公共建筑在拆除、商业开发之外，是否能成为文化生产与社区记忆的载体。",
    ],
    points: ["废弃医院成为大型展览现场", "空间历史参与作品叙事", "临时艺术介入城市更新"],
  },
  {
    slug: "glen-hansard-dies",
    tag: "文化",
    kicker: "人物",
    title: "爱尔兰音乐人 Glen Hansard 因车祸去世，享年 56 岁",
    summary:
      "这位以《Once》及歌曲 Falling Slowly 广为人知的创作歌手，在都柏林摩托车事故后去世。",
    readTime: "5 分钟",
    published: "2026.07.30",
    source: "Associated Press / AP",
    sourceUrl:
      "https://apnews.com/article/glen-hansard-dies-dublin-motorcycle-crash-2df53656c036a9e39f91514d25538311",
    region: "欧洲",
    paragraphs: [
      "爱尔兰创作歌手 Glen Hansard 在都柏林一场摩托车事故后去世，享年 56 岁。",
      "Hansard 以乐队 The Frames、电影《Once》以及歌曲 Falling Slowly 为国际观众熟知。他的创作把街头演出传统、民谣与摇滚能量带到更广泛的舞台。",
      "他的离世引发爱尔兰音乐与电影界悼念，也让《Once》如何把低成本独立电影、城市音乐现场与跨国观众连接起来，再度受到回顾。",
    ],
    points: ["Hansard 在都柏林事故后去世", "《Once》是其国际代表作", "爱尔兰文化界持续悼念"],
  },
];

export function getArticle(slug: string) {
  return articles.find((article) => article.slug === slug);
}
