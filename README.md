# 币圈指南（crypto-guide）

中文加密货币交易所评测 / 教程 / 工具站。前台为 Next.js App Router，内容存 PostgreSQL，后台提供文章、交易所、FAQ、资源、站点设置与点击统计管理。

线上地址：<https://bqzn.top>

## 技术栈

- Next.js 16（App Router / RSC / ISR）、React 19、TypeScript
- Tailwind CSS 4、Radix UI / shadcn 风格组件
- Prisma 6：生产 PostgreSQL，本地可用 SQLite
- 自托管签名 Cookie 会话（HMAC-SHA256），无第三方鉴权服务
- TipTap 富文本、Recharts 图表、zod 校验

## 本地开发

要求 Node.js >= 20.9。

```bash
npm ci
cp .env.example .env.local
```

在 `.env.local` 中至少填写：

```bash
DATABASE_URL="file:./dev.db"
AUTH_SECRET="$(openssl rand -base64 32)"
ADMIN_EMAIL="admin@bqzn.top"
ADMIN_PASSWORD="<至少 12 位，仅用于本地 seed>"
```

本地使用 SQLite 时，注意 `prisma.config.ts` 默认指向生产用的 `prisma/schema.postgres.prisma`，需要显式指定 SQLite schema：

```bash
npx prisma generate --schema prisma/schema.prisma
npx prisma db push --schema prisma/schema.prisma
npm run seed
npm run dev
```

打开 <http://localhost:3000>，后台在 <http://localhost:3000/admin/login>。

> 仓库不再包含默认管理员口令。`npm run seed` 只有在设置了 `ADMIN_PASSWORD` 时才会创建管理员，且不会覆盖已存在账号的密码。

## 环境变量

| 变量 | 必需 | 说明 |
|---|---|---|
| `DATABASE_URL` | 是 | PostgreSQL 连接串；本地可 `file:./dev.db` |
| `AUTH_SECRET` | 是 | 会话 Cookie 签名密钥，至少 32 字符；轮换后所有管理员会被登出 |
| `COINGECKO_API_KEY` | 否 | CoinGecko Demo key，提升行情接口限额 |
| `S3_ENDPOINT` / `S3_BUCKET` / `S3_ACCESS_KEY_ID` / `S3_SECRET_ACCESS_KEY` / `S3_PUBLIC_BASE_URL` / `S3_REGION` | 生产必需 | 媒体库对象存储（R2 / S3 / MinIO）。本地为空时回退到 `public/uploads` |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | 仅 seed/改密脚本 | 首次建号或轮换口令时使用，不要提交到仓库 |

完整示例见 [`.env.example`](./.env.example)。

## 常用脚本

| 命令 | 作用 |
|---|---|
| `npm run dev` | 本地开发 |
| `npm run build` | 生产构建 |
| `npm run start` | 启动生产构建 |
| `npm run lint` | ESLint |
| `npm run seed` | 填充种子数据（需 `ADMIN_PASSWORD`） |
| `npm run rotate-admin` | 直接改数据库中的管理员口令（`ADMIN_EMAIL` + `ADMIN_PASSWORD` + `DATABASE_URL`） |

轮换线上管理员口令：

```bash
ADMIN_EMAIL=admin@bqzn.top \
ADMIN_PASSWORD='<新口令>' \
DATABASE_URL='<生产连接串>' \
npm run rotate-admin
```

## 部署

- 托管在 Vercel，`main` 分支自动部署到 Production。
- Vercel 会执行 `npm run vercel-build`：`prisma generate && next build`，**构建期不再改数据库**。
- schema 变更走 migration：先备份，再在本地用 Neon 的 **direct（非 pooler）** 连接串执行 `npm run db:migrate`，确认后再合并/部署。
  ```bash
  # 1) 备份
  pg_dump "$DIRECT_URL" --no-owner --no-privileges -Fc -f backup.dump
  # 2) 应用 migration（DATABASE_URL 用 direct 连接串，去掉 -pooler）
  DATABASE_URL="$DIRECT_URL" npm run db:migrate
  # 3) 查看状态
  DATABASE_URL="$DIRECT_URL" npm run db:migrate:status
  ```
- 必需的生产环境变量：`DATABASE_URL`、`AUTH_SECRET`；媒体库还需要 `S3_*`。
- 媒体库使用 S3 兼容存储（推荐 Cloudflare R2）：
  - 建 bucket，创建 Object Read & Write 的 API Token；
  - 给 bucket 绑定公开自定义域（如 `cdn.bqzn.top`），或先用 `pub-xxx.r2.dev`；
  - 在 Vercel 配置 `S3_ENDPOINT`、`S3_BUCKET`、`S3_ACCESS_KEY_ID`、`S3_SECRET_ACCESS_KEY`、`S3_PUBLIC_BASE_URL`、`S3_REGION=auto`；
  - 未配置时生产上传返回 503，本地开发回退到 `public/uploads`。
- 域名：`bqzn.top`；`www` 需在 Vercel 项目中单独添加并配置跳转。

## 监控

- **健康检查**：`GET /api/health` 检查数据库连通性，正常返回 200，数据库异常返回 503（不缓存、不泄露配置）。
- **可用性告警**：`.github/workflows/uptime.yml` 每 15 分钟探测一次生产 `/api/health`；连续失败会在 GitHub Issues 创建/更新 `monitoring` 工单，恢复后自动关闭。
- **流量与性能**：根布局接入 Vercel Analytics / Speed Insights，需在 Vercel 项目里启用对应功能后生效。
- **服务端错误**：`src/instrumentation.ts` 的 `onRequestError` 会把错误以单行 JSON（`"type":"request_error"`）写入 Vercel Logs，方便检索/后续接 Sentry 或 Log Drain。

## 目录

```
src/app/(front)   前台页面
src/app/admin     后台
src/app/api       REST 接口（写接口统一走 auth() 会话校验）
src/lib/session   会话签发/校验（Edge + Node 通用）
src/lib/auth      服务端读取会话
prisma            schema、seed
scripts           数据导入、资源 slug、管理员改密
```

## 安全约定

- 不要提交 `.env*`（`.env.example` 除外）、数据库文件或任何密钥。
- 写接口必须先鉴权再解析请求体；新增接口请复用 `auth()`。
- 上线前确认 `AUTH_SECRET` 已配置；缺失时会话校验会 fail closed（后台不可登录），而不是放行。
