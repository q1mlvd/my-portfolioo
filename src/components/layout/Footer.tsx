"use client";

import { useTranslations } from "next-intl";
import { Github, Send, Linkedin, Code2 } from "lucide-react";

const socials = [
  { icon: Github, href: "https://github.com/q1mlvd", label: "GitHub" },
  { icon: Send, href: "https://t.me/q1mlvd", label: "Telegram" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/mykhailo-kravchuk-50a7813b5/", label: "LinkedIn" },
];

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="border-t border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#060a10]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
              <Code2 className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-space font-semibold text-gray-900 dark:text-white">
              MK<span className="text-blue-500">.</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            {socials.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="p-2 rounded-lg text-gray-500 dark:text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-500">
            © {new Date().getFullYear()} Mikhailo Kravchuk. {t("rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
