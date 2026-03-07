"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { ArrowRight, Download, BookOpen, FileText, Layers } from "lucide-react";

const posts = [
  {
    id: 1,
    title: "Building Scalable Telegram Bots with aiogram 3.x",
    excerpt:
      "A complete guide to architecting production-ready Telegram bots: middleware, FSM, payment integrations, and deployment with Docker.",
    tag: "Guide",
    readTime: "8 min",
    icon: BookOpen,
    gradient: "from-blue-500 to-cyan-500",
    href: "#",
  },
  {
    id: 2,
    title: "PostgreSQL Performance: Indexing Strategies That Actually Work",
    excerpt:
      "Deep dive into B-tree, GIN, and partial indexes. Learn when to use composite indexes and how to analyze query plans effectively.",
    tag: "Database",
    readTime: "12 min",
    icon: FileText,
    gradient: "from-violet-500 to-purple-500",
    href: "#",
  },
  {
    id: 3,
    title: "Next.js App Router: Advanced Patterns for Production",
    excerpt:
      "Server Components, streaming, parallel routes, and caching strategies for building high-performance Next.js applications at scale.",
    tag: "Next.js",
    readTime: "10 min",
    icon: Layers,
    gradient: "from-emerald-500 to-teal-500",
    href: "#",
  },
];

const leadMagnets = [
  {
    id: 1,
    title: "Telegram Bot Launch Checklist",
    description: "50-point checklist covering security, performance, and monetization for production bot releases.",
    format: "PDF + Notion",
    gradient: "from-blue-500/20 to-cyan-500/10",
    border: "border-blue-500/20",
  },
  {
    id: 2,
    title: "Database Schema Templates Pack",
    description: "10 battle-tested PostgreSQL schemas for SaaS, e-commerce, bots, and multi-tenant applications.",
    format: "SQL + Prisma",
    gradient: "from-violet-500/20 to-purple-500/10",
    border: "border-violet-500/20",
  },
  {
    id: 3,
    title: "Next.js Project Starter Pack",
    description: "Production-ready boilerplate with auth, i18n, dark mode, and CI/CD configuration pre-configured.",
    format: "GitHub Template",
    gradient: "from-emerald-500/20 to-teal-500/10",
    border: "border-emerald-500/20",
  },
];

export function BlogSection() {
  const t = useTranslations("blog");

  return (
    <section id="blog" className="py-24 bg-white dark:bg-[#0a0f1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-blue-500 dark:text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3 block">
            Knowledge
          </span>
          <h2 className="font-space text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {t("title")}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg">{t("subtitle")}</p>
        </motion.div>

        {/* Latest Posts */}
        <div className="mb-16">
          <h3 className="font-space text-xl font-semibold text-gray-900 dark:text-white mb-6">
            {t("latest_posts")}
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {posts.map((post, i) => {
              const Icon = post.icon;
              return (
                <Link key={post.id} href={post.href} className="block">
                  <motion.article
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -4 }}
                    className="group h-full p-6 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 hover:border-blue-500/30 transition-all duration-300 cursor-pointer"
                  >
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${post.gradient} flex items-center justify-center mb-4`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-medium text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded-full">
                        {post.tag}
                      </span>
                      <span className="text-xs text-gray-400">{post.readTime} read</span>
                    </div>
                    <h4 className="font-space font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors leading-snug">
                      {post.title}
                    </h4>
                    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-4">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-1 text-blue-500 dark:text-blue-400 text-sm font-medium">
                      {t("read_more")}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </motion.article>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Lead Magnets */}
        <div>
          <h3 className="font-space text-xl font-semibold text-gray-900 dark:text-white mb-6">
            {t("lead_magnets")}
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {leadMagnets.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className={`group p-5 rounded-2xl bg-gradient-to-br ${item.gradient} border ${item.border} cursor-pointer transition-all duration-300`}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs font-mono font-medium text-gray-500 dark:text-gray-500 bg-gray-100 dark:bg-black/30 px-2 py-0.5 rounded">
                    {item.format}
                  </span>
                  <Download className="w-4 h-4 text-gray-400 group-hover:text-blue-400 transition-colors" />
                </div>
                <h4 className="font-space font-semibold text-gray-900 dark:text-white mb-2">
                  {item.title}
                </h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
