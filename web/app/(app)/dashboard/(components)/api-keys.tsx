'use client'

import { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Key, MoreVertical, Loader2, Plus, AlertTriangle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import httpBrowserClient from '@/lib/httpBrowserClient'
import { ApiEndpoints } from '@/config/api'
import { Skeleton } from '@/components/ui/skeleton'
import GenerateApiKey, {
  type GenerateApiKeyHandle,
} from './generate-api-key'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useTranslations } from 'next-intl'

type ApiKeyRow = {
  _id: string
  apiKey: string
  name?: string
  revokedAt?: string
  createdAt: string
  lastUsedAt?: string
  usageCount?: number
}

export default function ApiKeys() {
  const t = useTranslations('apiKeys')
  const addApiKeyRef = useRef<GenerateApiKeyHandle>(null)
  const queryClient = useQueryClient()

  const [selectedKey, setSelectedKey] = useState<ApiKeyRow | null>(null)
  const [isRevokeDialogOpen, setIsRevokeDialogOpen] = useState(false)
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false)
  const [isRevokedModalOpen, setIsRevokedModalOpen] = useState(false)
  const [isConfirmDeleteRevokedOpen, setIsConfirmDeleteRevokedOpen] =
    useState(false)
  const [revokedKeyToDelete, setRevokedKeyToDelete] =
    useState<ApiKeyRow | null>(null)
  const [newKeyName, setNewKeyName] = useState('')

  const { toast } = useToast()

  const {
    isPending,
    error,
    data: apiKeys,
  } = useQuery({
    queryKey: ['apiKeys', 'active'],
    queryFn: () =>
      httpBrowserClient
        .get(ApiEndpoints.auth.listApiKeys('active'))
        .then((res) => res.data),
  })

  const {
    data: revokedKeysData,
    isPending: isRevokedPending,
  } = useQuery({
    queryKey: ['apiKeys', 'revoked'],
    queryFn: () =>
      httpBrowserClient
        .get(ApiEndpoints.auth.listApiKeys('revoked'))
        .then((res) => res.data),
    enabled: isRevokedModalOpen,
  })

  const {
    mutate: revokeApiKey,
    isPending: isRevokingApiKey,
    error: revokeApiKeyError,
  } = useMutation({
    mutationFn: (id: string) =>
      httpBrowserClient.post(ApiEndpoints.auth.revokeApiKey(id)),
    onSuccess: () => {
      setIsRevokeDialogOpen(false)
      toast({
        title: t('revokedToast', { key: selectedKey?.apiKey ?? '' }),
      })
      void queryClient.invalidateQueries({ queryKey: ['apiKeys'] })
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: t('revokeError'),
        description: revokeApiKeyError?.message,
      })
    },
  })

  const {
    mutate: deleteRevokedApiKey,
    isPending: isDeletingRevokedApiKey,
    error: deleteApiKeyError,
  } = useMutation({
    mutationFn: (id: string) =>
      httpBrowserClient.delete(ApiEndpoints.auth.deleteApiKey(id)),
    onSuccess: () => {
      setIsConfirmDeleteRevokedOpen(false)
      setRevokedKeyToDelete(null)
      toast({
        title: t('removedToast'),
      })
      void queryClient.invalidateQueries({ queryKey: ['apiKeys'] })
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: t('deleteError'),
        description: deleteApiKeyError?.message,
      })
    },
  })
  const {
    mutate: renameApiKey,
    isPending: isRenamingApiKey,
    error: renameApiKeyError,
  } = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      httpBrowserClient.patch(ApiEndpoints.auth.renameApiKey(id), { name }),
    onSuccess: () => {
      setIsRenameDialogOpen(false)
      toast({
        title: t('renamedToast', { name: newKeyName }),
      })
      void queryClient.invalidateQueries({ queryKey: ['apiKeys', 'active'] })
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: t('renameError'),
        description: renameApiKeyError?.message,
      })
    },
  })

  const revokedList = revokedKeysData?.data as ApiKeyRow[] | undefined

  return (
    <>
      <GenerateApiKey ref={addApiKeyRef} showTrigger={false} />
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-lg'>{t('title')}</CardTitle>
          <div className='flex items-center gap-1'>
            <Button
              variant='ghost'
              size='sm'
              className='h-auto px-2 py-1 text-xs font-normal text-muted-foreground hover:bg-transparent hover:text-foreground'
              onClick={() => setIsRevokedModalOpen(true)}
            >
              {t('viewRevoked')}
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() => addApiKeyRef.current?.open()}
            >
              <Plus className='mr-1 h-4 w-4' />
              {t('addKey')}
            </Button>
          </div>
        </CardHeader>
      <CardContent>
          <div className='space-y-2'>
            {isPending && (
              <>
                {[1, 2, 3].map((i) => (
                  <Card key={i} className='border-0 shadow-none'>
                    <CardContent className='flex items-center p-3'>
                      <Skeleton className='h-6 w-6 mr-3' />
                      <div className='flex-1'>
                        <div className='flex items-center justify-between'>
                          <Skeleton className='h-4 w-24' />
                          <Skeleton className='h-4 w-16' />
                        </div>
                        <div className='flex items-center space-x-2 mt-1'>
                          <Skeleton className='h-4 w-64' />
                        </div>
                        <div className='flex items-center mt-1 space-x-3'>
                          <Skeleton className='h-3 w-32' />
                          <Skeleton className='h-3 w-32' />
                        </div>
                      </div>
                      <Skeleton className='h-6 w-6' />
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

            {!isPending && !error && apiKeys?.data?.length === 0 && (
              <div className='flex justify-center items-center h-full'>
                <div>{t('noKeys')}</div>
              </div>
            )}

            {apiKeys?.data?.map((apiKey: ApiKeyRow) => (
              <Card key={apiKey._id} className='border-0 shadow-none'>
                <CardContent className='flex items-center p-3'>
                  <Key className='h-6 w-6 mr-3' />
                  <div className='flex-1'>
                    <div className='flex items-center justify-between'>
                      <h3 className='font-semibold text-sm'>
                        {apiKey.name || t('keyFallback')}
                      </h3>
                      <Badge variant='default' className='text-xs'>
                        {t('active')}
                      </Badge>
                    </div>
                    <div className='flex items-center space-x-2 mt-1'>
                      <code className='relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-xs'>
                        {apiKey.apiKey}
                      </code>
                    </div>
                    <div className='flex items-center mt-1 space-x-3 text-xs text-muted-foreground'>
                      <div>
                        {t('createdAt')}{' '}
                        {new Date(apiKey.createdAt).toLocaleString('en-US', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })}
                      </div>
                      <div>
                        {t('lastUsed')}{' '}
                        {apiKey?.lastUsedAt && apiKey.usageCount
                          ? new Date(apiKey.lastUsedAt).toLocaleString(
                              'en-US',
                              {
                                dateStyle: 'medium',
                                timeStyle: 'short',
                              }
                            )
                          : t('never')}
                      </div>
                    </div>
                  </div>
                  <div className=''>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant='ghost' size='icon' className='h-6 w-6'>
                          <MoreVertical className='h-3 w-3' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedKey(apiKey)
                            setNewKeyName(apiKey.name || t('keyFallback'))
                            setIsRenameDialogOpen(true)
                          }}
                        >
                          {t('rename')}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className='text-destructive'
                          onClick={() => {
                            setSelectedKey(apiKey)
                            setIsRevokeDialogOpen(true)
                          }}
                        >
                          {t('revoke')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

        {/* Revoke Dialog */}
        <Dialog open={isRevokeDialogOpen} onOpenChange={setIsRevokeDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('revokeTitle')}</DialogTitle>
              <DialogDescription className='sr-only'>
                {t('revokeSrDesc')}
              </DialogDescription>
            </DialogHeader>
            <Alert variant='destructive'>
              <AlertTriangle className='h-4 w-4' />
              <AlertDescription>
                {t('revokeWarning')}
              </AlertDescription>
            </Alert>
            <DialogFooter>
              <Button
                variant='outline'
                onClick={() => setIsRevokeDialogOpen(false)}
                disabled={isRevokingApiKey}
              >
                {t('cancel')}
              </Button>
              <Button
                variant='destructive'
                onClick={() => revokeApiKey(selectedKey?._id)}
                disabled={isRevokingApiKey}
              >
                {isRevokingApiKey ? (
                  <Loader2 className='h-4 w-4 animate-spin mr-2' />
                ) : null}
                {t('revokeKey')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Revoked keys list */}
        <Dialog
          open={isRevokedModalOpen}
          onOpenChange={setIsRevokedModalOpen}
        >
          <DialogContent className='max-h-[85vh] overflow-y-auto sm:max-w-lg'>
            <DialogHeader>
              <DialogTitle>{t('revokedTitle')}</DialogTitle>
              <DialogDescription>
                {t('revokedDesc')}
              </DialogDescription>
            </DialogHeader>
            {isRevokedPending && (
              <div className='space-y-2 py-2'>
                <Skeleton className='h-12 w-full' />
                <Skeleton className='h-12 w-full' />
              </div>
            )}
            {!isRevokedPending &&
              (!revokedList || revokedList.length === 0) && (
                <p className='text-sm text-muted-foreground py-4'>
                  {t('noRevoked')}
                </p>
              )}
            {!isRevokedPending &&
              revokedList?.map((k) => (
                <div
                  key={k._id}
                  className='flex items-center justify-between gap-3 rounded-md border p-3'
                >
                  <div className='min-w-0 flex-1'>
                    <div className='font-medium text-sm truncate'>
                      {k.name || t('keyFallback')}
                    </div>
                    <code className='text-xs text-muted-foreground'>
                      {k.apiKey}
                    </code>
                    <div className='text-xs text-muted-foreground mt-1'>
                      {t('revokedAt')}{' '}
                      {k.revokedAt
                        ? new Date(k.revokedAt).toLocaleString('en-US', {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                          })
                        : ''}
                    </div>
                  </div>
                  <Button
                    variant='destructive'
                    size='sm'
                    onClick={() => {
                      setRevokedKeyToDelete(k)
                      setIsConfirmDeleteRevokedOpen(true)
                    }}
                  >
                    {t('delete')}
                  </Button>
                </div>
              ))}
          </DialogContent>
        </Dialog>

        {/* Confirm delete revoked key */}
        <Dialog
          open={isConfirmDeleteRevokedOpen}
          onOpenChange={(open) => {
            setIsConfirmDeleteRevokedOpen(open)
            if (!open) setRevokedKeyToDelete(null)
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('removeTitle')}</DialogTitle>
              <DialogDescription>
                {t('removeDesc')}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant='outline'
                onClick={() => {
                  setIsConfirmDeleteRevokedOpen(false)
                  setRevokedKeyToDelete(null)
                }}
                disabled={isDeletingRevokedApiKey}
              >
                {t('cancel')}
              </Button>
              <Button
                variant='destructive'
                onClick={() =>
                  revokedKeyToDelete &&
                  deleteRevokedApiKey(revokedKeyToDelete._id)
                }
                disabled={isDeletingRevokedApiKey}
              >
                {isDeletingRevokedApiKey ? (
                  <Loader2 className='h-4 w-4 animate-spin mr-2' />
                ) : null}
                {t('remove')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Rename Dialog */}
        <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('renameTitle')}</DialogTitle>
              <DialogDescription>
                {t('renameDesc')}
              </DialogDescription>
            </DialogHeader>
            <Input
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              placeholder={t('renamePlaceholder')}
            />
            <DialogFooter>
              <Button
                variant='outline'
                onClick={() => setIsRenameDialogOpen(false)}
                disabled={isRenamingApiKey}
              >
                {t('cancel')}
              </Button>
              <Button
                onClick={() =>
                  renameApiKey({
                    id: selectedKey?._id,
                    name: newKeyName?.trim(),
                  })
                }
                disabled={isRenamingApiKey || !newKeyName?.trim()}
              >
                {isRenamingApiKey ? (
                  <Loader2 className='h-4 w-4 animate-spin mr-2' />
                ) : null}
                {t('save')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
      </Card>
    </>
  )
}
