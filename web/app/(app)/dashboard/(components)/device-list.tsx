'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Smartphone,
  Battery,
  Signal,
  Copy,
  Plus,
  ExternalLink,
  Loader2,
  MoreVertical,
  TriangleAlert,
} from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'
import httpBrowserClient from '@/lib/httpBrowserClient'
import { ApiEndpoints } from '@/config/api'
import { Routes } from '@/config/routes'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRef, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { formatDeviceName } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import GenerateApiKey, {
  type GenerateApiKeyHandle,
} from './generate-api-key'
import {
  DeviceVersionCandidate,
  getDeviceVersionCode,
  isDeviceOutdated,
  latestAppVersionCode,
} from './update-app-helpers'

type DeviceRow = DeviceVersionCandidate & {
  createdAt: string
  status?: string
  enabled?: boolean
}

export default function DeviceList() {
  const t = useTranslations('devices')
  const addDeviceKeyRef = useRef<GenerateApiKeyHandle>(null)
  const [addDeviceInstructionOpen, setAddDeviceInstructionOpen] =
    useState(false)
  const [devicePendingDelete, setDevicePendingDelete] =
    useState<DeviceRow | null>(null)
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const {
    isPending,
    error,
    data: devices,
  } = useQuery({
    queryKey: ['devices'],
    queryFn: () =>
      httpBrowserClient
        .get(ApiEndpoints.gateway.listDevices())
        .then((res) => res.data),
    // select: (res) => res.data,
  })

  const { data: currentSubscription } = useQuery({
    queryKey: ['currentSubscription'],
    queryFn: () =>
      httpBrowserClient
        .get(ApiEndpoints.billing.currentSubscription())
        .then((res) => res.data),
  })

  // -1 (or missing) means unlimited; only enabled devices count toward the limit
  const deviceLimit = currentSubscription?.usage?.deviceLimit ?? -1
  const activeDeviceCount =
    devices?.data?.filter((device) => device.enabled).length ?? 0
  const isDeviceLimitReached =
    deviceLimit !== -1 && !isPending && activeDeviceCount >= deviceLimit
  const isApproachingDeviceLimit =
    deviceLimit >= 2 && !isPending && activeDeviceCount === deviceLimit - 1

  const {
    mutate: deleteDevice,
    isPending: isDeletingDevice,
  } = useMutation({
    mutationFn: (id: string) =>
      httpBrowserClient.delete(ApiEndpoints.gateway.deleteDevice(id)),
    onSuccess: () => {
      setDevicePendingDelete(null)
      toast({
        title: 'Device removed',
      })
      void queryClient.invalidateQueries({ queryKey: ['devices'] })
    },
    onError: (err: unknown) => {
      const message =
        err &&
        typeof err === 'object' &&
        'message' in err &&
        typeof (err as { message: unknown }).message === 'string'
          ? (err as { message: string }).message
          : 'Something went wrong'
      toast({
        variant: 'destructive',
        title: 'Error removing device',
        description: message,
      })
    },
  })

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id)
    toast({
      title: t('idCopied'),
    })
  }

  return (
    <>
      <GenerateApiKey ref={addDeviceKeyRef} showTrigger={false} />
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-lg'>{t('registered')}</CardTitle>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setAddDeviceInstructionOpen(true)}
          >
            <Plus className='mr-1 h-4 w-4' />
            {t('addDevice')}
          </Button>
        </CardHeader>
      <CardContent>
          {(isDeviceLimitReached || isApproachingDeviceLimit) && (
            <div
              className={`mb-4 flex flex-col gap-2 rounded-lg border px-3 py-2 sm:flex-row sm:items-center sm:justify-between ${
                isDeviceLimitReached
                  ? 'border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-950/20'
                  : 'border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/40'
              }`}
            >
              <div className='flex items-start gap-2'>
                <TriangleAlert
                  className={`mt-0.5 h-4 w-4 shrink-0 ${
                    isDeviceLimitReached
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-amber-600 dark:text-amber-400'
                  }`}
                />
                <p className='text-xs text-muted-foreground'>
                  {isDeviceLimitReached ? (
                    <>
                      {t.rich('limitReached', {
                        count: deviceLimit,
                        b: (chunks) => (
                          <span className='font-medium text-foreground'>{chunks}</span>
                        ),
                      })}
                    </>
                  ) : (
                    <>
                      {t.rich('limitApproaching', {
                        active: activeDeviceCount,
                        limit: deviceLimit,
                        b: (chunks) => (
                          <span className='font-medium text-foreground'>{chunks}</span>
                        ),
                      })}
                    </>
                  )}
                </p>
              </div>
              <Button variant='outline' size='sm' asChild className='shrink-0'>
                <Link href='/pricing'>{t('upgradePlan')}</Link>
              </Button>
            </div>
          )}
          <div className='space-y-2'>
            {isPending && (
              <>
                {[1, 2, 3].map((i) => (
                  <Card key={i} className='border-0 shadow-none'>
                    <CardContent className='flex items-center p-3'>
                      <Skeleton className='h-6 w-6 rounded-full mr-3 shrink-0' />
                      <div className='min-w-0 flex-1'>
                        <div className='flex items-center justify-between'>
                          <Skeleton className='h-4 w-[120px]' />
                          <Skeleton className='h-4 w-[60px]' />
                        </div>
                        <div className='flex items-center space-x-2 mt-1'>
                          <Skeleton className='h-4 w-[180px]' />
                        </div>
                        <div className='flex items-center mt-1 space-x-3'>
                          <Skeleton className='h-3 w-[200px]' />
                        </div>
                      </div>
                      <Skeleton className='h-6 w-6 shrink-0' />
                    </CardContent>
                  </Card>
                ))}
              </>
            )}

            {error && (
              <div className='flex justify-center items-center h-full'>
                <div>Error: {error.message}</div>
              </div>
            )}

            {!isPending && !error && devices?.data?.length === 0 && (
              <div className='flex justify-center items-center h-full'>
                <div>{t('noDevices')}</div>
              </div>
            )}

            {devices?.data?.map((device) => (
              <Card key={device._id} className='border-0 shadow-none'>
                <CardContent className='flex items-center gap-1 p-3'>
                  <Smartphone className='h-6 w-6 mr-2 shrink-0' />
                  <div className='min-w-0 flex-1'>
                    <div className='flex items-center justify-between'>
                      <h3 className='font-semibold text-sm'>
                        {formatDeviceName(device)}
                      </h3>
                      <div className='flex items-center gap-2'>
                        {isDeviceOutdated(device as DeviceVersionCandidate) && (
                          <Badge
                            variant='outline'
                            className='border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300'
                          >
                            Update available
                          </Badge>
                        )}
                        <Badge
                          variant={
                            device.status === 'online' ? 'default' : 'secondary'
                          }
                          className='text-xs'
                        >
                          {device.enabled ? t('enabled') : t('disabled')}
                        </Badge>
                      </div>
                    </div>
                    <div className='flex items-center space-x-2 mt-1'>
                      <code className='relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-xs'>
                        {device._id}
                      </code>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='h-6 w-6'
                        onClick={() => handleCopyId(device._id)}
                      >
                        <Copy className='h-3 w-3' />
                      </Button>
                    </div>
                    <div className='flex items-center mt-1 space-x-3 text-xs text-muted-foreground'>
                      <div className='flex items-center'>
                        <Battery className='h-3 w-3 mr-1' />
                        unknown
                      </div>
                      <div className='flex items-center'>
                        <Signal className='h-3 w-3 mr-1' />-
                      </div>
                      <div>
                        App version:{' '}
                        {getDeviceVersionCode(device as DeviceVersionCandidate) ??
                          'unknown'}
                      </div>
                      <div>
                        Registered at:{' '}
                        {new Date(device.createdAt).toLocaleString('en-US', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })}
                      </div>
                    </div>
                    {isDeviceOutdated(device as DeviceVersionCandidate) && (
                      <div className='mt-3 flex items-center justify-between gap-2 rounded-lg border border-brand-100 bg-brand-50/60 px-3 py-2 dark:border-brand-900/50 dark:bg-brand-950/20'>
                        <p className='text-xs text-muted-foreground'>
                          This device is behind the latest supported version{' '}
                          <span className='font-medium text-foreground'>
                            {latestAppVersionCode}
                          </span>
                          .
                        </p>
                        <Button
                          variant='outline'
                          size='sm'
                          asChild
                          className='shrink-0'
                        >
                          <a
                            href={Routes.downloadAndroidApp}
                            target='_blank'
                            rel='noreferrer'
                          >
                            Update app
                          </a>
                        </Button>
                      </div>
                    )}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='h-8 w-8 shrink-0'
                        aria-label='Device actions'
                      >
                        <MoreVertical className='h-4 w-4' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      <DropdownMenuItem
                        className='text-destructive focus:text-destructive'
                        onClick={() =>
                          setDevicePendingDelete(device as DeviceRow)
                        }
                      >
                        {t('delete')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardContent>
              </Card>
            ))}
          </div>
      </CardContent>
      </Card>

      <Dialog
        open={addDeviceInstructionOpen}
        onOpenChange={setAddDeviceInstructionOpen}
      >
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>{t('addDialogTitle')}</DialogTitle>
            <DialogDescription className='text-left'>
              {t('addDialogDesc')}
            </DialogDescription>
          </DialogHeader>
          <ol className='list-decimal space-y-3 pl-5 text-left text-sm text-muted-foreground'>
            <li>
              {t.rich('addStep1', {
                link: (chunks) => (
                  <a
                    href={Routes.downloadAndroidApp}
                    target='_blank'
                    rel='noreferrer'
                    className='font-medium text-primary underline-offset-4 hover:underline'
                  >
                    {chunks}
                  </a>
                ),
              })}
            </li>
            <li>{t('addStep2')}</li>
            <li>{t('addStep3')}</li>
          </ol>
          <DialogFooter className='flex-col gap-2 sm:flex-row sm:justify-between'>
            <Button variant='outline' size='sm' asChild>
              <a href={Routes.quickstart} target='_blank' rel='noreferrer'>
                {t('fullGuide')}
                <ExternalLink className='ml-1 h-3 w-3' />
              </a>
            </Button>
            <div className='flex w-full gap-2 sm:w-auto'>
              <Button
                variant='outline'
                size='sm'
                className='flex-1 sm:flex-none'
                onClick={() => setAddDeviceInstructionOpen(false)}
              >
                {t('cancel')}
              </Button>
              <Button
                size='sm'
                className='flex-1 sm:flex-none'
                onClick={() => {
                  setAddDeviceInstructionOpen(false)
                  addDeviceKeyRef.current?.open()
                }}
              >
                {t('continue')}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!devicePendingDelete}
        onOpenChange={(open) => {
          if (!open) setDevicePendingDelete(null)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('removeTitle')}</DialogTitle>
            <DialogDescription>
              {devicePendingDelete
                ? t('removeDescNamed', { name: formatDeviceName(devicePendingDelete) })
                : t('removeDesc')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setDevicePendingDelete(null)}
              disabled={isDeletingDevice}
            >
              {t('cancel')}
            </Button>
            <Button
              variant='destructive'
              onClick={() =>
                devicePendingDelete &&
                deleteDevice(devicePendingDelete._id)
              }
              disabled={isDeletingDevice}
            >
              {isDeletingDevice ? (
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              ) : null}
              {t('remove')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
