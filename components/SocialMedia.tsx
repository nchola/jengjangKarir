'use client';

import { Instagram, Linkedin, MessageSquare, Mail, Phone } from "lucide-react";

export function SocialMedia({ className = "" }: { className?: string }) {
  const socialLinks = [
    {
      href: "https://instagram.com/jenjangkarir",
      icon: <Instagram size={16} />,
      label: "Instagram",
      bgColor: "bg-purple-600 hover:bg-purple-700"
    },
    {
      href: "https://linkedin.com/company/jenjangkarir",
      icon: <Linkedin size={16} />,
      label: "LinkedIn",
      bgColor: "bg-blue-600 hover:bg-blue-700"
    },
    {
      href: "https://t.me/jenjangkarir",
      icon: <MessageSquare size={16} />,
      label: "Telegram",
      bgColor: "bg-blue-500 hover:bg-blue-600"
    },
    {
      href: "mailto:info@jenjangkarir.id",
      icon: <Mail size={16} />,
      label: "Email",
      bgColor: "bg-pink-500 hover:bg-pink-600"
    },
    {
      href: "tel:+6281234567890",
      icon: <Phone size={16} />,
      label: "Phone",
      bgColor: "bg-green-500 hover:bg-green-600"
    }
  ];

  return (
    <div className={`flex space-x-3 ${className}`}>
      {socialLinks.map((link) => (
        <a
          key={link.label}
          href={link.href}
          className={`${link.bgColor} p-1.5 rounded-full text-white transition-colors`}
          aria-label={link.label}
          target="_blank"
          rel="noopener noreferrer"
        >
          {link.icon}
        </a>
      ))}
    </div>
  );
} 