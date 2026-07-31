import React, { useRef, useState, useEffect } from 'react';

/**
 * File icon color by extension
 */
const getTabColor = (fileName) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    const colorMap = {
        'js': '#f7df1e',
        'jsx': '#61dafb',
        'ts': '#3178c6',
        'tsx': '#3178c6',
        'py': '#3776ab',
        'java': '#ed8b00',
        'cpp': '#00599c',
        'c': '#a8b9cc',
        'html': '#e34f26',
        'css': '#1572b6',
        'json': '#fbc02d',
        'md': '#ffffff',
    };
    return colorMap[ext] || '#adc6ff';
};

const FileTabs = ({
    openTabs = [],
    activeFileName,
    onTabSelect,
    onTabClose,
    modifiedFiles = new Set(),
}) => {
    const scrollRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const checkScroll = () => {
        const el = scrollRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 0);
        setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    };

    useEffect(() => {
        checkScroll();
        const el = scrollRef.current;
        if (el) {
            el.addEventListener('scroll', checkScroll);
            const ro = new ResizeObserver(checkScroll);
            ro.observe(el);
            return () => {
                el.removeEventListener('scroll', checkScroll);
                ro.disconnect();
            };
        }
    }, [openTabs]);

    // Auto-scroll to active tab
    useEffect(() => {
        if (!scrollRef.current || !activeFileName) return;
        const activeTab = scrollRef.current.querySelector(`[data-tab="${activeFileName}"]`);
        if (activeTab) {
            activeTab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
        }
    }, [activeFileName]);

    const scroll = (dir) => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: dir * 150, behavior: 'smooth' });
        }
    };

    if (openTabs.length === 0) return null;

    return (
        <div className="flex items-center bg-[#0a0a0c] border-b border-white/10 shrink-0 relative">
            {/* Left scroll arrow */}
            {canScrollLeft && (
                <button
                    onClick={() => scroll(-1)}
                    className="absolute left-0 z-10 h-full px-1 bg-gradient-to-r from-[#0a0a0c] via-[#0a0a0c]/90 to-transparent text-[#c2c6d6]/60 hover:text-white transition-colors cursor-pointer"
                >
                    <span className="material-symbols-outlined text-[14px]">chevron_left</span>
                </button>
            )}

            {/* Tabs Container */}
            <div
                ref={scrollRef}
                className="flex items-end overflow-x-auto no-scrollbar flex-1 min-w-0"
            >
                {openTabs.map((tab) => {
                    const isActive = tab.fileName === activeFileName;
                    const isModified = modifiedFiles.has(tab.fileName);
                    const tabColor = getTabColor(tab.fileName);

                    return (
                        <div
                            key={tab._id || tab.fileName}
                            data-tab={tab.fileName}
                            onClick={() => onTabSelect?.(tab)}
                            className={`group flex items-center gap-1.5 px-3 py-2 cursor-pointer transition-all duration-150 border-r border-white/5 min-w-0 max-w-[180px] shrink-0 ${
                                isActive
                                    ? 'bg-[#0e0e10] text-[#e5e1e4] border-t-2'
                                    : 'bg-[#08080a] text-[#c2c6d6]/50 hover:text-[#c2c6d6]/80 hover:bg-[#0c0c0e] border-t-2 border-t-transparent'
                            }`}
                            style={{
                                borderTopColor: isActive ? tabColor : 'transparent',
                            }}
                        >
                            {/* Modified indicator dot */}
                            {isModified && (
                                <span className="w-1.5 h-1.5 rounded-full bg-[#adc6ff] shrink-0 animate-pulse" />
                            )}

                            <span className={`text-[11px] truncate min-w-0 ${
                                isActive ? 'font-semibold' : 'font-normal'
                            }`}>
                                {tab.fileName}
                            </span>

                            {/* Close button */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onTabClose?.(tab);
                                }}
                                className={`p-0.5 rounded shrink-0 transition-all cursor-pointer ${
                                    isActive
                                        ? 'text-[#c2c6d6]/40 hover:text-white hover:bg-white/10'
                                        : 'opacity-0 group-hover:opacity-100 text-[#c2c6d6]/30 hover:text-white hover:bg-white/10'
                                }`}
                                title={`Close ${tab.fileName}`}
                            >
                                <span className="material-symbols-outlined text-[13px]">close</span>
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Right scroll arrow */}
            {canScrollRight && (
                <button
                    onClick={() => scroll(1)}
                    className="absolute right-0 z-10 h-full px-1 bg-gradient-to-l from-[#0a0a0c] via-[#0a0a0c]/90 to-transparent text-[#c2c6d6]/60 hover:text-white transition-colors cursor-pointer"
                >
                    <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                </button>
            )}
        </div>
    );
};

export default FileTabs;
