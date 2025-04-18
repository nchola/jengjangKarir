'use client';

import dynamic from 'next/dynamic';
import { Text3DProps } from './Text3D';

const Text3DScene = dynamic<Text3DProps>(() => import('./Text3D'), {
  ssr: false,
  loading: () => <div className="w-[600px] h-[400px] bg-[#0E0E1A] rounded-lg" />
});

export default Text3DScene; 