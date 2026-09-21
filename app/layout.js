import './globals.css';

export const metadata = {
  title: 'Széchenyi István Technikum - 11. D Osztálypénz és Szülői Portál',
  description: 'A Nyíregyházi SZC Széchenyi István Technikum és Kollégium 11. D osztályának hivatalos szülői portálja. 2. tanév Banki elszámolás, hírek és SZMK kapcsolat.',
  openGraph: {
    title: 'Széchenyi István Technikum - 11. D Osztálypénz és Szülői Portál',
    description: 'Nyíregyházi SZC Széchenyi István Technikum és Kollégium 11. D osztály hivatalos szülői portálja.',
    images: ['/share.png'],
    type: 'website',
    locale: 'hu_HU'
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
