import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document';
import React from 'react';

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render(): React.ReactElement {
    return (
      <Html lang="zh-CN">
        <Head>
          <meta charSet="utf-8"/>
          <meta name="description"
                content="挖头矿 - 币圈热点消息聚合平台，实时追踪链上动向，AI 智能分析助你快速掌握市场动态。"/>
          <meta name="keywords"
                content="挖头矿, 币圈热点, 加密货币新闻, 区块链资讯, AI分析, WEB3工具, ETH, BTC, SOL, BNB, Crypto Trends"/>
          <meta name="author" content="挖头矿团队"/>

          <meta property="og:title" content="挖头矿 - 币圈热点追踪与 AI 智能分析平台"/>
          <meta property="og:description"
                content="整合币圈最新资讯，结合 AI 提供深度解读，还提供实用 Web3 工具，帮你看懂市场、抓住机会。"/>
          <meta property="og:type" content="website"/>
          <meta property="og:site_name" content="挖头矿 | Crypto 热点聚合 + AI 分析"/>
          <meta property="og:image" content="/og-image.jpg"/>

          <link rel="icon" href="/favicon.svg" type="image/svg+xml"/>
          <link rel="alternate icon" href="/favicon.ico"/>
          <link rel="preconnect" href="https://fonts.googleapis.com"/>
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
                rel="stylesheet"/>
          
          {/* 预加载主题脚本 - 避免闪烁 */}
          <script src="/js/theme-script.js" />
        </Head>
        <body>
          <Main/>
          <NextScript/>
        </body>
      </Html>
    );
  }
}

export default MyDocument;
