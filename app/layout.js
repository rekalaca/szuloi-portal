import './globals.css';

export const metadata = {
  metadataBase: new URL('https://szuloi-portal.vercel.app'),
  title: 'Széchenyi István Technikum - 11. D Osztálypénz és Szülői Portál',
  description: 'A Nyíregyházi SZC Széchenyi István Technikum és Kollégium 11. D osztályának zárt szülői portálja. Osztálypénz elszámolás, hírek és SZMK kapcsolat.',
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
    url: 'https://szuloi-portal.vercel.app',
    siteName: 'Széchenyi 11. D Szülői Portál',
    images: [
      {
        url: 'https://szuloi-portal.vercel.app/share.png',
        secureUrl: 'https://szuloi-portal.vercel.app/share.png',
        width: 1200,
        height: 630,
        alt: 'Széchenyi 11. D Szülői Portál',
        type: 'image/png'
      }
    ],
    type: 'website',
    locale: 'hu_HU'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Széchenyi István Technikum - 11. D Osztálypénz és Szülői Portál',
    description: 'Nyíregyházi SZC Széchenyi István Technikum és Kollégium 11. D osztály szülői portálja.',
    images: ['https://szuloi-portal.vercel.app/share.png']
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
        <meta property="og:image" content="https://szuloi-portal.vercel.app/share.png" />
        <meta property="og:image:secure_url" content="https://szuloi-portal.vercel.app/share.png" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:url" content="https://szuloi-portal.vercel.app/" />
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
