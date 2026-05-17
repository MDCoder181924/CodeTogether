import React from 'react';
import { useNavigate } from 'react-router-dom';

const GroupLobbyBox = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#0e0e10] min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(59,130,246,0.15)_0%,rgba(59,130,246,0)_70%)] rounded-full blur-[60px] -z-10 top-[-10%] left-[-10%]"></div>
      <div className="absolute w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(59,130,246,0.15)_0%,rgba(59,130,246,0)_70%)] rounded-full blur-[60px] -z-10 bottom-[-10%] right-[-10%]"></div>

      {/* Main Container */}
      <main className="w-full max-w-[480px] p-6 z-10">
        {/* Header / Logo */}
        <header className="flex flex-col items-center mb-10 text-center">
          <div className="mb-4 p-2 bg-white/5 rounded-xl border border-white/10 backdrop-blur-md">
            <span className="material-symbols-outlined text-[#adc6ff] text-[40px]">terminal</span>
          </div>
          <h1 className="font-sans text-5xl font-bold text-[#e5e1e4] mb-1 tracking-tight">CodeTogether</h1>
          <p className="text-lg text-[#c2c6d6] opacity-80">Collaborate with your team in real-time</p>
        </header>

        {/* Glassmorphism Form Card */}
        <section className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-xl shadow-2xl">
          <div className="space-y-4">
            {/* Room Code Field */}
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-widest font-semibold text-[#c2c6d6] ml-1">ROOM CODE</label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-4 text-[#8c909f] text-[20px]">vpn_key</span>
                <input 
                  className="w-full bg-[#050506] border border-white/10 rounded-lg py-4 pl-10 pr-4 text-[#e5e1e4] font-mono focus:outline-none focus:border-[#adc6ff] focus:ring-2 focus:ring-[#adc6ff]/20 transition-all placeholder:opacity-30" 
                  placeholder="Enter room ID" 
                  type="text" 
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <button 
                onClick={() => navigate('/editor')}
                className="bg-[#adc6ff] text-[#002e6a] text-xs uppercase tracking-widest font-bold py-4 rounded-lg hover:shadow-[0_0_12px_rgba(173,198,255,0.5)] active:scale-95 transition-all flex items-center justify-center gap-1"
              >
                <span className="material-symbols-outlined text-[18px]">add_box</span>
                CREATE ROOM
              </button>
              <button 
                onClick={() => navigate('/editor')}
                className="bg-white/5 border border-white/10 text-[#e5e1e4] text-xs uppercase tracking-widest font-bold py-4 rounded-lg hover:bg-white/10 active:scale-95 transition-all flex items-center justify-center gap-1"
              >
                <span className="material-symbols-outlined text-[18px]">login</span>
                JOIN ROOM
              </button>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="mt-10 pt-6 border-t border-white/5 flex justify-between items-center">
            <div className="flex -space-x-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-[#0e0e10]"></div>
              <div className="text-[#c2c6d6] text-[10px] font-bold uppercase tracking-widest ml-4 opacity-60">1,204 DEVELOPERS ONLINE</div>
            </div>
            <div className="flex gap-2">
              <span className="material-symbols-outlined text-[#8c909f] text-[16px] hover:text-[#adc6ff] transition-colors cursor-pointer">help</span>
              <span className="material-symbols-outlined text-[#8c909f] text-[16px] hover:text-[#adc6ff] transition-colors cursor-pointer">settings</span>
            </div>
          </div>
        </section>

        {/* Footer / Credits */}
        <footer className="mt-10 text-center">
          <p className="text-xs uppercase tracking-widest font-bold text-[#8c909f] opacity-40">POWERED BY DISTRIBUTED SYNC ENGINE V2.0</p>
        </footer>
      </main>

      {/* Floating Background Visuals */}
      <div className="hidden lg:block absolute top-1/2 left-[10%] -translate-y-1/2 opacity-20 pointer-events-none">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-xl w-[200px] border-l-4 border-l-[#adc6ff]">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
            <div className="font-mono text-xs text-[#adc6ff]">Main.js</div>
          </div>
          <div className="space-y-1">
            <div className="h-2 w-full bg-white/10 rounded"></div>
            <div className="h-2 w-3/4 bg-white/10 rounded"></div>
            <div className="h-2 w-5/6 bg-white/10 rounded"></div>
          </div>
        </div>
      </div>
      
      <div className="hidden lg:block absolute top-1/4 right-[15%] opacity-10 pointer-events-none">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-xl w-[180px]">
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-[14px] text-[#ffb786]">group</span>
            <div className="text-xs uppercase tracking-widest font-bold text-[#c2c6d6]">Active Pair</div>
          </div>
          <div className="flex gap-1">
            <div className="w-6 h-6 rounded-full bg-[#adc6ff]/20 border border-[#adc6ff]/30"></div>
            <div className="w-6 h-6 rounded-full bg-[#c0c1ff]/20 border border-[#c0c1ff]/30"></div>
            <div className="w-6 h-6 rounded-full bg-[#ffb786]/20 border border-[#ffb786]/30"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupLobbyBox;
