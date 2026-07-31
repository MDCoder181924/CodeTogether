import { Editor } from '@monaco-editor/react'
import { MonacoBinding } from 'y-monaco'
import { useRef, useMemo, useState, useEffect, useCallback } from 'react'
import * as Y from 'yjs'
import api, { getSocketUrl } from "../../services/api"
import { SocketIOProvider } from 'y-socket.io'
import { useParams, useNavigate } from "react-router-dom"
import ChatPanel from "./ChatPanel";
import SettingsModal, { DEFAULT_SETTINGS } from "./SettingsModal";
import FileExplorer from "./FileExplorer";
import FileTabs from "./FileTabs";
import NewFileDialog from "./NewFileDialog";
import { io } from "socket.io-client";

const SOCKET_URL = getSocketUrl();

/**
 * Detect Monaco editor language from file extension
 */
const detectLanguage = (fileName) => {
  const ext = fileName?.split('.').pop()?.toLowerCase();
  const langMap = {
    'js': 'javascript',
    'jsx': 'javascript',
    'ts': 'typescript',
    'tsx': 'typescript',
    'py': 'python',
    'java': 'java',
    'cpp': 'cpp',
    'c': 'c',
    'html': 'html',
    'css': 'css',
    'json': 'json',
    'md': 'markdown',
  };
  return langMap[ext] || 'javascript';
};

