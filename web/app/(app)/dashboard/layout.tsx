'use client'

import { Home, MessageSquareText, UserCircle, Users } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'

import AccountDeletionAlert from './(components)/account-deletion-alert'
import UpgradeToProAlert from './(components)/upgrade-to-pro-alert'
import UpdateAppModal from './(components)/update-app-modal'
import UpdateAppNotificationBar from './(components)/update-app-notification-bar'
import VerifyEmailAlert from './(components)/verify-email-alert'
import PastDueBillingAlert from './(components)/past-due-billing-alert'
import { SurveyModal } from '@/components/shared/survey-modal'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from '@/components/ui/sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const t = useTranslations('nav')
  const { data: session } = useSession()

  const items = [
    { href: '/dashboard', icon: Home, label: t('dashboard') },
    { href: '/dashboard/messaging', icon: MessageSquareText, label: t('messaging') },
    { href: '/dashboard/community', icon: Users, label: t('community') },
    { href: '/dashboard/account', icon: UserCircle, label: t('account') },
  ]

  const user = session?.user
  const initial = (user?.name || user?.email || 'U').charAt(0).toUpperCase()

  return (
    <SidebarProvider>
      <Sidebar
        collapsible="icon"
        className="!top-14 !h-[calc(100svh-3.5rem)]"
      >
        <SidebarHeader>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-2 py-1.5"
          >
            <Image
              src="/images/logo.png"
              alt="Wablast SMS"
              width={28}
              height={28}
              className="h-7 w-7 shrink-0 rounded-md bg-white"
            />
            <span className="font-bold leading-none group-data-[collapsible=icon]:hidden">
              Wablast<span className="text-primary"> SMS</span>
            </span>
          </Link>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>{t('menu')}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => {
                  const isActive =
                    item.href === '/dashboard'
                      ? pathname === '/dashboard'
                      : pathname.startsWith(item.href)
                  const Icon = item.icon
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={item.label}
                      >
                        <Link href={item.href} prefetch>
                          <Icon className="stroke-[1.5]" />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild size="lg" tooltip={user?.name || t('account')}>
                <Link href="/dashboard/account">
                  <Avatar className="h-7 w-7 shrink-0">
                    <AvatarImage src={(user as any)?.avatar} alt={user?.name || ''} />
                    <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground text-xs">
                      {initial}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex min-w-0 flex-col group-data-[collapsible=icon]:hidden">
                    <span className="truncate text-sm font-medium leading-tight">
                      {user?.name || t('account')}
                    </span>
                    {user?.email && (
                      <span className="truncate text-xs text-sidebar-foreground/60 leading-tight">
                        {user.email}
                      </span>
                    )}
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <SidebarInset>
        <div className="flex items-center gap-2 px-4 pt-3">
          <SidebarTrigger className="-ml-1" />
        </div>
        <div className="space-y-2 p-4 pt-2">
          <UpdateAppNotificationBar />
          <VerifyEmailAlert />
          <PastDueBillingAlert />
          <AccountDeletionAlert />
          <UpgradeToProAlert />
        </div>
        {children}
        <SurveyModal />
        <UpdateAppModal />
      </SidebarInset>
    </SidebarProvider>
  )
}
