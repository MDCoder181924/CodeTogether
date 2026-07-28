import React, { useState } from 'react';

const DEFAULT_SETTINGS = {
  // Editor
  theme: 'vs-dark',
  fontSize: 14,
  fontFamily: "'JetBrains Mono', monospace",
  tabSize: 2,
  wordWrap: 'on',
  lineNumbers: 'on',
  cursorStyle: 'line',
  minimap: false,
  bracketPairColorization: true,

  // Profile
  username: '',

  // Preferences
  defaultLanguage: 'javascript',
  autoSave: true,
  formatOnPaste: false,
};

export { DEFAULT_SETTINGS };

export default function SettingsModal({ isOpen, onClose, settings, onUpdateSettings, username, onUpdateUsername }) {
  const [activeTab, setActiveTab] = useState('editor');

  if (!isOpen) return null;

  const handleSettingChange = (key, value) => {
    onUpdateSettings({
      ...settings,
      [key]: value,
    });
  };

  const handleReset = () => {
    onUpdateSettings({ ...DEFAULT_SETTINGS, username: username || '' });
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md transition-opacity duration-200 animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl bg-[#0c0c0e]/95 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-[#e5e1e4]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#3b82f6]/10 text-[#3b82f6] border border-[#3b82f6]/20">
              <span className="material-symbols-outlined text-[22px]">settings</span>
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-wide text-white">Settings</h2>
              <p className="text-xs text-[#c2c6d6]/60">Customize your editor workspace & preferences</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#c2c6d6]/70 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            aria-label="Close Settings"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex px-6 pt-3 border-b border-white/10 bg-black/20 gap-2">
          <button
            onClick={() => setActiveTab('editor')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-t-xl transition-all cursor-pointer border-b-2 ${
              activeTab === 'editor'
                ? 'bg-white/10 text-[#adc6ff] border-[#3b82f6]'
                : 'text-[#c2c6d6]/60 hover:text-white border-transparent'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">code</span>
            Editor Options
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-t-xl transition-all cursor-pointer border-b-2 ${
              activeTab === 'profile'
                ? 'bg-white/10 text-[#adc6ff] border-[#3b82f6]'
                : 'text-[#c2c6d6]/60 hover:text-white border-transparent'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">person</span>
            Profile
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-t-xl transition-all cursor-pointer border-b-2 ${
              activeTab === 'preferences'
                ? 'bg-white/10 text-[#adc6ff] border-[#3b82f6]'
                : 'text-[#c2c6d6]/60 hover:text-white border-transparent'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">tune</span>
            Preferences
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {/* TAB 1: EDITOR SETTINGS */}
          {activeTab === 'editor' && (
            <div className="space-y-5">
              {/* Theme */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 rounded-xl bg-white/5 border border-white/5">
                <div>
                  <label className="text-sm font-semibold text-white block">Editor Theme</label>
                  <span className="text-xs text-[#c2c6d6]/60">Select color theme for Monaco Editor</span>
                </div>
                <select
                  value={settings.theme || 'vs-dark'}
                  onChange={(e) => handleSettingChange('theme', e.target.value)}
                  className="bg-[#1c1b1d] border border-white/10 text-sm text-white px-3 py-1.5 rounded-lg outline-none cursor-pointer hover:border-white/20 transition-all min-w-[140px]"
                >
                  <option value="vs-dark">Dark (VS-Dark)</option>
                  <option value="light">Light</option>
                  <option value="hc-black">High Contrast Dark</option>
                  <option value="hc-light">High Contrast Light</option>
                </select>
              </div>

              {/* Font Size */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-white/5 border border-white/5">
                <div>
                  <label className="text-sm font-semibold text-white block">Font Size ({settings.fontSize || 14}px)</label>
                  <span className="text-xs text-[#c2c6d6]/60">Adjust text size in the code canvas</span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="10"
                    max="26"
                    step="1"
                    value={settings.fontSize || 14}
                    onChange={(e) => handleSettingChange('fontSize', parseInt(e.target.value, 10))}
                    className="w-32 accent-[#3b82f6] cursor-pointer"
                  />
                  <input
                    type="number"
                    min="10"
                    max="26"
                    value={settings.fontSize || 14}
                    onChange={(e) => handleSettingChange('fontSize', Math.min(26, Math.max(10, parseInt(e.target.value, 10) || 14)))}
                    className="w-14 bg-[#1c1b1d] border border-white/10 text-sm text-center text-white py-1 rounded-lg outline-none"
                  />
                </div>
              </div>

              {/* Font Family */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 rounded-xl bg-white/5 border border-white/5">
                <div>
                  <label className="text-sm font-semibold text-white block">Font Family</label>
                  <span className="text-xs text-[#c2c6d6]/60">Monospaced font used in the editor</span>
                </div>
                <select
                  value={settings.fontFamily || "'JetBrains Mono', monospace"}
                  onChange={(e) => handleSettingChange('fontFamily', e.target.value)}
                  className="bg-[#1c1b1d] border border-white/10 text-sm text-white px-3 py-1.5 rounded-lg outline-none cursor-pointer hover:border-white/20 transition-all min-w-[180px]"
                >
                  <option value="'JetBrains Mono', monospace">JetBrains Mono</option>
                  <option value="'Fira Code', monospace">Fira Code</option>
                  <option value="'Courier New', monospace">Courier New</option>
                  <option value="monospace">Standard Monospace</option>
                </select>
              </div>

              {/* Tab Size */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 rounded-xl bg-white/5 border border-white/5">
                <div>
                  <label className="text-sm font-semibold text-white block">Tab Size</label>
                  <span className="text-xs text-[#c2c6d6]/60">Number of spaces per indentation level</span>
                </div>
                <div className="flex gap-1.5 bg-[#1c1b1d] p-1 rounded-lg border border-white/10">
                  {[2, 4, 8].map((size) => (
                    <button
                      key={size}
                      onClick={() => handleSettingChange('tabSize', size)}
                      className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                        (settings.tabSize || 2) === size
                          ? 'bg-[#3b82f6] text-white shadow-sm'
                          : 'text-[#c2c6d6]/60 hover:text-white'
                      }`}
                    >
                      {size} Spaces
                    </button>
                  ))}
                </div>
              </div>

              {/* Word Wrap */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 rounded-xl bg-white/5 border border-white/5">
                <div>
                  <label className="text-sm font-semibold text-white block">Word Wrap</label>
                  <span className="text-xs text-[#c2c6d6]/60">Wrap lines that exceed editor width</span>
                </div>
                <select
                  value={settings.wordWrap || 'on'}
                  onChange={(e) => handleSettingChange('wordWrap', e.target.value)}
                  className="bg-[#1c1b1d] border border-white/10 text-sm text-white px-3 py-1.5 rounded-lg outline-none cursor-pointer min-w-[120px]"
                >
                  <option value="on">On</option>
                  <option value="off">Off</option>
                  <option value="bounded">Bounded</option>
                </select>
              </div>

              {/* Line Numbers */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 rounded-xl bg-white/5 border border-white/5">
                <div>
                  <label className="text-sm font-semibold text-white block">Line Numbers</label>
                  <span className="text-xs text-[#c2c6d6]/60">Display line numbers in editor margin</span>
                </div>
                <select
                  value={settings.lineNumbers || 'on'}
                  onChange={(e) => handleSettingChange('lineNumbers', e.target.value)}
                  className="bg-[#1c1b1d] border border-white/10 text-sm text-white px-3 py-1.5 rounded-lg outline-none cursor-pointer min-w-[120px]"
                >
                  <option value="on">On</option>
                  <option value="off">Off</option>
                  <option value="relative">Relative</option>
                </select>
              </div>

              {/* Cursor Style */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 rounded-xl bg-white/5 border border-white/5">
                <div>
                  <label className="text-sm font-semibold text-white block">Cursor Style</label>
                  <span className="text-xs text-[#c2c6d6]/60">Visual appearance of text insertion point</span>
                </div>
                <select
                  value={settings.cursorStyle || 'line'}
                  onChange={(e) => handleSettingChange('cursorStyle', e.target.value)}
                  className="bg-[#1c1b1d] border border-white/10 text-sm text-white px-3 py-1.5 rounded-lg outline-none cursor-pointer min-w-[120px]"
                >
                  <option value="line">Line (|)</option>
                  <option value="block">Block (█)</option>
                  <option value="underline">Underline (_)</option>
                </select>
              </div>

              {/* Minimap Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/5">
                <div>
                  <label className="text-sm font-semibold text-white block">Code Minimap</label>
                  <span className="text-xs text-[#c2c6d6]/60">Show code outline preview on right sidebar</span>
                </div>
                <button
                  onClick={() => handleSettingChange('minimap', !settings.minimap)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 cursor-pointer ${
                    settings.minimap ? 'bg-[#3b82f6]' : 'bg-[#1c1b1d] border border-white/10'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                      settings.minimap ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Bracket Pair Colorization */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/5">
                <div>
                  <label className="text-sm font-semibold text-white block">Bracket Pair Colorization</label>
                  <span className="text-xs text-[#c2c6d6]/60">Highlight matching brackets with unique colors</span>
                </div>
                <button
                  onClick={() => handleSettingChange('bracketPairColorization', !settings.bracketPairColorization)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 cursor-pointer ${
                    settings.bracketPairColorization ? 'bg-[#3b82f6]' : 'bg-[#1c1b1d] border border-white/10'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                      settings.bracketPairColorization ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: PROFILE SETTINGS */}
          {activeTab === 'profile' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#3b82f6] to-[#adc6ff] flex items-center justify-center text-lg font-bold text-white uppercase shadow-lg border border-white/10">
                    {(username || 'A').substring(0, 2)}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{username || 'Anonymous User'}</h3>
                    <p className="text-xs text-[#adc6ff]">Active Collaborator</p>
                  </div>
                </div>

                <div className="pt-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#c2c6d6] block mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => onUpdateUsername(e.target.value)}
                    placeholder="Enter your display name..."
                    className="w-full bg-[#1c1b1d] border border-white/10 text-sm text-white px-4 py-2.5 rounded-xl outline-none focus:border-[#3b82f6] transition-all"
                  />
                  <p className="text-[11px] text-[#c2c6d6]/60 mt-1.5">
                    This name will be visible to all collaborators in the room and live chat.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PREFERENCES */}
          {activeTab === 'preferences' && (
            <div className="space-y-5">
              {/* Default Language */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 rounded-xl bg-white/5 border border-white/5">
                <div>
                  <label className="text-sm font-semibold text-white block">Default Language</label>
                  <span className="text-xs text-[#c2c6d6]/60">Preferred programming language for new files</span>
                </div>
                <select
                  value={settings.defaultLanguage || 'javascript'}
                  onChange={(e) => handleSettingChange('defaultLanguage', e.target.value)}
                  className="bg-[#1c1b1d] border border-white/10 text-sm text-white px-3 py-1.5 rounded-lg outline-none cursor-pointer min-w-[140px]"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                  <option value="typescript">TypeScript</option>
                  <option value="c">C</option>
                </select>
              </div>

              {/* Auto-Save Code */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/5">
                <div>
                  <label className="text-sm font-semibold text-white block">Auto-Save Code</label>
                  <span className="text-xs text-[#c2c6d6]/60">Periodically sync code edits to database</span>
                </div>
                <button
                  onClick={() => handleSettingChange('autoSave', !settings.autoSave)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 cursor-pointer ${
                    settings.autoSave ? 'bg-[#3b82f6]' : 'bg-[#1c1b1d] border border-white/10'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                      settings.autoSave ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 bg-white/5">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">restart_alt</span>
            Reset to Defaults
          </button>
          
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold uppercase tracking-wider bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-xl shadow-[0_0_12px_rgba(59,130,246,0.5)] active:scale-95 transition-all cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
