import React, { useState } from 'react';

/**
 * File icon mapping based on language/extension
 */
const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    const iconMap = {
        'js': { icon: 'javascript', color: '#f7df1e' },
        'jsx': { icon: 'javascript', color: '#61dafb' },
        'ts': { icon: 'code', color: '#3178c6' },
        'tsx': { icon: 'code', color: '#3178c6' },
        'py': { icon: 'code', color: '#3776ab' },
        'java': { icon: 'coffee', color: '#ed8b00' },
        'cpp': { icon: 'code', color: '#00599c' },
        'c': { icon: 'code', color: '#a8b9cc' },
        'html': { icon: 'html', color: '#e34f26' },
        'css': { icon: 'css', color: '#1572b6' },
        'json': { icon: 'data_object', color: '#fbc02d' },
        'md': { icon: 'article', color: '#ffffff' },
    };
    return iconMap[ext] || { icon: 'description', color: '#adc6ff' };
};

const FileExplorer = ({
    files = [],
    activeFileName,
    onFileSelect,
    onCreateFile,
    onRenameFile,
    onDeleteFile,
    isCollapsed = false,
}) => {
    const [contextMenu, setContextMenu] = useState(null);
    const [renamingFileId, setRenamingFileId] = useState(null);
    const [renameValue, setRenameValue] = useState('');

    const handleContextMenu = (e, file) => {
        e.preventDefault();
        e.stopPropagation();
        setContextMenu({
            x: e.clientX,
            y: e.clientY,
            file,
        });
    };

    const closeContextMenu = () => setContextMenu(null);

    const startRename = (file) => {
        setRenamingFileId(file._id);
        setRenameValue(file.fileName);
        closeContextMenu();
    };

    const handleRenameSubmit = (fileId) => {
        if (renameValue.trim() && onRenameFile) {
            onRenameFile(fileId, renameValue.trim());
        }
        setRenamingFileId(null);
        setRenameValue('');
    };

    const handleDeleteClick = (file) => {
        closeContextMenu();
        if (onDeleteFile) {
            onDeleteFile(file._id, file.fileName);
        }
    };

    if (isCollapsed) return null;

    return (
        <div className="flex flex-col h-full select-none" onClick={closeContextMenu}>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 shrink-0">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-[#adc6ff]">folder_open</span>
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#c2c6d6]">
                        Files
                    </h3>
                    <span className="px-1.5 py-0.5 rounded-full bg-[#3b82f6]/20 text-[#adc6ff] border border-[#3b82f6]/30 text-[9px] font-bold">
                        {files.length}
                    </span>
                </div>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onCreateFile?.();
                    }}
                    className="flex items-center justify-center p-1 rounded-md text-[#adc6ff] hover:text-white hover:bg-white/10 active:scale-90 transition-all cursor-pointer"
                    title="New File"
                >
                    <span className="material-symbols-outlined text-[18px]">add</span>
                </button>
            </div>

            {/* File List */}
            <div className="flex-1 overflow-y-auto py-1.5 px-2 space-y-0.5 min-h-0">
                {files.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-4">
                        <span className="material-symbols-outlined text-2xl text-[#c2c6d6]/20 mb-2">
                            note_add
                        </span>
                        <p className="text-[10px] text-[#c2c6d6]/40">No files yet</p>
                    </div>
                ) : (
                    files.map((file) => {
                        const isActive = file.fileName === activeFileName;
                        const { icon, color } = getFileIcon(file.fileName);
                        const isRenaming = renamingFileId === file._id;

                        return (
                            <div
                                key={file._id}
                                onClick={() => !isRenaming && onFileSelect?.(file)}
                                onContextMenu={(e) => handleContextMenu(e, file)}
                                className={`group flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer transition-all duration-150 ${
                                    isActive
                                        ? 'bg-[#adc6ff]/10 text-[#adc6ff] border-l-2 border-[#adc6ff]'
                                        : 'text-[#c2c6d6]/70 hover:text-[#e5e1e4] hover:bg-white/5 border-l-2 border-transparent'
                                }`}
                            >
                                <span
                                    className="material-symbols-outlined text-[16px] shrink-0"
                                    style={{ color: isActive ? color : undefined }}
                                >
                                    {icon}
                                </span>

                                {isRenaming ? (
                                    <input
                                        autoFocus
                                        value={renameValue}
                                        onChange={(e) => setRenameValue(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleRenameSubmit(file._id);
                                            if (e.key === 'Escape') {
                                                setRenamingFileId(null);
                                                setRenameValue('');
                                            }
                                        }}
                                        onBlur={() => handleRenameSubmit(file._id)}
                                        onClick={(e) => e.stopPropagation()}
                                        className="flex-1 bg-[#050506] border border-[#adc6ff]/40 rounded px-1.5 py-0.5 text-[11px] text-[#e5e1e4] outline-none focus:border-[#adc6ff] font-mono min-w-0"
                                    />
                                ) : (
                                    <span className={`text-[11px] font-medium truncate flex-1 min-w-0 ${
                                        isActive ? 'font-bold' : ''
                                    }`}>
                                        {file.fileName}
                                    </span>
                                )}

                                {/* Quick action buttons on hover */}
                                {!isRenaming && (
                                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                startRename(file);
                                            }}
                                            className="p-0.5 rounded hover:bg-white/10 text-[#c2c6d6]/50 hover:text-[#adc6ff] transition-all cursor-pointer"
                                            title="Rename"
                                        >
                                            <span className="material-symbols-outlined text-[13px]">edit</span>
                                        </button>
                                        {files.length > 1 && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteClick(file);
                                                }}
                                                className="p-0.5 rounded hover:bg-rose-500/10 text-[#c2c6d6]/50 hover:text-rose-400 transition-all cursor-pointer"
                                                title="Delete"
                                            >
                                                <span className="material-symbols-outlined text-[13px]">close</span>
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            {/* Right-click Context Menu */}
            {contextMenu && (
                <>
                    <div
                        className="fixed inset-0 z-[100]"
                        onClick={closeContextMenu}
                    />
                    <div
                        className="fixed z-[101] bg-[#1a1a1e] border border-white/15 rounded-lg shadow-2xl py-1.5 min-w-[160px] backdrop-blur-xl"
                        style={{ top: contextMenu.y, left: contextMenu.x }}
                    >
                        <button
                            onClick={() => startRename(contextMenu.file)}
                            className="w-full flex items-center gap-2.5 px-4 py-2 text-[11px] text-[#e5e1e4] hover:bg-white/10 transition-colors cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-[15px] text-[#adc6ff]">edit</span>
                            Rename
                        </button>
                        {files.length > 1 && (
                            <button
                                onClick={() => handleDeleteClick(contextMenu.file)}
                                className="w-full flex items-center gap-2.5 px-4 py-2 text-[11px] text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-[15px]">delete</span>
                                Delete
                            </button>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default FileExplorer;
