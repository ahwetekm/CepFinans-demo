'use client'

import { useState } from 'react'
import RichTextEditor from '@/components/admin/RichTextEditor'

export default function TestEditor() {
  const [content, setContent] = useState('<p>Test content</p>')

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Rich Text Editor</h1>
      <RichTextEditor 
        content={content}
        onChange={setContent}
        placeholder="Type your content here..."
      />
      <div className="mt-4">
        <h2 className="text-lg font-semibold mb-2">HTML Output:</h2>
        <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
          {content}
        </pre>
      </div>
    </div>
  )
}