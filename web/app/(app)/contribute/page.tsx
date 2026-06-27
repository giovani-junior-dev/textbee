'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Bitcoin,
  CircleDollarSign,
  Copy,
  Github,
  Heart,
  MessageSquare,
  Star,
  Wallet,
  Shield,
  Coins,
  Twitter,
  Linkedin,
} from 'lucide-react'
import Link from 'next/link'
import { ExternalLinks } from '@/config/external-links'
import { useToast } from '@/hooks/use-toast'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { CRYPTO_ADDRESSES } from '@/lib/constants'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

export default function ContributePage() {
  const { toast } = useToast()
  const t = useTranslations('contribute')

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: t('addressCopied', { type }),
    })
  }

  return (
    <div className='min-h-screen p-4 md:p-8 space-y-8'>
      <div className='text-center space-y-4'>
        <h1 className='text-4xl font-bold'>{t('title')}</h1>
        <p className='text-muted-foreground max-w-2xl mx-auto'>
          {t('subtitle')}
        </p>
      </div>

      <div className='space-y-6 max-w-5xl mx-auto'>
        <Card className='overflow-hidden hidden'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <CircleDollarSign className='h-5 w-5' />
              {t('financialSupport')}
            </CardTitle>
            <CardDescription>
              {t('financialDesc')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid gap-6 md:grid-cols-2'>
              <div className='space-y-6'>
                <Card className='overflow-hidden'>
                  <CardHeader>
                    <CardTitle className='text-lg'>{t('monthlySupport')}</CardTitle>
                    <CardDescription>
                      {t('monthlyDesc')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className='w-full' asChild>
                      <Link href={ExternalLinks.patreon} target='_blank'>
                        <Heart className='mr-2 h-4 w-4' />
                        {t('supportPatreon')}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
              <div className='space-y-6'>
                <Card className='overflow-hidden'>
                  <CardHeader>
                    <CardTitle className='text-lg'>{t('oneTimeSupport')}</CardTitle>
                    <CardDescription>
                      {t('oneTimeDesc')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant='outline' className='w-full' asChild>
                      <Link href={ExternalLinks.polar} target='_blank'>
                        <Heart className='mr-2 h-4 w-4' />
                        {t('donatePolar')}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <Card className='h-full overflow-hidden'>
                <CardHeader>
                  <CardTitle className='text-lg'>{t('cryptoDonations')}</CardTitle>
                  <CardDescription>
                    {t('cryptoDesc')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className='w-full' variant='outline'>
                        <Wallet className='mr-2 h-4 w-4' />
                        {t('viewCrypto')}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className='max-w-md'>
                      <DialogHeader>
                        <DialogTitle>
                          {t('cryptoTitle')}
                        </DialogTitle>
                      </DialogHeader>
                      <div className='space-y-4'>
                        {CRYPTO_ADDRESSES.map((wallet, index) => (
                          <div key={index} className='space-y-2'>
                            <div className='flex items-center justify-between'>
                              <span className='flex items-center gap-2'>
                                <Image
                                  src={wallet.icon}
                                  alt={wallet.name}
                                  width={32}
                                  height={32}
                                />
                                {wallet.name}
                              </span>
                              <Button
                                variant='ghost'
                                size='sm'
                                onClick={() =>
                                  handleCopy(wallet.address, wallet.name)
                                }
                              >
                                <Copy className='h-4 w-4' />
                              </Button>
                            </div>
                            <code className='text-xs block bg-muted p-2 rounded break-all whitespace-pre-wrap'>
                              {wallet.address}
                            </code>
                            <p className='text-xs text-muted-foreground'>
                              {t('network')} {wallet.network}
                            </p>
                          </div>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        <Card className='overflow-hidden'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Github className='h-5 w-5' />
              {t('codeContrib')}
            </CardTitle>
            <CardDescription>
              {t('codeDesc')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid gap-6 md:grid-cols-3'>
              <Card className='overflow-hidden'>
                <CardHeader>
                  <CardTitle className='text-lg'>{t('starProject')}</CardTitle>
                  <CardDescription>
                    {t('starDesc')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className='w-full' asChild>
                    <Link href={ExternalLinks.github} target='_blank'>
                      <Star className='mr-2 h-4 w-4' />
                      {t('starGithub')}
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className='overflow-hidden'>
                <CardHeader>
                  <CardTitle className='text-lg'>{t('reportIssues')}</CardTitle>
                  <CardDescription>
                    {t('reportDesc')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className='w-full' variant='outline' asChild>
                    <Link
                      href={`${ExternalLinks.github}/issues/new`}
                      target='_blank'
                    >
                      <MessageSquare className='mr-2 h-4 w-4' />
                      {t('createIssue')}
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className='overflow-hidden'>
                <CardHeader>
                  <CardTitle className='text-lg'>{t('securityReports')}</CardTitle>
                  <CardDescription>
                    {t('securityDesc')}{' '}
                    <a href='mailto:security@textbee.dev'>
                      security@textbee.dev
                    </a>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className='w-full' variant='outline' asChild>
                    <Link href='mailto:security@textbee.dev'>
                      <Shield className='mr-2 h-4 w-4' />
                      {t('reportVuln')}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        <Card className='overflow-hidden'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <MessageSquare className='h-5 w-5' />
              {t('joinCommunity')}
            </CardTitle>
            <CardDescription>
              {t('joinDesc')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
              <Button variant='outline' asChild>
                <Link href={ExternalLinks.discord} target='_blank'>
                  <MessageSquare className='mr-2 h-4 w-4' />
                  {t('joinDiscord')}
                </Link>
              </Button>
              <Button variant='outline' asChild>
                <Link href={ExternalLinks.twitter} target='_blank'>
                  <Twitter className='mr-2 h-4 w-4' />
                  {t('followX')}
                </Link>
              </Button>
              <Button variant='outline' asChild>
                <Link href={ExternalLinks.linkedin} target='_blank'>
                  <Linkedin className='mr-2 h-4 w-4' />
                  {t('connectLinkedin')}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
