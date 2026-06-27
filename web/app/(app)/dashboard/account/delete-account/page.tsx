import { AlertTriangleIcon } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import DeleteAccountForm from '../../(components)/delete-account-form'
import { getTranslations } from 'next-intl/server'

export default async function DangerZonePage() {
  const t = await getTranslations('accountPage')
  return (
    <div className='flex-1 space-y-6 p-6 md:p-8'>
      <div className='space-y-1'>
        <div className='flex items-center space-x-2'>
          <AlertTriangleIcon className='h-6 w-6 text-destructive' />
          <h2 className='text-3xl font-bold tracking-tight'>{t('dangerZone')}</h2>
        </div>
        <p className='text-muted-foreground'>{t('dangerZoneDesc')}</p>
      </div>

      <div className='max-w-2xl'>
        <Card className='border-destructive/50'>
          <CardHeader>
            <div className='flex items-center gap-2 text-destructive'>
              <AlertTriangleIcon className='h-5 w-5' />
              <CardTitle>{t('deleteAccount')}</CardTitle>
            </div>
            <CardDescription>
              {t('deleteAccountFullDesc')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DeleteAccountForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 