use sqlx::SqlitePool;

pub async fn migrate(pool: &SqlitePool) -> anyhow::Result<()> {
    // 创建items表
    sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS t_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            link TEXT NOT NULL,
            created INTEGER NOT NULL
        )
        "#,
    )
        .execute(pool)
        .await?;

    sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS t_cex (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            icon TEXT,
            bg_color TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        "#,
    )
        .execute(pool)
        .await?;

    sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS t_cex_msg (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            cex_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            created INTEGER NOT NULL,
            href TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        "#,
    )
        .execute(pool)
        .await?;

    sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS t_kol (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            avatar TEXT,
            description TEXT,
            url TEXT NOT NULL,
            platform TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        "#,
    )
        .execute(pool)
        .await?;
    // 创建 twitter 表
    sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS t_twitter (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            icon TEXT,
            bg_color TEXT,
            messages TEXT,
            created INTEGER NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        "#,
    )
        .execute(pool)
        .await?;

    sqlx::query(
        r#"
            CREATE TABLE IF NOT EXISTS t_binlog (
                id BIGINT PRIMARY KEY,
                plt VARCHAR(50) NOT NULL,
                name VARCHAR(100) NOT NULL,
                img TEXT NULL,
                account VARCHAR(100) NOT NULL,
                social VARCHAR(255) NOT NULL,
                remark TEXT NULL,
                created BIGINT NOT NULL,
                updated BIGINT NOT NULL,
                yn INT NOT NULL,
                state INT NOT NULL
            )
            "#,
    )
        .execute(pool)
        .await?;
    // 初始化所有表的数据
    init_cex_data(pool).await?;
    init_cex_msg_data(pool).await?;
    init_kol_data(pool).await?;
    init_twitter_data(pool).await?;
    init_binlog_data(pool).await?;
    Ok(())
}

/// 初始化 CEX 数据
async fn init_cex_data(pool: &SqlitePool) -> anyhow::Result<()> {
    // 检查是否已有数据
    let count: i64 = sqlx::query_scalar("SELECT COUNT(*) FROM t_cex")
        .fetch_one(pool)
        .await?;

    // 如果表为空，则插入初始数据
    if count == 0 {
        let cexs = vec![
            (1, "Binance", "", "#fff7cc"),
            (2, "OKX", "", "#eaeaea"),
            (3, "Coinbase", "", "#e6f0ff"),
        ];

        for cex in cexs {
            sqlx::query(
                r#"
                INSERT INTO t_cex (id, name, icon, bg_color)
                VALUES (?, ?, ?, ?)
                "#,
            )
                .bind(cex.0)  // id
                .bind(cex.1)  // name
                .bind(cex.2)  // icon
                .bind(cex.3)  // bg_color
                .execute(pool)
                .await?;
        }
    }

    Ok(())
}

/// 初始化 CEX 消息数据
async fn init_cex_msg_data(pool: &SqlitePool) -> anyhow::Result<()> {
    // 检查是否已有数据
    let count: i64 = sqlx::query_scalar("SELECT COUNT(*) FROM t_cex_msg")
        .fetch_one(pool)
        .await?;

    // 如果表为空，则插入初始数据
    if count == 0 {
        // 获取当前时间
        let now = std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap()
            .as_secs() as i64;

        // CEX消息数据
        let cex_messages = vec![
            // Binance消息
            (1, 1, "Binance 上线新交易对 XYZ/USDT，开盘涨幅超 12%", now - 5 * 60, "https://www.binance.com/"),
            (2, 1, "期货永续合约增加杠杆上限至 50x（部分标的）", now - 45 * 60, "https://www.binance.com/"),
            (3, 1, "公告：系统维护预计在 2 小时内完成，现货交易不受影响", now - 2 * 60 * 60, "https://www.binance.com/"),
            (4, 1, "研究院发布季度报告：交易深度与流动性回升", now - 6 * 60 * 60, "https://research.binance.com/"),
            // OKX消息
            (5, 2, "OKX Earn 上线新理财产品，年化最高 8%", now - 10 * 60, "https://www.okx.com/"),
            (6, 2, "Jumpstart 第 28 期申购将于明日开启", now - 3 * 60 * 60, "https://www.okx.com/"),
            (7, 2, "钱包新增对某公链生态 DApp 的一键连接", now - 26 * 60 * 60, "https://www.okx.com/wallet"),
            // Coinbase消息
            (8, 3, "Coinbase 推出机构托管新功能，提升风控与审计", now - 15 * 60, "https://www.coinbase.com/"),
            (9, 3, "Base 链上周活跃用户数创新高", now - 5 * 60 * 60, "https://base.org/"),
            (10, 3, "与某支付服务合作扩展合规购币通道", now - 30 * 60 * 60, "https://www.coinbase.com/"),
        ];

        // 插入CEX消息数据
        for msg in cex_messages {
            sqlx::query(
                r#"
                INSERT INTO t_cex_msg (id, cex_id, title, created, href)
                VALUES (?, ?, ?, ?, ?)
                "#,
            )
                .bind(msg.0)  // id
                .bind(msg.1)  // cex_id
                .bind(msg.2)  // title
                .bind(msg.3)  // created
                .bind(msg.4)  // href
                .execute(pool)
                .await?;
        }
    }

    Ok(())
}

