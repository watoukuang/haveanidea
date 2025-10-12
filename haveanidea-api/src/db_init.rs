use sqlx::SqlitePool;
use std::fs;

pub async fn init_database(pool: &SqlitePool) -> Result<(), sqlx::Error> {
    // 读取并执行迁移文件
    let migration_sql = fs::read_to_string("migrations/001_initial.sql")
        .expect("Failed to read migration file");

    // 分割SQL语句并执行
    for statement in migration_sql.split(';') {
        let statement = statement.trim();
        if !statement.is_empty() {
            sqlx::query(statement).execute(pool).await?;
        }
    }

    // 插入一些示例数据
    insert_sample_data(pool).await?;

    println!("Database initialized successfully");
    Ok(())
}

async fn insert_sample_data(pool: &SqlitePool) -> Result<(), sqlx::Error> {
    // 检查是否已有数据
    let count: i64 = sqlx::query_scalar("SELECT COUNT(*) FROM ideas")
        .fetch_one(pool)
        .await?;

    if count > 0 {
        return Ok(());
    }

    // 创建示例用户
    let user_result = sqlx::query!(
        "INSERT INTO users (wallet_address, username) VALUES (?1, ?2)",
        "0x1234567890abcdef1234567890ABCDEF12345678",
        "Demo User"
    )
    .execute(pool)
    .await?;

    let user_id = user_result.last_insert_rowid();

    // 创建示例想法
    let ideas = vec![
        (
            "SOL SZN",
            "Blockchain-verified business card system for Web3 professionals",
            "🪪",
            "#e8f0ff",
            "NFT Ideas",
            "nft",
            "eth",
            "blockchain,nft,business"
        ),
        (
            "Pump It Hard",
            "Growth hacking platform with tokenized rewards",
            "🚀",
            "#eefde7",
            "Free Ideas",
            "free",
            "eth",
            "growth,rewards,token"
        ),
        (
            "Loan Agreement",
            "Smart contract template generator with NFT certificates",
            "📄",
            "#fff7e6",
            "NFT Ideas",
            "nft",
            "sol",
            "smartcontract,legal,nft"
        ),
        (
            "NTO",
            "Real-world asset tokenization for invoice clearing",
            "🧾",
            "#f1f5f9",
            "NFT Ideas",
            "nft",
            "polygon",
            "rwa,tokenization,finance"
        ),
        (
            "SOLCAR",
            "Ride-sharing loyalty points on blockchain",
            "🚗",
            "#e6f7ff",
            "Free Ideas",
            "free",
            "bsc",
            "rideshare,loyalty,blockchain"
        ),
        (
            "MLO",
            "Medical equipment rental marketplace with verified ownership",
            "🏥",
            "#f0fdf4",
            "Free Ideas",
            "free",
            "polygon",
            "medical,rental,marketplace"
        ),
        (
            "Memeland",
            "Meme generator with NFT ownership and royalties",
            "🧸",
            "#fff1f2",
            "Trending",
            "nft",
            "sol",
            "meme,nft,royalties"
        ),
        (
            "Green Fund",
            "Sustainable investment tracking with carbon credit NFTs",
            "🌱",
            "#ecfeff",
            "NFT Ideas",
            "nft",
            "eth",
            "sustainability,carbon,investment"
        ),
    ];

    for (name, description, icon, bg_color, category, idea_type, chain, tags) in ideas {
        let messages = format!(
            r#"[{{"title": "{}", "created": {}, "href": "#"}}]"#,
            description,
            chrono::Utc::now().timestamp()
        );

        let launch_params = if idea_type == "nft" {
            Some(r#"{"priceEth": 0.1, "fundingGoalEth": 10, "revenueSharePct": 10, "contacts": {"twitter": "@example", "discord": "example#1234", "telegram": "@example"}}"#)
        } else {
            None
        };

        sqlx::query!(
            "INSERT INTO ideas (name, description, icon, bg_color, category, idea_type, chain, tags, messages, launch, creator_id, deployer) 
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12)",
            name,
            description,
            icon,
            bg_color,
            category,
            idea_type,
            chain,
            tags,
            messages,
            launch_params,
            user_id,
            "0x1234567890abcdef1234567890ABCDEF12345678"
        )
        .execute(pool)
        .await?;
    }

    println!("Sample data inserted successfully");
    Ok(())
}
