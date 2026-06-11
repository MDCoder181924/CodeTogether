import { Editor } from '@monaco-editor/react'
import { MonacoBinding } from 'y-monaco'
import { useRef, useMemo, useState, useEffect } from 'react'
import * as Y from 'yjs'
import api from "../../services/api"
import { SocketIOProvider } from 'y-socket.io'
import { useParams, useNavigate } from "react-router-dom"
import ChatPanel from "./ChatPanel";
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || (import.meta.env.PROD ? window.location.origin : "http://localhost:3000");

function CollaborativeEditor() {

  const navigate = useNavigate();

  const { groupCode } = useParams();

  const editorRef = useRef(null)
  const socketRef = useRef(null)
  const [users, setUsers] = useState([])
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState("");
  const [showUsers, setShowUsers] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("users");

  const currentUser =
    JSON.parse(localStorage.getItem("user"));

  const username =
    currentUser?.name || "Anonymous";

  const ydoc = useMemo(() => new Y.Doc(), [])
  const yText = useMemo(() => ydoc.getText("monaco"), [ydoc])

  const updateUsersFromAwareness = (states) => {
    const uniqueUsers = Array.from(
      new Map(
        states
          .filter(state => state.user && state.user.username)
          .map(state => [state.user.id, state.user])
      ).values()
    )

    setUsers(uniqueUsers)
  }

  const handleRunCode = async () => {
    try {
      const code = editorRef.current.getValue();

      const response = await api.post('/code/run', { code, language })
      setOutput(response.data.output);
    } catch (error) {
      console.log(error);
      setOutput("Error running code");
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

    setUsers([
      {
        username,
      },
    ]);

  }, [username]);

  useEffect(() => {

    console.log(username)

    if (username) {

      const provider = new SocketIOProvider(SOCKET_URL, groupCode, ydoc, {
        autoConnect: true,
      })

      provider.awareness.setLocalStateField("user", {
        id: currentUser?._id || username,
        username,
      })


      const states = Array.from(provider.awareness.getStates().values())

      console.log(states)

      updateUsersFromAwareness(states)

      provider.awareness.on("change", () => {
        const states = Array.from(provider.awareness.getStates().values())
        updateUsersFromAwareness(states)
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

  // Handle room socket operations: loading code history and auto-saving code
  useEffect(() => {
    socketRef.current = io(SOCKET_URL);

    // Join room
    socketRef.current.emit("join-room", groupCode);

    // Load saved code history from MongoDB if local Y.Doc text is empty
    socketRef.current.on("code-history", ({ code, language }) => {
      if (yText.toString() === "" && code) {
        yText.insert(0, code);
      }
      if (language) {
        setLanguage(language);
      }
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [groupCode, yText]);

  // Periodic Auto-save code back to MongoDB
  useEffect(() => {
    let lastSavedCode = "";
    const interval = setInterval(() => {
      const currentCode = yText.toString();
      if (currentCode && currentCode !== lastSavedCode && socketRef.current) {
        socketRef.current.emit("save-code", {
          roomCode: groupCode,
          code: currentCode,
          language: language
        });
        lastSavedCode = currentCode;
      }
    }, 4000); // Auto-save every 4 seconds

    return () => clearInterval(interval);
  }, [yText, groupCode, language]);

  return (
    <div className="bg-[#0e0e10] text-[#e5e1e4] font-sans overflow-hidden flex h-[100dvh] w-full">
      {/* Navigation Drawer (Responsive: Fixed on desktop, Drawer overlay on mobile) */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-[260px] bg-[#0c0c0e]/95 md:bg-white/5 backdrop-blur-2xl md:backdrop-blur-md text-[#adc6ff] font-sans flex flex-col py-6 gap-4 border-r border-white/10 transition-transform duration-300 ease-in-out md:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="px-6 mb-8 flex items-center justify-between">
          <h1 className="font-sans text-xs uppercase tracking-widest font-black text-[#e5e1e4] bg-gradient-to-r from-white via-[#adc6ff] to-[#3b82f6] bg-clip-text text-transparent">
            CODETOGETHER
          </h1>
          {/* Close Button (Mobile Only) */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden flex items-center justify-center p-1.5 rounded-lg text-[#adc6ff] hover:text-white hover:bg-white/10 active:scale-95 duration-150 cursor-pointer border border-white/5"
            aria-label="Close sidebar"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <nav className="flex flex-col gap-1.5 flex-1 px-3">
          <div className="bg-[#adc6ff]/10 text-[#adc6ff] border-l-4 border-[#adc6ff] px-4 py-2.5 rounded-r-lg flex items-center gap-4 transition-all duration-300">
            <span className="material-symbols-outlined text-[20px]">code</span>
            <span className="text-sm font-bold tracking-wide">Editor</span>
          </div>
          <div className="text-[#c2c6d6]/60 hover:text-[#adc6ff] hover:bg-white/5 px-4 py-2.5 rounded-lg flex items-center gap-4 cursor-pointer transition-all duration-200">
            <span className="material-symbols-outlined text-[20px]">folder_open</span>
            <span className="text-sm font-medium">Files</span>
          </div>
          <div className="text-[#c2c6d6]/60 hover:text-[#adc6ff] hover:bg-white/5 px-4 py-2.5 rounded-lg flex items-center gap-4 cursor-pointer transition-all duration-200">
            <span className="material-symbols-outlined text-[20px]">group</span>
            <span className="text-sm font-medium">Collaborators</span>
          </div>
          <div className="text-[#c2c6d6]/60 hover:text-[#adc6ff] hover:bg-white/5 px-4 py-2.5 rounded-lg flex items-center gap-4 cursor-pointer transition-all duration-200">
            <span className="material-symbols-outlined text-[20px]">settings</span>
            <span className="text-sm font-medium">Settings</span>
          </div>
        </nav>

        <div className="px-4 mt-auto pt-6 border-t border-white/5">
          <div className="flex items-center gap-4 p-2 bg-white/5 border border-white/5 rounded-xl">
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#3b82f6] to-[#adc6ff] flex items-center justify-center text-xs font-bold text-white uppercase shadow-md">
                {username.substring(0, 2)}
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#0e0e10]"></span>
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-[#e5e1e4] truncate">{username}</p>
              <p className="text-[10px] text-[#adc6ff]/70 font-semibold uppercase tracking-wider truncate">
                Room: {groupCode}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Backdrop Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 flex flex-col md:ml-[260px] h-full pb-14 md:pb-0 overflow-hidden relative">
        {/* Top App Bar */}
        <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 px-4 sm:px-6 py-3 sm:py-0 min-h-16 w-full z-30 bg-white/5 backdrop-blur-xl border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto min-w-0">
            {/* Hamburger Button for Mobile (Matching the user's second image design) */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden flex flex-col justify-center items-center gap-1.5 w-10 h-10 px-2.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 active:scale-95 duration-150 shrink-0 cursor-pointer text-white"
              aria-label="Open navigation menu"
            >
              <span className="w-5 h-0.5 bg-[#e5e1e4] rounded-full"></span>
              <span className="w-5 h-0.5 bg-[#e5e1e4] rounded-full"></span>
              <span className="w-5 h-0.5 bg-[#e5e1e4] rounded-full"></span>
            </button>

            <span className="material-symbols-outlined text-[#adc6ff]">terminal</span>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-[#adc6ff]">main.js</span>
              <span className="text-[10px] text-[#c2c6d6] -mt-1">Edited just now</span>
            </div>
          </div>
          <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-4 w-full sm:w-auto min-w-0">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="min-w-0 flex-1 sm:flex-none bg-[#1c1b1d] border border-white/10 text-[#e5e1e4] px-3 sm:px-4 py-2 rounded-lg outline-none text-sm"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
              <option value="typescript">TypeScript</option>
              <option value="c">C</option>
            </select>
            <button className="hidden lg:flex items-center gap-2 px-4 py-1 bg-white/5 hover:bg-white/10 text-[#e5e1e4] transition-all active:scale-95 duration-150 rounded-lg border border-white/10">
              <span className="material-symbols-outlined text-[#c2c6d6]">dark_mode</span>
            </button>
            <button
              onClick={handleRunCode}
              className="flex items-center justify-center gap-2 px-3 sm:px-6 py-2 sm:py-1 bg-[#3b82f6] text-white text-xs uppercase tracking-widest font-bold rounded-lg shadow-[0_0_12px_rgba(59,130,246,0.5)] active:scale-95 duration-150 shrink-0">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
              <span className="hidden min-[380px]:inline">Run</span>
            </button>
            <button
              onClick={() => {
                setShowUsers(!showUsers);
                setActiveTab("users");
              }}
              className="xl:hidden flex items-center justify-center px-3 py-2 sm:py-1 bg-white/5 hover:bg-white/10 text-[#e5e1e4] transition-all active:scale-95 duration-150 rounded-lg border border-white/10 shrink-0"
            >
              <span className="material-symbols-outlined text-[18px]">group</span>
            </button>
          </div>
        </header>

        {/* Editor Content */}
        <div className="flex-1 min-h-0 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden">
          {/* Code Canvas */}
          <section className="flex-1 min-h-[320px] sm:min-h-[420px] lg:min-h-0 flex overflow-hidden bg-[#0a0a0c]">
            {/* The Monaco Editor */}
            <div className="flex-1 min-w-0 overflow-hidden relative h-full">
              <Editor
                height="100%"
                language={language}
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

          {/* Code Run Section */}
          <section className="w-full lg:w-80 shrink-0">
            <div className="bg-black border-t lg:border-l border-white/10 p-4 overflow-auto min-h-[150px] h-[180px] lg:h-full">
              <h2 className="text-green-400 text-sm mb-2 uppercase tracking-widest">
                Output
              </h2>
              <pre className="text-white whitespace-pre-wrap text-sm">
                {output || "Run code to see output"}
              </pre>
            </div>
          </section>

          {/* Mobile Overlay Backdrop */}
          {showUsers && (
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] xl:hidden transition-opacity duration-300"
              onClick={() => setShowUsers(false)}
            />
          )}

          {/* Users & Chat Sidebar (Responsive slide-over drawer on mobile/tablet) */}
          <section
            className={`fixed inset-y-0 right-0 z-[60] w-full sm:w-[350px] bg-[#0c0c0e]/95 backdrop-blur-2xl border-l border-white/10 flex flex-col p-4 gap-4 shadow-2xl transition-all duration-300 xl:relative xl:translate-x-0 xl:w-[300px] xl:bg-[#131315]/90 xl:border-t-0 xl:border-l xl:min-h-0 xl:z-20 ${
              showUsers ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none xl:opacity-100 xl:pointer-events-auto"
            }`}
          >
            {/* Tabs & Close button row */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Industry-level Tabs */}
              <div className="flex-1 flex bg-white/5 p-1 rounded-lg border border-white/5">
                <button
                  onClick={() => setActiveTab("users")}
                  className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-md text-xs font-bold uppercase tracking-widest cursor-pointer transition-all duration-200 ${
                    activeTab === "users"
                      ? "bg-[#3b82f6] text-white shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                      : "text-[#c2c6d6]/60 hover:text-white"
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">group</span>
                  Users
                </button>
                <button
                  onClick={() => setActiveTab("chat")}
                  className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-md text-xs font-bold uppercase tracking-widest cursor-pointer transition-all duration-200 ${
                    activeTab === "chat"
                      ? "bg-[#3b82f6] text-white shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                      : "text-[#c2c6d6]/60 hover:text-white"
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">chat</span>
                  Chat
                </button>
              </div>

              {/* Close Button for Drawer (Mobile Only) */}
              <button
                onClick={() => setShowUsers(false)}
                className="xl:hidden flex items-center justify-center p-2 rounded-lg text-[#adc6ff] hover:text-white hover:bg-white/10 active:scale-95 duration-150 cursor-pointer border border-white/5"
                aria-label="Close sidebar"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Users list tab panel */}
            <div className={`flex-1 flex flex-col gap-2 overflow-y-auto pr-1 min-h-0 ${activeTab === "users" ? "" : "hidden"}`}>
              <h2 className="text-xs font-bold uppercase tracking-widest text-[#c2c6d6] flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-[18px]">group</span>
                Users
              </h2>
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

            {/* Chat room panel (persists state by staying mounted in the DOM) */}
            <div className={`flex-1 min-h-0 h-full ${activeTab === "chat" ? "" : "hidden"}`}>
              <ChatPanel groupCode={groupCode} username={username} />
            </div>
          </section>


          </div>

          {/* Bottom Action Bar (Desktop-integrated look) */}
          <footer className="min-h-14 shrink-0 border-t border-white/10 bg-[#1c1b1d] flex flex-wrap items-center justify-between gap-2 px-4 sm:px-6 py-2 z-50">
            <div className="flex items-center gap-4 min-w-0">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(groupCode);
                }}
                className="flex items-center gap-2 min-w-0 max-w-[46vw] sm:max-w-none px-3 sm:px-4 py-2 sm:py-1 text-[#c2c6d6] hover:text-[#e5e1e4] transition-all bg-white/5 hover:bg-white/10 rounded-lg"
              >
                <span className="material-symbols-outlined text-[18px]">content_copy</span>
                <span className="text-xs uppercase tracking-widest font-bold truncate">{groupCode}</span>
              </button>
            </div>
            <div className="flex items-center justify-end gap-2 sm:gap-4 min-w-0">
              <div className="hidden md:flex items-center gap-2 text-[10px] text-[#c2c6d6] uppercase tracking-widest px-4 border-r border-white/10 h-6">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                Engine: Connected
              </div>
              <button
                className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-1 text-[#ffb4ab] hover:bg-[#ffb4ab]/10 transition-all rounded-lg active:scale-95 duration-150"
                onClick={() => { navigate("/group-lobby") }}
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
                <span className="hidden min-[420px]:inline text-xs uppercase tracking-widest font-bold">Leave Room</span>
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
          <div 
            onClick={() => {
              setShowUsers(true);
              setActiveTab("chat");
            }}
            className={`hover:text-[#d8e2ff] active:scale-90 transition-all cursor-pointer ${
              showUsers && activeTab === "chat" ? "text-[#3b82f6] scale-110" : "text-[#c2c6d6]"
            }`}
          >
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


