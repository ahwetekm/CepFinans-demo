'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Upload, Eye, EyeOff, Save, Trash2, Plus, Edit, FileText, Image as ImageIcon, Calendar, Clock, User } from 'lucide-react'
import RichTextEditor from '@/components/admin/RichTextEditor'

interface Post {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage?: string
  featured: boolean
  status: string
  viewCount: number
  readTime: number
  createdAt: string
  publishedAt?: string
  author: {
    name: string
    email: string
  }
  category?: {
    id: string
    name: string
    slug: string
  }
  tags: Array<{
    id: string
    name: string
    slug: string
    color?: string
  }>
  _count: {
    comments: number
  }
}

interface Category {
  id: string
  name: string
  slug: string
}

interface Tag {
  id: string
  name: string
  slug: string
  color?: string
}

export default function BlogManagement() {
  const [posts, setPosts] = useState<Post[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('posts')
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    coverImage: '',
    featured: false,
    status: 'DRAFT',
    categoryId: 'none',
    tagIds: [] as string[],
    seoTitle: '',
    seoDescription: '',
    keywords: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Load data
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      // Load posts
      const postsResponse = await fetch('/api/admin/blog')
      const postsData = await postsResponse.json()
      setPosts(postsData.posts || [])

      // Load categories
      const categoriesResponse = await fetch('/api/blog/categories')
      const categoriesData = await categoriesResponse.json()
      setCategories(categoriesData || [])

      // Load tags
      // Note: Tags API doesn't exist yet, using empty array
      setTags([])
    } catch (error) {
      console.error('Error loading data:', error)
    }
  }

  const handleImageUpload = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()
      if (data.success) {
        setFormData(prev => ({ ...prev, coverImage: data.url }))
      } else {
        alert('Resim yüklenemedi: ' + data.error)
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Resim yüklenirken hata oluştu')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const submitData = {
        ...formData,
        authorId: 'admin-user-id' // This should come from auth
      }

      let response
      if (editingPost) {
        response = await fetch(`/api/admin/blog?id=${editingPost.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submitData)
        })
      } else {
        response = await fetch('/api/admin/blog', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submitData)
        })
      }

      const data = await response.json()
      if (response.ok) {
        alert(editingPost ? 'Yazı başarıyla güncellendi!' : 'Yazı başarıyla oluşturuldu!')
        setEditingPost(null)
        setFormData({
          title: '',
          slug: '',
          excerpt: '',
          content: '',
          coverImage: '',
          featured: false,
          status: 'DRAFT',
          categoryId: 'none',
          tagIds: [],
          seoTitle: '',
          seoDescription: '',
          keywords: ''
        })
        loadData()
      } else {
        alert('Hata: ' + data.error)
      }
    } catch (error) {
      console.error('Error saving post:', error)
      alert('Yazı kaydedilirken hata oluştu')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (post: Post) => {
    setEditingPost(post)
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || '',
      content: post.content,
      coverImage: post.coverImage || '',
      featured: post.featured,
      status: post.status,
      categoryId: post.category?.id || 'none',
      tagIds: post.tags.map(tag => tag.id),
      seoTitle: '',
      seoDescription: '',
      keywords: ''
    })
    setActiveTab('editor')
  }

  const handleDelete = async (postId: string) => {
    if (!confirm('Bu yazıyı silmek istediğinizden emin misiniz?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/blog?id=${postId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        alert('Yazı başarıyla silindi!')
        loadData()
      } else {
        alert('Yazı silinirken hata oluştu')
      }
    } catch (error) {
      console.error('Error deleting post:', error)
      alert('Yazı silinirken hata oluştu')
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      DRAFT: { label: 'Taslak', variant: 'secondary' as const },
      PUBLISHED: { label: 'Yayında', variant: 'default' as const },
      ARCHIVED: { label: 'Arşiv', variant: 'outline' as const }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.DRAFT
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Blog Yönetimi</h1>
          <p className="text-gray-600 dark:text-gray-300">Blog yazılarını oluşturun, düzenleyin ve yayınlayın</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="posts" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Yazılar
            </TabsTrigger>
            <TabsTrigger value="editor" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              {editingPost ? 'Düzenle' : 'Yeni Yazı'}
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Ayarlar
            </TabsTrigger>
          </TabsList>

          {/* Posts List */}
          <TabsContent value="posts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Yazılar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {posts.map((post) => (
                    <div key={post.id} className="border rounded-lg p-4 space-y-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold">{post.title}</h3>
                            {getStatusBadge(post.status)}
                            {post.featured && <Badge variant="outline" className="ml-2">Öne Çıkan</Badge>}
                          </div>
                          <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
                            {post.excerpt || 'Özet yok'}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(post.createdAt).toLocaleDateString('tr-TR')}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {post.readTime} dk okuma
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              {post.viewCount} görüntülenme
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(post)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Düzenle
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(post.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Sil
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Editor */}
          <TabsContent value="editor" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{editingPost ? 'Yazıyı Düzenle' : 'Yeni Yazı Oluştur'}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="title">Başlık</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Yazı başlığı..."
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="slug">URL (Slug)</Label>
                      <Input
                        id="slug"
                        value={formData.slug}
                        onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                        placeholder="yazi-basligi"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="excerpt">Özet</Label>
                    <Textarea
                      id="excerpt"
                      value={formData.excerpt}
                      onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                      placeholder="Yazı özeti..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">İçerik</Label>
                    <RichTextEditor
                      content={formData.content}
                      onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                      placeholder="Yazı içeriğini buraya yazın..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="status">Durum</Label>
                      <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="DRAFT">Taslak</SelectItem>
                          <SelectItem value="PUBLISHED">Yayında</SelectItem>
                          <SelectItem value="ARCHIVED">Arşiv</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Kategori</Label>
                      <Select value={formData.categoryId} onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Kategori seç" />
                        </SelectTrigger>
                          <SelectContent>
                          <SelectItem value="none">Kategori Yok</SelectItem>
                          {categories.map(category => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="featured"
                        checked={formData.featured}
                        onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                        className="rounded"
                      />
                      <Label htmlFor="featured">Öne Çıkan</Label>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label>Kapak Resmi</Label>
                    <div className="space-y-2">
                      {formData.coverImage && (
                        <div className="relative">
                          <img
                            src={formData.coverImage}
                            alt="Kapak resmi"
                            className="w-full h-48 object-cover rounded-lg"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => setFormData(prev => ({ ...prev, coverImage: '' }))}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                      <div>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              handleImageUpload(file)
                            }
                          }}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setEditingPost(null)
                        setFormData({
                          title: '',
                          slug: '',
                          excerpt: '',
                          content: '',
                          coverImage: '',
                          featured: false,
                          status: 'DRAFT',
                          categoryId: 'none',
                          tagIds: [],
                          seoTitle: '',
                          seoDescription: '',
                          keywords: ''
                        })
                        setActiveTab('posts')
                      }}
                    >
                      İptal
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Kaydediliyor...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          {editingPost ? 'Güncelle' : 'Kaydet'}
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Ayarlar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Kategoriler</h3>
                    <div className="space-y-2">
                      {categories.map(category => (
                        <div key={category.id} className="flex items-center justify-between p-2 border rounded">
                          <span>{category.name}</span>
                          <Badge variant="outline">{category.slug}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Etiketler</h3>
                    <div className="space-y-2">
                      {tags.map(tag => (
                        <div key={tag.id} className="flex items-center justify-between p-2 border rounded">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-4 h-4 rounded"
                              style={{ backgroundColor: tag.color }}
                            />
                            <span>{tag.name}</span>
                          </div>
                          <Badge variant="outline">{tag.slug}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}