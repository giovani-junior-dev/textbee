'use client'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { AlertTriangle, Check, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from '@/hooks/use-toast'
import httpBrowserClient from '@/lib/httpBrowserClient'
import { ApiEndpoints } from '@/config/api'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useTurnstile } from '@/lib/turnstile'
import { useTranslations } from 'next-intl'

export default function SupportForm() {
  const t = useTranslations('support')
  const SupportFormSchema = z.object({
    name: z.string().min(1, { message: t('nameRequired') }),
    email: z.string().email({ message: t('invalidEmail') }),
    phone: z.string().optional(),
    category: z.enum(['general', 'technical', 'billing-and-payments', 'other'], {
      message: t('categoryRequired'),
    }),
    message: z.string().min(1, { message: t('messageRequired') }),
    turnstileToken: z.string().min(1, { message: t('botVerification') }),
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const router = useRouter()

  const { data: session } = useSession()

  const form = useForm({
    resolver: zodResolver(SupportFormSchema),
    defaultValues: {
      name: session?.user?.name || '',
      email: session?.user?.email || '',
      phone: session?.user?.phone || '',
      category: 'general',
      message: '',
      turnstileToken: '',
    },
  })

  const {
    containerRef: turnstileRef,
    token: turnstileToken,
    error: turnstileError,
  } = useTurnstile({
    siteKey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
    onToken: (token) =>
      form.setValue('turnstileToken', token, { shouldValidate: true }),
    onError: (message) =>
      form.setError('turnstileToken', { type: 'manual', message }),
    onExpire: (message) =>
      form.setError('turnstileToken', { type: 'manual', message }),
  })

  useEffect(() => {
    if (turnstileToken) {
      form.clearErrors('turnstileToken')
    }
  }, [turnstileToken, form])

  useEffect(() => {
    if (turnstileError) {
      form.setError('turnstileToken', { type: 'manual', message: turnstileError })
    }
  }, [turnstileError, form])

  const onSubmit = async (data: any) => {
    setIsSubmitting(true)
    setErrorMessage(null)

    if (!data.turnstileToken) {
      form.setError('turnstileToken', {
        type: 'manual',
        message: t('botVerification'),
      })
      setIsSubmitting(false)
      return
    }

    try {
      // Use the existing httpBrowserClient to call the NestJS endpoint
      const response = await httpBrowserClient.post(
        ApiEndpoints.support.customerSupport(),
        data
      )

      setIsSubmitSuccessful(true)

      toast({
        title: t('submitted'),
        description: response.data.message || t('willGetBack'),
      })
    } catch (error) {
      console.error('Error submitting support request:', error)

      setErrorMessage(t('submitError'))

      toast({
        title: t('submitErrorTitle'),
        description: t('tryAgainLater'),
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='category'
          disabled={isSubmitting}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('category')}</FormLabel>
              <Select
                onValueChange={field.onChange}
                disabled={isSubmitting}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t('categoryPlaceholder')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value='general'>{t('catGeneral')}</SelectItem>
                  <SelectItem value='technical'>{t('catTechnical')}</SelectItem>
                  <SelectItem value='billing-and-payments'>
                    {t('catBilling')}
                  </SelectItem>
                  <SelectItem value='other'>{t('catOther')}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='name'
          disabled={isSubmitting}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('name')}</FormLabel>
              <FormControl>
                <Input placeholder={t('namePlaceholder')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='email'
          disabled={isSubmitting}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('email')}</FormLabel>
              <FormControl>
                <Input placeholder='seu@email.com' type='email' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='phone'
          disabled={isSubmitting}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('phoneOptional')}</FormLabel>
              <FormControl>
                <Input placeholder='+1234567890' type='tel' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='message'
          disabled={isSubmitting}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('message')}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t('messagePlaceholder')}
                  className='min-h-[100px]'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='turnstileToken'
          disabled={isSubmitting}
          render={() => (
            <FormItem>
              <FormControl>
                <div
                  ref={turnstileRef}
                  className='min-h-[65px] w-full flex justify-center'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {isSubmitSuccessful && (
          <div className='flex items-center gap-2 text-green-500'>
            <Check className='h-4 w-4' /> {t('received')}
          </div>
        )}

        {errorMessage && (
          <div className='flex items-center gap-2 text-red-500'>
            <AlertTriangle className='h-4 w-4' /> {errorMessage}
          </div>
        )}
        <Button type='submit' disabled={isSubmitting} className='w-full'>
          {isSubmitting ? (
            <>
              <Loader2 className='h-4 w-4 animate-spin mr-2' /> {t('submitting')}
            </>
          ) : (
            t('submit')
          )}
        </Button>
      </form>
    </Form>
  )
}
