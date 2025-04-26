import { Metadata } from 'next'

export const revalidate = 3600 // Revalidate every hour

export const metadata: Metadata = {
  title: 'Detail Lowongan | JenjangKarir',
  description: 'Informasi detail lowongan kerja',
}

export default function JobDetailLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 