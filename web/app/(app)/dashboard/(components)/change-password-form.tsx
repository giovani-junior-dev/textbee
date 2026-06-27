'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useToast } from '@/hooks/use-toast'
import httpBrowserClient from '@/lib/httpBrowserClient'
import { ApiEndpoints } from '@/config/api'
import { useMutation } from '@tanstack/react-query'
import Link from 'next/link'
import { Routes } from '@/config/routes'
import { useTranslations } from 'next-intl'

type ChangePasswordFormData = {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

export default function ChangePasswordForm() {
  const { toast } = useToast()
  const t = useTranslations('account')

  const changePasswordSchema = z
    .object({
      oldPassword: z.string().min(1, t('pwOldRequired')),
      newPassword: z.string().min(8, { message: t('pwMin') }),
      confirmPassword: z.string().min(4, { message: t('pwConfirmRequired') }),
    })
    .superRefine((data, ctx) => {
      if (data.newPassword !== data.confirmPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('pwMustMatch'),
          path: ['confirmPassword'],
        })
      }
    })

  const changePasswordForm = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  })

  const {
    mutate: changePassword,
    isPending: isChangingPassword,
    error: changePasswordError,
    isSuccess: isChangePasswordSuccess,
  } = useMutation({
    mutationFn: (data: ChangePasswordFormData) =>
      httpBrowserClient.post(ApiEndpoints.auth.changePassword(), data),
    onSuccess: () => {
      toast({
        title: t('pwChanged'),
      })
      changePasswordForm.reset()
    },
    onError: (error) => {
      const errorMessage = (error as any).response?.data?.error
      changePasswordForm.setError('root.serverError', {
        message: errorMessage || t('pwChangeFailed'),
      })
      toast({
        title: t('pwChangeFailed'),
      })
    },
  })

  return (
    <>
      <p className='text-sm text-muted-foreground mb-4'>
        {t.rich('pwResetHint', {
          link: (chunks) => (
            <Link href={Routes.resetPassword} className='underline'>
              {chunks}
            </Link>
          ),
        })}
      </p>
      
      <form
        onSubmit={changePasswordForm.handleSubmit((data) => changePassword(data))}
        className='space-y-4'
      >
        <div className='space-y-2'>
          <Label htmlFor='oldPassword'>{t('oldPassword')}</Label>
          <Input
            id='oldPassword'
            type='password'
            {...changePasswordForm.register('oldPassword')}
            placeholder={t('oldPasswordPlaceholder')}
          />
          {changePasswordForm.formState.errors.oldPassword && (
            <p className='text-sm text-destructive'>
              {changePasswordForm.formState.errors.oldPassword.message}
            </p>
          )}
        </div>

        <div className='space-y-2'>
          <Label htmlFor='newPassword'>{t('newPassword')}</Label>
          <Input
            id='newPassword'
            type='password'
            {...changePasswordForm.register('newPassword')}
            placeholder={t('newPasswordPlaceholder')}
          />
          {changePasswordForm.formState.errors.newPassword && (
            <p className='text-sm text-destructive'>
              {changePasswordForm.formState.errors.newPassword.message}
            </p>
          )}
        </div>

        <div className='space-y-2'>
          <Label htmlFor='confirmPassword'>{t('confirmPassword')}</Label>
          <Input
            id='confirmPassword'
            type='password'
            {...changePasswordForm.register('confirmPassword')}
            placeholder={t('confirmPasswordPlaceholder')}
          />
          {changePasswordForm.formState.errors.confirmPassword && (
            <p className='text-sm text-destructive'>
              {changePasswordForm.formState.errors.confirmPassword.message}
            </p>
          )}
        </div>

        {changePasswordForm.formState.errors.root?.serverError && (
          <p className='text-sm text-destructive'>
            {changePasswordForm.formState.errors.root.serverError.message}
          </p>
        )}

        {isChangePasswordSuccess && (
          <p className='text-sm text-green-500'>
            {t('pwChanged')}
          </p>
        )}

        <Button
          type='submit'
          className='w-full mt-6'
          disabled={isChangingPassword}
        >
          {isChangingPassword ? (
            <Loader2 className='h-4 w-4 animate-spin mr-2' />
          ) : null}
          {t('changePassword')}
        </Button>
      </form>
    </>
  )
} 