'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Shield, Loader2, Mail, Check, UserCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useToast } from '@/hooks/use-toast'
import httpBrowserClient from '@/lib/httpBrowserClient'
import { ApiEndpoints } from '@/config/api'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Spinner } from '@/components/ui/spinner'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'

type UpdateProfileFormData = {
  name: string
  email?: string
  phone?: string
}

export default function EditProfileForm() {
  const { toast } = useToast()
  const { update: updateSession } = useSession()
  const t = useTranslations('account')

  const updateProfileSchema = z.object({
    name: z.string().min(1, t('nameRequired')),
    email: z.string().email().optional(),
    phone: z
      .string()
      .regex(/^\+?\d{0,14}$/, t('invalidPhone'))
      .optional(),
  })

  const {
    data: currentUser,
    isLoading: isLoadingUser,
    refetch: refetchCurrentUser,
  } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () =>
      httpBrowserClient
        .get(ApiEndpoints.auth.whoAmI())
        .then((res) => res.data?.data),
  })

  const updateProfileForm = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: currentUser?.name,
      email: currentUser?.email,
      phone: currentUser?.phone,
    },
  })

  const handleVerifyEmail = () => {
    // TODO: Implement email verification
  }

  const {
    mutate: updateProfile,
    isPending: isUpdatingProfile,
    error: updateProfileError,
    isSuccess: isUpdateProfileSuccess,
  } = useMutation({
    mutationFn: (data: UpdateProfileFormData) =>
      httpBrowserClient.patch(ApiEndpoints.auth.updateProfile(), data),
    onSuccess: () => {
      refetchCurrentUser()
      toast({
        title: t('profileUpdated'),
      })
      updateSession({
        name: updateProfileForm.getValues().name,
        phone: updateProfileForm.getValues().phone,
      })
    },
    onError: () => {
      toast({
        title: t('profileUpdateFailed'),
      })
    },
  })

  if (isLoadingUser)
    return (
      <div className='flex justify-center items-center h-full min-h-[200px]'>
        <Spinner size='sm' />
      </div>
    )

  return (
    <form
      onSubmit={updateProfileForm.handleSubmit((data) => updateProfile(data))}
      className='space-y-4'
    >
      <div className='space-y-2'>
        <Label htmlFor='name'>{t('fullName')}</Label>
        <Input
          id='name'
          {...updateProfileForm.register('name')}
          placeholder={t('fullNamePlaceholder')}
          defaultValue={currentUser?.name}
        />
        {updateProfileForm.formState.errors.name && (
          <p className='text-sm text-destructive'>
            {updateProfileForm.formState.errors.name.message}
          </p>
        )}
      </div>

      <div className='space-y-2'>
        <Label htmlFor='email' className='flex items-center gap-2'>
          {t('emailAddress')}
          {currentUser?.emailVerifiedAt && (
            <Badge variant='secondary' className='ml-2'>
              <Shield className='h-3 w-3 mr-1' />
              {t('verified')}
            </Badge>
          )}
        </Label>
        <div className='flex gap-2'>
          <Input
            id='email'
            type='email'
            {...updateProfileForm.register('email')}
            placeholder={t('emailPlaceholder')}
            defaultValue={currentUser?.email}
            disabled
          />
          {!currentUser?.emailVerifiedAt ? (
            <Button
              type='button'
              variant='outline'
              onClick={handleVerifyEmail}
              disabled={true}
            >
              {isUpdatingProfile ? (
                <Loader2 className='h-4 w-4 animate-spin' />
              ) : (
                <Mail className='h-4 w-4 mr-2' />
              )}
              {t('verify')}
            </Button>
          ) : (
            <Button variant='outline' disabled>
              <Check className='h-4 w-4 mr-2' />
              {t('verified')}
            </Button>
          )}
        </div>
        {updateProfileForm.formState.errors.email && (
          <p className='text-sm text-destructive'>
            {updateProfileForm.formState.errors.email.message}
          </p>
        )}
      </div>

      <div className='space-y-2'>
        <Label htmlFor='phone'>{t('phoneNumber')}</Label>
        <Input
          id='phone'
          type='tel'
          {...updateProfileForm.register('phone')}
          placeholder={t('phonePlaceholder')}
          defaultValue={currentUser?.phone}
        />
        {updateProfileForm.formState.errors.phone && (
          <p className='text-sm text-destructive'>
            {updateProfileForm.formState.errors.phone.message}
          </p>
        )}
      </div>

      {isUpdateProfileSuccess && (
        <p className='text-sm text-green-500'>
          {t('profileUpdated')}
        </p>
      )}

      <Button
        type='submit'
        className='w-full mt-6'
        disabled={isUpdatingProfile}
      >
        {isUpdatingProfile ? (
          <Loader2 className='h-4 w-4 animate-spin mr-2' />
        ) : null}
        {t('saveChanges')}
      </Button>
    </form>
  )
} 