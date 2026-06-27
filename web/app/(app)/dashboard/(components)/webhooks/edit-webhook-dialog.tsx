'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { v4 as uuidv4 } from 'uuid'
import { WebhookData } from '@/lib/types'
import { WEBHOOK_EVENTS } from '@/lib/constants'
import httpBrowserClient from '@/lib/httpBrowserClient'
import { ApiEndpoints } from '@/config/api'
import { useToast } from '@/hooks/use-toast'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { useTranslations } from 'next-intl'

interface EditWebhookDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  webhook: WebhookData
}

export function EditWebhookDialog({
  open,
  onOpenChange,
  webhook,
}: EditWebhookDialogProps) {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const t = useTranslations('webhooks')

  const formSchema = z.object({
    name: z.string().max(64, { message: t('formNameMax') }).optional(),
    deliveryUrl: z.string().url({ message: t('formUrlInvalid') }),
    events: z.array(z.string()).min(1, { message: t('formEventsMin') }),
    isActive: z.boolean().default(true),
    signingSecret: z.string().min(1, { message: t('formSecretRequired') }),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      name: webhook.name ?? '',
      deliveryUrl: webhook.deliveryUrl,
      events: webhook.events,
      isActive: webhook.isActive,
      signingSecret: webhook.signingSecret,
    },
  })

  const { mutate: updateWebhook, isPending } = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const payload = {
        ...values,
        name: values.name?.trim() ? values.name.trim() : '',
      }
      return httpBrowserClient.patch(
        ApiEndpoints.gateway.updateWebhook(webhook._id),
        payload,
      )
    },
    onSuccess: () => {
      toast({
        title: t('successTitle'),
        description: t('updatedSuccess'),
      })
      // Invalidate and refetch webhooks list
      queryClient.invalidateQueries({ queryKey: ['webhooks'] })
      onOpenChange(false)
    },
    onError: (error: any) => {
      toast({
        title: t('errorTitle'),
        description:
          error?.response?.data?.message || t('updateFailed'),
        variant: 'destructive',
      })
    },
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateWebhook(values)
  }

  const message_events = [
    'MESSAGE_RECEIVED',
    'MESSAGE_SENT',
    'MESSAGE_DELIVERED',
    'MESSAGE_FAILED',
    
    // TODO: handle these events better in the future
    // 'UNKNOWN_STATE',
    // 'SMS_STATUS_UPDATED',
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>{t('editTitle')}</DialogTitle>
          <DialogDescription>
            {t('editDialogDesc')}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('nameOptional')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('namePlaceholder')}
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormDescription>
                    {t('nameDesc')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='deliveryUrl'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('deliveryUrl')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='https://api.example.com/webhooks'
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {t('urlDesc')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='signingSecret'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('signingSecret')}</FormLabel>
                  <FormControl>
                    <div className='flex space-x-2'>
                      <Input {...field} type='text' />
                      <Button
                        type='button'
                        variant='outline'
                        onClick={() => field.onChange(uuidv4())}
                      >
                        {t('generate')}
                      </Button>
                    </div>
                  </FormControl>
                  <FormDescription>
                    {t('secretDesc')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='events'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('events')}</FormLabel>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <FormControl>
                        <Button
                          variant='outline'
                          className='w-full justify-between'
                        >
                          {field.value && field.value.length > 0
                            ? t('eventsSelected', { count: field.value.length })
                            : t('selectEvents')}
                        </Button>
                      </FormControl>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className='w-full'>
                      {message_events.map((event) => (
                        <DropdownMenuCheckboxItem
                          key={event}
                          checked={field.value?.includes(event) || false}
                          onCheckedChange={(checked) => {
                            const currentValues = field.value || []
                            const newValues = checked
                              ? [...currentValues, event]
                              : currentValues.filter((v: string) => v !== event)
                            field.onChange(newValues)
                          }}
                          // 👇 prevent menu from closing
                          onSelect={(e) => e.preventDefault()}
                        >
                          {event}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <FormDescription>
                    {t('eventsDesc')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex justify-end space-x-2'>
              <Button
                type='button'
                variant='outline'
                onClick={() => onOpenChange(false)}
              >
                {t('cancel')}
              </Button>
              <Button type='submit' disabled={isPending}>
                {isPending ? t('updating') : t('update')}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}