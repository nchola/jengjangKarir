'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const ServiceBanner = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-teal-500 p-6 shadow-lg"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      
      {/* Content */}
      <div className="relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Text content */}
          <div className="flex-1 space-y-4">
            <h3 className="text-2xl font-bold text-white">
              Butuh Bantuan IT Profesional?
            </h3>
            <p className="text-indigo-100 max-w-md">
              Kami menyediakan layanan IT terbaik untuk bisnis Anda. Dari pengembangan web hingga konsultasi teknologi, kami siap membantu.
            </p>
            <ul className="grid grid-cols-2 gap-2 text-sm text-indigo-100">
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-teal-300" />
                Web Development
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-teal-300" />
                Mobile Apps
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-teal-300" />
                UI/UX Design
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-teal-300" />
                IT Consulting
              </li>
            </ul>
          </div>

          {/* CTA Button */}
          <Link 
            href="/services"
            className="group flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-indigo-600 transition-all hover:bg-indigo-50 hover:shadow-md"
          >
            <span className="font-medium">Lihat Layanan</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
      <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/10" />
    </motion.div>
  );
};

export default ServiceBanner; 