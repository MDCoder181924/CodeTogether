import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
const GO_BASE64 = 'data:image/png;base64,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';

const Home = () => {
  const [activeSection, setActiveSection] = useState('platform');

  useEffect(() => {
    // Micro-interactions: cursor trail tracking
    const handleMouseMove = (e) => {
      const trails = document.querySelectorAll('.cursor-trail');
      trails.forEach((trail, index) => {
        const speed = 0.02 + (index * 0.01);
        const x = (window.innerWidth - e.pageX * speed) / 100;
        const y = (window.innerHeight - e.pageY * speed) / 100;
        trail.style.transform = `translate(${x}px, ${y}px)`;
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Scroll reveal observer
    const observerOptions = {
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-10');
        }
      });
    }, observerOptions);

    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
      section.classList.add('transition-all', 'duration-1000', 'opacity-0', 'translate-y-10');
      observer.observe(section);
    });

    // Active section scroll indicator observer
    const activeObserverOptions = {
      rootMargin: "-30% 0px -40% 0px", // Detect active section when it occupies the middle part of the screen
      threshold: 0.1
    };

    const activeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          if (id) {
            setActiveSection(id);
          }
        }
      });
    }, activeObserverOptions);

    const sectionsWithId = document.querySelectorAll('section[id]');
    sectionsWithId.forEach(section => {
      activeObserver.observe(section);
    });

    const handleScroll = () => {
      if (window.scrollY < 100) {
        setActiveSection('platform');
      }
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      sections.forEach(section => {
        observer.unobserve(section);
      });
      sectionsWithId.forEach(section => {
        activeObserver.unobserve(section);
      });
    };
  }, []);

  return (
    <div className="font-body-md bg-[#000000] text-[#e4e1ed] overflow-x-hidden selection:bg-primary/30 min-h-screen relative">
      <div className="noise-overlay"></div>

      {/* Navigation Shell */}
      <nav className="fixed top-0 w-full z-50 bg-[#13131b]/30 backdrop-blur-xl border-b border-white/10 shadow-[0_0_20px_rgba(73,75,214,0.15)]">
        <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop py-4 max-w-container-max mx-auto">
          <div className="flex items-center gap-4 lg:gap-8">
            <a className="flex items-center gap-2 sm:gap-3 group" href="#platform">
              <img
                alt="CodeTogether Logo"
                className="w-7 h-7 sm:w-8 sm:h-8 group-hover:rotate-12 transition-transform duration-300"
                src={GO_BASE64}
              />
              <span className="font-display-xl text-xl sm:text-headline-md font-bold tracking-tighter text-primary">CodeTogether</span>
            </a>

            <div className="hidden md:flex items-center gap-4 lg:gap-8">
              <a
                className={`font-body-md text-body-md nav-link transition-colors ${activeSection === 'platform' ? 'text-primary font-bold active' : 'text-on-surface-variant hover:text-on-surface'}`}
                href="#platform"
              >
                Platform
              </a>
              <a
                className={`font-body-md text-body-md nav-link transition-colors ${activeSection === 'features' ? 'text-primary font-bold active' : 'text-on-surface-variant hover:text-on-surface'}`}
                href="#features"
              >
                Features
              </a>
              <a
                className={`font-body-md text-body-md nav-link transition-colors ${activeSection === 'ai' ? 'text-primary font-bold active' : 'text-on-surface-variant hover:text-on-surface'}`}
                href="#ai"
              >
                AI
              </a>
              <a
                className={`font-body-md text-body-md nav-link transition-colors ${activeSection === 'pricing' ? 'text-primary font-bold active' : 'text-on-surface-variant hover:text-on-surface'}`}
                href="#pricing"
              >
                Pricing
              </a>
              <a
                className={`font-body-md text-body-md nav-link transition-colors ${activeSection === 'testimonials' ? 'text-primary font-bold active' : 'text-on-surface-variant hover:text-on-surface'}`}
                href="#testimonials"
              >
                Testimonials
              </a>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link to="/login" className="hidden sm:inline-block font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-all px-4 py-2 hover:bg-white/5 rounded-lg">
              Log In
            </Link>
            <Link to="/signup" className="bg-primary-container text-on-primary-container font-body-md text-xs sm:text-body-md font-bold px-3 sm:px-6 py-2 sm:py-2.5 rounded-lg hover:shadow-[0_0_20px_rgba(128,131,255,0.4)] transition-all scale-95 active:scale-90 whitespace-nowrap">
              Start Coding
            </Link>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section id="platform" className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-20 px-margin-mobile md:px-margin-desktop overflow-hidden grid-bg border-b border-white/[0.03]">
          <div className="light-leak bg-primary/30 -top-20 -left-20"></div>
          <div className="light-leak bg-secondary-container/30 bottom-0 -right-20"></div>

          <div className="z-10 text-center max-w-4xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 mb-6">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span className="font-label-mono text-caption text-primary uppercase tracking-widest">Version 2.0.4 Now Live</span>
            </div>

            <h1 className="font-display-xl text-4xl sm:text-6xl md:text-display-xl text-gradient mb-6 sm:mb-8 leading-tight">Code the Future, Together.</h1>

            <p className="font-body-lg text-base sm:text-body-lg text-on-surface-variant mb-8 sm:mb-10 max-w-2xl mx-auto">
              The ultra-low latency collaborative IDE designed for teams who ship at the speed of thought. Experience real-time sync with built-in AI pair programming.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4 sm:px-0">
              <Link to="/signup" className="w-full sm:w-auto px-6 sm:px-10 py-3 sm:py-4 bg-primary text-[#0d0096] text-center font-bold rounded-xl text-base sm:text-body-lg hover:shadow-[0_0_30px_rgba(192,193,255,0.5)] transition-all transform hover:-translate-y-1">
                Get Started Free
              </Link>
              <button className="w-full sm:w-auto px-6 sm:px-10 py-3 sm:py-4 glass-card text-on-surface font-bold rounded-xl text-base sm:text-body-lg flex items-center justify-center gap-2 group transition-all">
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">play_arrow</span>
                Watch Demo
              </button>
            </div>
          </div>

          {/* Floating Editor Preview */}
          <div className="relative w-full max-w-5xl mx-auto z-10 animate-float">
            <div className="glass-card rounded-2xl overflow-hidden shadow-2xl border border-white/10">
              <div className="h-8 bg-surface-container-high flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-error/40"></div>
                <div className="w-3 h-3 rounded-full bg-secondary-container/40"></div>
                <div className="w-3 h-3 rounded-full bg-tertiary/40"></div>
                <div className="ml-4 px-3 py-0.5 rounded-t-lg bg-surface-container text-caption font-label-mono text-primary/80">app.tsx</div>
              </div>
              <div className="p-6 font-label-mono text-body-md bg-surface-container-low flex gap-6 text-left">
                <div className="text-outline/40 select-none text-right">
                  01<br />02<br />03<br />04<br />05<br />06<br />07<br />08
                </div>
                <div className="flex-1">
                  <span className="text-primary-container">import</span> {`{ CodeTogether }`} <span className="text-primary-container">from</span> <span className="text-tertiary">'@ct-core'</span>;<br /><br />
                  <span className="text-primary-container">export const</span> <span className="text-secondary-fixed">Innovation</span> = () =&gt; {"{"}<br />
                  {"  "}<span className="text-primary-container">return</span> (<br />
                  {"    "}&lt;<span className="text-secondary">FutureCanvas</span><br />
                  {"      "}engine="codetogether"<br />
                  {"      "}mode="realtime" /&gt;<br />
                  {"  "});<br />
                  {"}"}
                </div>
              </div>
            </div>
            {/* Neon Blobs for depth */}
            <div className="absolute -z-10 -top-20 -right-20 w-64 h-64 bg-primary-container/20 blur-[100px]"></div>
            <div className="absolute -z-10 -bottom-20 -left-20 w-64 h-64 bg-tertiary/20 blur-[100px]"></div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="py-12 sm:py-16 px-margin-mobile md:px-margin-desktop border-y border-white/[0.03] bg-[#000000]">
          <p className="text-center font-label-mono text-caption text-outline mb-10 uppercase tracking-[0.3em]">Trusted by hyper-growth engineering teams</p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-40 grayscale hover:grayscale-0 transition-all">
            <div className="h-8 flex items-center font-display-xl text-headline-md font-bold text-on-surface">VOX.IO</div>
            <div className="h-8 flex items-center font-display-xl text-headline-md font-bold text-on-surface">ZEPHYR</div>
            <div className="h-8 flex items-center font-display-xl text-headline-md font-bold text-on-surface">PULSE</div>
            <div className="h-8 flex items-center font-display-xl text-headline-md font-bold text-on-surface">QUANTUM</div>
            <div className="h-8 flex items-center font-display-xl text-headline-md font-bold text-on-surface">SYNTH</div>
          </div>
        </section>

        {/* Live Collaboration Showcase */}
        <section id="features" className="py-16 sm:py-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center">
            <div className="text-left">
              <h2 className="font-display-xl text-3xl sm:text-headline-lg text-on-surface mb-6 leading-tight">Code at the speed of thought.</h2>
              <p className="text-base sm:text-body-lg text-on-surface-variant mb-8 leading-relaxed">
                Our proprietary operational transformation engine ensures that 100+ developers can edit the same file simultaneously without a single merge conflict.
              </p>

              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-lg">sync</span>
                  <div>
                    <h4 className="font-bold text-on-surface text-lg">15ms Latency</h4>
                    <p className="text-caption text-on-surface-variant mt-1">Global edge network for zero-delay collaboration.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-tertiary bg-tertiary/10 p-2 rounded-lg">chat_bubble</span>
                  <div>
                    <h4 className="font-bold text-on-surface text-lg">Threaded Discussion</h4>
                    <p className="text-caption text-on-surface-variant mt-1">In-line comments that evolve into persistent discussions.</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="relative">
              <div className="glass-card rounded-2xl relative p-4 sm:p-8 flex flex-col sm:flex-row gap-4 min-h-[350px] sm:min-h-0">
                <div className="flex-1 bg-surface-container-high rounded-lg p-4 font-label-mono text-xs sm:text-sm relative text-left min-h-[160px]">
                  <div className="absolute top-1/4 left-1/3 flex flex-col items-start cursor-trail" style={{ transform: 'translate(20px, 10px)' }}>
                    <span className="material-symbols-outlined text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>near_me</span>
                    <span className="bg-primary-container text-on-primary-container px-2 py-0.5 rounded text-[10px] font-bold">Alex.js</span>
                  </div>

                  <div className="absolute top-2/3 right-1/4 flex flex-col items-start cursor-trail" style={{ transform: 'translate(-40px, -20px)' }}>
                    <span className="material-symbols-outlined text-secondary-container" style={{ fontVariationSettings: "'FILL' 1" }}>near_me</span>
                    <span className="bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded text-[10px] font-bold">Sarah_Dev</span>
                  </div>

                  <div className="space-y-3 opacity-80 mt-4">
                    <div className="w-3/4 h-3 bg-primary/20 rounded"></div>
                    <div className="w-1/2 h-3 bg-primary/20 rounded"></div>
                    <div className="w-full h-3 bg-primary/20 rounded"></div>
                    <div className="w-2/3 h-3 bg-primary/20 rounded"></div>
                  </div>
                </div>

                <div className="w-full sm:w-1/3 bg-surface-container rounded-lg p-3 flex flex-col gap-3 text-left">
                  <div className="text-caption font-bold text-outline uppercase tracking-wider">Project Chat</div>

                  <div className="space-y-3">
                    <div className="p-2 bg-white/5 rounded">
                      <div className="font-bold text-[10px] text-primary">Alex</div>
                      <div className="text-[11px] mt-0.5">Just updated the auth hook!</div>
                    </div>

                    <div className="p-2 bg-white/5 rounded">
                      <div className="font-bold text-[10px] text-secondary">Sarah</div>
                      <div className="text-[11px] mt-0.5">Looks clean, checking tests...</div>
                    </div>
                  </div>

                  <div className="mt-auto pt-2 border-t border-white/10 flex items-center gap-2">
                    <div className="flex-1 h-6 bg-white/5 rounded px-2 text-[10px] flex items-center text-outline/60">Type something...</div>
                    <span className="material-symbols-outlined text-sm text-outline cursor-pointer">send</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Bento Grid */}
        <section id="ai" className="py-16 sm:py-24 px-margin-mobile md:px-margin-desktop bg-[#050505] grid-bg border-y border-white/[0.03]">
          <div className="max-w-container-max mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="font-display-xl text-3xl sm:text-headline-lg text-on-surface mb-4 leading-tight">Built for power users.</h2>
              <p className="text-base sm:text-body-lg text-on-surface-variant max-w-2xl mx-auto">Everything you need to ship world-class software in a single window.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter text-left">
              {/* AI Assistant Card */}
              <div className="md:col-span-8 glass-card rounded-2xl p-6 sm:p-8 group hover:border-primary/50 transition-all h-[360px] sm:h-[400px] flex flex-col justify-end">
                <div className="absolute top-8 right-8 w-48 h-48 bg-primary/10 rounded-full blur-[40px] group-hover:bg-primary/20 transition-all"></div>
                <span className="material-symbols-outlined text-3xl sm:text-4xl text-primary mb-6">auto_awesome</span>
                <h3 className="font-display-xl text-2xl sm:text-headline-md text-on-surface mb-4">AI Code Assistant</h3>
                <p className="text-sm sm:text-body-md text-on-surface-variant max-w-md">The next-gen copilot that understands your entire repository, not just the open file. Debug, refactor, and generate with ease.</p>
              </div>

              {/* Compiler Card */}
              <div className="md:col-span-4 glass-card rounded-2xl p-6 sm:p-8 group hover:border-tertiary/50 transition-all h-[360px] sm:h-[400px] flex flex-col justify-between">
                <div>
                  <span className="material-symbols-outlined text-3xl sm:text-4xl text-tertiary mb-6">terminal</span>
                  <h3 className="font-display-xl text-2xl sm:text-headline-md text-on-surface mb-4">Polyglot Compiler</h3>
                  <p className="text-sm sm:text-body-md text-on-surface-variant">Execute 25+ languages in our containerized environment with instant hot-reloading.</p>
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  <span className="px-3 py-1 font-label-mono text-caption bg-orange-500/10 text-orange-400 border border-orange-500/30 rounded-full">Python</span>
                  <span className="px-3 py-1 font-label-mono text-caption bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded-full">TypeScript</span>
                  <span className="px-3 py-1 font-label-mono text-caption bg-red-500/10 text-red-400 border border-red-500/30 rounded-full">Rust</span>
                </div>
              </div>

              {/* Video Calling */}
              <div className="md:col-span-4 glass-card rounded-2xl p-6 sm:p-8 group hover:border-secondary-container/50 transition-all">
                <span className="material-symbols-outlined text-3xl sm:text-4xl text-secondary-container mb-6">video_call</span>
                <h3 className="font-display-xl text-2xl sm:text-headline-md text-on-surface mb-4">4K Video Calls</h3>
                <p className="text-sm sm:text-body-md text-on-surface-variant">Crystal clear communication integrated directly into your workspace.</p>
              </div>

              {/* Screen Sharing */}
              <div className="md:col-span-8 glass-card rounded-2xl p-6 sm:p-8 group hover:border-primary-container/50 transition-all flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1">
                  <span className="material-symbols-outlined text-3xl sm:text-4xl text-primary-container mb-6">screen_share</span>
                  <h3 className="font-display-xl text-2xl sm:text-headline-md text-on-surface mb-4">Ultra-Low Latency Sharing</h3>
                  <p className="text-sm sm:text-body-md text-on-surface-variant">Share your browser, terminal, or full desktop with pixel-perfect precision and interactive control.</p>
                </div>
                <div className="w-full md:w-1/3 aspect-video bg-white/5 rounded-xl border border-white/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-4xl opacity-20">cast</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 sm:py-24 px-margin-mobile md:px-margin-desktop relative">
          <div className="max-w-container-max mx-auto text-center mb-12 sm:mb-20">
            <h2 className="font-display-xl text-3xl sm:text-headline-lg text-on-surface">Ship in seconds.</h2>
          </div>

          <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-gutter relative">
            {/* Connectors for desktop */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent -translate-y-1/2"></div>

            <div className="relative z-10 glass-card p-6 rounded-2xl text-center group hover:-translate-y-2 transition-transform">
              <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center mx-auto mb-6 font-bold">1</div>
              <h4 className="font-bold text-on-surface mb-2">Create Room</h4>
              <p className="text-caption text-on-surface-variant">Spin up a secure dev environment instantly.</p>
            </div>

            <div className="relative z-10 glass-card p-6 rounded-2xl text-center group hover:-translate-y-2 transition-transform">
              <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center mx-auto mb-6 font-bold">2</div>
              <h4 className="font-bold text-on-surface mb-2">Share Link</h4>
              <p className="text-caption text-on-surface-variant">Invite teammates with a simple secure URL.</p>
            </div>

            <div className="relative z-10 glass-card p-6 rounded-2xl text-center group hover:-translate-y-2 transition-transform">
              <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center mx-auto mb-6 font-bold">3</div>
              <h4 className="font-bold text-on-surface mb-2">Collaborate</h4>
              <p className="text-caption text-on-surface-variant">Code, chat, and debug in perfect sync.</p>
            </div>

            <div className="relative z-10 glass-card p-6 rounded-2xl text-center group hover:-translate-y-2 transition-transform">
              <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center mx-auto mb-6 font-bold">4</div>
              <h4 className="font-bold text-on-surface mb-2">Deploy</h4>
              <p className="text-caption text-on-surface-variant">Push to production with built-in CI/CD.</p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 sm:py-20 px-margin-mobile md:px-margin-desktop bg-primary/[0.02] grid-bg border-y border-white/[0.03]">
          <div className="max-w-container-max mx-auto grid grid-cols-1 sm:grid-cols-2 gap-12 text-center">
            <div>
              <div className="font-display-xl text-5xl sm:text-6xl md:text-display-xl text-primary mb-2">100K+</div>
              <p className="font-label-mono text-sm sm:text-body-md text-on-surface-variant uppercase tracking-widest">Developers Active</p>
            </div>
            <div>
              <div className="font-display-xl text-5xl sm:text-6xl md:text-display-xl text-tertiary mb-2">1M+</div>
              <p className="font-label-mono text-sm sm:text-body-md text-on-surface-variant uppercase tracking-widest">Sessions Created</p>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-16 sm:py-24 px-margin-mobile md:px-margin-desktop grid-bg relative border-b border-white/[0.03]">
          <div className="light-leak bg-secondary-container/20 -top-20 right-0"></div>
          <div className="max-w-container-max mx-auto relative z-10">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="font-display-xl text-3xl sm:text-headline-lg text-on-surface mb-4 leading-tight">Simple, transparent pricing.</h2>
              <p className="text-base sm:text-body-lg text-on-surface-variant">Scale from a weekend project to an enterprise giant.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-gutter text-left items-stretch">
              {/* Free */}
              <div className="glass-card p-6 sm:p-10 rounded-3xl border-white/5 flex flex-col">
                <h3 className="font-display-xl text-2xl sm:text-headline-md text-on-surface mb-2">Free</h3>
                <div className="text-4xl sm:text-display-xl font-bold text-on-surface mb-6">$0<span className="text-body-md text-outline font-normal">/mo</span></div>
                <p className="text-sm sm:text-body-md text-on-surface-variant mb-8 flex-1">Perfect for individuals and hobbyists starting their journey.</p>
                <ul className="space-y-4 mb-10">
                  <li className="flex items-center gap-3 text-sm"><span className="material-symbols-outlined text-primary text-lg">check_circle</span> Unlimited Public Rooms</li>
                  <li className="flex items-center gap-3 text-sm"><span className="material-symbols-outlined text-primary text-lg">check_circle</span> 2 Collaborative Seats</li>
                  <li className="flex items-center gap-3 text-sm opacity-50"><span className="material-symbols-outlined text-lg">cancel</span> AI Assistant</li>
                </ul>
                <Link to="/signup" className="w-full py-4 glass-card rounded-xl font-bold text-center hover:bg-white/5 transition-all">Get Started</Link>
              </div>

              {/* Pro */}
              <div className="glass-card p-6 sm:p-10 rounded-3xl border-primary/50 bg-primary/5 relative transform md:scale-105 shadow-2xl flex flex-col my-4 md:my-0">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-on-primary px-4 py-1 rounded-full text-caption font-bold uppercase tracking-wider">Most Popular</div>
                <h3 className="font-display-xl text-2xl sm:text-headline-md text-on-surface mb-2">Pro</h3>
                <div className="text-4xl sm:text-display-xl font-bold text-on-surface mb-6">$19<span className="text-body-md text-outline font-normal">/mo</span></div>
                <p className="text-sm sm:text-body-md text-on-surface-variant mb-8 flex-1">Advanced features for professional developers and startups.</p>
                <ul className="space-y-4 mb-10">
                  <li className="flex items-center gap-3 text-sm"><span className="material-symbols-outlined text-primary text-lg">check_circle</span> Unlimited Private Rooms</li>
                  <li className="flex items-center gap-3 text-sm"><span className="material-symbols-outlined text-primary text-lg">check_circle</span> 10 Collaborative Seats</li>
                  <li className="flex items-center gap-3 text-sm"><span className="material-symbols-outlined text-primary text-lg">check_circle</span> Full AI Assistant Access</li>
                  <li className="flex items-center gap-3 text-sm"><span className="material-symbols-outlined text-primary text-lg">check_circle</span> 4K Video Integration</li>
                </ul>
                <Link to="/signup" className="w-full py-4 bg-primary text-[#0d0096] text-center rounded-xl font-bold hover:shadow-[0_0_20px_rgba(192,193,255,0.4)] transition-all">Go Pro</Link>
              </div>

              {/* Team */}
              <div className="glass-card p-6 sm:p-10 rounded-3xl border-white/5 flex flex-col">
                <h3 className="font-display-xl text-2xl sm:text-headline-md text-on-surface mb-2">Team</h3>
                <div className="text-4xl sm:text-display-xl font-bold text-on-surface mb-6">$49<span className="text-body-md text-outline font-normal">/mo</span></div>
                <p className="text-sm sm:text-body-md text-on-surface-variant mb-8 flex-1">Complete control for scaling engineering organizations.</p>
                <ul className="space-y-4 mb-10">
                  <li className="flex items-center gap-3 text-sm"><span className="material-symbols-outlined text-primary text-lg">check_circle</span> Unlimited Everything</li>
                  <li className="flex items-center gap-3 text-sm"><span className="material-symbols-outlined text-primary text-lg">check_circle</span> Advanced SSO &amp; Security</li>
                  <li className="flex items-center gap-3 text-sm"><span className="material-symbols-outlined text-primary text-lg">check_circle</span> Dedicated Success Manager</li>
                </ul>
                <button className="w-full py-4 glass-card rounded-xl font-bold hover:bg-white/5 transition-all">Contact Sales</button>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-16 sm:py-24 px-margin-mobile md:px-margin-desktop bg-[#000000] overflow-hidden relative border-y border-white/[0.03]">
          <div className="light-leak bg-tertiary/10 top-0 left-1/4"></div>
          <div className="max-w-container-max mx-auto text-left relative z-10">
            <div className="flex flex-col md:flex-row items-end justify-between mb-12 sm:mb-16 gap-8">
              <h2 className="font-display-xl text-3xl sm:text-headline-lg text-on-surface max-w-xl leading-tight">What builders are saying.</h2>
              <div className="flex gap-4">
                <button className="p-3 sm:p-4 rounded-full glass-card hover:bg-white/10 transition-all"><span className="material-symbols-outlined">arrow_back</span></button>
                <button className="p-3 sm:p-4 rounded-full glass-card hover:bg-white/10 transition-all"><span className="material-symbols-outlined">arrow_forward</span></button>
              </div>
            </div>

            <div className="flex gap-gutter overflow-x-auto pb-10 scrollbar-hide">
              <div className="min-w-[290px] sm:min-w-[400px] glass-card p-6 sm:p-8 rounded-2xl">
                <p className="text-base sm:text-body-lg text-on-surface mb-8">"CodeTogether has completely transformed how our remote team handles emergency bug fixes. It feels like we're in the same room."</p>
                <div className="flex items-center gap-4">
                  <img
                    alt="Marcus Chen Avatar"
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-primary/30"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuC0C2ALrhcWHmQLg1HJ1fNNpQQPBLcveBlZbmqXY5ezg0Ja8oamwfV5op2ovljbroEHkm21BdqKHnbepad2vpYHBHGkR_osukmMc4c4wyFW8-Q0T8Nu9mVdlxG9rbUdBL0Vz7DvUFbsdkyxLYxw-2gr7tlrZ-IufOBMCZzTgySb0asgWWyQzUAFdnvAhUNoZoGlGKUt2PMaMRhvBUGEzrgzKa6Jxo_tRLEBB5HwUiWfvjhInxHzHjnLygM032BEeipmOR1wHUKy3IE"
                  />
                  <div>
                    <div className="font-bold text-on-surface text-sm sm:text-base">Marcus Chen</div>
                    <div className="text-caption text-outline">Lead Engineer @ Vox.io</div>
                  </div>
                </div>
              </div>

              <div className="min-w-[290px] sm:min-w-[400px] glass-card p-6 sm:p-8 rounded-2xl">
                <p className="text-base sm:text-body-lg text-on-surface mb-8">"The AI pair programmer is scary good. It caught a potential memory leak before we even finished writing the function. Worth every penny."</p>
                <div className="flex items-center gap-4">
                  <img
                    alt="Elena Rodriguez Avatar"
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-primary/30"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBebxf9fXVqnioe-oBHuXCUMezYNljjTlBhWxiXqDJlKIcdGFZY9ImXpgqeFdCOhHZrJMrHjvDinNtZ_mmkCQgmHcKWii2S2wV8d8FVI3PpU38yUkBnyYZ0m8jUUSsRie6jnGWMdXCgQS7yW23oYTwC1veO3dS_oMYwWlv1uAuwQFFh7Qpxq9gg-za9oEOZpQPwT3G6MCBQY2GO3SVb6FzdLFQo0oIaLXr8FlZNChxlxOBhTKUfFwSOSzIr1dogShpTcHEnzAViu1Q"
                  />
                  <div>
                    <div className="font-bold text-on-surface text-sm sm:text-base">Elena Rodriguez</div>
                    <div className="text-caption text-outline">CTO @ Pulse Devs</div>
                  </div>
                </div>
              </div>

              <div className="min-w-[290px] sm:min-w-[400px] glass-card p-6 sm:p-8 rounded-2xl">
                <p className="text-base sm:text-body-lg text-on-surface mb-8">"Switched from VS Code Live Share and never looked back. The latency is practically non-existent even across continents."</p>
                <div className="flex items-center gap-4">
                  <img
                    alt="Jordan Smith Avatar"
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-primary/30"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuArZUS-Xlr-zmQe45n1fJU4lZJkrldarLg5VxcqTfHH0l_v7UdoeiYdzb2ykfZdAuQQmmgZnoNE176wMGVpYUiGgnzE_pAGfH_n3vbzCu5KtwUkkLtF-nt_IA5rWGs_YJ-2uMvFkO79hXeSTKWIIxtJXxarVyWik2peTZuOgHaGpxm9pBtqfxQXXxhTyTfAk692oF4SLvc_0deT3EAAPuu94WyYwj1obA53q4PpTh5pn8gtCbBDU-NIXljvvEkfYrkvyruW-p_mljw"
                  />
                  <div>
                    <div className="font-bold text-on-surface text-sm sm:text-base">Jordan Smith</div>
                    <div className="text-caption text-outline">Senior Frontend Dev @ Zephyr</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-16 sm:py-24 px-margin-mobile md:px-margin-desktop">
          <div className="max-w-container-max mx-auto">
            <div className="relative glass-card rounded-[24px] sm:rounded-[40px] p-8 sm:p-16 overflow-hidden border-primary/20 text-center grid-bg">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/10 via-transparent to-tertiary/10"></div>
              <div className="relative z-10">
                <h2 className="font-display-xl text-3xl sm:text-headline-lg text-on-surface mb-6 leading-tight">Ready to build the future?</h2>
                <p className="text-base sm:text-body-lg text-on-surface-variant mb-8 sm:mb-10 max-w-2xl mx-auto">Join the 100,000+ developers who are already coding together. No setup, no credit card required.</p>
                <Link to="/signup" className="inline-block px-6 sm:px-12 py-3.5 sm:py-5 bg-primary text-[#0d0096] font-bold rounded-2xl text-base sm:text-headline-md neon-glow-primary hover:scale-105 transition-all">Start Building Together Today</Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-background border-t border-outline-variant/30 w-full py-12 sm:py-16 px-margin-mobile md:px-margin-desktop text-left">
        <div className="max-w-container-max mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter mb-12 sm:mb-16">
            <div>
              <h4 className="font-display-xl text-xl sm:text-headline-md font-bold text-primary mb-6">CodeTogether</h4>
              <p className="text-sm sm:text-body-md text-on-surface-variant max-w-[200px]">Empowering the next generation of engineers through seamless collaboration.</p>
            </div>
            <div className="flex flex-col gap-4">
              <span className="font-bold text-on-surface uppercase tracking-widest text-caption">Product</span>
              <a className="text-sm sm:text-body-md text-on-surface-variant hover:text-tertiary transition-colors duration-200 opacity-80 hover:opacity-100" href="#">Documentation</a>
              <a className="text-sm sm:text-body-md text-on-surface-variant hover:text-tertiary transition-colors duration-200 opacity-80 hover:opacity-100" href="#">API Reference</a>
              <a className="text-sm sm:text-body-md text-on-surface-variant hover:text-tertiary transition-colors duration-200 opacity-80 hover:opacity-100" href="#">Status</a>
            </div>
            <div className="flex flex-col gap-4">
              <span className="font-bold text-on-surface uppercase tracking-widest text-caption">Company</span>
              <a className="text-sm sm:text-body-md text-on-surface-variant hover:text-tertiary transition-colors duration-200 opacity-80 hover:opacity-100" href="#">Privacy Policy</a>
              <a className="text-sm sm:text-body-md text-on-surface-variant hover:text-tertiary transition-colors duration-200 opacity-80 hover:opacity-100" href="#">Terms of Service</a>
              <a className="text-sm sm:text-body-md text-on-surface-variant hover:text-tertiary transition-colors duration-200 opacity-80 hover:opacity-100" href="#">Security</a>
            </div>
            <div className="flex flex-col gap-4">
              <span className="font-bold text-on-surface uppercase tracking-widest text-caption">Connect</span>
              <a className="text-sm sm:text-body-md text-on-surface-variant hover:text-tertiary transition-colors duration-200 opacity-80 hover:opacity-100" href="#">GitHub</a>
              <a className="text-sm sm:text-body-md text-on-surface-variant hover:text-tertiary transition-colors duration-200 opacity-80 hover:opacity-100" href="#">Discord</a>
              <a className="text-sm sm:text-body-md text-on-surface-variant hover:text-tertiary transition-colors duration-200 opacity-80 hover:opacity-100" href="#">Twitter</a>
            </div>
          </div>
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm sm:text-body-md text-tertiary font-body-md">© 2024 CodeTogether Inc. Built for the next generation of engineers.</p>
            <div className="flex gap-6">
              <span className="material-symbols-outlined text-outline hover:text-primary cursor-pointer transition-colors">public</span>
              <span className="material-symbols-outlined text-outline hover:text-primary cursor-pointer transition-colors">hub</span>
              <span className="material-symbols-outlined text-outline hover:text-primary cursor-pointer transition-colors">rocket_launch</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
