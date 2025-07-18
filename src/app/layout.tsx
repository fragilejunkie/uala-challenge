import type { Metadata } from 'next'
import { Public_Sans } from 'next/font/google'
import 'react-day-picker/style.css'
import './globals.css'

const publicSans = Public_Sans({
  variable: '--font-public-sans',
  subsets: ['latin', 'latin-ext'],
})

export const metadata: Metadata = {
  title: 'Ualá Web Dev Challenge',
  description:
    'En este challenge, se debe desarrollar una aplicación web de cobros online que permita a los usuarios visualizar, filtrar y exportar sus transacciones utilizando NextJs',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${publicSans.variable}`}>{children}</body>
    </html>
  )
}
