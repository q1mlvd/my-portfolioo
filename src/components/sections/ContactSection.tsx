"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Send, Github, Linkedin, CheckCircle2, Mail, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { MathCaptcha } from "@/components/ui/MathCaptcha";

const socials = [
  {
    icon: Send,
    label: "Telegram",
    handle: "@q1mlvd",
    href: "https://t.me/q1mlvd",
    color: "hover:text-blue-400 hover:border-blue-500/40",
  },
  {
    icon: Github,
    label: "GitHub",
    handle: "q1mlvd",
    href: "https://github.com/q1mlvd",
    color: "hover:text-gray-200 hover:border-gray-500/40",
  },
  {
    icon: Mail,
    label: "Email",
    handle: "mishakravhuk@gmail.com",
    href: "mailto:mishakravhuk@gmail.com",
    color: "hover:text-violet-400 hover:border-violet-500/40",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    handle: "mykhailo-kravchuk",
    href: "https://www.linkedin.com/in/mykhailo-kravchuk-50a7813b5/",
    color: "hover:text-blue-500 hover:border-blue-600/40",
  },
];

export function ContactSection() {
  const t = useTranslations("contact");
  const [form, setForm] = useState({ name: "", contact: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [captchaOk, setCaptchaOk] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    if (!captchaOk) return;
    try {
      const res = await fetch("/api/send-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("sent");
      setForm({ name: "", contact: "", message: "" });
      setCaptchaOk(false);
      setTimeout(() => setStatus("idle"), 4000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  return (
    <section id="contact" className="py-24 bg-gray-50 dark:bg-[#060a10] relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-violet-500/5 dark:from-blue-500/5 dark:to-violet-500/5" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-blue-500 dark:text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3 block">
            Contact
          </span>
          <h2 className="font-space text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {t("title")}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg">{t("subtitle")}</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    {t("name_label")}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={t("name_placeholder")}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 transition-colors text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    {t("contact_label")}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={t("contact_placeholder")}
                    value={form.contact}
                    onChange={(e) => setForm({ ...form, contact: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 transition-colors text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  {t("message_label")}
                </label>
                <textarea
                  required
                  rows={6}
                  placeholder={t("message_placeholder")}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 transition-colors text-sm resize-none"
                />
              </div>

              <MathCaptcha onVerify={setCaptchaOk} />

              <button
                type="submit"
                disabled={status === "sending" || !captchaOk}
                className={cn(
                  "w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200",
                  status === "sent"
                    ? "bg-emerald-500 text-white"
                    : status === "error"
                    ? "bg-red-500 text-white"
                    : captchaOk
                    ? "bg-blue-500 hover:bg-blue-600 text-white hover:shadow-lg hover:shadow-blue-500/25"
                    : "bg-white/5 text-gray-500 cursor-not-allowed border border-white/10",
                  status === "sending" && "opacity-70 cursor-not-allowed"
                )}
              >
                {status === "sent" ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    {t("success")}
                  </>
                ) : status === "sending" ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {t("sending")}
                  </>
                ) : status === "error" ? (
                  <>
                    <AlertCircle className="w-4 h-4" />
                    {t("error")}
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    {t("send_button")}
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center"
          >
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-6 text-center lg:text-left">
              {t("or")}
            </p>
            <div className="grid grid-cols-2 gap-3">
              {socials.map(({ icon: Icon, label, handle, href, color }, i) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.03, y: -2 }}
                  className={cn(
                    "group flex flex-col items-center gap-3 p-5 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 transition-all duration-300",
                    color
                  )}
                >
                  <Icon className="w-6 h-6 text-gray-400 group-hover:scale-110 transition-all" />
                  <div className="text-center">
                    <div className="font-medium text-gray-900 dark:text-white text-sm">{label}</div>
                    <div className="text-gray-500 dark:text-gray-500 text-xs mt-0.5">{handle}</div>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
