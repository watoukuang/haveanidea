import React from 'react';
import Layout from '../components/Layout';
import KolsGrid from '../components/KolsGrid';
import { api } from '../lib/api';
import { KolItem } from '../types';

export default function AiAgents(): React.ReactElement {
  const [items, setItems] = React.useState<KolItem[]>([]);
  React.useEffect(() => {
    let ignore = false;
    api.getKols().then((data) => { if (!ignore) setItems(data || []); }).catch(() => { if (!ignore) setItems([]); });
    return () => { ignore = true; };
  }, []);
  return (
    <Layout>
      <div className="container px-4 md:px-6 py-4 pb-20 lg:pb-4">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight leading-tight mb-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 bg-clip-text text-transparent dark:from-sky-400 dark:via-indigo-400 dark:to-emerald-300 headline-glow">🚀 精选 KOL 索引</h1>
          <p className="text-[13.5px] md:text-base leading-relaxed max-w-2xl subtle-muted">Twitter、Reddit、YouTube 等平台的高质量账号索引，点击卡片直达主页。</p>
        </div>

        <KolsGrid items={items} platform="all" />
      </div>
    </Layout>
  );
}
