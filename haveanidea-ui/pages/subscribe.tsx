import React, { useState } from 'react';
import Layout from '../components/Layout';

export default function Subscribe(): React.ReactElement {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: hook up real API later
    setSubmitted(true);
  };

  return (
    <Layout>
      <div className="container px-4 md:px-6 py-8">
        <div className="max-w-xl">
          <h1 className="text-2xl md:text-3xl font-bold mb-3">订阅最新更新</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            订阅我们的 Newsletter，第一时间获取热门智能体、精选榜单与产品上新。
          </p>

          {submitted ? (
            <div className="p-4 rounded-xl border border-green-200 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800">
              订阅成功！我们会将最新资讯发送到你的邮箱：{email}
            </div>
          ) : (
            <form onSubmit={onSubmit} className="flex gap-2 md:gap-3">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="输入邮箱地址"
                type="email"
                required
                className="flex-1 px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-[#1e1e1e] dark:border-[#2d2d30] dark:text-gray-100 dark:placeholder-gray-500 dark:focus:ring-sky-500"
              />
              <button type="submit" className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-lime-500 text-white shadow-sm hover:opacity-90 transition-opacity dark:from-emerald-400 dark:to-lime-400">
                订阅
              </button>
            </form>
          )}

          <p className="mt-6 text-xs text-gray-500 dark:text-gray-400">
            我们尊重你的隐私，仅用于发送与挖头矿产品更新相关的邮件。
          </p>
        </div>
      </div>
    </Layout>
  );
}
