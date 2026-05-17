import { Editor } from '@monaco-editor/react'
import { MonacoBinding } from 'y-monaco'
import { useRef, useMemo, useState, useEffect } from 'react'
import * as Y from 'yjs'
import { SocketIOProvider } from 'y-socket.io'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000"

function CollaborativeEditor() {

  const editorRef = useRef(null)
  const [username, setUsername] = useState(() => {
    return new URLSearchParams(window.location.search).get("username") || ""
  })
  const [users, setUsers] = useState([])

  const ydoc = useMemo(() => new Y.Doc(), [])
  const yText = useMemo(() => ydoc.getText("monaco"), [ydoc])

  const handleJoin = (event) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const nextUsername = formData.get("username")?.toString().trim()

    if (nextUsername) {
      setUsername(nextUsername)
      window.history.replaceState(null, "", `?username=${encodeURIComponent(nextUsername)}`)
    }
  }

  const handleMount = (editor) => {
    editorRef.current = editor

    new MonacoBinding(
      yText,
      editorRef.current.getModel(),
      new Set([editorRef.current]),
    )
  }

  useEffect(() => {

    console.log(username)

    if (username) {

      const provider = new SocketIOProvider(SOCKET_URL, "monaco", ydoc, {
        autoConnect: true,
      })

      provider.awareness.setLocalStateField("user", { username })


      const states = Array.from(provider.awareness.getStates().values())

      console.log(states)

      setUsers(states.filter(state => state.user && state.user.username).map(state => state.user))

      provider.awareness.on("change", () => {
        const states = Array.from(provider.awareness.getStates().values())
        setUsers(states.filter(state => state.user && state.user.username).map(state => state.user))
      })

      function handleBeforeUnload() {
        provider.awareness.setLocalStateField("user", null)
      }

      window.addEventListener("beforeunload", handleBeforeUnload)


      return () => {
        provider.disconnect()
        window.removeEventListener("beforeunload", handleBeforeUnload)
      }
    }
  }, [
    username
  ])



  if (!username) {
    return (
      <main className="min-h-screen w-full bg-[#0e0e10] flex gap-4 p-6 items-center justify-center relative overflow-hidden" >
        {/* Background Accents */}
        <div className="absolute w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(59,130,246,0.15)_0%,rgba(59,130,246,0)_70%)] rounded-full blur-[60px] -z-10 top-[-10%] left-[-10%]"></div>
        <div className="absolute w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(59,130,246,0.15)_0%,rgba(59,130,246,0)_70%)] rounded-full blur-[60px] -z-10 bottom-[-10%] right-[-10%]"></div>
        
        <form
          onSubmit={handleJoin}
          className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-xl shadow-2xl flex flex-col gap-6 max-w-[400px] w-full z-10">
          
          <div className="text-center mb-2">
             <span className="material-symbols-outlined text-[#adc6ff] text-[40px] mb-2">person</span>
             <h1 className="font-sans text-3xl font-bold text-[#e5e1e4] tracking-tight">Join Session</h1>
          </div>

          <div className="space-y-1">
            <label className="text-xs uppercase tracking-widest font-semibold text-[#c2c6d6] ml-1">USERNAME</label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-4 text-[#8c909f] text-[20px]">account_circle</span>
              <input
                type="text"
                placeholder="Enter your username"
                className="w-full bg-[#050506] border border-white/10 rounded-lg py-4 pl-10 pr-4 text-[#e5e1e4] font-mono focus:outline-none focus:border-[#adc6ff] focus:ring-2 focus:ring-[#adc6ff]/20 transition-all placeholder:opacity-30"
                name="username"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-[#adc6ff] text-[#002e6a] text-xs uppercase tracking-widest font-bold py-4 rounded-lg hover:shadow-[0_0_12px_rgba(173,198,255,0.5)] active:scale-95 transition-all flex items-center justify-center gap-1"
          >
            <span className="material-symbols-outlined text-[18px]">login</span>
            Join Workspace
          </button>
        </form>
      </main>
    )
  }


  return (
    <div className="bg-[#0e0e10] text-[#e5e1e4] font-sans overflow-hidden flex h-screen w-screen">
      {/* Desktop Navigation Drawer (Fixed Left) */}
      <aside className="hidden md:flex flex-col py-6 gap-4 bg-white/5 backdrop-blur-md text-[#adc6ff] font-sans fixed left-0 top-0 h-full w-[260px] border-r border-white/10 z-50">
        <div className="px-4 mb-10">
          <h1 className="font-sans text-xs uppercase tracking-widest font-black text-[#e5e1e4]">CODETOGETHER</h1>
        </div>
        <nav className="flex flex-col gap-1 flex-1">
          <div className="bg-[#adc6ff]/10 text-[#adc6ff] border-l-4 border-[#adc6ff] px-6 py-2 flex items-center gap-4">
            <span className="material-symbols-outlined">code</span>
            <span className="text-sm font-bold">Editor</span>
          </div>
          <div className="text-[#c2c6d6] opacity-70 hover:bg-white/5 hover:opacity-100 transition-opacity duration-200 px-6 py-2 flex items-center gap-4 cursor-pointer">
            <span className="material-symbols-outlined">folder_open</span>
            <span className="text-sm font-bold">Files</span>
          </div>
          <div className="text-[#c2c6d6] opacity-70 hover:bg-white/5 hover:opacity-100 transition-opacity duration-200 px-6 py-2 flex items-center gap-4 cursor-pointer">
            <span className="material-symbols-outlined">group</span>
            <span className="text-sm font-bold">Collaborators</span>
          </div>
          <div className="text-[#c2c6d6] opacity-70 hover:bg-white/5 hover:opacity-100 transition-opacity duration-200 px-6 py-2 flex items-center gap-4 cursor-pointer">
            <span className="material-symbols-outlined">settings</span>
            <span className="text-sm font-bold">Settings</span>
          </div>
        </nav>
        <div className="px-4 mt-auto pt-6 border-t border-white/5">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-[#353437] flex items-center justify-center text-xs font-bold text-[#e5e1e4] uppercase">
                {username.substring(0, 2)}
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#0e0e10]"></span>
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-[#e5e1e4] truncate">{username}</p>
              <p className="text-[10px] text-[#c2c6d6] uppercase tracking-wider truncate">Room: {new URLSearchParams(window.location.search).get("room") || "alpha-10"}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col md:ml-[260px] h-full overflow-hidden relative">
        {/* Top App Bar */}
        <header className="flex justify-between items-center px-6 h-16 w-full z-50 bg-white/5 backdrop-blur-xl border-b border-white/10 shrink-0">
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-[#adc6ff]">terminal</span>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-[#adc6ff]">main.js</span>
              <span className="text-[10px] text-[#c2c6d6] -mt-1">Edited just now</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-1 bg-white/5 hover:bg-white/10 text-[#e5e1e4] transition-all active:scale-95 duration-150 rounded-lg border border-white/10">
              <span className="material-symbols-outlined text-[#c2c6d6]">dark_mode</span>
            </button>
            <button className="flex items-center gap-2 px-6 py-1 bg-[#3b82f6] text-white text-xs uppercase tracking-widest font-bold rounded-lg shadow-[0_0_12px_rgba(59,130,246,0.5)] active:scale-95 duration-150">
              <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>play_arrow</span>
              <span>Run</span>
            </button>
          </div>
        </header>

        {/* Editor Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Code Canvas */}
          <section className="flex-1 flex overflow-hidden bg-[#0a0a0c]">
             {/* The Monaco Editor */}
             <div className="flex-1 overflow-hidden relative h-full">
                <Editor
                  height="100%"
                  defaultLanguage="javascript"
                  defaultValue="// start coding..."
                  theme="vs-dark"
                  onMount={handleMount}
                  options={{
                    minimap: { enabled: false },
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 14,
                    lineHeight: 1.7,
                    padding: { top: 16 },
                    scrollBeyondLastLine: false,
                  }}
                />
             </div>
          </section>

          {/* Users Sidebar (Desktop Only) */}
          <section className="hidden lg:flex w-[300px] flex-col bg-[#2a2a2c] border-l border-white/10 p-4 gap-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#c2c6d6] flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">group</span>
              Users
            </h2>
            <div className="flex flex-col gap-2 overflow-y-auto pr-1">
              {users.map((user, index) => (
                <div key={index} className="flex items-center gap-4 p-2 bg-white/5 border border-white/10 rounded-xl transition-all hover:bg-white/10">
                  <div className="relative">
                     <div className="w-8 h-8 rounded-full bg-[#1c1b1d] border border-white/10 flex items-center justify-center text-xs font-bold text-[#adc6ff] uppercase">
                       {user.username.substring(0, 2)}
                     </div>
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#2a2a2c]"></span>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex justify-between items-center">
                      <p className="text-xs uppercase tracking-widest font-bold text-[#e5e1e4] truncate mr-2">{user.username}</p>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold shrink-0">ACTIVE</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Bottom Action Bar (Desktop-integrated look) */}
        <footer className="h-14 shrink-0 border-t border-white/10 bg-[#1c1b1d] flex items-center justify-between px-6 z-50">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-1 text-[#c2c6d6] hover:text-[#e5e1e4] transition-all bg-white/5 hover:bg-white/10 rounded-lg">
              <span className="material-symbols-outlined text-[18px]">content_copy</span>
              <span className="text-xs uppercase tracking-widest font-bold">Copy Room Code</span>
            </button>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-[10px] text-[#c2c6d6] uppercase tracking-widest px-4 border-r border-white/10 h-6">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
              Engine: Connected
            </div>
            <button 
              className="flex items-center gap-2 px-4 py-1 text-[#ffb4ab] hover:bg-[#ffb4ab]/10 transition-all rounded-lg active:scale-95 duration-150"
              onClick={() => { window.location.href = '/' }}
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
              <span className="text-xs uppercase tracking-widest font-bold">Leave Room</span>
            </button>
          </div>
        </footer>
      </main>

      {/* Bottom Navigation Bar (Mobile Only) */}
      <nav className="fixed bottom-0 w-full flex justify-around py-2 px-4 bg-[#131315] z-40 md:hidden border-t border-white/10">
        <div className="text-[#c2c6d6] hover:text-[#d8e2ff] active:scale-90 transition-all cursor-pointer">
          <span className="material-symbols-outlined">bug_report</span>
        </div>
        <div className="text-[#c2c6d6] hover:text-[#d8e2ff] active:scale-90 transition-all cursor-pointer">
          <span className="material-symbols-outlined">history</span>
        </div>
        <div className="text-[#adc6ff] scale-110 active:scale-90 transition-all cursor-pointer">
          <span className="material-symbols-outlined">terminal</span>
        </div>
        <div className="text-[#c2c6d6] hover:text-[#d8e2ff] active:scale-90 transition-all cursor-pointer">
          <span className="material-symbols-outlined">chat</span>
        </div>
        <div className="text-[#c2c6d6] hover:text-[#d8e2ff] active:scale-90 transition-all cursor-pointer">
          <span className="material-symbols-outlined">info</span>
        </div>
      </nav>
    </div>
  )
}

export default CollaborativeEditor


