import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="bg-[#0a0a0c] text-[#e5e1e4] font-sans overflow-x-hidden selection:bg-[#adc6ff]/30 min-h-screen">
      {/* TopAppBar */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-white/5 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#adc6ff] text-2xl">terminal</span>
          <span className="font-sans text-2xl font-bold text-[#adc6ff]">CodeTogether</span>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <a className="text-[#c2c6d6] text-xs uppercase tracking-widest font-bold hover:text-[#e5e1e4] transition-colors" href="#Features">Features</a>
          <a className="text-[#c2c6d6] text-xs uppercase tracking-widest font-bold hover:text-[#e5e1e4] transition-colors" href="#Documentation">Documentation</a>
          <a className="text-[#c2c6d6] text-xs uppercase tracking-widest font-bold hover:text-[#e5e1e4] transition-colors" href="#Enterprise">Enterprise</a>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="px-4 py-2 text-xs uppercase tracking-widest font-bold text-[#c2c6d6] hover:text-[#e5e1e4] transition-all">
            Login
          </Link>
          <Link to="/group-lobby" className="px-4 py-2 bg-[#adc6ff] text-[#002e6a] text-xs uppercase tracking-widest font-bold rounded-lg hover:shadow-[0_0_12px_rgba(173,198,255,0.5)] active:scale-95 transition-all">
            Run
          </Link>
        </div>
      </nav>

      <main className="pt-16">
        {/* Hero Section */}
        <section  className="relative min-h-[795px] flex flex-col items-center justify-center px-6 text-center overflow-hidden">
          {/* Background Gradients */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#adc6ff]/20 blur-[120px] rounded-full -z-10"></div>
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#c0c1ff]/10 blur-[100px] rounded-full -z-10"></div>
          
          <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="font-sans text-5xl md:text-6xl font-black text-white leading-tight">
              Code Together in <span className="text-[#adc6ff] italic">Real-Time</span>
            </h1>
            <p className="text-lg text-[#c2c6d6] max-w-2xl mx-auto">
              Collaborate, edit, and build projects live with your team from anywhere. Experience a zero-latency development environment built for high-performance engineers.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Link to="/signup" className="px-10 py-4 bg-[#adc6ff] text-[#002e6a] text-xs uppercase tracking-widest font-bold rounded-full hover:shadow-[0_0_20px_rgba(173,198,255,0.4)] transition-all active:scale-95">
                Get Started
              </Link>
              <button className="px-10 py-4 bg-white/5 backdrop-blur-md border border-white/10 text-white text-xs uppercase tracking-widest font-bold rounded-full hover:bg-white/10 transition-all active:scale-95">
                Live Demo
              </button>
            </div>
          </div>

          {/* Editor Illustration */}
          <div className="mt-10 w-full max-w-5xl mx-auto bg-white/5 backdrop-blur-md rounded-xl overflow-hidden shadow-[0_0_40px_-10px_rgba(59,130,246,0.3)] border border-white/10">
            <div className="h-8 bg-white/5 border-b border-white/10 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
              <div className="ml-4 px-3 py-1 bg-white/5 rounded text-[10px] text-[#c2c6d6] font-mono">main.py</div>
            </div>
            <div className="flex">
              <div className="w-12 bg-[#0e0e10] border-r border-white/5 py-4 flex flex-col items-center gap-2">
                <span className="text-xs text-[#8c909f] font-mono">1</span>
                <span className="text-xs text-[#8c909f] font-mono">2</span>
                <span className="text-xs text-[#8c909f] font-mono">3</span>
                <span className="text-xs text-[#8c909f] font-mono">4</span>
                <span className="text-xs text-[#8c909f] font-mono">5</span>
              </div>
              <div className="flex-1 p-4 bg-[#050506] font-mono text-sm text-left overflow-x-auto">
                <div className="mb-1"><span className="text-[#818cf8]">import</span> asyncio</div>
                <div className="mb-1"><span className="text-[#818cf8]">from</span> engine <span className="text-[#818cf8]">import</span> CodeTogether</div>
                <div className="mb-1">&nbsp;</div>
                <div className="mb-1 bg-[#adc6ff]/10 border-l-2 border-[#adc6ff] -mx-4 px-4 py-0.5"><span className="text-[#818cf8]">async def</span> <span className="text-[#3b82f6]">main</span>():</div>
                <div className="mb-1">&nbsp;&nbsp;&nbsp;&nbsp;app = CodeTogether(room=<span className="text-[#34d399]">"alpha-10"</span>)</div>
                <div className="mb-1">&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#818cf8]">await</span> app.start_collaboration() <span className="text-[#64748b]">{`# Real-time sync initialized`}</span></div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Bento Grid */}
        <section id="Features" className="py-10 px-6 max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-sans text-3xl font-bold text-white mb-2">Engineered for Collaboration</h2>
            <p className="text-[#c2c6d6] text-base">Precision tools for modern engineering teams.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-xl flex flex-col gap-4 transition-all group">
              <div className="w-12 h-12 rounded-lg bg-[#adc6ff]/10 flex items-center justify-center text-[#adc6ff] group-hover:bg-[#adc6ff]/20 transition-all">
                <span className="material-symbols-outlined text-2xl">hub</span>
              </div>
              <h3 className="text-2xl font-bold text-white">Real-Time Collaboration</h3>
              <p className="text-[#c2c6d6] text-sm leading-relaxed">
                Sub-50ms latency ensures your team stays in perfect sync. See every keystroke and cursor movement as it happens across the globe.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-xl flex flex-col gap-4 transition-all group">
              <div className="w-12 h-12 rounded-lg bg-[#c0c1ff]/10 flex items-center justify-center text-[#c0c1ff] group-hover:bg-[#c0c1ff]/20 transition-all">
                <span className="material-symbols-outlined text-2xl"><Link to="/login ">login</Link></span>
              </div>
              <h3 className="text-2xl font-bold text-white">Instant Room Joining</h3>
              <p className="text-[#c2c6d6] text-sm leading-relaxed">
                No complex setup. Generate a secure link and invite collaborators instantly. Join a persistent workspace with one click.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-xl flex flex-col gap-4 transition-all group">
              <div className="w-12 h-12 rounded-lg bg-[#ffb786]/10 flex items-center justify-center text-[#ffb786] group-hover:bg-[#ffb786]/20 transition-all">
                <span className="material-symbols-outlined text-2xl">edit_square</span>
              </div>
              <h3 className="text-2xl font-bold text-white">Multi-User Live Editing</h3>
              <p className="text-[#c2c6d6] text-sm leading-relaxed">
                Intelligent conflict resolution allows dozens of developers to edit the same file simultaneously without overwriting progress.
              </p>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="Documentation" className="py-10 px-6 max-w-7xl mx-auto overflow-hidden">
          <div className="flex flex-col lg:flex-row items-center gap-10">
            <div className="flex-1 space-y-6 order-2 lg:order-1">
              <span className="text-xs uppercase tracking-widest font-bold text-[#adc6ff]">Global Infrastructure</span>
              <h2 className="font-sans text-3xl md:text-5xl font-black text-white leading-tight">
                Built on an <span className="text-[#c0c1ff]">Ultra-Fast</span> Distributed Network
              </h2>
              <p className="text-[#c2c6d6] text-lg">
                Our proprietary synchronization engine uses CRDT technology to ensure your data is consistent and secure. We distribute workloads across 24 edge regions to provide a frictionless coding experience, no matter where your team is located.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-[#adc6ff]">check_circle</span>
                  <span className="text-base text-[#e5e1e4]">End-to-End Encryption for all sessions</span>
                </li>
                <li className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-[#adc6ff]">check_circle</span>
                  <span className="text-base text-[#e5e1e4]">Git-integrated version history</span>
                </li>
                <li className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-[#adc6ff]">check_circle</span>
                  <span className="text-base text-[#e5e1e4]">Automatic environmental snapshotting</span>
                </li>
              </ul>
            </div>
            <div className="flex-1 order-1 lg:order-2 w-full">
              <div className="relative rounded-2xl overflow-hidden shadow-[0_0_40px_-10px_rgba(168,85,247,0.3)]">
                <img alt="Futuristic Server Room" className="w-full aspect-video object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuABMOvZzz9U3DQxWZ1q4LAnD9LY2jtJNMVVkajaYwF0ylaa5H1hmOt-DvekxlJo996e8uy23-sj0wCtrdGk6CLJSa3atSw3j1u5K5nKeGekn-Pvqlvb6xrhZfZHEdRB5xKVq40AOIJmSY6nvuJoddf-vfnur_AzlPphCKiOozuU60Pbu_IzAO6t_1Hv5w1r62Waxc1CmRZWSPqChYN_EPtWHA_kC9ORGN3-XzDm2TDDzkS8EsnS3_zstd4tpt8L8iPmDhljdbhkzmgY" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-transparent"></div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="Enterprise" className="py-10 px-6">
          <div className="max-w-5xl mx-auto bg-white/5 backdrop-blur-md border border-white/10 p-10 rounded-[2rem] text-center space-y-6 relative overflow-hidden">
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#adc6ff]/20 blur-[80px] rounded-full"></div>
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-[#c0c1ff]/20 blur-[80px] rounded-full"></div>
            <h2 className="font-sans text-3xl md:text-4xl font-bold text-white relative z-10">Ready to transform how your team builds?</h2>
            <p className="text-[#c2c6d6] text-lg max-w-2xl mx-auto relative z-10">
              Join over 50,000 developers who use CodeTogether to ship code faster and more collaboratively.
            </p>
            <div className="flex justify-center gap-4 relative z-10">
              <Link to="/signup" className="px-10 py-4 bg-[#adc6ff] text-[#002e6a] text-xs uppercase tracking-widest font-bold rounded-full hover:shadow-[0_0_20px_rgba(173,198,255,0.5)] transition-all">Start Coding for Free</Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#0e0e10] py-10 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="col-span-1 md:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#adc6ff] text-2xl">terminal</span>
              <span className="font-sans text-2xl font-bold text-white">CodeTogether</span>
            </div>
            <p className="text-[#c2c6d6] text-sm max-w-xs">
              The next-generation collaborative IDE for high-performance engineering teams.
            </p>
            <div className="flex gap-4">
              <a className="text-[#c2c6d6] hover:text-[#adc6ff] transition-colors" href="#">
                <span className="material-symbols-outlined">language</span>
              </a>
              <a className="text-[#c2c6d6] hover:text-[#adc6ff] transition-colors" href="#">
                <span className="material-symbols-outlined">share</span>
              </a>
              <a className="text-[#c2c6d6] hover:text-[#adc6ff] transition-colors" href="#">
                <span className="material-symbols-outlined">terminal</span>
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-widest font-bold text-white mb-4">Product</h4>
            <ul className="space-y-2 text-[#c2c6d6] text-sm">
              <li><a className="hover:text-[#e5e1e4] transition-colors" href="#">Features</a></li>
              <li><a className="hover:text-[#e5e1e4] transition-colors" href="#">API Reference</a></li>
              <li><a className="hover:text-[#e5e1e4] transition-colors" href="#">Integrations</a></li>
              <li><a className="hover:text-[#e5e1e4] transition-colors" href="#">Pricing</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-widest font-bold text-white mb-4">Resources</h4>
            <ul className="space-y-2 text-[#c2c6d6] text-sm">
              <li><a className="hover:text-[#e5e1e4] transition-colors" href="#">Documentation</a></li>
              <li><a className="hover:text-[#e5e1e4] transition-colors" href="#">Community</a></li>
              <li><a className="hover:text-[#e5e1e4] transition-colors" href="#">Blog</a></li>
              <li><a className="hover:text-[#e5e1e4] transition-colors" href="#">Status</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-widest font-bold text-white mb-4">Company</h4>
            <ul className="space-y-2 text-[#c2c6d6] text-sm">
              <li><a className="hover:text-[#e5e1e4] transition-colors" href="#">About Us</a></li>
              <li><a className="hover:text-[#e5e1e4] transition-colors" href="#">Careers</a></li>
              <li><a className="hover:text-[#e5e1e4] transition-colors" href="#">Privacy Policy</a></li>
              <li><a className="hover:text-[#e5e1e4] transition-colors" href="#">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-white/5 text-center text-[#c2c6d6] text-xs uppercase tracking-widest font-bold">
            © 2024 CodeTogether Inc. Built with passion for developers.
        </div>
      </footer>

      {/* BottomNavBar for Mobile */}
      <nav className="fixed bottom-0 w-full flex justify-around py-2 px-4 bg-[#131315] z-40 border-t border-white/10 md:hidden">
        <div className="flex flex-col items-center gap-1 text-[#adc6ff] scale-110">
          <span className="material-symbols-outlined">terminal</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-[#c2c6d6] opacity-70">
          <span className="material-symbols-outlined">bug_report</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-[#c2c6d6] opacity-70">
          <span className="material-symbols-outlined">chat</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-[#c2c6d6] opacity-70">
          <span className="material-symbols-outlined">history</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-[#c2c6d6] opacity-70">
          <span className="material-symbols-outlined">info</span>
        </div>
      </nav>
    </div>
  );
};

export default Home;
