'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BarChart3, 
  Users, 
  FileText, 
  Settings, 
  Database, 
  LogOut, 
  Menu,
  Home,
  Edit,
  Plus
} from 'lucide-react'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')

  const menuItems = [
    {
      id: 'overview',
      label: 'Genel Bakış',
      icon: BarChart3,
      href: '/admin/dashboard'
    },
    {
      id: 'blog',
      label: 'Blog Yönetimi',
      icon: FileText,
      href: '/admin/blog'
    },
    {
      id: 'users',
      label: 'Kullanıcılar',
      icon: Users,
      href: '/admin/users'
    },
    {
      id: 'settings',
      label: 'Ayarlar',
      icon: Settings,
      href: '/admin/settings'
    },
    {
      id: 'database',
      label: 'Veritabanı',
      icon: Database,
      href: '/admin/database'
    },
    {
      id: 'logs',
      label: 'Loglar',
      icon: LogOut,
      href: '/admin/logs'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-screen">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-8">
              <img 
                src="/favicon.png" 
                alt="ButcApp Admin" 
                className="w-8 h-8 rounded-lg"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">ButcApp</p>
              </div>
            </div>

            <nav className="space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </nav>

            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
              <Link
                href="/"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Home className="w-5 h-5" />
                <span className="font-medium">Ana Sayfa</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Hoş Geldiniz, Admin
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                ButcApp yönetim paneline hoş geldiniz. Sol menüden istediğiniz bölümü seçebilirsiniz.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                      <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">12</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Toplam Yazı</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                      <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">1,234</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Toplam Ziyaretçi</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                      <Edit className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">8</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Yayında</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
                      <BarChart3 className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">2.5K</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Toplam Görüntülenme</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Hızlı Eylemler
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Link href="/admin/blog">
                    <Button className="w-full justify-start" variant="outline">
                      <FileText className="w-4 h-4 mr-2" />
                      Yeni Blog Yazısı
                    </Button>
                  </Link>
                  <Button className="w-full justify-start" variant="outline">
                    <Users className="w-4 h-4 mr-2" />
                      Kullanıcı Ekle
                    </Button>
                  </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Son Aktiviteler</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Yeni yazı oluşturuldu</span>
                      <Badge>2 dk önce</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Kullanıcı kayıt oldu</span>
                      <Badge variant="outline">15 dk önce</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Yorum yapıldı</span>
                      <Badge variant="outline">1 saat önce</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}