import { ShieldIcon } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import ChangePasswordForm from '../../(components)/change-password-form'
import { getTranslations } from 'next-intl/server'

export default async function ChangePasswordPage() {
  const t = await getTranslations('accountPage')
  return (
    <div className='flex-1 space-y-6 p-6 md:p-8'>
      <div className='space-y-1'>
        <div className='flex items-center space-x-2'>
          <ShieldIcon className='h-6 w-6 text-primary' />
          <h2 className='text-3xl font-bold tracking-tight'>{t('changePassword')}</h2>
        </div>
        <p className='text-muted-foreground'>{t('changePasswordDesc')}</p>
      </div>

      <div className='max-w-2xl'>
        <Card>
          <CardHeader>
            <CardTitle>{t('pwSecurity')}</CardTitle>
            <CardDescription>{t('pwSecurityDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <ChangePasswordForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 