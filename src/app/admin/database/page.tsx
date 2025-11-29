'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Database, 
  ArrowLeft,
  Play,
  Pause,
  RefreshCw,
  Download,
  Upload,
  Trash2,
  HardDrive,
  Server,
  Activity,
  Clock,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  FileText,
  Settings
} from 'lucide-react'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

interface DatabaseStats {
  totalSize: string
  usedSize: string
  freeSize: string
  tableCount: number
  totalRecords: number
  lastBackup: string
  backupStatus: 'success' | 'warning' | 'error'
  uptime: string
  connections: number
  queryPerSecond: number
}

interface TableInfo {
  name: string
  records: number
  size: string
  lastModified: string
  status: 'healthy' | 'warning' | 'error'
}

interface BackupInfo {
  id: string
  filename: string
  size: string
  createdAt: string
  status: 'completed' | 'in_progress' | 'failed'
  type: 'manual' | 'automatic'
}

export default function DatabaseManagement() {
  const [stats, setStats] = useState<DatabaseStats>({
    totalSize: '10 GB',
    usedSize: '7.2 GB',
    freeSize: '2.8 GB',
    tableCount: 8,
    totalRecords: 45678,
    lastBackup: '2024-11-29 02:00:00',
    backupStatus: 'success',
    uptime: '15 gün 3 saat',
    connections: 12,
    queryPerSecond: 45
  })
  const [tables, setTables] = useState<TableInfo[]>([])
  const [backups, setBackups] = useState<BackupInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [backupInProgress, setBackupInProgress] = useState(false)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
    fetchDatabaseInfo()
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

  const fetchDatabaseInfo = async () => {
    try {
      // Mock veriler
      setTimeout(() => {
        setTables([
          {
            name: 'app_users',
            records: 1247,
            size: '45.2 MB',
            lastModified: '2024-11-29 10:30:00',
            status: 'healthy'
          },
          {
            name: 'investments',
            records: 45678,
            size: '1.2 GB',
            lastModified: '2024-11-29 10:25:00',
            status: 'healthy'
          },
          {
            name: 'user_sessions',
            records: 892,
            size: '12.8 MB',
            lastModified: '2024-11-29 10:20:00',
            status: 'healthy'
          },
          {
            name: 'system_logs',
            records: 15623,
            size: '234.5 MB',
            lastModified: '2024-11-29 10:15:00',
            status: 'warning'
          },
          {
            name: 'audit_trail',
            records: 8934,
            size: '156.3 MB',
            lastModified: '2024-11-29 10:10:00',
            status: 'healthy'
          }
        ])
        setBackups([
          {
            id: '1',
            filename: 'backup_20241129_020000.sql',
            size: '1.8 GB',
            createdAt: '2024-11-29 02:00:00',
            status: 'completed',
            type: 'automatic'
          },
          {
            id: '2',
            filename: 'backup_20241128_020000.sql',
            size: '1.7 GB',
            createdAt: '2024-11-28 02:00:00',
            status: 'completed',
            type: 'automatic'
          },
          {
            id: '3',
            filename: 'manual_backup_20241127_143000.sql',
            size: '1.7 GB',
            createdAt: '2024-11-27 14:30:00',
            status: 'completed',
            type: 'manual'
          }
        ])
        setLoading(false)
      }, 1000)
    } catch (error) {
      console.error('Database info fetch error:', error)
      setLoading(false)
    }
  }

  const createBackup = async () => {
    setBackupInProgress(true)
    try {
      // Mock backup process
      setTimeout(() => {
        const newBackup: BackupInfo = {
          id: Date.now().toString(),
          filename: `manual_backup_${new Date().toISOString().replace(/[:.]/g, '_')}.sql`,
          size: '1.8 GB',
          createdAt: new Date().toLocaleString('tr-TR'),
          status: 'completed',
          type: 'manual'
        }
        setBackups(prev => [newBackup, ...prev])
        setBackupInProgress(false)
      }, 3000)
    } catch (error) {
      setBackupInProgress(false)
    }
  }

  const optimizeDatabase = () => {
    if (confirm('Veritabanı optimizasyonu başlatmak istediğinizden emin misiniz? Bu işlem biraz sürebilir.')) {
      // Mock optimization
      setTimeout(() => {
        alert('Veritabanı başarıyla optimize edildi!')
      }, 2000)
    }
  }

  const clearLogs = () => {
    if (confirm('Sistem loglarını temizlemek istediğinizden emin misiniz?')) {
      // Mock log clearing
      setTimeout(() => {
        alert('Loglar başarıyla temizlendi!')
        fetchDatabaseInfo()
      }, 1000)
    }
  }

  const getStoragePercentage = () => {
    const used = parseFloat(stats.usedSize)
    const total = parseFloat(stats.totalSize)
    return (used / total) * 100
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      healthy: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      error: 'bg-red-100 text-red-800'
    }
    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {status === 'healthy' ? 'Sağlıklı' : status === 'warning' ? 'Uyarı' : 'Hata'}
      </Badge>
    )
  }

  const getBackupStatusBadge = (status: string) => {
    const variants = {
      completed: 'bg-green-100 text-green-800',
      in_progress: 'bg-blue-100 text-blue-800',
      failed: 'bg-red-100 text-red-800'
    }
    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {status === 'completed' ? 'Tamamlandı' : status === 'in_progress' ? 'Devam Ediyor' : 'Başarısız'}
      </Badge>
    )
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
                <Database className="w-6 h-6 text-purple-600 mr-3" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    Veritabanı Yönetimi
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Veritabanı yönetimi ve yedekleme
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={optimizeDatabase}>
                <Settings className="w-4 h-4 mr-2" />
                Optimize Et
              </Button>
              <Button 
                onClick={createBackup} 
                disabled={backupInProgress}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {backupInProgress ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Yedekleniyor...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Yedekle
                  </>
                )}
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
              <CardTitle className="text-sm font-medium">Depolama</CardTitle>
              <HardDrive className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.usedSize}</div>
              <div className="text-xs text-muted-foreground">
                {stats.freeSize} boş
              </div>
              <Progress value={getStoragePercentage()} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tablolar</CardTitle>
              <Server className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.tableCount}</div>
              <div className="text-xs text-muted-foreground">
                {stats.totalRecords.toLocaleString()} toplam kayıt
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bağlantılar</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.connections}</div>
              <div className="text-xs text-muted-foreground">
                {stats.queryPerSecond} sorgu/saniye
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Son Yedek</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-bold">{stats.lastBackup}</div>
              <div className="text-xs text-muted-foreground">
                {getStatusBadge(stats.backupStatus)}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
            <TabsTrigger value="tables">Tablolar</TabsTrigger>
            <TabsTrigger value="backups">Yedekler</TabsTrigger>
            <TabsTrigger value="maintenance">Bakım</TabsTrigger>
          </TabsList>

          {/* Genel Bakış */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Veritabanı Durumu
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Toplam Boyut</span>
                    <span className="font-medium">{stats.totalSize}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Kullanılan</span>
                    <span className="font-medium">{stats.usedSize}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Boş Alan</span>
                    <span className="font-medium">{stats.freeSize}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Çalışma Süresi</span>
                    <span className="font-medium">{stats.uptime}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Performans
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Aktif Bağlantı</span>
                    <span className="font-medium">{stats.connections}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Sorgu/Saniye</span>
                    <span className="font-medium">{stats.queryPerSecond}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Tablo Sayısı</span>
                    <span className="font-medium">{stats.tableCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Toplam Kayıt</span>
                    <span className="font-medium">{stats.totalRecords.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tablolar */}
          <TabsContent value="tables">
            <Card>
              <CardHeader>
                <CardTitle>Tablolar</CardTitle>
                <CardDescription>
                  Veritabanı tablolarının durumu ve istatistikleri
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4">Tablo Adı</th>
                        <th className="text-left p-4">Kayıt Sayısı</th>
                        <th className="text-left p-4">Boyut</th>
                        <th className="text-left p-4">Son Değişiklik</th>
                        <th className="text-left p-4">Durum</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tables.map((table, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td className="p-4 font-medium">{table.name}</td>
                          <td className="p-4">{table.records.toLocaleString()}</td>
                          <td className="p-4">{table.size}</td>
                          <td className="p-4 text-sm">{table.lastModified}</td>
                          <td className="p-4">{getStatusBadge(table.status)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Yedekler */}
          <TabsContent value="backups">
            <Card>
              <CardHeader>
                <CardTitle>Yedekler</CardTitle>
                <CardDescription>
                  Veritabanı yedekleme geçmişi
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4">Dosya Adı</th>
                        <th className="text-left p-4">Boyut</th>
                        <th className="text-left p-4">Oluşturulma</th>
                        <th className="text-left p-4">Tür</th>
                        <th className="text-left p-4">Durum</th>
                        <th className="text-left p-4">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
                      {backups.map((backup) => (
                        <tr key={backup.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td className="p-4 font-medium">{backup.filename}</td>
                          <td className="p-4">{backup.size}</td>
                          <td className="p-4 text-sm">{backup.createdAt}</td>
                          <td className="p-4">
                            <Badge variant={backup.type === 'automatic' ? 'secondary' : 'default'}>
                              {backup.type === 'automatic' ? 'Otomatik' : 'Manuel'}
                            </Badge>
                          </td>
                          <td className="p-4">{getBackupStatusBadge(backup.status)}</td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Download className="w-3 h-3" />
                              </Button>
                              <Button variant="outline" size="sm" className="text-red-600">
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bakım */}
          <TabsContent value="maintenance">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Bakım İşlemleri
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Veritabanı Optimizasyonu</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Tabloları optimize eder ve performansı artırır
                    </p>
                    <Button onClick={optimizeDatabase} className="w-full">
                      <Play className="w-4 h-4 mr-2" />
                      Optimize Et
                    </Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Log Temizleme</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Eski sistem loglarını temizler
                    </p>
                    <Button onClick={clearLogs} variant="outline" className="w-full">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Logları Temizle
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Sistem Raporları
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Veritabanı Raporu</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Detaylı veritabanı analizi raporu
                    </p>
                    <Button variant="outline" className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      İndir
                    </Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Performans Raporu</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Sistem performans metrikleri
                    </p>
                    <Button variant="outline" className="w-full">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Görüntüle
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}