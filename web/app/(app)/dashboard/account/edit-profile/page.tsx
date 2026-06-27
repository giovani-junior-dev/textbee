import { UserIcon } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import EditProfileForm from '../../(components)/edit-profile-form'
import { getTranslations } from 'next-intl/server'

export default async function EditProfilePage() {
  const t = await getTranslations('accountPage')
  return (
    <div className='flex-1 space-y-6 p-6 md:p-8'>
      <div className='space-y-1'>
        <div className='flex items-center space-x-2'>
          <UserIcon className='h-6 w-6 text-primary' />
          <h2 className='text-3xl font-bold tracking-tight'>{t('editProfile')}</h2>
        </div>
        <p className='text-muted-foreground'>{t('editProfileDesc')}</p>
      </div>

      <div className='max-w-2xl'>
        <Card>
          <CardHeader>
            <CardTitle>{t('profileInfo')}</CardTitle>
            <CardDescription>{t('profileInfoDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <EditProfileForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 