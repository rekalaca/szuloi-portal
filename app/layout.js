import './globals.css';

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'Széchenyi István Technikum - 11. D Osztálypénz és Szülői Portál',
  description: 'A Nyíregyházi SZC Széchenyi István Technikum és Kollégium 11. D osztályának zárt szülői portálja.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true
    }
  },
  openGraph: {
    title: 'Széchenyi István Technikum - 11. D Osztálypénz és Szülői Portál',
    description: 'Nyíregyházi SZC Széchenyi István Technikum és Kollégium 11. D osztály szülői portálja.',
    images: [
      {
        url: '/share.png',
        width: 1200,
        height: 630,
        alt: 'Széchenyi 11. D Szülői Portál'
      }
    ],
    type: 'website',
    locale: 'hu_HU'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Széchenyi István Technikum - 11. D Osztálypénz és Szülői Portál',
    description: 'Nyíregyházi SZC Széchenyi István Technikum és Kollégium 11. D osztály szülői portálja.',
    images: ['/share.png']
  },
  icons: {
    icon: '/icon.png',
    apple: '/icon.png'
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="hu" data-theme="dark" suppressHydrationWarning>
      <head>
        <meta name="robots" content="noindex, nofollow, noarchive, nosnippet" />
        <meta name="googlebot" content="noindex, nofollow, noarchive, nosnippet" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <div className="app-container">
          {children}
        </div>
      </body>
    </html>
  );
}
