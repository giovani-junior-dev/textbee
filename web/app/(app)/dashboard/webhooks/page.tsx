'use client'

import { MessageSquareTextIcon } from 'lucide-react'
import WebhooksHistory from '../(components)/webhooks-history'
import { useTranslations } from 'next-intl'

export default function MessagingPage() {
  const t = useTranslations('whHistory')
  return (
    <div className="flex-1 p-6 md:p-8">
      <div className="space-y-1 mb-6">
        <div className="flex items-center space-x-2">
          <MessageSquareTextIcon className="h-6 w-6 text-primary" />
          <h2 className="text-3xl font-bold tracking-tight">
            {t('pageTitle')}
          </h2>
        </div>
      </div>

      <div className="">
        <WebhooksHistory />
      </div>
    </div>
  )
}