/// 初始化 KOL 数据
async fn init_kol_data(pool: &SqlitePool) -> anyhow::Result<()> {
    // 检查是否已有数据
    let count: i64 = sqlx::query_scalar("SELECT COUNT(*) FROM t_kol")
        .fetch_one(pool)
        .await?;

    // 如果表为空，则插入初始数据
    if count == 0 {
        let kols = vec![
            (1, "CZ_Binance", "", "Binance 创始人，行业观点与合规进展", "https://twitter.com/cz_binance", "twitter"),
            (2, "OKX_Official", "", "OKX 官方资讯与活动", "https://twitter.com/okx", "twitter"),
            (3, "Coinbase", "", "Coinbase 官方账号与 Base 生态动态", "https://twitter.com/coinbase", "twitter"),
            (4, "r/CryptoCurrency", "", "最大加密 Reddit 社区，热点讨论", "https://reddit.com/r/CryptoCurrency", "reddit"),
        ];

        for kol in kols {
            sqlx::query(
                r#"
                INSERT INTO t_kol (id, name, avatar, description, url, platform)
                VALUES (?, ?, ?, ?, ?, ?)
                "#,
            )
                .bind(kol.0)  // id
                .bind(kol.1)  // name
                .bind(kol.2)  // avatar
                .bind(kol.3)  // description
                .bind(kol.4)  // url
                .bind(kol.5)  // platform
                .execute(pool)
                .await?;
        }
    }

    Ok(())
}
/// 初始化 twitter 数据
async fn init_twitter_data(pool: &SqlitePool) -> anyhow::Result<()> {
    // 检查是否已有数据
    let count: i64 = sqlx::query_scalar("SELECT COUNT(*) FROM t_twitter")
        .fetch_one(pool)
        .await?;

    // 如果表为空，则插入初始数据
    if count == 0 {
        // 获取当前时间戳
        let now = std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap()
            .as_secs() as i64;

        let twitters = vec![
            (1, "CZ_Binance", "🧢", "#e6f0ff", "推出新合规举措，强调用户资产透明化", now - 5 * 60),
            (2, "OKX_Official", "⚫", "#eaeaea", "Jumpstart 项目预热，社区 AMA 本周进行", now - 12 * 60),
            (3, "coinbase", "🔵", "#e6f0ff", "Base 生态开发者大会倒计时 7 天", now - 25 * 60),
            (4, "gate_official", "🔺", "#fff0f5", "新 Launchpad 报名即将开启，规则公布", now - 40 * 60),
        ];

        for twitter in twitters {
            sqlx::query(
                r#"
                INSERT INTO t_twitter (id, name, icon, bg_color, messages, created)
                VALUES (?, ?, ?, ?, ?, ?)
                "#,
            )
                .bind(twitter.0)  // id
                .bind(twitter.1)  // name
                .bind(twitter.2)  // icon
                .bind(twitter.3)  // bg_color
                .bind(twitter.4)  // messages
                .bind(twitter.5)  // created
                .execute(pool)
                .await?;
        }
    }

    Ok(())
}
/// 初始化 binlog 数据
pub async fn init_binlog_data(pool: &SqlitePool) -> anyhow::Result<()> {
    let count: i64 = sqlx::query_scalar("SELECT COUNT(*) FROM t_binlog")
        .fetch_one(pool)
        .await?;

    if count == 0 {
        let now = std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)?
            .as_secs() as i64;

        let binlogs = vec![
            (1, "twitter", "Thomas Lee", None, "fundstrat", "https://x.com/fundstrat", None, now - 3600, now - 3600, 0, 1),
            (2, "twitter", "CZ_Binance", Some("https://img.com/cz.png"), "cz_binance", "https://twitter.com/cz_binance", Some("Binance 创始人"), now - 1800, now - 1800, 0, 1),
            (3, "telegram", "CryptoWhale", None, "cryptowhale", "https://t.me/cryptowhale", Some("市场消息推送"), now - 600, now - 600, 0, 1),
        ];

        for log in binlogs {
            sqlx::query(
                r#"
                INSERT INTO t_binlog (id, plt, name, img, account, social, remark, created, updated, yn, state)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                "#,
            )
                .bind(log.0)
                .bind(log.1)
                .bind(log.2)
                .bind(log.3)
                .bind(log.4)
                .bind(log.5)
                .bind(log.6)
                .bind(log.7)
                .bind(log.8)
                .bind(log.9)
                .bind(log.10)
                .execute(pool)
                .await?;
        }
    }

    Ok(())
}
