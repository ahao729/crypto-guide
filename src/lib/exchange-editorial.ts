export interface ExchangeEditorial {
  metaTitle: string
  metaDescription: string
  lastChecked: string
  intro: string
  bestFor: string[]
  notFor: string[]
  pros: string[]
  watchouts: string[]
  funding: string
  feeExamples: { label: string; value: string }[]
  links: { label: string; href: string }[]
  faqs: { question: string; answer: string }[]
}

export const exchangeEditorials: Record<string, ExchangeEditorial> = {
  binance: {
    metaTitle: "币安 Binance 评测 2026：费率、注册、KYC 与适合人群",
    metaDescription:
      "2026 币安评测：现货/合约标准费率、$10,000 与 $50,000 成本示例、注册与 KYC 步骤、适合人群和注意事项。",
    lastChecked: "2026-10-29",
    intro:
      "币安仍是综合能力最均衡的交易所：现货深度、产品线、流动性和中文资料都更完整。它的短板是产品太多、页面复杂，新手容易在合约、理财和活动之间迷路；另外 KYC、地区限制和费率活动必须以注册页为准。",
    bestFor: ["第一次注册、主要做现货的用户", "需要深度和大额成交的场景", "想要中文教程与完整产品线的人"],
    notFor: ["只想做单一链上操作、完全不想 KYC 的人", "所在地区不支持币安的人", "把交易所当无风险理财的人"],
    pros: ["现货深度和流动性强", "产品线完整，现货/合约/理财都能覆盖", "中文教程、活动与客服入口较多"],
    watchouts: ["产品多，新手容易误开合约/杠杆", "地区与 KYC 规则以注册页为准", "活动奖励通常有交易量/身份门槛"],
    funding:
      "入金方式按地区支持法币、稳定币或链上充值；转账前核对网络和 memo，先小额测试。提现网络可对照站内提现指南。",
    feeExamples: [
      { label: "$10,000 现货 Taker（0.10%）", value: "约 $10/单边" },
      { label: "$50,000 合约 Taker（0.04%）", value: "约 $20/单边" },
      { label: "往返成本（现货买卖各一次）", value: "约 $20/$10,000" },
    ],
    links: [
      { label: "币安注册教程", href: "/articles/binance-registration-guide" },
      { label: "注册与 KYC 步骤图", href: "/articles/binance-registration-kyc-visual-guide" },
      { label: "手续费对比", href: "/articles/exchange-fee-comparison" },
      { label: "币安 vs OKX", href: "/compare/binance-vs-okx" },
      { label: "币安美股入门", href: "/articles/binance-us-stocks-guide" },
    ],
    faqs: [
      { question: "币安适合新手吗？", answer: "适合第一次注册和主要做现货的用户，但建议先只开现货，不要一上来碰合约/杠杆。" },
      { question: "币安手续费是多少？", answer: "标准用户现货通常 Maker/Taker 0.10%，合约约 Maker 0.02%/Taker 0.04%；VIP、BNB 抵扣和活动会改变实际费率。" },
      { question: "币安注册需要 KYC 吗？", answer: "多数交易和入金功能需要完成身份认证；具体要求以注册页和所在地区为准。" },
    ],
  },
  okx: {
    metaTitle: "OKX 欧易评测 2026：费率、Web3 钱包与适合人群",
    metaDescription:
      "2026 OKX 评测：现货 0.08%/0.10%、合约 0.02%/0.05% 标准费率，Web3 钱包、DApp 与适合人群，附注册与对比入口。",
    lastChecked: "2026-10-29",
    intro:
      "OKX 的优势是现货 Maker 费率较低，且 Web3 钱包、DApp、NFT 和链上入口整合得比较完整。它更适合愿意同时使用中心化交易和链上工具的用户；如果你只需要最简单的买币，OKX 的功能密度可能偏高。",
    bestFor: ["想要 Web3 钱包和链上入口的用户", "现货 Maker 交易较多的人", "愿意花时间熟悉多产品界面的进阶用户"],
    notFor: ["只想用一个极简界面买币的人", "所在地区不支持 OKX 的人", "不准备做 KYC 的人"],
    pros: ["现货 Maker 0.08% 标准档较低", "Web3 钱包与 DApp 入口完整", "产品线覆盖现货、合约和链上"],
    watchouts: ["功能多，新手容易点错网络/产品", "不同地区功能差异明显", "链上操作需自行承担授权与合约风险"],
    funding:
      "支持法币/稳定币/链上充值，具体按地区；从交易所提到钱包时核对网络，首次先小额。",
    feeExamples: [
      { label: "$10,000 现货 Maker（0.08%）", value: "约 $8/单边" },
      { label: "$10,000 现货 Taker（0.10%）", value: "约 $10/单边" },
      { label: "$50,000 合约 Taker（0.05%）", value: "约 $25/单边" },
    ],
    links: [
      { label: "手续费对比", href: "/articles/exchange-fee-comparison" },
      { label: "币安 vs OKX", href: "/compare/binance-vs-okx" },
      { label: "新用户活动整理", href: "/articles/binance-okx-new-user-campaigns-2026" },
      { label: "热钱包对比", href: "/articles/hot-wallet-comparison-2026" },
    ],
    faqs: [
      { question: "OKX 和币安怎么选？", answer: "想要更低现货 Maker 费率和 Web3 钱包可看 OKX；更看重深度、产品完整度和中文教程可看币安。" },
      { question: "OKX 手续费是多少？", answer: "标准用户现货约 Maker 0.08%/Taker 0.10%，合约约 0.02%/0.05%；VIP 与活动另算。" },
      { question: "OKX 钱包是自托管吗？", answer: "OKX Web3 钱包是自托管钱包，助记词/私钥由用户保管；交易所账户则是托管账户。" },
    ],
  },
  bybit: {
    metaTitle: "Bybit 评测 2026：合约费率、跟单与适合人群",
    metaDescription:
      "2026 Bybit 评测：合约 Maker 0.01%/Taker 0.06%、现货 0.10%，跟单与衍生品体验、适合人群和风险提醒。",
    lastChecked: "2026-10-29",
    intro:
      "Bybit 更偏衍生品和交易体验：合约盘口、下单速度和跟单生态是主要卖点。它的标准合约 Taker 费率不算最低，高频吃单用户要把 Maker/Taker 比例算清楚；新手更不应该把合约当第一站。",
    bestFor: ["以合约/跟单为主的进阶用户", "重视下单体验和衍生品工具的人", "能接受杠杆风险的人"],
    notFor: ["第一次买币、只想做现货的新手", "不能接受合约爆仓风险的人", "所在地区不支持衍生品的人"],
    pros: ["合约产品与交易工具成熟", "跟单/复制交易生态较完整", "系统与下单体验口碑较好"],
    watchouts: ["合约 Taker 0.06% 高于部分竞品", "杠杆会放大亏损", "跟单历史收益不代表未来"],
    funding:
      "支持稳定币/法币/链上入金，按地区；合约账户与现货账户资金划转要看清。",
    feeExamples: [
      { label: "$50,000 合约 Maker（0.01%）", value: "约 $5/单边" },
      { label: "$50,000 合约 Taker（0.06%）", value: "约 $30/单边" },
      { label: "$10,000 现货 Taker（0.10%）", value: "约 $10/单边" },
    ],
    links: [
      { label: "Bitget 跟单教程", href: "/articles/what-is-copy-trading-bitget" },
      { label: "手续费对比", href: "/articles/exchange-fee-comparison" },
      { label: "交易所排名", href: "/exchange-ranking" },
    ],
    faqs: [
      { question: "Bybit 适合新手吗？", answer: "如果只做现货可以了解；合约/跟单不适合作为第一站，先用小额熟悉规则和强平机制。" },
      { question: "Bybit 合约手续费多少？", answer: "标准用户约 Maker 0.01%/Taker 0.06%，具体合约和 VIP 等级可能不同。" },
      { question: "跟单能保证赚钱吗？", answer: "不能。历史收益、回撤和跟单费率都要看，跟单同样会亏损。" },
    ],
  },
  bitget: {
    metaTitle: "Bitget 评测 2026：跟单、费率与适合人群",
    metaDescription:
      "2026 Bitget 评测：现货 0.10%、合约 0.02%/0.06%，跟单交易、BGB 生态、适合人群和跟单风险。",
    lastChecked: "2026-10-29",
    intro:
      "Bitget 的核心标签是跟单和策略交易，适合想研究交易员历史表现、而不是自己从零盯盘的用户。但跟单不是“稳赚”：交易员可能回撤、停止更新或过度冒险，跟单前应看历史回撤、仓位和费率。",
    bestFor: ["想尝试跟单/复制交易的用户", "愿意研究交易员历史数据的人", "需要合约与现货组合的人"],
    notFor: ["完全不想承担合约风险的人", "把跟单当保本理财的人", "所在地区不支持的人"],
    pros: ["跟单生态和交易员筛选工具较完整", "现货/合约产品齐全", "BGB 与活动体系较活跃"],
    watchouts: ["跟单会同步交易员的亏损", "高收益榜可能伴随高回撤", "活动奖励有条件"],
    funding:
      "支持稳定币/法币/链上入金，按地区；跟单账户的资金划转和风控设置要提前看清。",
    feeExamples: [
      { label: "$10,000 现货 Taker（0.10%）", value: "约 $10/单边" },
      { label: "$50,000 合约 Maker（0.02%）", value: "约 $10/单边" },
      { label: "$50,000 合约 Taker（0.06%）", value: "约 $30/单边" },
    ],
    links: [
      { label: "Bitget 跟单教程", href: "/articles/what-is-copy-trading-bitget" },
      { label: "手续费对比", href: "/articles/exchange-fee-comparison" },
      { label: "交易所排名", href: "/exchange-ranking" },
    ],
    faqs: [
      { question: "Bitget 跟单怎么选交易员？", answer: "看至少 6–12 个月收益、最大回撤、仓位集中度和跟单人数，不要只看收益率榜。" },
      { question: "Bitget 手续费多少？", answer: "标准现货约 0.10%，合约约 Maker 0.02%/Taker 0.06%；活动/VIP 另算。" },
      { question: "跟单会亏钱吗？", answer: "会。交易员的亏损会同步到跟单账户，务必设置止损和仓位上限。" },
    ],
  },
  "gate-io": {
    metaTitle: "Gate.io 评测 2026：币种、费率与适合人群",
    metaDescription:
      "2026 Gate.io 评测：现货 0.10%、合约 0.02%/0.05%，小币种与 Startup、适合人群和流动性风险。",
    lastChecked: "2026-10-29",
    intro:
      "Gate.io 的优势是币种覆盖广、上新快，适合找小币种和早期项目；代价是部分标的流动性较薄、价格波动更大。它更适合有筛选能力的用户，不适合把“币多”当成“机会多”的新手。",
    bestFor: ["想找小币种/早期项目的用户", "能自己看流动性和合约风险的人", "需要多币种现货的人"],
    notFor: ["只买 BTC/ETH、追求极简的人", "不会判断小币种风险的新手", "所在地区不支持的人"],
    pros: ["币种覆盖广、上新快", "Startup/打新等活动较多", "现货与合约产品齐全"],
    watchouts: ["小币种深度和退出流动性差异大", "上新快也意味着风险项目多", "活动规则需要逐条核对"],
    funding:
      "支持稳定币/链上充值，法币渠道按地区；提现前核对网络和最小额度。",
    feeExamples: [
      { label: "$10,000 现货 Taker（0.10%）", value: "约 $10/单边" },
      { label: "$50,000 合约 Maker（0.02%）", value: "约 $10/单边" },
      { label: "$50,000 合约 Taker（0.05%）", value: "约 $25/单边" },
    ],
    links: [
      { label: "Meme 币风险清单", href: "/articles/meme-coin-guide-2026" },
      { label: "手续费对比", href: "/articles/exchange-fee-comparison" },
      { label: "交易所排名", href: "/exchange-ranking" },
    ],
    faqs: [
      { question: "Gate.io 适合新手吗？", answer: "如果只买主流币可以；小币种/打新需要自己判断流动性和项目风险，不建议新手重仓。" },
      { question: "Gate.io 手续费多少？", answer: "标准现货约 0.10%，合约约 Maker 0.02%/Taker 0.05%；GT 抵扣/VIP 另算。" },
      { question: "小币种流动性怎么看？", answer: "看盘口深度、24h 成交额、买卖价差和持币集中度；深度差的币不要用市价大单。" },
    ],
  },
}

export function getExchangeEditorial(slug: string) {
  return exchangeEditorials[slug]
}
