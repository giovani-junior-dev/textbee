import { PropsWithChildren } from 'react'
import '@/styles/main.css'
import { Metadata } from 'next'
import Footer from '@/components/shared/footer'
import { Toaster } from '@/components/ui/toaster'
import Analytics from '@/components/shared/analytics'
import { Session } from 'next-auth'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'

export const metadata: Metadata = {
  title: 'Wablast SMS - gateway de SMS - painel',

  metadataBase: new URL('https://wablastmessage.com'),
}

export default async function RootLayout({ children }: PropsWithChildren) {
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <main>{children}</main>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
