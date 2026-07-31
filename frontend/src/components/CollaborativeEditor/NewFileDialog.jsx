import React, { useState, useRef, useEffect } from 'react';

const TEMPLATES = [
    { label: 'Empty File', ext: '', code: '' },
    { label: 'JavaScript', ext: '.js', code: '// Start coding...\n' },
    { label: 'Python', ext: '.py', code: '# Start coding...\n' },
    { label: 'TypeScript', ext: '.ts', code: '// Start coding...\n' },
    { label: 'Java', ext: '.java', code: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}\n' },
    { label: 'C++', ext: '.cpp', code: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}\n' },
    { label: 'C', ext: '.c', code: '#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}\n' },
    { label: 'HTML', ext: '.html', code: '<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="UTF-8">\n    <title>Document</title>\n</head>\n<body>\n    \n</body>\n</html>\n' },
    { label: 'CSS', ext: '.css', code: '/* Styles */\n' },
];

const NewFileDialog = ({ isOpen, onClose, onSubmit, existingFileNames = [] }) => {
    const [fileName, setFileName] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState(0);
    const [error, setError] = useState('');
    const inputRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            setFileName('');
            setSelectedTemplate(0);
            setError('');
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    const validate = (name) => {
        if (!name.trim()) return 'File name is required';
        if (!/^[a-zA-Z0-9_\-\.]+$/.test(name.trim())) return 'Invalid characters in file name';
        if (existingFileNames.some(f => f.toLowerCase() === name.trim().toLowerCase())) {
            return 'A file with this name already exists';
        }
        return '';
    };

    const handleSubmit = () => {
        let finalName = fileName.trim();
        const template = TEMPLATES[selectedTemplate];

        // Auto-add extension if missing and template selected
        if (template.ext && !finalName.includes('.')) {
            finalName += template.ext;
        }

        const validationError = validate(finalName);
        if (validationError) {
            setError(validationError);
            return;
        }

        onSubmit?.({
            fileName: finalName,
            code: template.code,
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[70] p-4">
            <div
                className="bg-[#121216] border border-white/15 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-5"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center pb-3 border-b border-white/10">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#adc6ff]">note_add</span>
                        Create New File
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-[#c2c6d6]/50 hover:text-white transition-colors cursor-pointer"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* File Name Input */}
                <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-[#c2c6d6]">
                        FILE NAME
                    </label>
                    <input
                        ref={inputRef}
                        value={fileName}
                        onChange={(e) => {
                            setFileName(e.target.value);
                            setError('');
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSubmit();
                            if (e.key === 'Escape') onClose?.();
                        }}
                        className="w-full bg-[#050506] border border-white/10 rounded-xl py-3 px-4 text-sm text-[#e5e1e4] font-mono focus:outline-none focus:border-[#adc6ff] focus:ring-2 focus:ring-[#adc6ff]/20 transition-all placeholder:opacity-30"
                        placeholder="e.g. utils.js, styles.css, main.py"
                        type="text"
                    />
                    {error && (
                        <p className="text-[11px] text-rose-400 font-semibold flex items-center gap-1">
                            <span className="material-symbols-outlined text-[13px]">error</span>
                            {error}
                        </p>
                    )}
                </div>

                {/* Template Selection */}
                <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-[#c2c6d6]">
                        TEMPLATE
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                        {TEMPLATES.map((template, idx) => (
                            <button
                                key={idx}
                                onClick={() => setSelectedTemplate(idx)}
                                className={`px-2.5 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                                    selectedTemplate === idx
                                        ? 'bg-[#3b82f6]/20 text-[#adc6ff] border border-[#3b82f6]/40 shadow-[0_0_8px_rgba(59,130,246,0.2)]'
                                        : 'bg-white/5 text-[#c2c6d6]/60 border border-white/5 hover:bg-white/10 hover:text-[#e5e1e4]'
                                }`}
                            >
                                {template.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-1">
                    <button
                        onClick={handleSubmit}
                        className="flex-1 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-bold py-3 rounded-xl shadow-[0_0_12px_rgba(59,130,246,0.4)] active:scale-95 transition-all cursor-pointer text-xs uppercase tracking-widest flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined text-[18px]">add</span>
                        Create File
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-3 rounded-xl active:scale-95 transition-all cursor-pointer text-xs uppercase tracking-widest"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NewFileDialog;