function CollaborativeEditor() {

  const navigate = useNavigate();
  const { groupCode } = useParams();

  const editorRef = useRef(null)
  const socketRef = useRef(null)
  const providerRef = useRef(null)
  const bindingRef = useRef(null)

  const [users, setUsers] = useState([])
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("users");
  const [isOutputOpen, setIsOutputOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Multi-file state
  const [files, setFiles] = useState([]);
  const [activeFile, setActiveFile] = useState(null);
  const [openTabs, setOpenTabs] = useState([]);
  const [isNewFileDialogOpen, setIsNewFileDialogOpen] = useState(false);
  const [isFileExplorerOpen, setIsFileExplorerOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Per-file Yjs documents
  const ydocsRef = useRef(new Map());
  const providersRef = useRef(new Map());

  // Settings State & Persistence
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem("codetogether_settings");
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  // User State & Persistence
  const [username, setUsername] = useState(() => {
    try {
      const u = JSON.parse(localStorage.getItem("user"));
      return u?.name || "Anonymous";
    } catch {
      return "Anonymous";
    }
  });

  // Save settings changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("codetogether_settings", JSON.stringify(settings));
    } catch (e) {
      console.error("Failed to save settings to localStorage", e);
    }
  }, [settings]);

  // Dynamic updates for Monaco Editor options when settings change
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.updateOptions({
        fontSize: settings.fontSize || 14,
        fontFamily: settings.fontFamily || "'JetBrains Mono', monospace",
        tabSize: settings.tabSize || 2,
        wordWrap: settings.wordWrap || 'on',
        lineNumbers: settings.lineNumbers || 'on',
        cursorStyle: settings.cursorStyle || 'line',
        minimap: { enabled: !!settings.minimap },
        bracketPairColorization: { enabled: settings.bracketPairColorization ?? true },
      });
    }
  }, [settings]);

  // Handler for updating username from Settings
  const handleUpdateUsername = (newName) => {
    setUsername(newName);
    try {
      const currentUser = JSON.parse(localStorage.getItem("user")) || {};
      const updatedUser = { ...currentUser, name: newName };
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (e) {
      console.error("Failed to save updated username", e);
    }

    // Broadcast new username over Yjs awareness if provider is active
    if (providerRef.current?.awareness) {
      const currentUser = JSON.parse(localStorage.getItem("user"));
      providerRef.current.awareness.setLocalStateField("user", {
        id: currentUser?._id || newName,
        username: newName,
      });
    }
  };

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

  // ─── Per-file Yjs Document Management ─────────────────

  const getOrCreateYDoc = useCallback((fileName) => {
    if (ydocsRef.current.has(fileName)) {
      return ydocsRef.current.get(fileName);
    }
    const doc = new Y.Doc();
    ydocsRef.current.set(fileName, doc);
    return doc;
  }, []);

  const getOrCreateProvider = useCallback((fileName) => {
    if (providersRef.current.has(fileName)) {
      return providersRef.current.get(fileName);
    }

    const doc = getOrCreateYDoc(fileName);
    const roomName = `${groupCode}:${fileName}`;

    const provider = new SocketIOProvider(SOCKET_URL, roomName, doc, {
      autoConnect: true,
    });

    const currentUser = JSON.parse(localStorage.getItem("user"));

    provider.awareness.setLocalStateField("user", {
      id: currentUser?._id || username,
      username,
    });

    providersRef.current.set(fileName, provider);
    return provider;
  }, [groupCode, username, getOrCreateYDoc]);

  const cleanupProvider = useCallback((fileName) => {
    const provider = providersRef.current.get(fileName);
    if (provider) {
      provider.disconnect();
      providersRef.current.delete(fileName);
    }
    const doc = ydocsRef.current.get(fileName);
    if (doc) {
      doc.destroy();
      ydocsRef.current.delete(fileName);
    }
  }, []);

  // ─── File Operations ─────────────────────────────────

  const switchToFile = useCallback((file) => {
    if (!file) return;

    setActiveFile(file);
    setLanguage(file.language || detectLanguage(file.fileName));

    // Add to open tabs if not already open
    setOpenTabs(prev => {
      if (prev.some(t => t._id === file._id)) return prev;
      return [...prev, file];
    });

    // Get or create Y doc for this file
    const doc = getOrCreateYDoc(file.fileName);
    const yText = doc.getText("monaco");

    // Initialize yText with file code if empty
    if (yText.toString() === "" && file.code) {
      yText.insert(0, file.code);
    }

    // Connect provider for this file
    const provider = getOrCreateProvider(file.fileName);

    // Store as main provider for awareness
    providerRef.current = provider;

    // Rebind Monaco editor if it exists
    if (editorRef.current) {
      // Clean up old binding
      if (bindingRef.current) {
        bindingRef.current.destroy();
        bindingRef.current = null;
      }

      // Set the new model content and language
      const model = editorRef.current.getModel();
      if (model) {
        // We need to set the model and rebind
        const monaco = window.monaco || editorRef.current._domElement?.__monacoEditor;

        // Update language
        if (window.monaco) {
          window.monaco.editor.setModelLanguage(model, file.language || detectLanguage(file.fileName));
        }

        // Create new binding
        bindingRef.current = new MonacoBinding(
          yText,
          model,
          new Set([editorRef.current]),
        );
      }
    }
  }, [getOrCreateYDoc, getOrCreateProvider]);

  const handleCreateFile = useCallback(({ fileName, code }) => {
    if (socketRef.current) {
      socketRef.current.emit("create-file", {
        roomCode: groupCode,
        fileName,
        code: code || "",
      });
    }
    setIsNewFileDialogOpen(false);
  }, [groupCode]);

  const handleRenameFile = useCallback((fileId, newFileName) => {
    if (socketRef.current) {
      socketRef.current.emit("rename-file", {
        roomCode: groupCode,
        fileId,
        newFileName,
      });
    }
  }, [groupCode]);

  const handleDeleteFile = useCallback((fileId, fileName) => {
    setDeleteConfirm({ fileId, fileName });
  }, []);

  const confirmDeleteFile = useCallback(() => {
    if (!deleteConfirm || !socketRef.current) return;

    socketRef.current.emit("delete-file", {
      roomCode: groupCode,
      fileId: deleteConfirm.fileId,
    });

    setDeleteConfirm(null);
  }, [groupCode, deleteConfirm]);

  const handleTabClose = useCallback((tab) => {
    setOpenTabs(prev => {
      const newTabs = prev.filter(t => t._id !== tab._id);

      // If closing active tab, switch to another
      if (tab.fileName === activeFile?.fileName && newTabs.length > 0) {
        const nextFile = newTabs[newTabs.length - 1];
        // Use setTimeout to avoid state conflicts
        setTimeout(() => switchToFile(nextFile), 0);
      }

      return newTabs;
    });
  }, [activeFile, switchToFile]);

  const handleRunCode = async () => {
    // Automatically open the output panel when code is executed
    setIsOutputOpen(true);
    try {
      const code = editorRef.current ? editorRef.current.getValue() : "";

      const response = await api.post('/code/run', { code, language })
      setOutput(response.data.output);
    } catch (error) {
      console.log(error);
      setOutput("Error running code");
    }
  }

  const handleMount = (editor, monaco) => {
    editorRef.current = editor;
    window.monaco = monaco;

    // If we have an active file, bind to its Y doc
    if (activeFile) {
      const doc = getOrCreateYDoc(activeFile.fileName);
      const yText = doc.getText("monaco");

      bindingRef.current = new MonacoBinding(
        yText,
        editor.getModel(),
        new Set([editor]),
      );
    }
  }

  // ─── Initial User List ────────────────────────────────

  useEffect(() => {
    setUsers([
      {
        username,
      },
    ]);
  }, [username]);

  // ─── Yjs Awareness for Users ──────────────────────────

  useEffect(() => {
    if (username && activeFile) {
      const provider = getOrCreateProvider(activeFile.fileName);
      providerRef.current = provider;

      const currentUser = JSON.parse(localStorage.getItem("user"));

      provider.awareness.setLocalStateField("user", {
        id: currentUser?._id || username,
        username,
      });

      const states = Array.from(provider.awareness.getStates().values());
      updateUsersFromAwareness(states);

      provider.awareness.on("change", () => {
        const states = Array.from(provider.awareness.getStates().values());
        updateUsersFromAwareness(states);
      });

      function handleBeforeUnload() {
        provider.awareness.setLocalStateField("user", null);
      }

      window.addEventListener("beforeunload", handleBeforeUnload);

      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    }
  }, [username, activeFile, getOrCreateProvider]);

  // ─── Socket: Room Join & File Events ──────────────────

  useEffect(() => {
    socketRef.current = io(SOCKET_URL);

    // Join room
    socketRef.current.emit("join-room", groupCode);

    // Receive file list on join
    socketRef.current.on("file-list", ({ files: fileList }) => {
      setFiles(fileList);

      // Auto-select the first file if none active
      if (fileList.length > 0) {
        const firstFile = fileList[0];
        setActiveFile(firstFile);
        setLanguage(firstFile.language || detectLanguage(firstFile.fileName));
        setOpenTabs([firstFile]);

        // Initialize Y doc for first file
        const doc = getOrCreateYDoc(firstFile.fileName);
        const yText = doc.getText("monaco");
        if (yText.toString() === "" && firstFile.code) {
          yText.insert(0, firstFile.code);
        }
      }
    });

    // Legacy: also handle code-history for backward compat
    socketRef.current.on("code-history", ({ code, language: lang }) => {
      // Only use this if we haven't received file-list yet
      if (files.length === 0 && activeFile) {
        const doc = getOrCreateYDoc(activeFile.fileName);
        const yText = doc.getText("monaco");
        if (yText.toString() === "" && code) {
          yText.insert(0, code);
        }
        if (lang) setLanguage(lang);
      }
    });

    // File created by someone in the room
    socketRef.current.on("file-created", ({ file }) => {
      setFiles(prev => {
        if (prev.some(f => f._id === file._id)) return prev;
        return [...prev, file];
      });
    });

    // File renamed
    socketRef.current.on("file-renamed", ({ fileId, oldFileName, newFileName, language: lang }) => {
      setFiles(prev => prev.map(f =>
        f._id === fileId
          ? { ...f, fileName: newFileName, language: lang }
          : f
      ));

      setOpenTabs(prev => prev.map(t =>
        t._id === fileId
          ? { ...t, fileName: newFileName, language: lang }
          : t
      ));

      setActiveFile(prev => {
        if (prev?._id === fileId) {
          return { ...prev, fileName: newFileName, language: lang };
        }
        return prev;
      });

      // Update language if active file was renamed
      setLanguage(prev => {
        // Re-check from current state
        return prev;
      });
    });

    // File deleted
    socketRef.current.on("file-deleted", ({ fileId, fileName: deletedName, remainingFiles }) => {
      setFiles(remainingFiles);

      setOpenTabs(prev => {
        const filtered = prev.filter(t => t._id !== fileId);
        return filtered;
      });

      // If deleted file was active, switch to first remaining file
      setActiveFile(prev => {
        if (prev?._id === fileId && remainingFiles.length > 0) {
          const nextFile = remainingFiles[0];
          setTimeout(() => switchToFile(nextFile), 0);
          return nextFile;
        }
        return prev;
      });

      // Cleanup Yjs resources for deleted file
      cleanupProvider(deletedName);
    });

    // File error
    socketRef.current.on("file-error", ({ message }) => {
      console.error("File operation error:", message);
      alert(message);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [groupCode]);

  // ─── Periodic Auto-save ───────────────────────────────

  useEffect(() => {
    if (settings.autoSave === false || !activeFile) return;

    let lastSavedCode = "";
    const interval = setInterval(() => {
      if (!activeFile || !socketRef.current) return;

      const doc = ydocsRef.current.get(activeFile.fileName);
      if (!doc) return;

      const yText = doc.getText("monaco");
      const currentCode = yText.toString();

      if (currentCode && currentCode !== lastSavedCode) {
        socketRef.current.emit("save-code", {
          roomCode: groupCode,
          code: currentCode,
          language: language,
          fileName: activeFile.fileName,
        });
        lastSavedCode = currentCode;
      }
    }, 4000); // Auto-save every 4 seconds

    return () => clearInterval(interval);
  }, [activeFile, groupCode, language, settings.autoSave]);

  // ─── Cleanup all providers on unmount ──────────────────

  useEffect(() => {
    return () => {
      providersRef.current.forEach((provider) => {
        provider.disconnect();
      });
      providersRef.current.clear();

      ydocsRef.current.forEach((doc) => {
        doc.destroy();
      });
      ydocsRef.current.clear();
    };
  }, []);

  return (
    <div className="bg-[#0e0e10] text-[#e5e1e4] font-sans overflow-hidden flex h-[100dvh] w-full">
      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={setSettings}
        username={username}
        onUpdateUsername={handleUpdateUsername}
      />

      {/* New File Dialog */}
      <NewFileDialog
        isOpen={isNewFileDialogOpen}
        onClose={() => setIsNewFileDialogOpen(false)}
        onSubmit={handleCreateFile}
        existingFileNames={files.map(f => f.fileName)}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[70] p-4">
          <div className="bg-[#121216] border border-rose-500/30 rounded-2xl p-6 w-full max-w-sm shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400 pb-2 border-b border-white/10">
              <span className="material-symbols-outlined text-xl">warning</span>
              <h2 className="text-base font-bold text-white">Delete File</h2>
            </div>
            <p className="text-xs text-[#c2c6d6] leading-relaxed">
              Are you sure you want to delete <span className="font-bold text-white font-mono">"{deleteConfirm.fileName}"</span>?
              This action cannot be undone.
            </p>
            <div className="flex gap-3 pt-1">
              <button
                onClick={confirmDeleteFile}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 rounded-xl shadow-[0_0_12px_rgba(225,29,72,0.4)] active:scale-95 transition-all cursor-pointer text-xs uppercase tracking-widest flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[16px]">delete</span>
                Delete
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-2.5 rounded-xl active:scale-95 transition-all cursor-pointer text-xs uppercase tracking-widest"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Drawer (Responsive: Fixed on desktop, Drawer overlay on mobile) */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-[260px] bg-[#0c0c0e]/95 md:bg-white/5 backdrop-blur-2xl md:backdrop-blur-md text-[#adc6ff] font-sans flex flex-col py-6 gap-0 border-r border-white/10 transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="px-6 mb-4 flex items-center justify-between shrink-0">
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

        {/* Nav Links */}
        <nav className="flex flex-col gap-1.5 px-3 shrink-0 mb-2">
          <div className="bg-[#adc6ff]/10 text-[#adc6ff] border-l-4 border-[#adc6ff] px-4 py-2.5 rounded-r-lg flex items-center gap-4 transition-all duration-300">
            <span className="material-symbols-outlined text-[20px]">code</span>
            <span className="text-sm font-bold tracking-wide">Editor</span>
          </div>
          <div
            onClick={() => {
              setIsFileExplorerOpen(!isFileExplorerOpen);
            }}
            className={`px-4 py-2.5 rounded-lg flex items-center gap-4 cursor-pointer transition-all duration-200 ${
              isFileExplorerOpen
                ? "bg-[#adc6ff]/10 text-[#adc6ff] font-bold"
                : "text-[#c2c6d6]/60 hover:text-[#adc6ff] hover:bg-white/5"
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">folder_open</span>
            <span className="text-sm font-medium">Files</span>
            <span className="ml-auto px-1.5 py-0.5 rounded-full bg-[#3b82f6]/20 text-[#adc6ff] border border-[#3b82f6]/30 text-[9px] font-bold">
              {files.length}
            </span>
          </div>
          <div 
            onClick={() => {
              setIsChatOpen(true);
              setActiveTab("users");
              setIsSidebarOpen(false);
            }}
            className="text-[#c2c6d6]/60 hover:text-[#adc6ff] hover:bg-white/5 px-4 py-2.5 rounded-lg flex items-center gap-4 cursor-pointer transition-all duration-200"
          >
            <span className="material-symbols-outlined text-[20px]">group</span>
            <span className="text-sm font-medium">Collaborators</span>
          </div>
          <div 
            onClick={() => {
              setIsSettingsOpen(true);
              setIsSidebarOpen(false);
            }}
            className={`px-4 py-2.5 rounded-lg flex items-center gap-4 cursor-pointer transition-all duration-200 ${
              isSettingsOpen 
                ? "bg-[#adc6ff]/10 text-[#adc6ff] font-bold" 
                : "text-[#c2c6d6]/60 hover:text-[#adc6ff] hover:bg-white/5"
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">settings</span>
            <span className="text-sm font-medium">Settings</span>
          </div>
        </nav>

        {/* File Explorer (Integrated in Sidebar) */}
        {isFileExplorerOpen && (
          <div className="flex-1 min-h-0 border-t border-white/10 overflow-hidden">
            <FileExplorer
              files={files}
              activeFileName={activeFile?.fileName}
              onFileSelect={(file) => {
                switchToFile(file);
                setIsSidebarOpen(false);
              }}
              onCreateFile={() => setIsNewFileDialogOpen(true)}
              onRenameFile={handleRenameFile}
              onDeleteFile={handleDeleteFile}
            />
          </div>
        )}

        {/* User Profile Footer */}
        <div className="px-4 mt-auto pt-4 border-t border-white/5 shrink-0">
          <div 
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center gap-4 p-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl cursor-pointer transition-all"
            title="Open Profile Settings"
          >
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#3b82f6] to-[#adc6ff] flex items-center justify-center text-xs font-bold text-white uppercase shadow-md">
                {username.substring(0, 2)}
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#0e0e10]"></span>
            </div>
            <div className="overflow-hidden flex-1 min-w-0">
              <p className="text-xs font-bold text-[#e5e1e4] truncate">{username}</p>
              <p className="text-[10px] text-[#adc6ff]/70 font-semibold uppercase tracking-wider truncate">
                Room: {groupCode}
              </p>
            </div>
            <span className="material-symbols-outlined text-[16px] text-[#c2c6d6]/40">tune</span>
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
            {/* Hamburger Button for Mobile */}
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
              <span className="text-sm font-bold text-[#adc6ff] truncate">
                {activeFile?.fileName || "main.js"}
              </span>
              <span className="text-[10px] text-[#c2c6d6] -mt-1">Edited just now</span>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 w-full sm:w-auto min-w-0">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="min-w-0 flex-1 sm:flex-none bg-[#1c1b1d] border border-white/10 text-[#e5e1e4] px-3 sm:px-4 py-2 rounded-lg outline-none text-sm cursor-pointer hover:border-white/20 transition-all"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
              <option value="typescript">TypeScript</option>
              <option value="c">C</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
            </select>

            {/* Run Code Button */}
            <button
              onClick={handleRunCode}
              className="flex items-center justify-center gap-2 px-3 sm:px-5 py-2 sm:py-1.5 bg-[#3b82f6] hover:bg-[#2563eb] text-white text-xs uppercase tracking-widest font-bold rounded-lg shadow-[0_0_12px_rgba(59,130,246,0.5)] active:scale-95 duration-150 shrink-0 cursor-pointer"
              title="Run Code"
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
              <span className="hidden min-[380px]:inline">Run</span>
            </button>

            {/* Output Toggle Button */}
            <button
              onClick={() => setIsOutputOpen(!isOutputOpen)}
              className={`flex items-center justify-center gap-2 px-3 py-2 sm:py-1.5 rounded-lg border text-xs uppercase tracking-wider font-bold transition-all active:scale-95 duration-150 shrink-0 cursor-pointer ${
                isOutputOpen
                  ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                  : "bg-white/5 hover:bg-white/10 text-[#e5e1e4] border-white/10"
              }`}
              title={isOutputOpen ? "Close Output Panel" : "Open Output Panel"}
            >
              <span className="material-symbols-outlined text-[18px]">terminal</span>
              <span className="hidden sm:inline">Output</span>
              {output && !isOutputOpen && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              )}
            </button>

            {/* Chat & Users Panel Toggle Button */}
            <button
              onClick={() => setIsChatOpen(!isChatOpen)}
              className={`flex items-center justify-center gap-2 px-3 py-2 sm:py-1.5 rounded-lg border text-xs uppercase tracking-wider font-bold transition-all active:scale-95 duration-150 shrink-0 cursor-pointer ${
                isChatOpen
                  ? "bg-[#3b82f6]/20 text-[#adc6ff] border-[#3b82f6]/40 shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                  : "bg-white/5 hover:bg-white/10 text-[#e5e1e4] border-white/10"
              }`}
              title={isChatOpen ? "Close Chat & Users" : "Open Chat & Users"}
            >
              <span className="material-symbols-outlined text-[18px]">forum</span>
              <span className="hidden sm:inline">Chat</span>
            </button>

            {/* Settings Toggle Button in Header */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className={`flex items-center justify-center gap-2 px-3 py-2 sm:py-1.5 rounded-lg border text-xs uppercase tracking-wider font-bold transition-all active:scale-95 duration-150 shrink-0 cursor-pointer ${
                isSettingsOpen
                  ? "bg-[#3b82f6]/20 text-[#adc6ff] border-[#3b82f6]/40 shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                  : "bg-white/5 hover:bg-white/10 text-[#e5e1e4] border-white/10"
              }`}
              title="Open Settings"
            >
              <span className="material-symbols-outlined text-[18px]">settings</span>
              <span className="hidden sm:inline">Settings</span>
            </button>
          </div>
        </header>

        {/* Main Workspace Area (Tabs + Editor + Output + Chat Panel) */}
        <div className="flex-1 min-h-0 flex flex-row overflow-hidden relative">
          {/* Code Canvas & Output Panel Container */}
          <div className="flex-1 min-w-0 flex flex-col h-full overflow-hidden">
            {/* File Tabs Bar */}
            <FileTabs
              openTabs={openTabs}
              activeFileName={activeFile?.fileName}
              onTabSelect={(tab) => switchToFile(tab)}
              onTabClose={handleTabClose}
            />

            {/* Monaco Code Editor Canvas */}
            <section className="flex-1 min-h-0 relative overflow-hidden bg-[#0a0a0c]">
              <Editor
                height="100%"
                language={language}
                defaultValue="// start coding..."
                theme={settings.theme || 'vs-dark'}
                onMount={handleMount}
                options={{
                  minimap: { enabled: !!settings.minimap },
                  fontFamily: settings.fontFamily || "'JetBrains Mono', monospace",
                  fontSize: settings.fontSize || 14,
                  lineHeight: 1.7,
                  tabSize: settings.tabSize || 2,
                  wordWrap: settings.wordWrap || 'on',
                  lineNumbers: settings.lineNumbers || 'on',
                  cursorStyle: settings.cursorStyle || 'line',
                  bracketPairColorization: { enabled: settings.bracketPairColorization ?? true },
                  padding: { top: 16 },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                }}
              />
            </section>

            {/* Output Console Panel (Collapsible with toggle & auto-opens on Run) */}
            {isOutputOpen && (
              <section className="h-48 sm:h-56 lg:h-64 border-t border-white/10 bg-[#08080a] flex flex-col shrink-0 transition-all duration-300">
                {/* Output Header */}
                <div className="flex items-center justify-between px-4 py-2 bg-[#121215] border-b border-white/10 shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-emerald-400 text-[18px]">terminal</span>
                    <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                      Console Output
                    </h2>
                  </div>
                  <div className="flex items-center gap-2">
                    {output && (
                      <button
                        onClick={() => setOutput("")}
                        className="text-[11px] font-semibold text-[#c2c6d6]/60 hover:text-white px-2 py-0.5 rounded hover:bg-white/5 transition-all cursor-pointer"
                      >
                        Clear
                      </button>
                    )}
                    <button
                      onClick={() => setIsOutputOpen(false)}
                      className="flex items-center justify-center p-1 rounded text-[#c2c6d6] hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                      title="Close Output"
                    >
                      <span className="material-symbols-outlined text-[18px]">close</span>
                    </button>
                  </div>
                </div>

                {/* Output Body */}
                <div className="flex-1 p-4 overflow-auto font-mono text-sm leading-relaxed">
                  {output ? (
                    <pre className="text-[#e5e1e4] whitespace-pre-wrap">{output}</pre>
                  ) : (
                    <span className="text-[#c2c6d6]/40 italic text-xs">Run code to see output...</span>
                  )}
                </div>
              </section>
            )}
          </div>

          {/* Mobile Overlay Backdrop for Chat Drawer */}
          {isChatOpen && (
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] xl:hidden transition-opacity duration-300"
              onClick={() => setIsChatOpen(false)}
            />
          )}

          {/* Users & Chat Sidebar (Collapsible & Responsive: Drawer on Mobile/Tablet, Right Panel on Desktop) */}
          {isChatOpen && (
            <section
              className="fixed inset-y-0 right-0 z-[60] w-full sm:w-[350px] bg-[#0c0c0e]/95 backdrop-blur-2xl border-l border-white/10 flex flex-col p-4 gap-4 shadow-2xl transition-all duration-300 xl:relative xl:inset-auto xl:z-20 xl:w-[320px] xl:bg-[#131315]/90 xl:shadow-none shrink-0"
            >
              {/* Tabs & Close button row */}
              <div className="flex items-center gap-2 shrink-0">
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

                {/* Close Button for Panel */}
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="flex items-center justify-center p-2 rounded-lg text-[#adc6ff] hover:text-white hover:bg-white/10 active:scale-95 duration-150 cursor-pointer border border-white/5"
                  aria-label="Close panel"
                  title="Close Panel"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              {/* Users list tab panel */}
              <div className={`flex-1 flex flex-col gap-2 overflow-y-auto pr-1 min-h-0 ${activeTab === "users" ? "" : "hidden"}`}>
                <h2 className="text-xs font-bold uppercase tracking-widest text-[#c2c6d6] flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-[18px]">group</span>
                  Users ({users.length})
                </h2>
                {users.map((user, index) => (
                  <div key={index} className="flex items-center gap-4 p-2 bg-white/5 border border-white/10 rounded-xl transition-all hover:bg-white/10">
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-[#1c1b1d] border border-white/10 flex items-center justify-center text-xs font-bold text-[#adc6ff] uppercase">
                        {user.username ? user.username.substring(0, 2) : "??"}
                      </div>
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#2a2a2c]"></span>
                    </div>
                    <div className="overflow-hidden flex-1 min-w-0">
                      <p className="text-xs font-bold text-[#e5e1e4] truncate">
                        {user.username} {user.username === username && "(You)"}
                      </p>
                      <p className="text-[10px] text-[#adc6ff]/70 font-semibold uppercase tracking-wider">Online</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat panel component */}
              <div className={`flex-1 flex flex-col min-h-0 ${activeTab === "chat" ? "" : "hidden"}`}>
                <ChatPanel socket={socketRef.current} username={username} groupCode={groupCode} />
              </div>
            </section>
          )}
        </div>

        {/* Status Bar Footer */}
        <footer className="h-8 min-h-8 px-4 bg-[#08080a] border-t border-white/10 flex items-center justify-between text-[11px] text-[#c2c6d6] shrink-0">
          <div className="flex items-center gap-4 min-w-0">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold truncate">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Syncing
            </span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(groupCode);
                alert("Room Code copied to clipboard!");
              }}
              className="hidden sm:flex items-center gap-1 hover:text-white transition-colors cursor-pointer min-w-0"
              title="Click to copy Room Code"
            >
              <span className="material-symbols-outlined text-[14px]">content_copy</span>
              <span className="text-xs uppercase tracking-widest font-bold truncate">{groupCode}</span>
            </button>
          </div>
          <div className="flex items-center justify-end gap-2 sm:gap-4 min-w-0">
            {/* Active file indicator */}
            <div className="hidden md:flex items-center gap-2 text-[10px] text-[#c2c6d6] uppercase tracking-widest px-4 border-r border-white/10 h-6">
              <span className="material-symbols-outlined text-[13px] text-[#adc6ff]">description</span>
              <span className="truncate max-w-[120px]">{activeFile?.fileName || "main.js"}</span>
            </div>
            <div className="hidden md:flex items-center gap-2 text-[10px] text-[#c2c6d6] uppercase tracking-widest px-4 border-r border-white/10 h-6">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
              Engine: Connected
            </div>
            <button
              className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-1 text-[#ffb4ab] hover:bg-[#ffb4ab]/10 transition-all rounded-lg active:scale-95 duration-150 cursor-pointer"
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
        <div 
          onClick={() => {
            setIsFileExplorerOpen(!isFileExplorerOpen);
            setIsSidebarOpen(true);
          }}
          className={`hover:text-[#d8e2ff] active:scale-90 transition-all cursor-pointer flex flex-col items-center ${
            isFileExplorerOpen ? "text-[#3b82f6] scale-110" : "text-[#c2c6d6]"
          }`}
          title="Toggle Files"
        >
          <span className="material-symbols-outlined">folder_open</span>
        </div>
        <div 
          onClick={() => setIsOutputOpen(!isOutputOpen)}
          className={`hover:text-[#d8e2ff] active:scale-90 transition-all cursor-pointer flex flex-col items-center ${
            isOutputOpen ? "text-emerald-400 scale-110" : "text-[#c2c6d6]"
          }`}
          title="Toggle Output"
        >
          <span className="material-symbols-outlined">terminal</span>
        </div>
        <div 
          onClick={() => {
            setIsChatOpen(!isChatOpen);
            setActiveTab("chat");
          }}
          className={`hover:text-[#d8e2ff] active:scale-90 transition-all cursor-pointer flex flex-col items-center ${
            isChatOpen && activeTab === "chat" ? "text-[#3b82f6] scale-110" : "text-[#c2c6d6]"
          }`}
          title="Toggle Chat"
        >
          <span className="material-symbols-outlined">chat</span>
        </div>
        <div 
          onClick={() => {
            setIsChatOpen(!isChatOpen);
            setActiveTab("users");
          }}
          className={`hover:text-[#d8e2ff] active:scale-90 transition-all cursor-pointer flex flex-col items-center ${
            isChatOpen && activeTab === "users" ? "text-[#3b82f6] scale-110" : "text-[#c2c6d6]"
          }`}
          title="Toggle Users"
        >
          <span className="material-symbols-outlined">group</span>
        </div>
        <div 
          onClick={() => setIsSettingsOpen(true)}
          className={`hover:text-[#d8e2ff] active:scale-90 transition-all cursor-pointer flex flex-col items-center ${
            isSettingsOpen ? "text-[#3b82f6] scale-110" : "text-[#c2c6d6]"
          }`}
          title="Toggle Settings"
        >
          <span className="material-symbols-outlined">settings</span>
        </div>
        <div 
          onClick={handleRunCode}
          className="text-[#3b82f6] hover:text-blue-400 active:scale-90 transition-all cursor-pointer flex flex-col items-center"
          title="Run Code"
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
        </div>
      </nav>
    </div>
  )
}

export default CollaborativeEditor
