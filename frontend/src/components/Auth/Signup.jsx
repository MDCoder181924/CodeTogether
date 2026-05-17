import React from 'react';
import { Link , useNavigate } from 'react-router-dom';

const Signup = () => {

  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/group-lobby');
  }


  return (
    <div className="bg-[#0e0e10] text-[#e5e1e4] flex items-center justify-center min-h-screen p-6 overflow-x-hidden selection:bg-[#adc6ff]/30 relative">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.15)_0%,rgba(0,0,0,0)_70%)] blur-[60px] -z-10"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.15)_0%,rgba(0,0,0,0)_70%)] blur-[60px] opacity-50 -z-10"></div>

      <main className="w-full max-w-[480px] relative z-10">
        {/* Brand Header */}
        <header className="flex flex-col items-center mb-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-[#adc6ff] text-3xl">terminal</span>
            <h1 className="font-sans text-3xl font-black text-[#e5e1e4] tracking-tighter">CodeTogether</h1>
          </div>
          <p className="text-base text-[#c2c6d6] text-center max-w-[320px]">
            Enter the focus flow. Join thousands of developers building in real-time.
          </p>
        </header>

        {/* Glassmorphism Signup Card */}
        <section className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 shadow-2xl relative overflow-hidden">
          {/* Subtle accent top border */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

          <form onSubmit={(e)=>{handleSubmit(e)}} className="flex flex-col gap-6">
            {/* Full Name Field */}
            <div className="flex flex-col gap-1">
              <label className="text-xs uppercase tracking-widest font-semibold text-[#c2c6d6] opacity-70" htmlFor="full_name">Full Name</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#c2c6d6] group-focus-within:text-[#adc6ff] transition-colors text-[20px]">person</span>
                <input 
                  className="w-full bg-[#0e0e10] border border-white/10 rounded-lg py-4 pl-[48px] pr-4 text-base text-[#e5e1e4] placeholder:text-[#8c909f] focus:outline-none focus:border-[#adc6ff] focus:ring-2 focus:ring-[#adc6ff]/20 transition-all" 
                  id="full_name" 
                  placeholder="Linus Torvalds" 
                  type="text" 
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="flex flex-col gap-1">
              <label className="text-xs uppercase tracking-widest font-semibold text-[#c2c6d6] opacity-70" htmlFor="email">Email Address</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#c2c6d6] group-focus-within:text-[#adc6ff] transition-colors text-[20px]">alternate_email</span>
                <input 
                  className="w-full bg-[#0e0e10] border border-white/10 rounded-lg py-4 pl-[48px] pr-4 text-base text-[#e5e1e4] placeholder:text-[#8c909f] focus:outline-none focus:border-[#adc6ff] focus:ring-2 focus:ring-[#adc6ff]/20 transition-all" 
                  id="email" 
                  placeholder="dev@codetogether.io" 
                  type="email" 
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1">
              <label className="text-xs uppercase tracking-widest font-semibold text-[#c2c6d6] opacity-70" htmlFor="password">Security Token</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#c2c6d6] group-focus-within:text-[#adc6ff] transition-colors text-[20px]">lock</span>
                <input 
                  className="w-full bg-[#0e0e10] border border-white/10 rounded-lg py-4 pl-[48px] pr-4 text-base text-[#e5e1e4] placeholder:text-[#8c909f] focus:outline-none focus:border-[#adc6ff] focus:ring-2 focus:ring-[#adc6ff]/20 transition-all" 
                  id="password" 
                  placeholder="••••••••••••" 
                  type="password" 
                  required
                />
              </div>
              <div className="mt-1 px-1 flex justify-between">
                <span className="font-mono text-xs text-[#8c909f]">Complexity: <span className="text-[#34d399]">High</span></span>
              </div>
            </div>

            {/* Sign Up Button */}
            <button className="mt-2 w-full bg-[#adc6ff] py-4 rounded-lg text-2xl text-[#002e6a] font-bold shadow-[0_0_20px_rgba(173,198,255,0.3)] hover:shadow-[0_0_30px_rgba(173,198,255,0.5)] active:scale-[0.98] transition-all duration-200" type="submit">
              <Link to={"/group-lobby"} className="form-control">
                Sign Up
              </Link>
            </button>
          </form>

          {/* Social/Alt Signups */}
          <div className="mt-6 pt-6 border-t border-white/5 flex flex-col gap-4">
            <button className="w-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors py-2 rounded-lg flex items-center justify-center gap-2 text-xs font-semibold text-[#e5e1e4] uppercase tracking-widest">
              <img alt="G" className="w-4 h-4 grayscale contrast-200 brightness-200" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4KjIB08yIPSUzpUvSeButn87s7q8W2rmuZ82Qn5VJH5QRfeVZ31v44l_O5FeuTcOKUpvqvKR93qgeThq0iT9RX1eaTjAR5vQZjG4pmRNyF1bg3vhrps1Dwas1V9I6eL57Q7xhpe1C4BeNbhvz6IGI1yZwkMJs-nq6_S0LqJLae1ALIFuU2-FPItM9x5w0FTJyPRcfEEHLHIVtcDj3l9soirfXL8rDhV-dCRRwEmxzo5-5C1W4j7UlETGZyKhPZlk8cVwYsxgIoHzE" />
              CONTINUE WITH GITHUB
            </button>
          </div>
        </section>

        {/* Footer Navigation */}
        <footer className="mt-6 text-center">
          <p className="text-sm text-[#c2c6d6]">
            Already part of the cluster? 
            <Link className="text-[#adc6ff] font-bold hover:underline underline-offset-4 ml-2" to="/login">
              Log in instead
            </Link>
          </p>
        </footer>

        {/* Decorative Code Snippet Card (Floating Background) */}
        <div className="absolute -right-48 top-1/4 hidden lg:block w-72 bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-xl opacity-40 rotate-6 pointer-events-none">
          <div className="flex gap-1 mb-2">
            <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
            <div className="w-2 h-2 rounded-full bg-yellow-500/50"></div>
            <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
          </div>
          <pre className="font-mono text-xs leading-relaxed">
            <span className="text-[#818cf8]">const</span> <span className="text-[#3b82f6]">session</span> = <span className="text-[#818cf8]">await</span>
            <br />
            CodeTogether.<span className="text-[#3b82f6]">init</span>({`{`}
            <br />
            &nbsp;&nbsp;id: <span className="text-[#34d399]">'alpha-10'</span>,
            <br />
            &nbsp;&nbsp;role: <span className="text-[#34d399]">'architect'</span>
            <br />
            {`}`});
          </pre>
        </div>

        <div className="absolute -left-48 bottom-1/4 hidden lg:block w-72 bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-xl opacity-30 -rotate-3 pointer-events-none">
          <div className="flex items-center gap-2 mb-2 border-b border-white/10 pb-2">
            <div className="w-6 h-6 rounded-full bg-[#adc6ff]/20"></div>
            <div className="h-2 w-24 bg-white/10 rounded"></div>
          </div>
          <div className="space-y-2">
            <div className="h-2 w-full bg-white/5 rounded"></div>
            <div className="h-2 w-4/5 bg-white/5 rounded"></div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Signup;
