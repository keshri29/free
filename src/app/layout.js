import '../scss/global.scss';
import { Inter } from 'next/font/google'
import { SITE_URL, SITE_NAME } from '@/lib/blog/config'
import { buildWebsiteJsonLd, buildOrganizationJsonLd } from '@/lib/blog/seo'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — making things happen`,
    template: `%s | ${SITE_NAME}`,
  },
  description: 'Developed by Anurag — projects, writing, and articles on software engineering.',
}

export default function RootLayout({ children }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [buildWebsiteJsonLd(), buildOrganizationJsonLd()],
  };

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width,
	user-scalable=no" />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
