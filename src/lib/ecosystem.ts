export type EcosystemCategory = "wallet" | "bridge" | "oracle"

export interface BrandUseCase {
  title: string
  description: string
}

export interface BrandScreenshot {
  src: string
  alt: string
  caption: string
  sourceLabel: string
  sourceUrl: string
  kind: "phone" | "wide"
}

export interface EcosystemBrand {
  slug: string
  name: string
  mark: string
  logo: string
  category: EcosystemCategory
  type: string
  tagline: string
  summary: string
  chains: string[]
  features: string[]
  risks: string[]
  officialUrl: string
  docsUrl?: string
  useCases: BrandUseCase[]
  screenshot: BrandScreenshot
  articleSlug: string
  color: string
}

export const ecosystemCategories: Record<
  EcosystemCategory,
  { label: string; plural: string; description: string }
> = {
  wallet: {
    label: "热钱包",
    plural: "热钱包",
    description: "联网使用的自托管钱包：方便，但私钥和授权风险由你承担。",
  },
  bridge: {
    label: "跨链桥",
    plural: "跨链桥",
    description: "在链之间转移资产或消息：先看资产形态、验证模型和退出路径。",
  },
  oracle: {
    label: "预言机",
    plural: "预言机",
    description: "把链下价格/数据带上链：喂价延迟、节点和操纵风险都会影响协议。",
  },
}

