'use client'

import { useState, useCallback, useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import { Bold, Italic, Strikethrough, List, ListOrdered, Quote, Image as ImageIcon, Link as LinkIcon, Undo, Redo } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  editable?: boolean
}

export default function RichTextEditor({ 
  content, 
  onChange, 
  placeholder = 'İçeriği buraya yazın...', 
  editable = true 
}: RichTextEditorProps) {
  const [mounted, setMounted] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [imageAlt, setImageAlt] = useState('')
  const [linkUrl, setLinkUrl] = useState('')
  const [showImageDialog, setShowImageDialog] = useState(false)
  const [showLinkDialog, setShowLinkDialog] = useState(false)
  const [headingLevel, setHeadingLevel] = useState('p')

  useEffect(() => {
    setMounted(true)
  }, [])

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        placeholder,
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full h-auto',
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      if (editor) {
        onChange(editor.getHTML())
      }
    },
    editable,
  })

  const addImage = useCallback(() => {
    if (imageUrl && editor) {
      editor.chain().focus().setImage({ src: imageUrl, alt: imageAlt }).run()
      setImageUrl('')
      setImageAlt('')
      setShowImageDialog(false)
    }
  }, [imageUrl, imageAlt, editor])

  const addLink = useCallback(() => {
    if (linkUrl && editor) {
      editor.chain().focus().setLink({ href: linkUrl }).run()
      setLinkUrl('')
      setShowLinkDialog(false)
    }
  }, [linkUrl, editor])

  const setHeading = useCallback((level: string) => {
    if (!editor) return
    
    if (level === 'p') {
      editor.chain().focus().setParagraph().run()
    } else {
      editor.chain().focus().toggleHeading({ level: parseInt(level) as 1 | 2 | 3 | 4 | 5 | 6 }).run()
    }
    setHeadingLevel(level)
  }, [editor])

  const insertParagraph = useCallback(() => {
    if (editor) {
      editor.chain().focus().setParagraph().run()
      setHeadingLevel('p')
    }
  }, [editor])

  const isButtonActive = (type: string, attrs = {}) => {
    return editor ? editor.isActive(type, attrs) : false
  }

  const canExecuteCommand = (command: string) => {
    return editor ? editor.can().chain().focus()[command]().run() : false
  }

  // Don't render until mounted on client
  if (!mounted) {
    return (
      <div className="border rounded-lg p-4 min-h-[400px] flex items-center justify-center">
        <div className="text-gray-500">Loading editor...</div>
      </div>
    )
  }

  return (
    <div className="border rounded-lg">
      {/* Toolbar */}
      <div className="border-b p-2 flex flex-wrap gap-1 bg-gray-50 dark:bg-gray-800">
        {/* Undo/Redo */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor?.chain().focus().undo().run()}
          disabled={!canExecuteCommand('undo')}
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor?.chain().focus().redo().run()}
          disabled={!canExecuteCommand('redo')}
        >
          <Redo className="h-4 w-4" />
        </Button>

        {/* Heading Selector */}
        <Select value={headingLevel} onValueChange={setHeading}>
          <SelectTrigger className="w-20 h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="p">Paragraf</SelectItem>
            <SelectItem value="1">Başlık 1</SelectItem>
            <SelectItem value="2">Başlık 2</SelectItem>
            <SelectItem value="3">Başlık 3</SelectItem>
            <SelectItem value="4">Başlık 4</SelectItem>
            <SelectItem value="5">Başlık 5</SelectItem>
            <SelectItem value="6">Başlık 6</SelectItem>
          </SelectContent>
        </Select>

        {/* Text Formatting */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={isButtonActive('bold') ? "bg-gray-200 dark:bg-gray-700" : ""}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={isButtonActive('italic') ? "bg-gray-200 dark:bg-gray-700" : ""}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor?.chain().focus().toggleStrike().run()}
          className={isButtonActive('strike') ? "bg-gray-200 dark:bg-gray-700" : ""}
        >
          <Strikethrough className="h-4 w-4" />
        </Button>

        {/* Lists */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          className={isButtonActive('bulletList') ? "bg-gray-200 dark:bg-gray-700" : ""}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          className={isButtonActive('orderedList') ? "bg-gray-200 dark:bg-gray-700" : ""}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        {/* Special Actions */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setShowLinkDialog(true)}
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setShowImageDialog(true)}
        >
          <ImageIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
          className={isButtonActive('blockquote') ? "bg-gray-200 dark:bg-gray-700" : ""}
        >
          <Quote className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor Content */}
      <div className="p-4 min-h-[400px]">
        <EditorContent 
          editor={editor} 
          className="prose prose-sm max-w-none focus:outline-none min-h-[350px] [&_.ProseMirror]:focus:outline-none [&_.ProseMirror-focused]:outline-none"
        />
      </div>

      {/* Image Dialog */}
      {showImageDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Resim Ekle</h3>
            <div className="space-y-4">
                <div>
                <Label htmlFor="imageUrl">Resim URL</Label>
                <Input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div>
                <Label htmlFor="imageAlt">Alt Text</Label>
                <Input
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  placeholder="Resim açıklaması"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowImageDialog(false)}>
                  İptal
                </Button>
                <Button onClick={addImage} disabled={!imageUrl}>
                  Ekle
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Link Dialog */}
      {showLinkDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Link Ekle</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="linkUrl">Link URL</Label>
                <Input
                  id="linkUrl"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowLinkDialog(false)}>
                  İptal
                </Button>
                <Button onClick={addLink} disabled={!linkUrl}>
                  Ekle
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}