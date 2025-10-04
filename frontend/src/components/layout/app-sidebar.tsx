'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
  Shield,
  Home,
  Users,
  Settings,
  FileText,
  AlertTriangle,
  Activity,
  Database,
  Network,
  Lock,
  Eye,
  BarChart3,
  UserCheck,
  Globe,
  Zap,
  Building,
  ChevronDown,
  ChevronRight,
} from 'lucide-react'

interface NavigationItem {
  title: string
  href: string
  icon: any
  badge?: {
    text: string
    variant: 'default' | 'secondary' | 'destructive' | 'outline'
  } | null
  items?: NavigationItem[]
}

interface AppSidebarProps {
  className?: string
}

const navigationItems: NavigationItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    badge: null,
  },
  {
    title: 'Security Overview',
    href: '/security',
    icon: Shield,
    badge: {
      text: '12',
      variant: 'destructive'
    },
    items: [
      { title: 'Threats', href: '/security/threats', icon: AlertTriangle, badge: null },
      { title: 'Vulnerabilities', href: '/security/vulnerabilities', icon: Eye, badge: null },
      { title: 'Compliance', href: '/security/compliance', icon: FileText, badge: null },
    ],
  },
  {
    title: 'Asset Management',
    href: '/assets',
    icon: Database,
    badge: null,
    items: [
      { title: 'All Assets', href: '/assets/all', icon: Database, badge: null },
      { title: 'Networks', href: '/assets/networks', icon: Network, badge: null },
      { title: 'Endpoints', href: '/assets/endpoints', icon: Activity, badge: null },
    ],
  },
  {
    title: 'Identity & Access',
    href: '/identity',
    icon: UserCheck,
    badge: null,
    items: [
      { title: 'Users', href: '/identity/users', icon: Users, badge: null },
      { title: 'Roles', href: '/identity/roles', icon: Lock, badge: null },
      { title: 'Permissions', href: '/identity/permissions', icon: Settings, badge: null },
    ],
  },
  {
    title: 'Monitoring',
    href: '/monitoring',
    icon: Activity,
    badge: {
      text: '3',
      variant: 'secondary'
    },
    items: [
      { title: 'Real-time', href: '/monitoring/realtime', icon: Zap, badge: null },
      { title: 'Logs', href: '/monitoring/logs', icon: FileText, badge: null },
      { title: 'Analytics', href: '/monitoring/analytics', icon: BarChart3, badge: null },
    ],
  },
  {
    title: 'Compliance',
    href: '/compliance',
    icon: FileText,
    badge: null,
    items: [
      { title: 'Frameworks', href: '/compliance/frameworks', icon: Building, badge: null },
      { title: 'Audits', href: '/compliance/audits', icon: Eye, badge: null },
      { title: 'Reports', href: '/compliance/reports', icon: BarChart3, badge: null },
    ],
  },
  {
    title: 'Administration',
    href: '/admin',
    icon: Settings,
    badge: null,
    items: [
      { title: 'System Settings', href: '/admin/system', icon: Settings, badge: null },
      { title: 'User Management', href: '/admin/users', icon: Users, badge: null },
      { title: 'Integration', href: '/admin/integrations', icon: Globe, badge: null },
    ],
  },
]

export function AppSidebar({ className }: AppSidebarProps) {
  const pathname = usePathname()
  const [openItems, setOpenItems] = useState<string[]>([])

  const toggleItem = (href: string) => {
    setOpenItems(prev =>
      prev.includes(href)
        ? prev.filter(item => item !== href)
        : [...prev, href]
    )
  }

  const isOpen = (href: string) => openItems.includes(href)

  return (
    <div className={cn('flex h-full w-64 flex-col border-r bg-background', className)}>
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6">
        <div className="flex items-center space-x-2">
          <Shield className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">BlickTrack</span>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navigationItems.map((item) => {
            const isItemOpen = isOpen(item.href)
            const hasChildren = item.items && item.items.length > 0

            if (hasChildren) {
              return (
                <Collapsible key={item.href} open={isItemOpen} onOpenChange={() => toggleItem(item.href)}>
                  <CollapsibleTrigger className={cn(
                    'flex w-full items-center justify-start rounded-md p-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
                    pathname.startsWith(item.href)
                      ? 'bg-accent text-accent-foreground'
                      : 'text-foreground'
                  )}>
                    <item.icon className="h-4 w-4 mr-3" />
                    <span className="flex-1 text-left">{item.title}</span>
                    {item.badge && (
                      <Badge variant={item.badge.variant} className="ml-2 text-xs">
                        {item.badge.text}
                      </Badge>
                    )}
                    {isItemOpen ? (
                      <ChevronDown className="h-4 w-4 ml-2" />
                    ) : (
                      <ChevronRight className="h-4 w-4 ml-2" />
                    )}
                  </CollapsibleTrigger>
                  <CollapsibleContent className="ml-6 mt-1 space-y-1">
                    {item.items?.map((subItem) => (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        className={cn(
                          'flex items-center rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                          pathname === subItem.href
                            ? 'bg-accent text-accent-foreground'
                            : 'text-muted-foreground hover:text-foreground'
                        )}
                      >
                        <subItem.icon className="h-3 w-3 mr-3" />
                        <span>{subItem.title}</span>
                        {subItem.badge && (
                          <Badge variant={subItem.badge.variant} className="ml-auto text-xs">
                            {subItem.badge.text}
                          </Badge>
                        )}
                      </Link>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              )
            } else {
              // Regular menu item - no asChild to avoid the React.Children.only error
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                    pathname === item.href
                      ? 'bg-accent text-accent-foreground'
                      : 'text-foreground'
                  )}
                >
                  <item.icon className="h-4 w-4 mr-3" />
                  <span>{item.title}</span>
                  {item.badge && (
                    <Badge variant={item.badge.variant} className="ml-auto text-xs">
                      {item.badge.text}
                    </Badge>
                  )}
                </Link>
              )
            }
          })}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t p-4">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Users className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Admin User</p>
            <p className="text-xs text-muted-foreground truncate">Platform Administrator</p>
          </div>
        </div>
      </div>
    </div>
  )
}