import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { ApiEndpoints } from '@/config/api'
import httpBrowserClient from '@/lib/httpBrowserClient'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { useMemo } from 'react'
import { useTranslations } from 'next-intl'

const DISCOUNT_CODE_FALLBACK = null
const DISCOUNT_PERCENTAGE_FALLBACK = null

const envDiscountCode = process.env.NEXT_PUBLIC_DISCOUNT_CODE?.trim()
const envDiscountPercentage = process.env.NEXT_PUBLIC_DISCOUNT_PERCENTAGE?.trim()

const discountCode = (envDiscountCode !== undefined && envDiscountCode !== '') 
  ? envDiscountCode 
  : DISCOUNT_CODE_FALLBACK
const discountPercentage = (envDiscountPercentage !== undefined && envDiscountPercentage !== '')
  ? envDiscountPercentage
  : DISCOUNT_PERCENTAGE_FALLBACK
const isDiscountEnabled = discountCode !== null && discountCode !== '' && discountPercentage !== null && discountPercentage !== ''

export default function UpgradeToProAlert() {
  const t = useTranslations('upgradePro')
  const {
    data: currentSubscription,
    isLoading: isLoadingSubscription,
    error: subscriptionError,
  } = useQuery({
    queryKey: ['currentSubscription'],
    queryFn: () =>
      httpBrowserClient
        .get(ApiEndpoints.billing.currentSubscription())
        .then((res) => res.data),
  })

  const monthlyUsagePercentage = currentSubscription?.usage?.monthlyUsagePercentage || 0
  const monthlyLimit = currentSubscription?.usage?.monthlyLimit || 0
  const processedSmsLastMonth = currentSubscription?.usage?.processedSmsLastMonth || 0

  const alertConfig = useMemo(() => {
    if (monthlyUsagePercentage >= 100 ) {
      return {
        bgColor: 'bg-gradient-to-r from-red-600 to-red-800',
        message: t('limitExceeded'),
        subMessage: t('usedOfLimit', { used: processedSmsLastMonth, limit: monthlyLimit }),
        buttonText: t('upgradeNow'),
        buttonColor: 'bg-white text-red-600 hover:bg-red-50 hover:text-red-700 border-red-600',
        urgency: 'critical'
      }
    } else if (monthlyUsagePercentage >= 80) {
      return {
        bgColor: 'bg-gradient-to-r from-orange-500 to-red-500',
        message: t('approaching'),
        subMessage: t('usedPercent', { pct: monthlyUsagePercentage, used: processedSmsLastMonth, limit: monthlyLimit }),
        buttonText: t('upgradeBeforeLimit'),
        buttonColor: 'bg-white text-orange-600 hover:bg-orange-50 hover:text-orange-700 border-orange-600',
        urgency: 'warning'
      }
    } else {
      const subMessage = isDiscountEnabled
        ? t('discountMsg', { code: discountCode ?? '', pct: discountPercentage ?? '' })
        : t('proSubMessage')

      return {
        bgColor: 'bg-gradient-to-r from-purple-500 to-pink-500',
        message: isDiscountEnabled ? t('proCtaDiscount') : t('proCta'),
        subMessage,
        buttonText: isDiscountEnabled ? t('claimDiscount') : t('getPro'),
        buttonColor: 'bg-red-500 text-white hover:bg-red-600 border-red-500',
        urgency: 'normal'
      }
    }
  }, [monthlyUsagePercentage, monthlyLimit, processedSmsLastMonth, t])

  const planName = currentSubscription?.plan?.name

  if (isLoadingSubscription || !currentSubscription || subscriptionError) {
    return null
  }

  if (planName === 'scale' || planName?.startsWith('custom')) {
    return null
  }

  if (planName === 'pro') {
    if (monthlyUsagePercentage < 80) return null

    const scaleAlertConfig =
      monthlyUsagePercentage >= 100
        ? {
            bgColor: 'bg-gradient-to-r from-red-600 to-red-800',
            message: t('scaleExceeded'),
            subMessage: t('usedOfLimit', { used: processedSmsLastMonth, limit: monthlyLimit }),
            buttonText: t('upgradeScaleBang'),
            buttonColor: 'bg-white text-red-600 hover:bg-red-50 hover:text-red-700 border-red-600',
          }
        : {
            bgColor: 'bg-gradient-to-r from-orange-500 to-red-500',
            message: t('scaleApproaching'),
            subMessage: t('usedPercent', { pct: monthlyUsagePercentage, used: processedSmsLastMonth, limit: monthlyLimit }),
            buttonText: t('upgradeScale'),
            buttonColor: 'bg-white text-orange-600 hover:bg-orange-50 hover:text-orange-700 border-orange-600',
          }

    return (
      <Alert className={`${scaleAlertConfig.bgColor} text-white`}>
        <AlertDescription className='flex flex-col sm:flex-row flex-wrap items-center gap-2 md:gap-4'>
          <span className='w-full sm:flex-1 text-center sm:text-left text-sm md:text-base font-medium'>
            {scaleAlertConfig.message}
          </span>
          <span className='w-full sm:flex-1 text-center sm:text-left text-xs md:text-sm'>
            {scaleAlertConfig.subMessage}
          </span>
          <div className='w-full sm:w-auto mt-2 sm:mt-0 flex justify-center sm:justify-end flex-wrap gap-1 md:gap-2'>
            <Button
              variant='outline'
              size='sm'
              asChild
              className={`${scaleAlertConfig.buttonColor} text-xs md:text-sm`}
            >
              <Link href={'/checkout/scale'}>
                {scaleAlertConfig.buttonText}
              </Link>
            </Button>
            <Button
              variant='outline'
              size='sm'
              asChild
              className='bg-orange-500 text-white hover:bg-orange-600 text-xs md:text-sm'
            >
              <Link href={'/#pricing'}>{t('learnMore')}</Link>
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Alert className={`${alertConfig.bgColor} text-white`}>
      <AlertDescription className='flex flex-col sm:flex-row flex-wrap items-center gap-2 md:gap-4'>
        <span className='w-full sm:flex-1 text-center sm:text-left text-sm md:text-base font-medium'>
          {alertConfig.message}
        </span>
        <span className='w-full sm:flex-1 text-center sm:text-left text-xs md:text-sm'>
          {alertConfig.urgency === 'normal' && isDiscountEnabled ? (
            t.rich('discountMsgRich', {
              code: discountCode ?? '',
              pct: discountPercentage ?? '',
              strong: (chunks) => <strong className="text-yellow-200">{chunks}</strong>,
            })
          ) : (
            alertConfig.subMessage
          )}
        </span>
        <div className='w-full sm:w-auto mt-2 sm:mt-0 flex justify-center sm:justify-end flex-wrap gap-1 md:gap-2'>
          <Button
            variant='outline'
            size='sm'
            asChild
            className={`${alertConfig.buttonColor} text-xs md:text-sm`}
          >
            <Link href={'/checkout/pro'}>{alertConfig.buttonText}</Link>
          </Button>
          {alertConfig.urgency === 'normal' && (
            <Button
              variant='outline'
              size='sm'
              asChild
              className='bg-orange-500 text-white hover:bg-orange-600 text-xs md:text-sm'
            >
              <Link href={'/#pricing'}>{t('learnMore')}</Link>
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  )
}
