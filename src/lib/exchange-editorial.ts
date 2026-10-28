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
      { label: "Bybit vs Bitget", href: "/compare/bybit-vs-bitget" },
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
      { label: "Bitget vs Bybit", href: "/compare/bybit-vs-bitget" },
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
  "kucoin": {
    "metaTitle": "KuCoin 评测 2026：费率、币种与适合人群",
    "metaDescription": "2026 KuCoin 评测：现货 0.08%/0.10%、合约 0.01%/0.06%，小币种覆盖、KCS 抵扣、适合人群和风险。",
    "lastChecked": "2026-10-29",
    "intro": "KuCoin 以币种覆盖和早期项目见长，现货 Maker 费率较低，适合愿意自己筛选小币种的用户。它的短板是部分标的流动性一般、活动规则复杂；不要把“币多”直接当成“机会多”。",
    "bestFor": [
        "想找小币种/早期项目的用户",
        "能自己看深度和合约风险的人",
        "主要做现货 Maker 交易的人"
    ],
    "notFor": [
        "只买 BTC/ETH、追求极简的人",
        "不会判断小币种风险的新手",
        "所在地区不支持的人"
    ],
    "pros": [
        "币种覆盖广、上新较快",
        "现货 Maker 标准费率较低",
        "KCS 抵扣与活动体系"
    ],
    "watchouts": [
        "小币种流动性差异大",
        "活动/VIP 规则复杂",
        "合约风险需自行控制"
    ],
    "funding": "支持稳定币/链上充值，法币渠道按地区；提现前核对网络和最小额度。",
    "feeExamples": [
        {
            "label": "$10,000 现货 Maker（0.08%）",
            "value": "约 $8/单边"
        },
        {
            "label": "$10,000 现货 Taker（0.10%）",
            "value": "约 $10/单边"
        },
        {
            "label": "$50,000 合约 Taker（0.06%）",
            "value": "约 $30/单边"
        }
    ],
    "links": [
        {
            "label": "Meme 币风险清单",
            "href": "/articles/meme-coin-guide-2026"
        },
        {
            "label": "手续费对比",
            "href": "/articles/exchange-fee-comparison"
        },
        {
            "label": "交易所排名",
            "href": "/exchange-ranking"
        }
    ],
    "faqs": [
        {
            "question": "KuCoin 适合新手吗？",
            "answer": "只买主流币可以；小币种需要自己看流动性和项目风险，不建议新手重仓。"
        },
        {
            "question": "KuCoin 手续费多少？",
            "answer": "标准现货约 Maker 0.08%/Taker 0.10%，合约约 0.01%/0.06%；KCS/VIP 另算。"
        },
        {
            "question": "小币种怎么避坑？",
            "answer": "看盘口深度、24h 成交额、持币集中度和合约权限；深度差的币不要市价大单。"
        }
    ]
},
  "mexc": {
    "metaTitle": "MEXC 评测 2026：零费率、上新与适合人群",
    "metaDescription": "2026 MEXC 评测：现货 Maker 0%、Taker 0.10%，合约 0.01%/0.03%，上新速度、流动性与风险。",
    "lastChecked": "2026-10-29",
    "intro": "MEXC 的卖点是上新快、现货 Maker 常见零费率，适合主动找新币的用户。但零费率多是活动/特定市场，深度和项目质量差异很大；新手容易被“上新”吸引而忽略退出流动性。",
    "bestFor": [
        "想跟踪新币/早期项目的用户",
        "能接受高波动、自己筛选标的人",
        "需要低现货 Maker 成本的交易者"
    ],
    "notFor": [
        "只买主流币、追求稳定的人",
        "不会看合约/流动性风险的新手",
        "所在地区不支持的人"
    ],
    "pros": [
        "上新速度快、币种多",
        "现货 Maker 常见零费率活动",
        "合约费率较低"
    ],
    "watchouts": [
        "零费率多为活动/特定市场",
        "小币种深度和退出风险",
        "活动规则变化快"
    ],
    "funding": "支持稳定币/链上充值，法币渠道按地区；先小额测试网络。",
    "feeExamples": [
        {
            "label": "$10,000 现货 Maker（活动 0%）",
            "value": "约 $0"
        },
        {
            "label": "$10,000 现货 Taker（0.10%）",
            "value": "约 $10/单边"
        },
        {
            "label": "$50,000 合约 Taker（0.03%）",
            "value": "约 $15/单边"
        }
    ],
    "links": [
        {
            "label": "Meme 币风险清单",
            "href": "/articles/meme-coin-guide-2026"
        },
        {
            "label": "手续费对比",
            "href": "/articles/exchange-fee-comparison"
        },
        {
            "label": "MEXC 交易所页",
            "href": "/exchanges/mexc"
        }
    ],
    "faqs": [
        {
            "question": "MEXC 真的零手续费吗？",
            "answer": "常见 Maker 零费率，但通常有市场/活动条件，Taker 仍收费；以下单页为准。"
        },
        {
            "question": "MEXC 适合新手吗？",
            "answer": "可以用来观察新币，但不建议把“上新”当稳赚；先小额、看流动性。"
        },
        {
            "question": "MEXC 合约费率多少？",
            "answer": "标准约 Maker 0.01%/Taker 0.03%；具体合约和活动另算。"
        }
    ]
},
  "htx": {
    "metaTitle": "HTX 评测 2026：费率、流动性与适合人群",
    "metaDescription": "2026 HTX 评测：现货 0.10%、合约 0.02%/0.04%，老牌交易所的流动性、产品与注意事项。",
    "lastChecked": "2026-10-29",
    "intro": "HTX（原火币）是老牌交易所，现货/合约产品齐全，中文用户基础较大。选择它时要重点看地区限制、合规状态和近年的品牌变化，不要只看“老牌”两个字。",
    "bestFor": [
        "需要中文界面和老牌平台的人",
        "现货/合约组合交易的用户",
        "能自行核对地区与合规信息的人"
    ],
    "notFor": [
        "所在地区不支持的人",
        "不做 KYC 的人",
        "只看品牌历史、不看当前规则的人"
    ],
    "pros": [
        "产品线完整、中文支持较好",
        "老牌平台、流动性基础在",
        "活动与理财入口较多"
    ],
    "watchouts": [
        "地区/合规状态需自行核对",
        "品牌与业务经历过变化",
        "合约风险不因老牌而降低"
    ],
    "funding": "支持稳定币/链上充值，法币渠道按地区；提现网络先小额测试。",
    "feeExamples": [
        {
            "label": "$10,000 现货 Taker（0.10%）",
            "value": "约 $10/单边"
        },
        {
            "label": "$50,000 合约 Maker（0.02%）",
            "value": "约 $10/单边"
        },
        {
            "label": "$50,000 合约 Taker（0.04%）",
            "value": "约 $20/单边"
        }
    ],
    "links": [
        {
            "label": "手续费对比",
            "href": "/articles/exchange-fee-comparison"
        },
        {
            "label": "交易所排名",
            "href": "/exchange-ranking"
        },
        {
            "label": "安全设置步骤图",
            "href": "/articles/wallet-security-visual-guide"
        }
    ],
    "faqs": [
        {
            "question": "HTX 是原来的火币吗？",
            "answer": "HTX 是原 Huobi 品牌升级后的平台；具体主体、地区和合规状态请以官网为准。"
        },
        {
            "question": "HTX 手续费多少？",
            "answer": "标准现货约 0.10%，合约约 0.02%/0.04%；HT 抵扣/VIP 另算。"
        },
        {
            "question": "老牌交易所更安全吗？",
            "answer": "不代表没有风险；仍需看地区、合规、储备和自身仓位管理。"
        }
    ]
},
  "bingx": {
    "metaTitle": "BingX 评测 2026：跟单、费率与适合人群",
    "metaDescription": "2026 BingX 评测：现货 0.10%、合约 0.02%/0.05%，跟单/复制交易、适合人群和风险。",
    "lastChecked": "2026-10-29",
    "intro": "BingX 主打社交/跟单交易，适合想复制交易员策略的用户。跟单会同步亏损，历史收益不代表未来；选择交易员时先看最大回撤、仓位集中度和跟单费率。",
    "bestFor": [
        "想尝试跟单/社交交易的人",
        "能接受合约波动的人",
        "需要中文界面与移动端体验的人"
    ],
    "notFor": [
        "完全不想承担合约风险的人",
        "把跟单当保本理财的人",
        "所在地区不支持的人"
    ],
    "pros": [
        "跟单/社交交易入口完整",
        "现货与合约产品齐全",
        "移动端体验较友好"
    ],
    "watchouts": [
        "跟单同步交易员亏损",
        "高收益榜可能伴随高回撤",
        "活动/地区规则需核对"
    ],
    "funding": "支持稳定币/链上充值，法币渠道按地区；跟单账户资金划转先看清。",
    "feeExamples": [
        {
            "label": "$10,000 现货 Taker（0.10%）",
            "value": "约 $10/单边"
        },
        {
            "label": "$50,000 合约 Maker（0.02%）",
            "value": "约 $10/单边"
        },
        {
            "label": "$50,000 合约 Taker（0.05%）",
            "value": "约 $25/单边"
        }
    ],
    "links": [
        {
            "label": "Bitget 跟单教程",
            "href": "/articles/what-is-copy-trading-bitget"
        },
        {
            "label": "手续费对比",
            "href": "/articles/exchange-fee-comparison"
        },
        {
            "label": "交易所排名",
            "href": "/exchange-ranking"
        }
    ],
    "faqs": [
        {
            "question": "BingX 跟单能赚钱吗？",
            "answer": "不保证；交易员会亏损，跟单账户同步回撤，先看历史最大回撤和仓位。"
        },
        {
            "question": "BingX 手续费多少？",
            "answer": "标准现货约 0.10%，合约约 0.02%/0.05%；活动/VIP 另算。"
        },
        {
            "question": "跟单应该看什么？",
            "answer": "至少看 6–12 个月收益、最大回撤、仓位集中度和跟单人数。"
        }
    ]
},
  "lbank": {
    "metaTitle": "LBank 评测 2026：Meme、上新与风险",
    "metaDescription": "2026 LBank 评测：现货 0.08%/0.10%、合约 0.01%/0.05%，Meme/新币覆盖、流动性和风险。",
    "lastChecked": "2026-10-29",
    "intro": "LBank 以 Meme/新币和活动见长，适合能自己筛选高风险标的的用户。它的优势是上新快，风险也来自上新快：深度、合约安全和项目质量差异很大。",
    "bestFor": [
        "想跟踪 Meme/新币的用户",
        "能自己看合约和流动性的人",
        "需要多币种现货的人"
    ],
    "notFor": [
        "只买主流币的新手",
        "不能接受归零风险的人",
        "所在地区不支持的人"
    ],
    "pros": [
        "Meme/新币覆盖较快",
        "现货 Maker 费率较低",
        "活动较多"
    ],
    "watchouts": [
        "新币合约/撤池风险",
        "深度不足导致滑点",
        "活动规则变化快"
    ],
    "funding": "支持稳定币/链上充值，法币渠道按地区；先小额测试。",
    "feeExamples": [
        {
            "label": "$10,000 现货 Maker（0.08%）",
            "value": "约 $8/单边"
        },
        {
            "label": "$10,000 现货 Taker（0.10%）",
            "value": "约 $10/单边"
        },
        {
            "label": "$50,000 合约 Taker（0.05%）",
            "value": "约 $25/单边"
        }
    ],
    "links": [
        {
            "label": "Meme 币风险清单",
            "href": "/articles/meme-coin-guide-2026"
        },
        {
            "label": "手续费对比",
            "href": "/articles/exchange-fee-comparison"
        },
        {
            "label": "热钱包对比",
            "href": "/articles/hot-wallet-comparison-2026"
        }
    ],
    "faqs": [
        {
            "question": "LBank 适合买 Meme 吗？",
            "answer": "可以作为观察渠道，但 Meme 风险极高，先看合约、流动性和持仓，不要重仓。"
        },
        {
            "question": "LBank 手续费多少？",
            "answer": "标准现货约 0.08%/0.10%，合约约 0.01%/0.05%；活动/VIP 另算。"
        },
        {
            "question": "新币怎么避免买假？",
            "answer": "只从官方渠道获取合约地址，核对链和尾号，先小额测试卖出。"
        }
    ]
},
  "coinw": {
    "metaTitle": "CoinW 评测 2026：费率、跟单与适合人群",
    "metaDescription": "2026 CoinW 评测：现货 0.08%/0.10%、合约 0.02%/0.06%，跟单/衍生品、适合人群和风险。",
    "lastChecked": "2026-10-29",
    "intro": "CoinW 提供现货、合约和跟单等产品，适合想要多产品组合的用户。选择前重点看地区限制、流动性和活动规则；跟单/合约都会放大亏损。",
    "bestFor": [
        "想尝试跟单/合约的用户",
        "需要多产品入口的人",
        "能自行核对地区规则的人"
    ],
    "notFor": [
        "完全不想承担合约风险的人",
        "只买主流现货的新手",
        "所在地区不支持的人"
    ],
    "pros": [
        "现货/合约/跟单产品齐全",
        "中文界面与活动入口",
        "费率档位较灵活"
    ],
    "watchouts": [
        "合约/跟单放大亏损",
        "部分标深度一般",
        "活动奖励有条件"
    ],
    "funding": "支持稳定币/链上充值，法币渠道按地区；先小额测试网络。",
    "feeExamples": [
        {
            "label": "$10,000 现货 Maker（0.08%）",
            "value": "约 $8/单边"
        },
        {
            "label": "$10,000 现货 Taker（0.10%）",
            "value": "约 $10/单边"
        },
        {
            "label": "$50,000 合约 Taker（0.06%）",
            "value": "约 $30/单边"
        }
    ],
    "links": [
        {
            "label": "Bitget 跟单教程",
            "href": "/articles/what-is-copy-trading-bitget"
        },
        {
            "label": "手续费对比",
            "href": "/articles/exchange-fee-comparison"
        },
        {
            "label": "交易所排名",
            "href": "/exchange-ranking"
        }
    ],
    "faqs": [
        {
            "question": "CoinW 适合新手吗？",
            "answer": "只做现货可以了解；合约/跟单不建议作为第一站。"
        },
        {
            "question": "CoinW 手续费多少？",
            "answer": "标准现货约 0.08%/0.10%，合约约 0.02%/0.06%；活动/VIP 另算。"
        },
        {
            "question": "跟单要注意什么？",
            "answer": "看历史回撤、仓位和费率，不要只看收益榜。"
        }
    ]
},
  "deepcoin": {
    "metaTitle": "DeepCoin 评测 2026：合约费率与风险",
    "metaDescription": "2026 DeepCoin 评测：合约 Maker 0.01%/Taker 0.05%，衍生品定位、适合人群和风险提醒。",
    "lastChecked": "2026-10-29",
    "intro": "DeepCoin 更偏衍生品/合约，现货信息相对少。它不适合把交易所当现货钱包的用户；合约杠杆、强平和流动性风险要被放在第一位。",
    "bestFor": [
        "以合约交易为主的进阶用户",
        "能严格控制杠杆和仓位的人",
        "已核对地区支持的人"
    ],
    "notFor": [
        "第一次买币的新手",
        "不准备做合约的人",
        "所在地区不支持的人"
    ],
    "pros": [
        "合约费率较低",
        "衍生品入口集中",
        "适合有经验的交易者"
    ],
    "watchouts": [
        "杠杆放大亏损",
        "现货产品/深度有限",
        "地区与合规需核对"
    ],
    "funding": "以稳定币/链上充值为主，具体按地区；合约资金划转先看清。",
    "feeExamples": [
        {
            "label": "$50,000 合约 Maker（0.01%）",
            "value": "约 $5/单边"
        },
        {
            "label": "$50,000 合约 Taker（0.05%）",
            "value": "约 $25/单边"
        },
        {
            "label": "资金费率",
            "value": "按市场每 8 小时结算"
        }
    ],
    "links": [
        {
            "label": "手续费对比",
            "href": "/articles/exchange-fee-comparison"
        },
        {
            "label": "交易所排名",
            "href": "/exchange-ranking"
        },
        {
            "label": "钱包安全步骤图",
            "href": "/articles/wallet-security-visual-guide"
        }
    ],
    "faqs": [
        {
            "question": "DeepCoin 适合新手吗？",
            "answer": "不适合作为第一站；先理解杠杆、强平和资金费率。"
        },
        {
            "question": "DeepCoin 手续费多少？",
            "answer": "合约标准约 Maker 0.01%/Taker 0.05%；具体以官方页面为准。"
        },
        {
            "question": "合约最怕什么？",
            "answer": "高杠杆、流动性不足和强平；先小额、低杠杆。"
        }
    ]
},
  "hyperliquid": {
    "metaTitle": "Hyperliquid 评测 2026：链上永续、费率与风险",
    "metaDescription": "2026 Hyperliquid 评测：现货 0.040%/0.070%、永续 0.015%/0.045%，链上订单簿、钱包与风险。",
    "lastChecked": "2026-10-29",
    "intro": "Hyperliquid 是链上永续/现货交易协议，使用钱包签名而不是交易所账户。它的优势是链上结算和低延迟体验，风险则在合约、钱包签名、跨链充值和地区限制。",
    "bestFor": [
        "熟悉钱包签名的链上用户",
        "想用链上订单簿做永续的人",
        "能自行管理私钥和网络的人"
    ],
    "notFor": [
        "第一次买币的新手",
        "不想管理钱包/私钥的人",
        "所在地区不支持的人"
    ],
    "pros": [
        "链上订单簿与永续体验",
        "无需中心化交易所账户",
        "费率透明可查"
    ],
    "watchouts": [
        "钱包签名/合约风险",
        "跨链充值网络选错",
        "流动性与资金费率波动"
    ],
    "funding": "通过钱包从支持的链充值；先小额测试，核对网络和到账。",
    "feeExamples": [
        {
            "label": "$10,000 现货 Taker（0.070%）",
            "value": "约 $7/单边"
        },
        {
            "label": "$50,000 永续 Taker（0.045%）",
            "value": "约 $22.5/单边"
        },
        {
            "label": "$50,000 永续 Maker（0.015%）",
            "value": "约 $7.5/单边"
        }
    ],
    "links": [
        {
            "label": "Hyperliquid vs Aster",
            "href": "/articles/hyperliquid-vs-aster-dex-guide"
        },
        {
            "label": "钱包安全步骤图",
            "href": "/articles/wallet-security-visual-guide"
        },
        {
            "label": "跨链桥小额测试",
            "href": "/articles/bridge-small-test-visual-guide"
        }
    ],
    "faqs": [
        {
            "question": "Hyperliquid 是交易所吗？",
            "answer": "它是链上交易协议，使用钱包签名；不是传统托管交易所。"
        },
        {
            "question": "Hyperliquid 费率多少？",
            "answer": "现货约 0.040%/0.070%，永续约 0.015%/0.045%；以官方页面为准。"
        },
        {
            "question": "新手能直接用吗？",
            "answer": "需要先会钱包、网络和签名；不建议作为第一站。"
        }
    ]
},
  "aster": {
    "metaTitle": "Aster 评测 2026：DEX 永续、费率与风险",
    "metaDescription": "2026 Aster 评测：链上永续/现货 DEX，连接钱包使用；费率、流动性与安全注意事项。",
    "lastChecked": "2026-10-29",
    "intro": "Aster 是去中心化交易协议，主打链上永续/现货。它不托管资产，但需要钱包签名、理解资金费率和链上流动性；费率与支持链以官方页面为准。",
    "bestFor": [
        "熟悉链上交易的钱包用户",
        "想用 DEX 做永续的人",
        "能自行核对合约和网络的人"
    ],
    "notFor": [
        "第一次买币的新手",
        "不想管理钱包的人",
        "所在地区不支持的人"
    ],
    "pros": [
        "非托管、钱包直接交易",
        "链上永续/现货入口",
        "费率和产品以官方页面透明展示"
    ],
    "watchouts": [
        "智能合约/签名风险",
        "链上流动性差异",
        "资金费率与网络拥堵"
    ],
    "funding": "连接钱包后从支持的链充值；先小额测试合约和到账。",
    "feeExamples": [
        {
            "label": "交易费率",
            "value": "以官方页面为准"
        },
        {
            "label": "资金费率",
            "value": "按市场结算"
        },
        {
            "label": "网络/Gas",
            "value": "按链上实际费用"
        }
    ],
    "links": [
        {
            "label": "Hyperliquid vs Aster",
            "href": "/articles/hyperliquid-vs-aster-dex-guide"
        },
        {
            "label": "钱包安全步骤图",
            "href": "/articles/wallet-security-visual-guide"
        },
        {
            "label": "跨链桥小额测试",
            "href": "/articles/bridge-small-test-visual-guide"
        }
    ],
    "faqs": [
        {
            "question": "Aster 是中心化交易所吗？",
            "answer": "不是，它是链上 DEX，使用钱包签名，资产不托管给平台。"
        },
        {
            "question": "Aster 手续费多少？",
            "answer": "以官方页面为准；不同市场/链可能不同。"
        },
        {
            "question": "DEX 最大风险是什么？",
            "answer": "合约漏洞、钱包签名、流动性和网络选择错误。"
        }
    ]
}
}

export function getExchangeEditorial(slug: string) {
  return exchangeEditorials[slug]
}
