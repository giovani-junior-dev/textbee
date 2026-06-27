'use client'

import { useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { Languages } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { locales, localeLabels, LOCALE_COOKIE, type Locale } from '@/i18n/locales'
import { cn } from '@/lib/utils'

export default function LanguageSwitcher() {
  const activeLocale = useLocale()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const setLocale = (locale: Locale) => {
    // 1 ano de validade; SameSite=Lax pra navegação normal.
    document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`
    startTransition(() => router.refresh())
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' aria-label='Idioma' disabled={isPending}>
          <Languages className='h-5 w-5' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        {locales.map((locale) => (
          <DropdownMenuItem
            key={locale}
            onClick={() => setLocale(locale)}
            className={cn(locale === activeLocale && 'font-semibold text-primary')}
          >
            {localeLabels[locale]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