export const ecosystemBrands: EcosystemBrand[] = [
  // Wallets
  {
    slug: "metamask",
    name: "MetaMask",
    mark: "MM",
    logo: "/images/ecosystem/metamask.png",
    category: "wallet",
    type: "浏览器扩展 / 移动端自托管钱包",
    tagline: "EVM 生态最常用的入口之一",
    summary:
      "MetaMask 以浏览器扩展起家，是以太坊及 EVM 链最常用的自托管钱包之一。它支持自定义 RPC、代币、NFT 和 DApp 连接，并逐步扩展到 Solana 等非 EVM 网络。",
    chains: ["Ethereum", "EVM L2", "Solana（逐步支持）"],
    features: ["DApp 连接与签名", "内置 Swap/Bridge", "多账户与硬件钱包连接"],
    risks: ["钓鱼网站/恶意授权", "助记词泄露即失去资产", "跨链/兑换路由由第三方提供"],
    useCases: [
      { title: "DeFi 交互", description: "连接 Uniswap、Aave 等协议，完成兑换、借贷和授权。" },
      { title: "NFT 与空投", description: "管理 NFT、参与活动/空投，用独立钱包隔离风险。" },
      { title: "多链测试", description: "添加 RPC、测试 L2 或新链，先小额再扩大。" },
    ],
    screenshot: {
      src: "/images/ecosystem/screens/metamask.jpg",
      alt: "MetaMask App Store 官方截图：资产与代币列表",
      caption: "MetaMask App Store 官方截图：资产与代币列表",
      sourceLabel: "App Store 官方截图",
      sourceUrl: "https://apps.apple.com/us/app/metamask-trade-crypto/id1438144202",
      kind: "phone",
    },
    officialUrl: "https://metamask.io/",
    docsUrl: "https://docs.metamask.io/",
    articleSlug: "hot-wallet-comparison-2026",
    color: "#F6851B",
  },
  {
    slug: "trust-wallet",
    name: "Trust Wallet",
    mark: "TW",
    logo: "/images/ecosystem/trust-wallet.png",
    category: "wallet",
    type: "移动端多链自托管钱包",
    tagline: "多链资产与 DApp 的移动端入口",
    summary:
      "Trust Wallet 是移动端多链钱包，覆盖 EVM、Solana、Cosmos 等多条网络，支持代币、NFT、DApp 浏览器和质押。它对新手较友好，但资产安全仍取决于助记词和签名习惯。",
    chains: ["Ethereum", "BNB Chain", "Solana", "多链"],
    features: ["多链资产管理", "内置 DApp 浏览器", "质押与 NFT"],
    risks: ["假 App/假网站", "授权与签名风险", "部分链功能依赖第三方服务"],
    useCases: [
      { title: "移动端多链资产", description: "在手机上管理 EVM、Solana 等多链资产。" },
      { title: "买币与质押", description: "通过法币/第三方入口买币，参与质押和理财。" },
      { title: "DApp 浏览", description: "用内置浏览器连接 DApp，核对域名和授权。" },
    ],
    screenshot: {
      src: "/images/ecosystem/screens/trust-wallet.jpg",
      alt: "Trust Wallet App Store 官方截图：买币入口",
      caption: "Trust Wallet App Store 官方截图：买币入口",
      sourceLabel: "App Store 官方截图",
      sourceUrl: "https://apps.apple.com/us/app/trust-crypto-bitcoin-wallet/id1288339409",
      kind: "phone",
    },
    officialUrl: "https://trustwallet.com/",
    docsUrl: "https://developer.trustwallet.com/",
    articleSlug: "hot-wallet-comparison-2026",
    color: "#3375BB",
  },
  {
    slug: "phantom",
    name: "Phantom",
    mark: "PH",
    logo: "/images/ecosystem/phantom.png",
    category: "wallet",
    type: "Solana 起家的多链自托管钱包",
    tagline: "Solana 用户体验标杆，逐步扩展 EVM",
    summary:
      "Phantom 以 Solana 钱包起家，以流畅的移动端/浏览器体验著称。它已扩展到 Ethereum、Polygon、Base 等网络，适合 Solana 与多链 DApp 用户。",
    chains: ["Solana", "Ethereum", "Polygon", "Base"],
    features: ["Solana 原生体验", "NFT 管理", "内置 Swap 与多链账户"],
    risks: ["助记词/私钥泄露", "恶意 NFT/空投钓鱼", "新链支持以官方为准"],
    useCases: [
      { title: "Solana 交易", description: "Swap、NFT 和 Solana DApp 交互。" },
      { title: "多链资产", description: "管理 Ethereum、Polygon、Base 等网络资产。" },
      { title: "新项目交互", description: "参与空投/新项目，用独立钱包小额测试。" },
    ],
    screenshot: {
      src: "/images/ecosystem/screens/phantom.jpg",
      alt: "Phantom App Store 官方截图：多链资产",
      caption: "Phantom App Store 官方截图：多链资产",
      sourceLabel: "App Store 官方截图",
      sourceUrl: "https://apps.apple.com/us/app/phantom-trading-wallet/id1598432977",
      kind: "phone",
    },
    officialUrl: "https://phantom.app/",
    docsUrl: "https://docs.phantom.com/",
    articleSlug: "hot-wallet-comparison-2026",
    color: "#AB9FF2",
  },
  {
    slug: "rabby",
    name: "Rabby",
    mark: "RB",
    logo: "/images/ecosystem/rabby.png",
    category: "wallet",
    type: "EVM 多链自托管钱包",
    tagline: "强调交易前风险提示的 EVM 钱包",
    summary:
      "Rabby 由 DeBank 团队推出，主打多链 EVM 体验和交易前的风险提示：在签名/交易前展示资产变化、授权和潜在风险，适合经常与 DeFi 交互的用户。",
    chains: ["Ethereum", "Arbitrum", "Base", "EVM 多链"],
    features: ["交易前资产变化预览", "多链账户", "授权/风险提示"],
    risks: ["风险提示不等于绝对安全", "仍需核对域名与签名", "扩展/移动端功能差异"],
    useCases: [
      { title: "DeFi 交易前检查", description: "在签名前预览资产变化、授权和潜在风险。" },
      { title: "多链账户", description: "在 EVM 多链间切换，减少网络选错。" },
      { title: "授权管理", description: "集中查看并撤销不常用的代币授权。" },
    ],
    screenshot: {
      src: "/images/ecosystem/screens/rabby.jpg",
      alt: "Rabby App Store 官方截图：跨链/兑换界面",
      caption: "Rabby App Store 官方截图：跨链/兑换界面",
      sourceLabel: "App Store 官方截图",
      sourceUrl: "https://apps.apple.com/us/app/rabby-wallet-crypto-evm/id6474381673",
      kind: "phone",
    },
    officialUrl: "https://rabby.io/",
    docsUrl: "https://docs.rabby.io/",
    articleSlug: "hot-wallet-comparison-2026",
    color: "#7B61FF",
  },
  {
    slug: "okx-wallet",
    name: "OKX Wallet",
    mark: "OKX",
    logo: "/images/ecosystem/okx-wallet.png",
    category: "wallet",
    type: "多链自托管钱包（OKX 生态）",
    tagline: "交易所生态里的多链 Web3 钱包",
    summary:
      "OKX Wallet 是 OKX 生态的多链自托管钱包，支持 EVM、Solana、Bitcoin 等网络，内置 DEX 聚合、NFT 市场和 DApp 连接。适合已经在使用 OKX 的用户。",
    chains: ["Ethereum", "Solana", "Bitcoin", "多链"],
    features: ["多链账户", "DEX 聚合", "DApp/NFT 入口"],
    risks: ["自托管仍需保管助记词", "聚合路由的合约风险", "地区功能差异"],
    useCases: [
      { title: "DEX 聚合", description: "多链 Swap 与路由比价，减少手动换链。" },
      { title: "多链资产", description: "统一管理 EVM、Solana、Bitcoin 等资产。" },
      { title: "Web3 入口", description: "连接 NFT、DApp 和活动，先小额测试。" },
    ],
    screenshot: {
      src: "/images/ecosystem/screens/okx-wallet.jpg",
      alt: "OKX Wallet App Store 官方截图：钱包首页",
      caption: "OKX Wallet App Store 官方截图：钱包首页",
      sourceLabel: "App Store 官方截图",
      sourceUrl: "https://apps.apple.com/us/app/okx-wallet-buy-crypto-rwa/id6743309484",
      kind: "phone",
    },
    officialUrl: "https://www.okx.com/web3",
    docsUrl: "https://www.okx.com/web3/learn",
    articleSlug: "hot-wallet-comparison-2026",
    color: "#F5F5F5",
  },
  {
    slug: "binance-web3-wallet",
    name: "Binance Web3 Wallet",
    mark: "BN",
    logo: "/images/ecosystem/binance-web3-wallet.png",
    category: "wallet",
    type: "币安 App 内置自托管钱包",
    tagline: "在币安 App 里管理链上资产",
    summary:
      "Binance Web3 Wallet 内置在币安 App 中，采用自托管模式，支持多链资产、DApp、Swap 和 NFT。适合已经使用币安、又不想额外安装多个钱包的用户。",
    chains: ["Ethereum", "BNB Chain", "Solana", "Bitcoin"],
    features: ["与币安 App 集成", "多链资产管理", "DApp/Swap 入口"],
    risks: ["自托管资产不等同交易所托管", "授权与签名风险", "地区/版本功能差异"],
    useCases: [
      { title: "币安用户链上交互", description: "在币安 App 内使用 Web3 钱包，减少额外安装。" },
      { title: "打新与空投", description: "参与链上活动/空投，先核对合约和权限。" },
      { title: "多链资产", description: "管理 EVM、Solana、Bitcoin 等多链资产。" },
    ],
    screenshot: {
      src: "/images/ecosystem/screens/binance-web3-wallet.png",
      alt: "Binance Wallet 官网截图：产品入口",
      caption: "Binance Wallet 官网截图：产品入口",
      sourceLabel: "Binance Wallet 官网",
      sourceUrl: "https://www.binance.com/en/web3wallet",
      kind: "wide",
    },
    officialUrl: "https://www.binance.com/en/web3wallet",
    articleSlug: "hot-wallet-comparison-2026",
    color: "#F0B90B",
  },
  {
    slug: "coinbase-wallet",
    name: "Coinbase Wallet",
    mark: "CB",
    logo: "/images/ecosystem/coinbase-wallet.png",
    category: "wallet",
    type: "自托管多链钱包（Coinbase 生态）",
    tagline: "Base 生态与 Coinbase 用户的自托管选择",
    summary:
      "Coinbase Wallet 是 Coinbase 推出的自托管钱包，支持 EVM 多链和 Base 生态，提供 DApp 浏览器、NFT 和社交恢复等能力。与 Coinbase 交易所账户分离。",
    chains: ["Ethereum", "Base", "EVM 多链", "Solana（以官方为准）"],
    features: ["Base 生态入口", "自托管与社交恢复", "DApp/NFT"],
    risks: ["自托管责任在用户", "恢复机制需正确设置", "地区功能差异"],
    useCases: [
      { title: "Base 生态", description: "使用 Base 上的 DApp、NFT 和 Swap。" },
      { title: "自托管与恢复", description: "用社交恢复/多签降低单点丢失风险。" },
      { title: "DApp 与 NFT", description: "连接应用、管理 NFT，控制授权范围。" },
    ],
    screenshot: {
      src: "/images/ecosystem/screens/coinbase-wallet.jpg",
      alt: "Coinbase Wallet App Store 官方截图：资产首页",
      caption: "Coinbase Wallet App Store 官方截图：资产首页",
      sourceLabel: "App Store 官方截图",
      sourceUrl: "https://apps.apple.com/us/app/coinbase-wallet-trade-to-win/id1278383455",
      kind: "phone",
    },
    officialUrl: "https://www.coinbase.com/wallet",
    docsUrl: "https://docs.cdp.coinbase.com/",
    articleSlug: "hot-wallet-comparison-2026",
    color: "#0052FF",
  },

  // Bridges
  {
    slug: "layerzero",
    name: "LayerZero",
    mark: "LZ",
    logo: "/images/ecosystem/layerzero.png",
    category: "bridge",
    type: "全链消息/互操作协议",
    tagline: "不是单一桥，而是跨链消息层",
    summary:
      "LayerZero 提供跨链消息传递，Stargate、OFT 资产和很多跨链应用建立在其上。它本身不是“把币存进去”的桥，安全性取决于应用配置、验证器和 DVN。",
    chains: ["Ethereum", "Arbitrum", "Base", "多链"],
    features: ["全链消息", "OFT 资产标准", "可配置安全模块"],
    risks: ["应用配置错误", "验证器/DVN 信任", "目标链拥堵/失败"],
    useCases: [
      { title: "跨链应用", description: "用 OFT/消息层实现资产或状态跨链。" },
      { title: "资产跨链", description: "通过 Stargate 等应用转移稳定币/主流资产。" },
      { title: "开发者集成", description: "配置 DVN、安全模块和目标链参数。" },
    ],
    screenshot: {
      src: "/images/ecosystem/screens/layerzero.jpg",
      alt: "LayerZero 官网截图：全链互操作定位",
      caption: "LayerZero 官网截图：全链互操作定位",
      sourceLabel: "官网截图",
      sourceUrl: "https://layerzero.network/",
      kind: "wide",
    },
    officialUrl: "https://layerzero.network/",
    docsUrl: "https://docs.layerzero.network/",
    articleSlug: "cross-chain-bridge-guide-2026",
    color: "#7C3AED",
  },
  {
    slug: "wormhole",
    name: "Wormhole",
    mark: "WH",
    logo: "/images/ecosystem/wormhole.png",
    category: "bridge",
    type: "跨链消息 + Token Bridge",
    tagline: "多链消息与资产转移的老牌协议",
    summary:
      "Wormhole 提供跨链消息和 Token Bridge，支持多条 EVM 与非 EVM 链。资产通常以包装形式存在，安全依赖 Guardian 验证网络和具体应用合约。",
    chains: ["Ethereum", "Solana", "Sui", "多链"],
    features: ["跨链消息", "Token Bridge", "多链 SDK"],
    risks: ["包装资产脱锚", "Guardian/合约风险", "目标链流动性"],
    useCases: [
      { title: "多链资产转移", description: "通过 Token Bridge 在 EVM/非 EVM 链间转移资产。" },
      { title: "跨链应用", description: "用消息层构建跨链合约和治理。" },
      { title: "多链开发", description: "使用 SDK 接入 Solana、Sui 等生态。" },
    ],
    screenshot: {
      src: "/images/ecosystem/screens/wormhole.jpg",
      alt: "Wormhole 官网截图：跨链基础设施",
      caption: "Wormhole 官网截图：跨链基础设施",
      sourceLabel: "官网截图",
      sourceUrl: "https://wormhole.com/",
      kind: "wide",
    },
    officialUrl: "https://wormhole.com/",
    docsUrl: "https://docs.wormhole.com/",
    articleSlug: "cross-chain-bridge-guide-2026",
    color: "#00C2FF",
  },
  {
    slug: "stargate",
    name: "Stargate",
    mark: "STG",
    logo: "/images/ecosystem/stargate.png",
    category: "bridge",
    type: "基于 LayerZero 的流动性桥",
    tagline: "稳定币与主流资产的跨链流动性",
    summary:
      "Stargate 是基于 LayerZero 的流动性桥，主打稳定币/主流资产的跨链转移。它依赖各链流动性池和 LayerZero 消息层，适合小额、主流资产测试。",
    chains: ["Ethereum", "Arbitrum", "Base", "多链"],
    features: ["统一流动性池", "稳定币跨链", "LayerZero 消息"],
    risks: ["池子流动性不足", "LayerZero 配置风险", "跨链手续费/滑点"],
    useCases: [
      { title: "稳定币跨链", description: "在支持链之间转移 USDC/USDT 等资产。" },
      { title: "L2 资金调度", description: "在 Ethereum 与 L2 之间调整流动性。" },
      { title: "小额测试", description: "先小额确认到账、费用和目标链资产。" },
    ],
    screenshot: {
      src: "/images/ecosystem/screens/stargate.jpg",
      alt: "Stargate 产品界面：跨链转移",
      caption: "Stargate 产品界面：跨链转移",
      sourceLabel: "产品界面截图",
      sourceUrl: "https://stargate.finance/",
      kind: "wide",
    },
    officialUrl: "https://stargate.finance/",
    docsUrl: "https://docs.stargate.finance/",
    articleSlug: "cross-chain-bridge-guide-2026",
    color: "#8B5CF6",
  },
  {
    slug: "across",
    name: "Across",
    mark: "AC",
    logo: "/images/ecosystem/across.png",
    category: "bridge",
    type: "意图式跨链桥",
    tagline: "快速、低成本的 L2 间转移",
    summary:
      "Across 采用意图/中继模式，由流动性提供者先垫付，用户快速拿到目标链资产。它主打 Ethereum 与 L2 之间的转账，适合追求速度的用户。",
    chains: ["Ethereum", "Arbitrum", "Optimism", "Base"],
    features: ["意图式成交", "快速到账", "L2 间转账"],
    risks: ["中继方/流动性风险", "报价与滑点", "目标链最终性"],
    useCases: [
      { title: "L2 快速转移", description: "在 Ethereum 与 L2 之间快速转移资产。" },
      { title: "资金归集", description: "把多链资金集中到目标链，比较报价。" },
      { title: "跨链支付", description: "需要快速到账的跨链转账场景。" },
    ],
    screenshot: {
      src: "/images/ecosystem/screens/across.jpg",
      alt: "Across 产品界面：Bridge & swap",
      caption: "Across 产品界面：Bridge & swap",
      sourceLabel: "产品界面截图",
      sourceUrl: "https://across.to/",
      kind: "wide",
    },
    officialUrl: "https://across.to/",
    docsUrl: "https://docs.across.to/",
    articleSlug: "cross-chain-bridge-guide-2026",
    color: "#6CF0C2",
  },
  {
    slug: "circle-cctp",
    name: "Circle CCTP",
    mark: "CCTP",
    logo: "/images/ecosystem/circle-cctp.png",
    category: "bridge",
    type: "USDC 原生跨链协议",
    tagline: "销毁-铸造，而不是包装 USDC",
    summary:
      "Circle 的 Cross-Chain Transfer Protocol 在源链销毁 USDC、在目标链铸造原生 USDC，减少包装资产脱锚风险。适合 USDC 跨链，但不是所有链/地区都支持。",
    chains: ["Ethereum", "Solana", "Base", "多链"],
    features: ["原生 USDC", "销毁/铸造", "可组合的跨链结算"],
    risks: ["支持的链有限", "目标链拥堵", "依赖 Circle 合约/合规"],
    useCases: [
      { title: "USDC 原生跨链", description: "通过销毁/铸造转移原生 USDC，减少包装资产。" },
      { title: "交易所与支付结算", description: "在支持链之间调拨稳定币流动性。" },
      { title: "资金调度", description: "确认目标链支持、费用和到账时间。" },
    ],
    screenshot: {
      src: "/images/ecosystem/screens/circle-cctp.jpg",
      alt: "Circle 官网截图：全球支付网络（CCTP 为其中能力）",
      caption: "Circle 官网截图：全球支付网络（CCTP 为其中能力）",
      sourceLabel: "官网截图",
      sourceUrl: "https://www.circle.com/",
      kind: "wide",
    },
    officialUrl: "https://www.circle.com/cross-chain-transfer-protocol",
    docsUrl: "https://developers.circle.com/stablecoins/cctp",
    articleSlug: "cross-chain-bridge-guide-2026",
    color: "#2775CA",
  },
  {
    slug: "thorchain",
    name: "THORChain",
    mark: "THOR",
    logo: "/images/ecosystem/thorchain.png",
    category: "bridge",
    type: "原生资产跨链兑换协议",
    tagline: "不包装资产的跨链兑换",
    summary:
      "THORChain 通过流动性池和验证者网络，让 BTC、ETH 等原生资产跨链兑换为其他资产，不依赖中心化托管。机制复杂，适合理解跨链风险的用户。",
    chains: ["Bitcoin", "Ethereum", "BNB Chain", "多链"],
    features: ["原生资产兑换", "去中心化流动性池", "跨链结算"],
    risks: ["验证者/共识风险", "流动性深度不足", "复杂合约与清算"],
    useCases: [
      { title: "BTC/ETH 原生兑换", description: "不依赖包装资产，直接兑换原生资产。" },
      { title: "跨链流动性", description: "通过池子提供/获取跨链流动性。" },
      { title: "高级用户", description: "理解验证者、清算和池子深度后再使用。" },
    ],
    screenshot: {
      src: "/images/ecosystem/screens/thorchain.jpg",
      alt: "THORChain 官网截图：Bitcoin DEX 定位",
      caption: "THORChain 官网截图：Bitcoin DEX 定位",
      sourceLabel: "官网截图",
      sourceUrl: "https://thorchain.org/",
      kind: "wide",
    },
    officialUrl: "https://thorchain.org/",
    docsUrl: "https://docs.thorchain.org/",
    articleSlug: "cross-chain-bridge-guide-2026",
    color: "#33FF99",
  },

  // Oracles
  {
    slug: "chainlink",
    name: "Chainlink",
    mark: "LINK",
    logo: "/images/ecosystem/chainlink.png",
    category: "oracle",
    type: "去中心化预言机网络",
    tagline: "价格喂价、CCIP 与可验证随机数",
    summary:
      "Chainlink 是最常用的去中心化预言机网络之一，提供价格喂价、储备证明、VRF 和跨链互操作 CCIP。大量 DeFi 协议依赖其数据源，但不同喂价的更新频率和节点集不同。",
    chains: ["Ethereum", "多链", "L2"],
    features: ["Price Feeds", "CCIP 跨链", "VRF/储备证明"],
    risks: ["喂价延迟/异常", "节点/聚合器风险", "集成方配置错误"],
    useCases: [
      { title: "DeFi 价格喂价", description: "为借贷、衍生品和稳定币提供价格数据。" },
      { title: "储备证明与 RWA", description: "用 PoR/NAV 数据支持资产背书。" },
      { title: "CCIP 与 VRF", description: "跨链消息、可验证随机数等集成。" },
    ],
    screenshot: {
      src: "/images/ecosystem/screens/chainlink.jpg",
      alt: "Chainlink 官网截图：数据与资产上链",
      caption: "Chainlink 官网截图：数据与资产上链",
      sourceLabel: "官网截图",
      sourceUrl: "https://chain.link/",
      kind: "wide",
    },
    officialUrl: "https://chain.link/",
    docsUrl: "https://docs.chain.link/",
    articleSlug: "oracle-guide-2026",
    color: "#375BD2",
  },
  {
    slug: "pyth",
    name: "Pyth Network",
    mark: "PYTH",
    logo: "/images/ecosystem/pyth.png",
    category: "oracle",
    type: "低延迟价格预言机",
    tagline: "Pull 模式，面向高频/衍生品场景",
    summary:
      "Pyth 采用 Pull 模式发布价格，数据由交易商/交易所等第一方提供，主打低延迟。它在 Solana 和 EVM 链上被衍生品协议广泛使用，但需要调用方主动更新价格。",
    chains: ["Solana", "EVM", "多链"],
    features: ["低延迟价格", "第一方数据", "Pull 更新"],
    risks: ["更新不及时导致过期价格", "数据提供方集中度", "集成复杂度"],
    useCases: [
      { title: "永续与衍生品", description: "低延迟价格适合高频/衍生品场景。" },
      { title: "Solana DeFi", description: "Pull 模式按需更新价格。" },
      { title: "数据集成", description: "接入第一方市场数据，注意更新频率。" },
    ],
    screenshot: {
      src: "/images/ecosystem/screens/pyth.jpg",
      alt: "Pyth 官网截图：市场数据产品",
      caption: "Pyth 官网截图：市场数据产品",
      sourceLabel: "官网截图",
      sourceUrl: "https://pyth.network/",
      kind: "wide",
    },
    officialUrl: "https://pyth.network/",
    docsUrl: "https://docs.pyth.network/",
    articleSlug: "oracle-guide-2026",
    color: "#E6DAFE",
  },
  {
    slug: "redstone",
    name: "RedStone",
    mark: "RS",
    logo: "/images/ecosystem/redstone.png",
    category: "oracle",
    type: "模块化预言机",
    tagline: "把数据可用性与喂价解耦",
    summary:
      "RedStone 采用模块化设计，把价格数据放到数据可用性层/链下，再由合约按需验证，适合需要多资产、低成本喂价的协议。具体安全模型取决于集成方式。",
    chains: ["EVM", "L2", "多链"],
    features: ["模块化数据", "按需喂价", "多资产支持"],
    risks: ["数据可用性依赖", "集成配置错误", "新资产数据质量"],
    useCases: [
      { title: "多资产借贷", description: "为长尾资产提供模块化喂价。" },
      { title: "新链上线", description: "按需部署数据源，降低上新成本。" },
      { title: "数据可用性", description: "理解 DA 层依赖和更新机制。" },
    ],
    screenshot: {
      src: "/images/ecosystem/screens/redstone.jpg",
      alt: "RedStone 产品界面：数据面板",
      caption: "RedStone 产品界面：数据面板",
      sourceLabel: "产品界面截图",
      sourceUrl: "https://app.redstone.finance/",
      kind: "wide",
    },
    officialUrl: "https://redstone.finance/",
    docsUrl: "https://docs.redstone.finance/",
    articleSlug: "oracle-guide-2026",
    color: "#E03A3A",
  },
  {
    slug: "api3",
    name: "API3",
    mark: "API3",
    logo: "/images/ecosystem/api3.png",
    category: "oracle",
    type: "第一方预言机 / OEV",
    tagline: "让 API 提供方直接上链",
    summary:
      "API3 主打第一方预言机：数据提供方直接运行节点，减少中间层。它还提供 OEV（Oracle Extractable Value）相关方案，让协议回收部分清算价值。",
    chains: ["Ethereum", "EVM", "多链"],
    features: ["第一方数据源", "Airnode", "OEV 方案"],
    risks: ["数据提供方可用性", "集成/合约风险", "新市场流动性"],
    useCases: [
      { title: "第一方 API", description: "让数据提供方直接上链，减少中间层。" },
      { title: "OEV", description: "让协议回收部分清算价值。" },
      { title: "市场集成", description: "在 API3 Market 选择数据源和链。" },
    ],
    screenshot: {
      src: "/images/ecosystem/screens/api3.jpg",
      alt: "API3 Market 产品界面",
      caption: "API3 Market 产品界面",
      sourceLabel: "产品界面截图",
      sourceUrl: "https://market.api3.org/",
      kind: "wide",
    },
    officialUrl: "https://api3.org/",
    docsUrl: "https://docs.api3.org/",
    articleSlug: "oracle-guide-2026",
    color: "#7B3FE4",
  },
  {
    slug: "uma",
    name: "UMA",
    mark: "UMA",
    logo: "/images/ecosystem/uma.png",
    category: "oracle",
    type: "乐观预言机 / 争议解决",
    tagline: "用争议机制处理主观数据",
    summary:
      "UMA 的 Optimistic Oracle 允许提议者提交数据，在争议期内由代币持有者投票/争议解决。它适合事件结果、主观判断等非纯价格数据，但存在争议和延迟风险。",
    chains: ["Ethereum", "EVM", "多链"],
    features: ["乐观验证", "争议解决", "自定义数据请求"],
    risks: ["争议延迟", "投票激励/治理风险", "错误提议的最终性"],
    useCases: [
      { title: "预测市场与事件", description: "用乐观验证处理事件结果。" },
      { title: "保险与争议", description: "通过争议机制解决主观数据。" },
      { title: "非纯价格数据", description: "适合需要人类判断/争议的场景。" },
    ],
    screenshot: {
      src: "/images/ecosystem/screens/uma.jpg",
      alt: "UMA Optimistic Oracle 产品界面",
      caption: "UMA Optimistic Oracle 产品界面",
      sourceLabel: "产品界面截图",
      sourceUrl: "https://oracle.uma.xyz/",
      kind: "wide",
    },
    officialUrl: "https://uma.xyz/",
    docsUrl: "https://docs.uma.xyz/",
    articleSlug: "oracle-guide-2026",
    color: "#FF4A4A",
  },
]

export function getEcosystemBrand(
  category: string,
  slug: string,
): EcosystemBrand | undefined {
  return ecosystemBrands.find(
    (brand) => brand.category === category && brand.slug === slug,
  )
}

export function brandsByCategory(category: EcosystemCategory) {
  return ecosystemBrands.filter((brand) => brand.category === category)
}
