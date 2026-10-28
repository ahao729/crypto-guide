export interface CategoryEditorial {
  intro: string
  howTo: string[]
  links: { label: string; href: string }[]
  faqs: { question: string; answer: string }[]
}

export const categoryEditorials: Record<string, CategoryEditorial> = {
  guide: {
    intro:
      "交易所教程不是“点一遍注册”就结束了。真正需要确认的是：地区是否支持、KYC 要什么材料、入金网络是否匹配、手续费和提现规则有没有隐藏条件。先按自己的地区和使用场景选平台，再跟着步骤图操作。",
    howTo: [
      "先确认所在地区是否支持该交易所，不要用 VPN/假资料绕过 KYC。",
      "准备好邮箱/手机号、证件和 2FA，再开始注册。",
      "入金先小额测试网络和 memo，确认到账后再加大金额。",
    ],
    links: [
      { label: "币安注册与 KYC 步骤图", href: "/articles/binance-registration-kyc-visual-guide" },
      { label: "交易所手续费对比", href: "/articles/exchange-fee-comparison" },
      { label: "交易所列表", href: "/exchanges" },
    ],
    faqs: [
      { question: "注册教程先看哪一篇？", answer: "第一次注册优先看币安注册与 KYC 步骤图；如果要比较平台，再看手续费对比和交易所列表。" },
      { question: "注册需要准备什么？", answer: "常用邮箱/手机号、身份证/护照等证件、2FA 工具；具体以交易所页面为准。" },
    ],
  },
  beginner: {
    intro:
      "新手入门最关键的不是记住所有概念，而是先建立三个习惯：只用亏得起的钱、先小额测试、任何签名/授权都先看清楚。这个分类从钱包、交易所、安全到第一笔交易，按顺序看少踩坑。",
    howTo: [
      "先学钱包和私钥，再学交易所注册和入金。",
      "第一次只做小额现货，不碰合约和杠杆。",
      "把助记词离线保存，不截图、不发网盘。",
    ],
    links: [
      { label: "钱包安全设置步骤图", href: "/articles/wallet-security-visual-guide" },
      { label: "币安注册与 KYC 步骤图", href: "/articles/binance-registration-kyc-visual-guide" },
      { label: "新手常见问题", href: "/faq" },
    ],
    faqs: [
      { question: "新手先买币还是先学钱包？", answer: "先搞懂交易所账户和自托管钱包的区别，再决定资产放哪里；第一次只放小额。" },
      { question: "新手适合合约吗？", answer: "不建议作为第一站；合约会放大亏损，先熟悉现货和风险控制。" },
    ],
  },
  cex: {
    intro:
      "中心化交易所（CEX）适合法币/稳定币入金、现货和合约交易，但你把资产托管给了平台。选 CEX 不只看费率，还要看地区限制、KYC、出入金网络、流动性和安全记录。",
    howTo: [
      "先看所在地区是否可用，再看现货/合约费率和深度。",
      "比较入金方式、提现网络和到账时间。",
      "不要把所有资产放在一个交易所；大额考虑冷钱包。",
    ],
    links: [
      { label: "交易所对比与排名", href: "/exchanges" },
      { label: "手续费对比", href: "/articles/exchange-fee-comparison" },
      { label: "币安 vs OKX", href: "/compare/binance-vs-okx" },
    ],
    faqs: [
      { question: "CEX 和 DEX 怎么选？", answer: "需要法币入金、深度和客服可看 CEX；想自托管、直接链上交互可看 DEX，但要自己承担钱包和合约风险。" },
      { question: "交易所越大越安全吗？", answer: "规模和储备是参考，但不等于没有风险；仍要看地区、合规、提现记录和自身仓位。" },
    ],
  },
  dex: {
    intro:
      "DEX 不托管你的资产，交易通过钱包签名完成。它适合熟悉链上操作的用户，但合约漏洞、授权、流动性和网络选择错误都会造成真实损失。第一次用 DEX，先小额、核对域名、看清签名内容。",
    howTo: [
      "先准备独立钱包，只放小额测试资金。",
      "核对官网域名、合约地址和网络。",
      "先小额兑换/提供流动性，确认能退出再加仓。",
    ],
    links: [
      { label: "Hyperliquid vs Aster", href: "/articles/hyperliquid-vs-aster-dex-guide" },
      { label: "跨链桥小额测试", href: "/articles/bridge-small-test-visual-guide" },
      { label: "基础设施目录", href: "/ecosystem" },
    ],
    faqs: [
      { question: "DEX 需要 KYC 吗？", answer: "多数 DEX 不需要交易所 KYC，但钱包、地区和前端可能有自己的限制；以实际页面为准。" },
      { question: "DEX 最大风险是什么？", answer: "合约漏洞、恶意授权、假网站、流动性不足和网络选错；先用小额测试。" },
    ],
  },
  futures: {
    intro:
      "合约交易放大了盈亏，也放大了对费率、资金费率和强平规则的要求。选择合约平台时，不要只看 Taker 费率，还要看 Maker 比例、盘口深度、强平机制和极端行情下的稳定性。",
    howTo: [
      "先算自己的 Maker/Taker 比例，不要只看一个数字。",
      "先用低杠杆、小额熟悉强平和资金费率。",
      "把手续费、资金费率和滑点一起算进成本。",
    ],
    links: [
      { label: "手续费对比", href: "/articles/exchange-fee-comparison" },
      { label: "Bybit 评测", href: "/exchanges/bybit" },
      { label: "合约/跟单风险", href: "/articles/what-is-copy-trading-bitget" },
    ],
    faqs: [
      { question: "合约手续费怎么算？", answer: "按 Maker/Taker、名义仓位和 VIP 等级计算；还要加上资金费率和滑点。" },
      { question: "新手能用高杠杆吗？", answer: "不建议；高杠杆会快速放大亏损，先低杠杆、小额测试。" },
    ],
  },
  "copy-trading": {
    intro:
      "跟单不是保本理财。交易员的收益、最大回撤、仓位集中度和跟单费率都会影响你的结果；高收益榜往往也伴随高回撤。先看至少 6–12 个月记录，再决定是否小额跟随。",
    howTo: [
      "先看最大回撤和仓位集中度，不只看收益率。",
      "设置跟单上限和止损，不用生活资金。",
      "先小额跟随，观察一段时间再加仓。",
    ],
    links: [
      { label: "Bitget 跟单教程", href: "/articles/what-is-copy-trading-bitget" },
      { label: "Bitget 评测", href: "/exchanges/bitget" },
      { label: "手续费对比", href: "/articles/exchange-fee-comparison" },
    ],
    faqs: [
      { question: "跟单能保证赚钱吗？", answer: "不能；交易员亏损会同步到跟单账户，历史收益不代表未来。" },
      { question: "跟单看什么指标？", answer: "至少看 6–12 个月收益、最大回撤、仓位集中度、跟单人数和费率。" },
    ],
  },
  stocks: {
    intro:
      "美股/ETF 内容和加密交易不同：有交易时段、汇率、股息税和地区限制。币安在部分非美国市场提供美股/ETF 与 bStocks；先确认所在地区可用，再小额试单。",
    howTo: [
      "先确认币安在你所在地区是否开放股票/ETF。",
      "分清直接股票/ETF 和 bStocks 的交易时间与权利。",
      "先小额，核对费用、汇率和到账后再加仓。",
    ],
    links: [
      { label: "美股与 ETF hub", href: "/stocks" },
      { label: "币安美股怎么买", href: "/articles/binance-us-stocks-guide" },
      { label: "SPY / VOO / QQQ", href: "/articles/us-stock-etf-beginners" },
    ],
    faqs: [
      { question: "中国大陆用户能直接买币安美股吗？", answer: "以币安注册页和 KYC 结果为准；地区不支持时不要用 VPN/假资料绕过。" },
      { question: "bStocks 和直接股票一样吗？", answer: "不一样；bStocks 是代币化证券，交易时间、权利和托管机制不同，以官方文件为准。" },
    ],
  },
  infra: {
    intro:
      "基础设施决定你链上操作的安全边界：钱包管私钥，跨链桥管资产转移，预言机管价格数据。它们不是“越有名越安全”，要看权限、验证模型、流动性和退出路径。",
    howTo: [
      "钱包：先小额热钱包，大额用冷钱包/多签。",
      "跨链桥：先 10–20 美元测试，核对目标链和资产。",
      "预言机：理解喂价延迟、节点和集成风险。",
    ],
    links: [
      { label: "基础设施地图", href: "/ecosystem" },
      { label: "钱包安全设置步骤图", href: "/articles/wallet-security-visual-guide" },
      { label: "跨链桥小额测试", href: "/articles/bridge-small-test-visual-guide" },
    ],
    faqs: [
      { question: "热钱包和硬件钱包怎么选？", answer: "日常小额用热钱包，大额长期资产用硬件钱包/多签；不要把全部资产放一个热钱包。" },
      { question: "跨链桥最怕什么？", answer: "合约漏洞、验证者被攻破、包装资产脱锚、流动性和目标链失败。" },
    ],
  },
  meme: {
    intro:
      "Meme 币没有现金流，价格由注意力、流动性和情绪驱动。早期项目可能有合约后门、撤池和无法卖出的风险；先看合约、持仓和流动性，再决定是否小额参与。",
    howTo: [
      "先看合约权限、LP 锁仓和前 10 地址持仓。",
      "只从官方渠道获取合约地址，先小额测试卖出。",
      "接受归零可能，不用生活资金/杠杆。",
    ],
    links: [
      { label: "Meme 币风险清单", href: "/articles/meme-coin-guide-2026" },
      { label: "钱包安全设置", href: "/articles/wallet-security-visual-guide" },
      { label: "Gate.io 评测", href: "/exchanges/gate-io" },
    ],
    faqs: [
      { question: "Meme 币适合新手吗？", answer: "早期 Meme 需要合约和流动性判断能力，不适合作为新手第一站。" },
      { question: "币安上线的 Meme 就安全吗？", answer: "交易所审核不等于没有价格风险；项目流动性、抛压和合约仍会变化。" },
    ],
  },
  ai: {
    intro:
      "AI × Crypto 不是“让 AI 预测涨跌”，而是让 Agent 调用数据、执行任务和支付服务。币安 AI、AI Pro、Agent OS、Skills Hub 和 Agentic Wallet 是不同层；先分清工具、权限和资金风险。",
    howTo: [
      "先用只读/测试功能，不让 Agent 直接碰大额资金。",
      "给 Agent 独立钱包、预算和允许列表。",
      "安装 Skill 前看来源、权限和审计。",
    ],
    links: [
      { label: "币安 AI 产品全景", href: "/articles/binance-ai-products-guide" },
      { label: "Agentic Wallet 与 x402", href: "/articles/ai-agent-wallet-x402-guide" },
      { label: "热门赛道", href: "/trends" },
    ],
    faqs: [
      { question: "Binance AI 能自动赚钱吗？", answer: "不能；AI 是工具，回测和实盘都可能亏损。" },
      { question: "Agent 钱包安全吗？", answer: "取决于权限和预算设置；不要给无限额度或主钱包私钥。" },
    ],
  },
  web3: {
    intro:
      "Web3 的核心是钱包、链和智能合约。体验在变好，但安全责任仍主要落在用户：助记词、签名、授权和网络选择，每一步都可能造成资产损失。",
    howTo: [
      "先学钱包、Gas 和授权，再尝试 DApp。",
      "用独立钱包做高风险交互，控制余额。",
      "跨链/签名前核对域名和合约。",
    ],
    links: [
      { label: "Web3.0 入门", href: "/articles/web3-guide-2026" },
      { label: "热钱包对比", href: "/articles/hot-wallet-comparison-2026" },
      { label: "RWA 入门", href: "/articles/rwa-guide-2026" },
    ],
    faqs: [
      { question: "Web3 和交易所账户有什么区别？", answer: "交易所是托管账户；Web3 钱包是自托管，私钥/助记词由你保管。" },
      { question: "Layer2 资产安全吗？", answer: "有桥、排序器和流动性风险；不要只看 Gas 便宜。" },
    ],
  },
  rwa: {
    intro:
      "RWA 把美债、基金、房地产等现实资产代币化，但不消除发行方、托管、流动性和监管风险。先看底层资产、法律结构和赎回路径，再看收益率。",
    howTo: [
      "确认底层资产、发行方和托管方是谁。",
      "看代币持有人权利、赎回周期和费用。",
      "区分交易所代币价格敞口和直接申购/赎回。",
    ],
    links: [
      { label: "RWA 入门", href: "/articles/rwa-guide-2026" },
      { label: "基础设施目录", href: "/ecosystem" },
      { label: "交易所手续费对比", href: "/articles/exchange-fee-comparison" },
    ],
    faqs: [
      { question: "RWA 是稳定币吗？", answer: "不是；RWA 代币可能代表基金份额、债务或收益权，不保本。" },
      { question: "RWA 收益稳定吗？", answer: "美债类相对稳定，但仍有发行方、托管和赎回风险；私人信贷/房地产风险更高。" },
    ],
  },
  nft: {
    intro:
      "NFT 已经从头像炒作转向会员、游戏资产和链上凭证，但流动性差、定价不透明和钱包安全仍是主要问题。先看合约、项目方和实际权益，再决定是否购买。",
    howTo: [
      "核对合约地址、链和项目方历史。",
      "用独立钱包，签名前看清授权内容。",
      "先看二级市场深度，不要只看地板价。",
    ],
    links: [
      { label: "NFT 入门与防骗", href: "/articles/nft-guide-2026" },
      { label: "钱包安全设置", href: "/articles/wallet-security-visual-guide" },
      { label: "热钱包对比", href: "/articles/hot-wallet-comparison-2026" },
    ],
    faqs: [
      { question: "NFT 还能买吗？", answer: "可以，但更适合当高风险的收藏/权益资产，先看流动性和实际用途。" },
      { question: "地板价低能抄底吗？", answer: "不一定；低地板价可能意味着没有买盘、项目停更或合约有问题。" },
    ],
  },
}
