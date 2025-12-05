import type { Metadata, Viewport } from 'next'
import './globals.css'
import Providers from '@/components/Providers'

export const metadata: Metadata = {
  title: 'RealCore Weihnachtsspende 2025 | Spenden statt Geschenke',
  description: 'Gemeinsam Gutes tun - Wählen Sie Ihre bevorzugte Spendenorganisation und nehmen Sie an unserem Weihnachtsgewinnspiel teil.',
  icons: {
    icon: '/favicon.ico',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'RealCore Spenden',
  },
  formatDetection: {
    telephone: true,
    email: true,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: '#d4af37',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de" className="scroll-smooth">
      <body className="font-sans antialiased min-h-screen min-h-[100dvh]">
        <Providers>
          <div className="star-overlay" />
          <div className="relative z-10">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  )
}
