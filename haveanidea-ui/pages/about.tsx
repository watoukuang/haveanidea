import React from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';

export default function About(): React.ReactElement {
    return (
        <Layout>
            <div className="relative overflow-hidden">
                {/* 背景装饰 */}
                <div className="pointer-events-none absolute inset-0 -z-10">
                    <div
                        className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-gradient-to-br from-sky-500/10 to-violet-500/10 blur-3xl"/>
                    <div
                        className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-gradient-to-tr from-emerald-500/10 to-indigo-500/10 blur-3xl"/>
                </div>

                <div className="container px-4 md:px-6 py-10 md:py-14">
                    {/* 英雄区 */}
                    <header className="text-center mb-8 md:mb-12">
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">About HAVE AN IDEA</h1>
                        <p className="mt-3 text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                            A blockchain platform for protecting and monetizing personal inspirations. Every idea can be verified, owned, traded, and collaborated on.
                        </p>
                    </header>

                    {/* 愿景卡片 */}
                    <section className="mb-10 md:mb-12">
                        <div
                            className="relative p-5 md:p-7 rounded-2xl border border-gray-200/60 bg-white/80 backdrop-blur dark:bg-[#15161a]/80 dark:border-[#2a2c31]">
                            <div className="absolute right-6 top-6 h-20 w-20 rounded-full bg-violet-500/10 blur-2xl"/>
                            <h2 className="text-lg md:text-xl font-bold mb-3">Our Vision</h2>
                            <div
                                className="space-y-3 text-sm md:text-[15px] text-gray-700 dark:text-gray-300 leading-7">
                                <p>
                                    Every brilliant idea deserves protection and the chance to flourish. We're building a blockchain platform where inspirations are timestamped, verified, and transformed into tradeable assets.
                                </p>
                                <p>
                                    Through NFT technology, creators can establish ownership, monetize their concepts, and collaborate with others while maintaining provable authorship of their original ideas.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* 我们做什么 */}
                    <section className="mb-10 md:mb-12">
                        <h2 className="text-lg md:text-xl font-bold mb-4">What We Do</h2>
                        <div className="grid gap-4 md:gap-5 md:grid-cols-3">
                            <div
                                className="p-4 rounded-xl border border-gray-200 bg-white dark:bg-[#1a1b1e] dark:border-[#2a2c31]">
                                <div className="mb-2 text-violet-500">🔐</div>
                                <h3 className="font-semibold mb-1">Blockchain Verification</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Timestamp and verify your ideas on-chain for immutable proof of creation.</p>
                            </div>
                            <div
                                className="p-4 rounded-xl border border-gray-200 bg-white dark:bg-[#1a1b1e] dark:border-[#2a2c31]">
                                <div className="mb-2 text-indigo-500">💎</div>
                                <h3 className="font-semibold mb-1">NFT Monetization</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Transform your ideas into tradeable NFTs with custom pricing and metadata.</p>
                            </div>
                            <div
                                className="p-4 rounded-xl border border-gray-200 bg-white dark:bg-[#1a1b1e] dark:border-[#2a2c31]">
                                <div className="mb-2 text-emerald-500">🤝</div>
                                <h3 className="font-semibold mb-1">Collaboration Hub</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Connect with other creators to build upon verified ideas and share revenue.</p>
                            </div>
                        </div>
                    </section>

                    {/* 核心价值观 */}
                    <section className="mb-10 md:mb-12">
                        <h2 className="text-lg md:text-xl font-bold mb-4">Core Values</h2>
                        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                            <div
                                className="p-4 rounded-xl border border-gray-200 bg-white dark:bg-[#1a1b1e] dark:border-[#2a2c31]">
                                <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                                    <li className="flex items-start gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-violet-500"/> Creator Ownership</li>
                                    <li className="flex items-start gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-sky-500"/> Transparent Verification</li>
                                    <li className="flex items-start gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-emerald-500"/> Fair Monetization</li>
                                </ul>
                            </div>
                            <div
                                className="p-4 rounded-xl border border-gray-200 bg-white dark:bg-[#1a1b1e] dark:border-[#2a2c31]">
                                <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                                    <li className="flex items-start gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-amber-500"/> Decentralized Innovation</li>
                                    <li className="flex items-start gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-pink-500"/> Community-Driven Growth</li>
                                    <li className="flex items-start gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-cyan-500"/> Sustainable Economics</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* 号召行动 */}
                    <section className="text-center mb-6 md:mb-8">
                        <h2 className="text-xl font-semibold mb-2">Start Protecting Your Ideas</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 max-w-2xl mx-auto">
                            Whether you're an inventor, creator, or entrepreneur, your ideas deserve protection and the chance to generate value.
                        </p>
                        <div className="flex items-center justify-center gap-3">
                            <Link href="/"
                                  className="px-4 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 dark:bg-[#1a1b1e] dark:border-[#2a2c31]">Explore</Link>
                            <Link href="/subscribe"
                                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-lime-500 text-white shadow-sm hover:opacity-90 transition-opacity dark:from-emerald-400 dark:to-lime-400">Subscribe</Link>
                        </div>
                    </section>

                    {/* 联系方式 */}
                    <div
                        className="mt-6 p-4 md:p-5 rounded-2xl border border-gray-200 bg-white dark:bg-[#1a1b1e] dark:border-[#2a2c31]">
                        <h3 className="font-semibold mb-2">Contact Us</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            For partnerships, submissions, or corrections, email
                            <a className="ml-1 text-blue-600 dark:text-sky-400 underline"
                               href="mailto:hello@watoukuang.com">hello@watoukuang.com</a>
                        </p>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
