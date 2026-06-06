import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const article = await prisma.article.findUnique({ 
    where: { slug: 'binance-registration-guide' } 
  });
  
  if (!article) {
    console.error('Article not found');
    return;
  }

  const rawContent = article.content;
  if (!rawContent) {
    console.error('Article content is empty');
    return;
  }
  let content = rawContent;

  // ===================================================================
  // 1. 第二步：创建账户 — 插入注册流程图
  // ===================================================================
  content = content.replace(
    '## 第二步：创建账户\n\n### 2.1 选择注册方式',
    `## 第二步：创建账户

![注册流程示意图](/images/articles/tutorial/binance-register-flow.svg "从填写信息到创建账户，5分钟完成注册")

### 2.1 选择注册方式`
  );

  // ===================================================================
  // 2. 第二步：2.3 步骤列表后 — 插入注册页面 + 邮箱验证截图
  // ===================================================================
  content = content.replace(
    '7. 点击【创建账户】\n\n> ✅ **完成后**',
    `7. 点击【创建账户】

![注册页面截图](/images/articles/screenshots/binance-register-real.png "在币安官网填写邮箱/手机和密码完成注册")

![邮箱验证截图](/images/articles/screenshots/binance-email-verification-real.png "输入邮箱中收到的6位验证码确认身份")

> ✅ **完成后**`
  );

  // ===================================================================
  // 3. 第三步：KYC 认证 — 插入 KYC 流程 SVG
  // ===================================================================
  content = content.replace(
    'KYC（Know Your Customer）是合规要求，完成后才能正常充值和交易。\n\n### 3.1 开始认证',
    `KYC（Know Your Customer）是合规要求，完成后才能正常充值和交易。

![KYC认证流程](/images/articles/tutorial/binance-kyc-flow.svg "身份认证从填写信息到审核通过共4步")

### 3.1 开始认证`
  );

  // ===================================================================
  // 4. 第三步：3.1 认证入口后 — 插入 KYC 入口 + 类型选择截图
  // ===================================================================
  content = content.replace(
    '2. 选择【个人认证】（个人用户选这个，企业用户选企业认证）\n\n### 3.2 认证流程',
    `2. 选择【个人认证】（个人用户选这个，企业用户选企业认证）

![KYC入口截图](/images/articles/screenshots/binance-account-menu-kyc-real.png "从用户中心进入身份认证")

![KYC类型选择截图](/images/articles/screenshots/binance-kyc-select-real.png "选择个人认证或企业认证")

### 3.2 认证流程`
  );

  // ===================================================================
  // 5. 第四步：安全设置 — 插入安全层级图 + 安全设置截图
  // ===================================================================
  content = content.replace(
    '**建议按以下优先级依次配置：**\n\n### 🥇 配置 1：开启两步验证（2FA）',
    `**建议按以下优先级依次配置：**

![安全设置层级图](/images/articles/tutorial/binance-security-stack.svg "从2FA到提现白名单，构建多层安全防护")

![安全设置界面截图](/images/articles/screenshots/binance-security-real.png "在安全设置中绑定Google验证器")

### 🥇 配置 1：开启两步验证（2FA）`
  );

  // ===================================================================
  // 6. 第四步：配置 4 后 — 插入安全检查截图
  // ===================================================================
  content = content.replace(
    '- 开启新设备登录确认\n\n---\n\n## 第五步：充值入金',
    `- 开启新设备登录确认

![安全检查确认截图](/images/articles/screenshots/binance-security-check-real.png "完成安全设置后进行最终确认")

---

## 第五步：充值入金`
  );

  // ===================================================================
  // 7. 第五步：C2C 入金 — 插入 C2C 流程 SVG
  // ===================================================================
  content = content.replace(
    '用自己的银行卡/支付宝直接买 USDT：\n\n1. 点击【买币】→ 【C2C交易】',
    `用自己的银行卡/支付宝直接买 USDT：

![C2C入金流程图](/images/articles/tutorial/binance-c2c-flow.svg "法币入金从下单到放币全流程")

1. 点击【买币】→ 【C2C交易】`
  );

  // ===================================================================
  // 8. 第五步：C2C 步骤后 — 插入买入入口 + P2P 商家列表截图
  // ===================================================================
  content = content.replace(
    '7. 等待商家放币（USDT 到账）\n\n**C2C 注意事项：**',
    `7. 等待商家放币（USDT 到账）

![买USD入口截图](/images/articles/screenshots/binance-buy-usd-entry-real.png "进入C2C买币页面，支持多种法币")

![买CNY入口截图](/images/articles/screenshots/binance-buy-cny-entry-real.png "支持银行卡、支付宝、微信支付")

![P2P商家列表截图](/images/articles/screenshots/binance-p2p-list-real.png "选择信誉度高、完成率好的认证商家")

**C2C 注意事项：**`
  );

  // ===================================================================
  // 保存更新
  // ===================================================================
  await prisma.article.update({
    where: { slug: 'binance-registration-guide' },
    data: { content },
  });

  console.log('✅ Article updated successfully with all images!');
  
  // Show a preview of the changes
  const updated = await prisma.article.findUnique({
    where: { slug: 'binance-registration-guide' },
    select: { content: true }
  });
  
  // Count images inserted
  const newContent = updated?.content ?? '';
  const oldContent = article.content ?? '';
  const imgCount = (newContent.match(/!\[/g) || []).length;
  const oldImgCount = (oldContent.match(/!\[/g) || []).length;
  console.log(`📸 Images: ${oldImgCount} → ${imgCount}`);
  console.log(`📝 Content length: ${oldContent.length} → ${newContent.length}`);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
