import '../scss/global.scss';
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })


export const metadata = {
  title: 'making things happen',
  description: 'Developed by Anurag',
}

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width,
	user-scalable=no" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
