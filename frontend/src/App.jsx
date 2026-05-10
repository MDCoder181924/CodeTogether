import './App.css'
import { Editor } from '@monaco-editor/react'
import { MonacoBinding } from 'y-monaco'
import { useRef, useMemo } from 'react'
import * as Y from 'yjs'
import { SocketIOProvider } from 'y-socket.io'

function App() {

  const editorRef = useRef(null)
  
  const ydoc = useMemo(() => new Y.Doc(), [])
  const yText = useMemo(() => ydoc.getText("monaco"), [ydoc])

  const handleMount = (editor) => {
    editorRef.current = editor

    const provider = new SocketIOProvider(
      'http://localhost:3000',
      'monaco-demo',
      ydoc,
      { autoConnect: true }
    )

    provider.on('status', (status) => {
      console.log('Socket status:', status)
    })

    new MonacoBinding(
      yText,
      editor.getModel(),
      new Set([editor]),
      provider.awareness
    )
  }

  return (
    <div className="h-screen w-screen p-2 bg-black gap-1 flex items-center justify-center">
      <div className="h-full w-1/4 bg-[#1c1919] rounded-md"></div>
      <div className="h-full w-3/4 bg-[#1c1919] rounded-md overflow-hidden">
        <Editor
          height="100%"
          defaultLanguage="javascript"
          defaultValue="// start coding..."
          theme="vs-dark"
          onMount={handleMount}
        />
      </div>
    </div>
  )
}

export default App