const createNextIntlPlugin = require('next-intl/plugin')

// next-intl (App Router) — locale resolvido via cookie em i18n/request.ts.
// O bloco `i18n` legado do Pages Router foi removido (incompatível com App Router).
const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',

  async redirects() {
    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: true,
      },
      {
        source: '/android',
        destination: 'https://dl.textbee.dev',
        permanent: false,
      },
    ]
  },
}

module.exports = withNextIntl(nextConfig)
