import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'RealCore Weihnachtsspende 2025 | Spenden statt Geschenke',
  description: 'Gemeinsam Gutes tun - Wählen Sie Ihre bevorzugte Spendenorganisation und nehmen Sie an unserem Weihnachtsgewinnspiel teil.',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <body className="font-sans antialiased">
        <div className="star-overlay" />
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  )
}
