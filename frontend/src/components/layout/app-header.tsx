'use client'

import { useState } from 'react'
import { Menu, Bell, Search, Settings, User, LogOut, Shield, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface AppHeaderProps {
  onMenuClick: () => void
  isMobile: boolean
}

export function AppHeader({ onMenuClick, isMobile }: AppHeaderProps) {
  const [searchQuery, setSearchQuery] = useState('')

  // Mock user data - in real app, get from auth context
  const user = {
    name: 'John Smith',
    email: 'john.smith@example.com',
    role: 'Security Analyst',
    tenant: 'Acme Corporation',
    avatar: '/avatars/john.jpg',
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        {/* Left section - Menu and Logo */}
        <div className="flex items-center space-x-4">
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onMenuClick}
              className="lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          
          {!isMobile && (
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-blue-600" />
              <span className="hidden font-bold sm:inline-block">BlickTrack</span>
            </div>
          )}
        </div>

        {/* Center section - Search */}
        <div className="flex flex-1 items-center justify-center px-4">
          <div className="w-full max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search threats, vulnerabilities, incidents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4"
              />
            </div>
          </div>
        </div>

        {/* Right section - Actions and User */}
        <div className="flex items-center space-x-4">
          {/* Tenant info - desktop only */}
          {!isMobile && (
            <div className="hidden md:flex items-center space-x-2 px-3 py-1 rounded-md bg-muted">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{user.tenant}</span>
            </div>
          )}

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs"
                >
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-64 overflow-y-auto">
                <DropdownMenuItem className="flex flex-col items-start space-y-1 p-3">
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 bg-red-500 rounded-full" />
                    <span className="font-medium text-sm">Critical Vulnerability</span>
                    <Badge variant="destructive" className="ml-auto">Critical</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    New critical vulnerability detected in user authentication module
                  </p>
                  <span className="text-xs text-muted-foreground">5 minutes ago</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start space-y-1 p-3">
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 bg-yellow-500 rounded-full" />
                    <span className="font-medium text-sm">Threat Model Updated</span>
                    <Badge variant="secondary" className="ml-auto">Medium</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Payment processing threat model has been updated
                  </p>
                  <span className="text-xs text-muted-foreground">2 hours ago</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start space-y-1 p-3">
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 bg-green-500 rounded-full" />
                    <span className="font-medium text-sm">Compliance Check</span>
                    <Badge variant="secondary" className="ml-auto">Info</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    SOC2 compliance check completed successfully
                  </p>
                  <span className="text-xs text-muted-foreground">1 day ago</span>
                </DropdownMenuItem>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-center justify-center">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant="outline" className="text-xs">
                      {user.role}
                    </Badge>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}