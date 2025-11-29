'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Activity, 
  ArrowLeft,
  Search,
  Filter,
  Download,
  Trash2,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  Clock,
  User,
  Shield,
  MoreHorizontal
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface LogEntry {
  id: string
  timestamp: string
  level: 'info' | 'warning' | 'error' | 'success'
  category: 'auth' | 'user' | 'system' | 'api' | 'security'
  message: string
  userId?: string
  userEmail?: string
  ip?: string
  userAgent?: string
  details?: any
}

export default function LogsManagement() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterLevel, setFilterLevel] = useState<'all' | 'info' | 'warning' | 'error' | 'success'>('all')
  const [filterCategory, setFilterCategory] = useState<'all' | 'auth' | 'user' | 'system' | 'api' | 'security'>('all')
  const router = useRouter()

  useEffect(() => {
    checkAuth()
    fetchLogs()
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

  const fetchLogs = async () => {
    try {
      // Mock veriler
      setTimeout(() => {
        setLogs([
          {
            id: '1',
            timestamp: '2024-11-29T10:30:15Z',
            level: 'success',
            category: 'auth',
            message: 'Admin kullanıcı giriş yaptı',
            userId: 'admin123',
            userEmail: 'admin@butcapp.com',
            ip: '192.168.1.100',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          },
          {
            id: '2',
            timestamp: '2024-11-29T10:25:30Z',
            level: 'warning',
            category: 'security',
            message: 'Başarısız giriş denemesi',
            userId: null,
            userEmail: 'unknown@hack.com',
            ip: '192.168.1.200',
            userAgent: 'Mozilla/5.0 (compatible; scanner/1.0)'
          },
          {
            id: '3',
            timestamp: '2024-11-29T10:20:45Z',
            level: 'info',
            category: 'user',
            message: 'Yeni kullanıcı kaydı',
            userId: 'user456',
            userEmail: 'newuser@example.com',
            ip: '192.168.1.150'
          },
          {
            id: '4',
            timestamp: '2024-11-29T10:15:20Z',
            level: 'error',
            category: 'api',
            message: 'Database connection timeout',
            details: { error: 'Connection timeout after 30 seconds', query: 'SELECT * FROM investments' }
          },
          {
            id: '5',
            timestamp: '2024-11-29T10:10:10Z',
            level: 'success',
            category: 'system',
            message: 'Otomatik yedekleme tamamlandı',
            details: { size: '2.3GB', duration: '45 seconds' }
          },
          {
            id: '6',
            timestamp: '2024-11-29T09:55:30Z',
            level: 'info',
            category: 'auth',
            message: 'Kullanıcı şifre değiştirdi',
            userId: 'user789',
            userEmail: 'user@example.com',
            ip: '192.168.1.120'
          }
        ])
        setLoading(false)
      }, 1000)
    } catch (error) {
      console.error('Logs fetch error:', error)
      setLoading(false)
    }
  }

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (log.userEmail && log.userEmail.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesLevel = filterLevel === 'all' || log.level === filterLevel
    const matchesCategory = filterCategory === 'all' || log.category === filterCategory
    return matchesSearch && matchesLevel && matchesCategory
  })

  const getLevelBadge = (level: string) => {
    const variants = {
      info: 'bg-blue-100 text-blue-800',
      warning: 'bg-yellow-100 text-yellow-800',
      error: 'bg-red-100 text-red-800',
      success: 'bg-green-100 text-green-800'
    }
    const icons = {
      info: Info,
      warning: AlertTriangle,
      error: XCircle,
      success: CheckCircle
    }
    const Icon = icons[level as keyof typeof icons]
    return (
      <Badge className={variants[level as keyof typeof variants]}>
        <Icon className="w-3 h-3 mr-1" />
        {level.toUpperCase()}
      </Badge>
    )
  }

  const getCategoryBadge = (category: string) => {
    const variants = {
      auth: 'bg-purple-100 text-purple-800',
      user: 'bg-blue-100 text-blue-800',
      system: 'bg-gray-100 text-gray-800',
      api: 'bg-orange-100 text-orange-800',
      security: 'bg-red-100 text-red-800'
    }
    const icons = {
      auth: Shield,
      user: User,
      system: Activity,
      api: Activity,
      security: Shield
    }
    const Icon = icons[category as keyof typeof icons]
    return (
      <Badge className={variants[category as keyof typeof variants]}>
        <Icon className="w-3 h-3 mr-1" />
        {category.toUpperCase()}
      </Badge>
    )
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('tr-TR')
  }

  const exportLogs = () => {
    // Mock export functionality
    const csvContent = logs.map(log => 
      `${log.timestamp},${log.level},${log.category},${log.message},${log.userEmail || ''},${log.ip || ''}`
    ).join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `logs-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  const clearLogs = () => {
    if (confirm('Tüm logları temizlemek istediğinizden emin misiniz? Bu işlem geri alınamaz.')) {
      setLogs([])
    }
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
                <Activity className="w-6 h-6 text-orange-600 mr-3" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    Log ve Raporlar
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Sistem loglarını ve raporlarını görüntüle
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={exportLogs}>
                <Download className="w-4 h-4 mr-2" />
                İndir
              </Button>
              <Button variant="outline" onClick={clearLogs} className="text-red-600">
                <Trash2 className="w-4 h-4 mr-2" />
                Temizle
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Toplam Log</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{logs.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hata</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {logs.filter(l => l.level === 'error').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Uyarı</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {logs.filter(l => l.level === 'warning').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Başarılı</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {logs.filter(l => l.level === 'success').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filtreler
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="search">Arama</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Mesaj veya e-posta ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="sm:w-48">
                <Label htmlFor="level">Seviye</Label>
                <select
                  id="level"
                  value={filterLevel}
                  onChange={(e) => setFilterLevel(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Tümü</option>
                  <option value="info">Bilgi</option>
                  <option value="warning">Uyarı</option>
                  <option value="error">Hata</option>
                  <option value="success">Başarılı</option>
                </select>
              </div>
              <div className="sm:w-48">
                <Label htmlFor="category">Kategori</Label>
                <select
                  id="category"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Tümü</option>
                  <option value="auth">Yetkilendirme</option>
                  <option value="user">Kullanıcı</option>
                  <option value="system">Sistem</option>
                  <option value="api">API</option>
                  <option value="security">Güvenlik</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Logs Table */}
        <Card>
          <CardHeader>
            <CardTitle>Log Kayıtları</CardTitle>
            <CardDescription>
              {filteredLogs.length} log kaydı bulundu
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">Zaman</th>
                    <th className="text-left p-4">Seviye</th>
                    <th className="text-left p-4">Kategori</th>
                    <th className="text-left p-4">Mesaj</th>
                    <th className="text-left p-4">Kullanıcı</th>
                    <th className="text-left p-4">IP</th>
                    <th className="text-left p-4">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="p-4">
                        <div className="text-sm flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTimestamp(log.timestamp)}
                        </div>
                      </td>
                      <td className="p-4">{getLevelBadge(log.level)}</td>
                      <td className="p-4">{getCategoryBadge(log.category)}</td>
                      <td className="p-4">
                        <div className="max-w-xs">
                          <div className="font-medium text-sm">{log.message}</div>
                          {log.details && (
                            <div className="text-xs text-gray-500 mt-1">
                              {JSON.stringify(log.details)}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          {log.userEmail || '-'}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm font-mono">
                          {log.ip || '-'}
                        </div>
                      </td>
                      <td className="p-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>İşlemler</DropdownMenuLabel>
                            <DropdownMenuItem>Detayları Görüntüle</DropdownMenuItem>
                            <DropdownMenuItem>İlişkili Loglar</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              Log'u Sil
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}