'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { 
  Settings, 
  ArrowLeft,
  Save,
  Globe,
  Mail,
  Bell,
  Shield,
  Database,
  Palette,
  Smartphone
} from 'lucide-react'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

interface SystemSettings {
  siteName: string
  siteDescription: string
  siteUrl: string
  supportEmail: string
  maintenanceMode: boolean
  allowRegistration: boolean
  emailNotifications: boolean
  maxFileSize: number
  sessionTimeout: number
  theme: 'light' | 'dark' | 'system'
  language: 'tr' | 'en'
}

export default function SettingsManagement() {
  const [settings, setSettings] = useState<SystemSettings>({
    siteName: 'ButcApp',
    siteDescription: 'Finansal yatırım yönetim platformu',
    siteUrl: 'https://butcapp.com',
    supportEmail: 'support@butcapp.com',
    maintenanceMode: false,
    allowRegistration: true,
    emailNotifications: true,
    maxFileSize: 10,
    sessionTimeout: 24,
    theme: 'system',
    language: 'tr'
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  useEffect(() => {
    checkAuth()
    fetchSettings()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/admin/auth')
      if (!response.ok) {
        router.push('/admin')
        return
      }
    } catch (error) {
      router.push('/admin')
    }
  }

  const fetchSettings = async () => {
    try {
      // Mock veriler
      setTimeout(() => {
        setLoading(false)
      }, 1000)
    } catch (error) {
      console.error('Settings fetch error:', error)
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage('')
    
    try {
      // Mock save operation
      setTimeout(() => {
        setSaving(false)
        setMessage('Ayarlar başarıyla kaydedildi!')
        setTimeout(() => setMessage(''), 3000)
      }, 1000)
    } catch (error) {
      setSaving(false)
      setMessage('Kaydetme işlemi başarısız oldu!')
    }
  }

  const handleInputChange = (field: keyof SystemSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/admin/dashboard')}
                className="mr-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Geri
              </Button>
              <div className="flex items-center">
                <Settings className="w-6 h-6 text-green-600 mr-3" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    Sistem Ayarları
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Sistem yapılandırmasını yönet
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {message && (
                <Badge variant={message.includes('başarı') ? 'default' : 'destructive'}>
                  {message}
                </Badge>
              )}
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-green-600 hover:bg-green-700"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Kaydediliyor...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Kaydet
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="general">Genel</TabsTrigger>
            <TabsTrigger value="security">Güvenlik</TabsTrigger>
            <TabsTrigger value="email">E-posta</TabsTrigger>
            <TabsTrigger value="notifications">Bildirimler</TabsTrigger>
            <TabsTrigger value="appearance">Görünüm</TabsTrigger>
            <TabsTrigger value="advanced">İleri</TabsTrigger>
          </TabsList>

          {/* Genel Ayarlar */}
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Genel Ayarlar
                </CardTitle>
                <CardDescription>
                  Sitenin temel yapılandırma ayarları
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="siteName">Site Adı</Label>
                    <Input
                      id="siteName"
                      value={settings.siteName}
                      onChange={(e) => handleInputChange('siteName', e.target.value)}
                      placeholder="Site adını girin"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="siteUrl">Site URL</Label>
                    <Input
                      id="siteUrl"
                      value={settings.siteUrl}
                      onChange={(e) => handleInputChange('siteUrl', e.target.value)}
                      placeholder="https://example.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteDescription">Site Açıklaması</Label>
                  <Textarea
                    id="siteDescription"
                    value={settings.siteDescription}
                    onChange={(e) => handleInputChange('siteDescription', e.target.value)}
                    placeholder="Site açıklamasını girin"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supportEmail">Destek E-postası</Label>
                  <Input
                    id="supportEmail"
                    type="email"
                    value={settings.supportEmail}
                    onChange={(e) => handleInputChange('supportEmail', e.target.value)}
                    placeholder="support@example.com"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Güvenlik Ayarları */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Güvenlik Ayarları
                </CardTitle>
                <CardDescription>
                  Sistem güvenliği ve erişim kontrolü
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Bakım Modu</Label>
                    <p className="text-sm text-gray-500">
                      Sitenin bakım modunda olup olmayacağını belirler
                    </p>
                  </div>
                  <Switch
                    checked={settings.maintenanceMode}
                    onCheckedChange={(checked) => handleInputChange('maintenanceMode', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Kullanıcı Kaydı</Label>
                    <p className="text-sm text-gray-500">
                      Yeni kullanıcı kaydına izin verilip verilmeyeceğini belirler
                    </p>
                  </div>
                  <Switch
                    checked={settings.allowRegistration}
                    onCheckedChange={(checked) => handleInputChange('allowRegistration', checked)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Oturum Zaman Aşımı (Saat)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    min="1"
                    max="168"
                    value={settings.sessionTimeout}
                    onChange={(e) => handleInputChange('sessionTimeout', parseInt(e.target.value))}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* E-posta Ayarları */}
          <TabsContent value="email">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  E-posta Ayarları
                </CardTitle>
                <CardDescription>
                  E-posta gönderimi ve SMTP yapılandırması
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>SMTP Sunucusu</Label>
                    <Input placeholder="smtp.example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label>SMTP Port</Label>
                    <Input type="number" placeholder="587" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>SMTP Kullanıcı Adı</Label>
                    <Input placeholder="email@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label>SMTP Şifre</Label>
                    <Input type="password" placeholder="••••••••" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>E-posta Bildirimleri</Label>
                    <p className="text-sm text-gray-500">
                      Sistem e-posta bildirimlerini etkinleştirir
                    </p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => handleInputChange('emailNotifications', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bildirim Ayarları */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Bildirim Ayarları
                </CardTitle>
                <CardDescription>
                  Sistem bildirimleri ve uyarılar
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Kullanıcı Bildirimleri</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Yatırım Bildirimleri</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Güvenlik Uyarıları</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Promosyonlar</Label>
                      <Switch />
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium">Admin Bildirimleri</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Yeni Kullanıcı Kayıtları</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Sistem Hataları</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Yedekleme Raporları</Label>
                      <Switch />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Görünüm Ayarları */}
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Görünüm Ayarları
                </CardTitle>
                <CardDescription>
                  Tema ve görünüm yapılandırması
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Tema</Label>
                    <select
                      value={settings.theme}
                      onChange={(e) => handleInputChange('theme', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="light">Açık</option>
                      <option value="dark">Koyu</option>
                      <option value="system">Sistem</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Dil</Label>
                    <select
                      value={settings.language}
                      onChange={(e) => handleInputChange('language', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="tr">Türkçe</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* İleri Ayarlar */}
          <TabsContent value="advanced">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  İleri Ayarlar
                </CardTitle>
                <CardDescription>
                  Gelişmiş sistem yapılandırması
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="maxFileSize">Maksimum Dosya Boyutu (MB)</Label>
                  <Input
                    id="maxFileSize"
                    type="number"
                    min="1"
                    max="100"
                    value={settings.maxFileSize}
                    onChange={(e) => handleInputChange('maxFileSize', parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium">Veritabanı Bakımı</h4>
                  <div className="flex gap-4">
                    <Button variant="outline">Optimize Et</Button>
                    <Button variant="outline">Yedekle</Button>
                    <Button variant="outline">Temizle</Button>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium">Önbellek Yönetimi</h4>
                  <div className="flex gap-4">
                    <Button variant="outline">Temizle</Button>
                    <Button variant="outline">Yeniden Oluştur</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}