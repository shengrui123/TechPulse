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
    slug: "imf-global-economy-2026",
    tag: "全球经济",
    kicker: "封面故事",
    title: "IMF：全球经济仍具韧性，但地区分化正在扩大",
    summary:
      "战争冲击与科技投资同时影响增长路径。能源进口国与脆弱经济体承受更大压力，进入全球科技价值链的经济体则获得支撑。",
    readTime: "8 分钟",
    published: "2026.07.08",
    source: "国际货币基金组织 IMF",
    sourceUrl:
      "https://www.imf.org/en/publications/weo/issues/2026/07/08/world-economic-outlook-update-july-2026",
    region: "全球",
    paragraphs: [
      "国际货币基金组织在七月更新中指出，世界经济展现出一定韧性，但总体数字掩盖了国家与地区之间越来越明显的差异。能源成本、冲突风险与金融市场重新定价，仍可能改变增长轨迹。",
      "报告将 2026 年全球增长预测维持在约 3.0%，并预计 2027 年回升至 3.4%。科技相关投资为部分经济体提供动能，但能源进口国和政策空间有限的国家更容易受到外部冲击。",
      "通胀下降的过程也出现停滞。对政策制定者而言，稳定物价、重建财政空间和提高经济适应能力，需要同时推进，而不能只依赖单一刺激手段。",
      "这份展望提醒我们：全球经济并非朝着同一个方向移动。理解平均数字背后的地区差异，才是判断未来风险的关键。",
    ],
    points: ["2026 年全球增长预测约为 3.0%", "能源冲击对脆弱经济体影响更大", "科技投资支撑部分供应链经济体"],
  },
  {
    slug: "strong-el-nino-preparation",
    tag: "气候",
    kicker: "全球焦点",
    title: "强厄尔尼诺形成，多地气候与人道风险进入准备期",
    summary:
      "世界气象组织确认强厄尔尼诺快速发展，联合国系统正协调政府与人道机构提前部署。",
    readTime: "7 分钟",
    published: "2026.07.07",
    source: "联合国日内瓦办事处 / WMO",
    sourceUrl:
      "https://www.ungeneva.org/en/news-media/press-briefing/2026/07/un-geneva-press-briefing",
    region: "全球",
    paragraphs: [
      "世界气象组织确认，厄尔尼诺在 2026 年第三季度迅速发展为强事件。它会改变不同地区的降雨与温度分布，使干旱、洪水和高温风险重新排列。",
      "气候讯号本身不会自动变成灾难，但它会放大原本已经脆弱的粮食、供水和公共卫生系统。中美洲、加勒比海以及部分全球南方地区，需要特别关注季节性降雨异常。",
      "联合国正在协调区域气候中心、政府与人道组织，把预测转化为更早的物资安排、农业建议和健康预警。",
      "提前行动的价值在于争取时间。越早把气候预测送到真正需要决策的人手中，就越有机会减少生命与生计损失。",
    ],
    points: ["强厄尔尼诺已在第三季度形成", "降雨异常可能影响粮食与供水", "联合国推动跨机构提前行动"],
  },
  {
    slug: "global-road-safety-progress",
    tag: "社会",
    kicker: "数据观察",
    title: "道路死亡率十五年下降 21%，年轻人仍承受最高风险",
    summary:
      "WHO 指出全球道路安全已有进步，但道路交通伤害仍是 5 至 29 岁人群的主要死因。",
    readTime: "6 分钟",
    published: "2026.07.20",
    source: "世界卫生组织 WHO",
    sourceUrl:
      "https://www.who.int/news/item/20-07-2026-road-deaths-fall-by-21--globally-but-stronger-action-is-needed-to-save-lives",
    region: "全球",
    paragraphs: [
      "世界卫生组织的新数据指出，2011 至 2025 年间，全球道路交通死亡率下降了 21%。同期机动车数量大幅增加，这说明更安全的道路设计、法规与车辆标准能够产生实际效果。",
      "进步并不平均。行人、骑车者和摩托车使用者仍占道路死亡中的很大部分，年轻人面对的风险尤其突出。",
      "WHO 倡导“安全系统”方法：承认人会犯错，并通过限速、道路设计、安全车辆和执法，让错误不至于造成致命后果。",
      "道路安全因此不只是交通议题，也与公共卫生、城市规划和社会公平直接相关。",
    ],
    points: ["全球道路死亡率下降 21%", "5 至 29 岁人群风险仍高", "安全系统强调道路必须容纳人为错误"],
  },
  {
    slug: "europe-extreme-heat-health",
    tag: "公共卫生",
    kicker: "最新动态",
    title: "欧洲升温速度约为全球两倍，公共卫生系统面对新压力",
    summary:
      "高温正在增加疾病与死亡风险，也考验医疗机构、照护系统与城市应变能力。",
    readTime: "6 分钟",
    published: "2026.07.16",
    source: "世界卫生组织欧洲区域办事处",
    sourceUrl:
      "https://www.who.int/europe/news/item/16-07-2026-planning-for-a-warmer-world",
    region: "欧洲",
    paragraphs: [
      "WHO 欧洲区域办事处指出，欧洲是全球升温最快的大陆，升温速度约为全球平均的两倍。极端高温会迅速增加疾病和死亡，并对医疗与社会照护服务造成压力。",
      "许多医疗设施本身并不是为持续高温设计。降温、供电、药品保存和工作人员安全，都需要进入长期规划。",
      "高温风险也高度不平等。老年人、慢性病患者、户外劳动者和居住条件较差的人，通常承受更大影响。",
    ],
    points: ["欧洲升温速度约为全球两倍", "医疗设施需要纳入高温韧性", "弱势群体面对更高暴露风险"],
  },
  {
    slug: "sudan-children-conflict",
    tag: "国际",
    kicker: "人道追踪",
    title: "苏丹战事升级，儿童伤亡与保护危机持续扩大",
    summary:
      "联合国表示，北科尔多凡战事加剧，儿童继续承受死亡、受伤、流离失所与基本服务中断。",
    readTime: "7 分钟",
    published: "2026.07.21",
    source: "联合国儿童与武装冲突办公室",
    sourceUrl:
      "https://childrenandarmedconflict.un.org/en/news/immediate-and-urgent-action-children-across-sudan-conflict-intensifies-north-kordofan",
    region: "非洲",
    paragraphs: [
      "联合国警告，苏丹北科尔多凡及周边地区的战事升级，使已经延续多年的儿童保护危机进一步恶化。",
      "儿童面对的不只是直接伤亡。流离失所、学校与医疗服务中断、家庭分离以及基本物资不足，都会造成长期影响。",
      "联合国呼吁冲突各方遵守国际人道法，保护平民设施，并让人道援助能够安全抵达需要的人群。",
    ],
    points: ["战事升级扩大儿童保护风险", "教育与医疗中断造成长期伤害", "人道准入是当前核心问题"],
  },
  {
    slug: "who-dementia-risk-guidelines",
    tag: "健康",
    kicker: "最新动态",
    title: "WHO 新指南：近半数失智风险因素有机会被干预",
    summary:
      "新的循证建议把运动、烟酒、空气污染、社交参与和慢性病管理纳入全生命历程的脑健康策略。",
    readTime: "6 分钟",
    published: "2026.07.15",
    source: "世界卫生组织 WHO",
    sourceUrl:
      "https://www.who.int/news/item/15-07-2026-new-who-guidelines--up-to-45--of-dementia-risk-could-be-prevented-or-delayed",
    region: "全球",
    paragraphs: [
      "世界卫生组织更新降低认知衰退与失智风险的指南，指出多项风险因素可以通过个人行为、医疗服务与公共政策共同干预。",
      "建议涵盖身体活动、停止吸烟、减少酒精、健康饮食、社交参与，以及高血压、糖尿病和高胆固醇的管理。",
      "指南也强调空气污染等环境因素，意味着脑健康并非只由个人选择决定，城市与公共卫生政策同样重要。",
    ],
    points: ["最高约 45% 风险与可改变因素有关", "慢性病管理同时保护脑健康", "公共政策与个人行为缺一不可"],
  },
  {
    slug: "education-debt-pressure",
    tag: "教育",
    kicker: "全球焦点",
    title: "教育与债务压力交织，113 个国家还债支出高于教育",
    summary:
      "UNESCO 呼吁重新思考教育融资，并讨论以债务转换等方式保护长期人力投资。",
    readTime: "6 分钟",
    published: "2026.07.10",
    source: "联合国教科文组织 UNESCO",
    sourceUrl: "https://www.unesco.org/en/about-us/snapshot",
    region: "全球",
    paragraphs: [
      "UNESCO 在七月工作摘要中指出，全球有 113 个国家的债务偿付支出高于教育支出。财政压力正在挤压学校、教师与技能建设所需的长期投资。",
      "教育融资的困难并非单一部门问题。它会影响劳动市场、科技转型、社会流动与国家应对未来危机的能力。",
      "多国教育部长讨论债务转换等机制，希望在维持财政稳定的同时，为教育保留更可持续的资源。",
    ],
    points: ["113 个国家还债支出高于教育", "教育投资影响长期社会韧性", "债务转换成为讨论中的工具"],
  },
  {
    slug: "mongolia-national-geopark",
    tag: "文化",
    kicker: "文化现场",
    title: "蒙古启用首座国家地质公园，保存自然与游牧文化",
    summary:
      "Khanbogd–Shar Tsav 地质公园连接地质、古生物与地方文化，也为永续旅游和社区发展打开新路径。",
    readTime: "5 分钟",
    published: "2026.07.07",
    source: "联合国教科文组织 UNESCO",
    sourceUrl:
      "https://www.unesco.org/en/articles/mongolia-launches-its-first-national-geopark-marking-major-step-towards-becoming-unesco-global",
    region: "亚洲",
    paragraphs: [
      "蒙古在南部戈壁地区启用首座国家地质公园，范围横跨多个地方行政区，保存重要的地质、古生物、自然与文化遗产。",
      "当地拥有恐龙化石遗址、特殊花岗岩地貌与游牧文化。地质公园的目标不仅是保护，也包括科学研究、教育、永续旅游与地方经济。",
      "UNESCO 强调，国家认定是迈向国际合作的基础，而长期成败取决于地方社区是否真正参与管理与受益。",
    ],
    points: ["保护地质与古生物遗产", "地方社区参与长期管理", "文化保存与永续旅游并行"],
  },
  {
    slug: "global-economy-war-technology",
    tag: "经济",
    kicker: "编辑精选",
    title: "全球经济的两股力量：战争拖累与科技投资支撑",
    summary:
      "能源冲击压低增长并推升物价，但人工智能相关投资为部分经济体提供了缓冲。",
    readTime: "7 分钟",
    published: "2026.07.07",
    source: "美联社 AP",
    sourceUrl:
      "https://apnews.com/article/5df2a8eb775b94bb6de1067fd694f6f0",
    region: "全球",
    paragraphs: [
      "美联社依据 IMF 最新展望报道，全球经济正同时受到战争冲击与科技投资热潮影响。两股力量方向相反，使总体增长保持韧性，却扩大国家之间的差距。",
      "能源价格会通过运输、制造和民生支出传导到不同经济体。对依赖进口且财政空间有限的国家来说，冲击通常更难吸收。",
      "另一方面，人工智能基础设施投资为科技供应链中的部分经济体提供需求。它能否转化为更广泛的生产力提升，仍是未来观察重点。",
    ],
    points: ["能源冲击与科技投资方向相反", "全球平均值掩盖地区差异", "AI 投资的生产力效果仍待观察"],
  },
  {
    slug: "sustainable-development-forum",
    tag: "国际合作",
    kicker: "编辑精选",
    title: "从水、能源到城市：联合国论坛检视可持续发展进度",
    summary:
      "在气候冲击、地缘紧张与经济不确定性下，各国重新检视 2030 年可持续发展议程的执行差距。",
    readTime: "6 分钟",
    published: "2026.07.01",
    source: "联合国经济和社会事务部",
    sourceUrl:
      "https://www.un.org/en/desa/hlpf-2026-where-hope-turns-into-action-for-a-sustainable-future",
    region: "全球",
    paragraphs: [
      "2026 年联合国可持续发展高级别政治论坛，聚焦水与卫生、清洁能源、产业创新、可持续城市和全球伙伴关系。",
      "这些议题彼此相连。缺水会影响健康与粮食，能源转型牵动产业与就业，城市规划则决定多数人口如何面对气候风险。",
      "论坛的作用不仅是盘点目标，也让各国交换政策经验并揭示融资、治理和执行之间的落差。",
    ],
    points: ["五项议题需要跨部门协作", "融资与执行仍是主要缺口", "城市是多数目标的实际落点"],
  },
];

export function getArticle(slug: string) {
  return articles.find((article) => article.slug === slug);
}
