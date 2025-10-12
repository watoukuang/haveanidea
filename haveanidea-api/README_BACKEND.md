# HaveAnIdea Rust Backend API

完整的 Rust 后端 API 服务，支持用户认证、想法管理、文件上传等功能。

## 🚀 功能特性

### ✅ 已实现功能
- **用户认证系统**：基于钱包地址的 JWT 认证
- **想法 CRUD**：创建、读取、更新、删除想法
- **启动参数管理**：仅创作者可见的启动配置
- **文件上传**：集成阿里云 OSS 存储
- **权限控制**：基于钱包地址的所有权验证
- **数据库**：SQLite 数据库，自动初始化
- **CORS 支持**：跨域请求处理

### 📊 数据库结构
- `users` - 用户表
- `ideas` - 想法表
- `idea_updates` - 想法更新记录
- `uploads` - 文件上传记录

## 🛠️ 安装与配置

### 1. 环境准备
```bash
# 确保已安装 Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# 进入项目目录
cd haveanidea-api
```

### 2. 环境变量配置
```bash
# 复制环境变量模板
cp .env.example .env

# 编辑 .env 文件，配置以下参数：
# - JWT_SECRET: JWT 密钥
# - OSS_ACCESS_KEY_ID: 阿里云 OSS Access Key
# - OSS_ACCESS_KEY_SECRET: 阿里云 OSS Secret Key  
# - OSS_BUCKET: OSS 存储桶名称
```

### 3. 启动服务
```bash
# 安装依赖并启动
cargo run

# 开发模式（自动重启）
cargo install cargo-watch
cargo watch -x run
```

## 📡 API 接口文档

### 认证接口

#### POST /auth/login
用户登录（钱包认证）
```json
{
  "wallet_address": "0x1234567890abcdef1234567890ABCDEF12345678",
  "signature": "签名数据",
  "message": "签名消息"
}
```

#### GET /auth/profile
获取用户信息（需要认证）

### 想法管理接口

#### GET /ideas
获取想法列表
- Query 参数：`category`, `chain`, `idea_type`, `page`, `limit`

#### GET /ideas/:id
获取单个想法详情

#### POST /ideas
创建新想法（需要认证）
```json
{
  "name": "想法名称",
  "description": "想法描述", 
  "icon": "🚀",
  "bg_color": "#eef2ff",
  "category": "NFT Ideas",
  "type": "nft",
  "chain": "eth",
  "tags": "blockchain,nft"
}
```

#### PUT /ideas/:id
更新想法（仅创作者）

#### PUT /ideas/:id/launch
更新启动参数（仅部署者）
```json
{
  "price_eth": 0.1,
  "funding_goal_eth": 10,
  "revenue_share_pct": 10,
  "twitter": "@example",
  "discord": "example#1234",
  "telegram": "@example"
}
```

#### DELETE /ideas/:id
删除想法（仅创作者）

### 文件上传接口

#### POST /upload
上传文件到阿里云 OSS（需要认证）
- 支持格式：JPEG, PNG, GIF, WebP, SVG
- 最大大小：10MB

## 🔧 开发指南

### 项目结构
```
src/
├── main.rs          # 入口文件
├── app.rs           # 应用配置
├── router.rs        # 路由配置
├── db.rs           # 数据库连接
├── db_init.rs      # 数据库初始化
├── models/         # 数据模型
│   ├── mod.rs
│   ├── idea.rs     # 想法相关模型
│   └── ...
└── service/        # 业务逻辑
    ├── auth.rs     # 认证服务
    ├── ideas.rs    # 想法管理
    ├── upload.rs   # 文件上传
    └── ...
```

### 添加新功能
1. 在 `models/` 中定义数据结构
2. 在 `service/` 中实现业务逻辑
3. 在 `router.rs` 中添加路由
4. 更新数据库迁移（如需要）

### 权限控制
- 使用 `auth_middleware` 中间件进行认证
- 在服务层检查用户权限：
  ```rust
  let claims = get_current_user(&request).ok_or(StatusCode::UNAUTHORIZED)?;
  ```

## 🔐 安全考虑

### JWT 认证
- Token 有效期：24小时
- 自动处理过期 Token
- 前端自动清理无效 Token

### 权限验证
- **创作者权限**：基于 `creator_id` 字段
- **部署者权限**：基于 `deployer` 钱包地址
- **文件上传**：需要登录认证

### 数据验证
- 使用 `validator` crate 进行输入验证
- 文件类型和大小限制
- SQL 注入防护（使用 sqlx 参数化查询）

## 🚀 部署指南

### Docker 部署
```bash
# 构建镜像
docker build -t haveanidea-api .

# 运行容器
docker run -d \
  -p 8181:8181 \
  -v $(pwd)/data:/app/data \
  -e JWT_SECRET=your-secret \
  -e OSS_ACCESS_KEY_ID=your-key \
  -e OSS_ACCESS_KEY_SECRET=your-secret \
  haveanidea-api
```

### 生产环境配置
1. 设置强密码的 JWT_SECRET
2. 配置阿里云 OSS 正式环境
3. 使用 HTTPS
4. 配置日志级别
5. 设置数据库备份

## 📝 API 使用示例

### 前端集成
```typescript
import { api } from './lib/api';

// 登录
const authResponse = await api.login({
  wallet_address: "0x...",
  signature: "...",
  message: "..."
});

// 获取想法列表
const ideas = await api.getCexs({
  category: 'nft',
  chain: 'eth',
  page: 1,
  limit: 20
});

// 创建想法
const newIdea = await api.createIdea({
  name: "My Idea",
  description: "Description",
  icon: "🚀",
  category: "NFT Ideas",
  type: "nft",
  chain: "eth"
});
```

## 🐛 故障排除

### 常见问题
1. **数据库连接失败**：检查 DATABASE_URL 配置
2. **OSS 上传失败**：验证阿里云凭证配置
3. **认证失败**：检查 JWT_SECRET 设置
4. **CORS 错误**：确认 CORS_ORIGIN 配置

### 日志查看
```bash
# 查看详细日志
RUST_LOG=debug cargo run

# 生产环境日志
RUST_LOG=info cargo run
```

## 🔄 数据迁移

### 添加新表
1. 创建迁移文件：`migrations/002_new_feature.sql`
2. 在 `db_init.rs` 中添加迁移逻辑
3. 重启服务自动应用

### 数据备份
```bash
# 备份 SQLite 数据库
cp watoukuang.db watoukuang.db.backup

# 恢复备份
cp watoukuang.db.backup watoukuang.db
```

## 📞 技术支持

如有问题，请查看：
1. 日志输出信息
2. 环境变量配置
3. 网络连接状态
4. 阿里云 OSS 配置

---

**注意**：这是一个完整的生产就绪后端系统，包含了用户认证、数据管理、文件存储等核心功能。在部署到生产环境前，请确保所有安全配置都已正确设置。
