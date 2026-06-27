'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import httpBrowserClient from '@/lib/httpBrowserClient'
import { ApiEndpoints } from '@/config/api'
import { useToast } from '@/hooks/use-toast'
import { useTranslations } from 'next-intl'

interface DeleteWebhookButtonProps {
  webhookId: string
  webhookLabel?: string
  onDeleted?: () => void
}

export function DeleteWebhookButton({
  webhookId,
  webhookLabel,
  onDeleted,
}: DeleteWebhookButtonProps) {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const t = useTranslations('webhooks')

  const { mutate: deleteWebhook, isPending } = useMutation({
    mutationFn: () =>
      httpBrowserClient.delete(ApiEndpoints.gateway.deleteWebhook(webhookId)),
    onSuccess: () => {
      toast({
        title: t('deletedTitle'),
        description: webhookLabel
          ? t('deletedNamed', { label: webhookLabel })
          : t('deletedGeneric'),
      })
      queryClient.invalidateQueries({ queryKey: ['webhooks'] })
      setOpen(false)
      onDeleted?.()
    },
    onError: (error: any) => {
      toast({
        title: t('errorTitle'),
        description:
          error?.response?.data?.message || t('deleteFailed'),
        variant: 'destructive',
      })
    },
  })

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant='outline' size='sm' disabled={isPending}>
          <Trash2 className='h-4 w-4 text-destructive' />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('deleteTitle')}</AlertDialogTitle>
          <AlertDialogDescription>
            {webhookLabel
              ? t('deleteConfirmNamed', { label: webhookLabel })
              : t('deleteConfirmGeneric')}{' '}
            {t('deleteConfirmTail')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>{t('cancel')}</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              deleteWebhook()
            }}
            disabled={isPending}
            className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
          >
            {isPending ? t('deleting') : t('delete')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
