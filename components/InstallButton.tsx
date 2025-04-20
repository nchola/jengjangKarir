'use client';

import { Button } from "@/components/ui/button";
import { usePWAInstall } from "@/hooks/usePWAInstall";

export function InstallButton() {
  const { isInstallable, isInstalled, install } = usePWAInstall();

  if (!isInstallable || isInstalled) return null;

  return (
    <Button 
      size="default"
      variant="outline" 
      className="bg-white/10 hover:bg-white/20 text-white border-white/20 w-full sm:w-auto flex items-center justify-center gap-2"
      onClick={install}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      Install App
    </Button>
  );
} 