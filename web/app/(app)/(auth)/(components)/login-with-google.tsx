'use client'

import { Routes } from '@/config/routes'
import { toast } from '@/hooks/use-toast'
import { CredentialResponse, GoogleLogin } from '@react-oauth/google'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'

export default function LoginWithGoogle() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect')
  const t = useTranslations('auth')

  const onGoogleLoginSuccess = async (
    credentialResponse: CredentialResponse
  ) => {
    toast({
      title: t('googleSuccess'),
      description: t('googleSuccessDesc'),
      variant: 'default',
    })
    await signIn('google-id-token-login', {
      redirect: true,
      callbackUrl: redirect ? decodeURIComponent(redirect) : Routes.dashboard,
      idToken: credentialResponse.credential,
    })
  }

  const onGoogleLoginError = () => {
    toast({
      title: t('errorTitle'),
      description: t('somethingWrong'),
      variant: 'destructive',
    })
  }
  return (
    <GoogleLogin
      onSuccess={onGoogleLoginSuccess}
      onError={onGoogleLoginError}
      useOneTap={true}
      width={'100%'}
      size='large'
      shape='pill'
      locale='en'
      theme='outline'
      text='continue_with'
    />
  )
}
