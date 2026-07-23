import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const GroupLobbyBox = () => {
  const navigate = useNavigate();

  const [groupCode, setGroupCode] = useState("");
  const [groupName, setGroupName] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [myGroups, setMyGroups] = useState(() => {
    try {
      const cached = localStorage.getItem('user_groups');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const fetchUserGroups = async () => {
      setLoadingGroups(true);
      try {
        const response = await api.get('/group/my-groups');
        if (response.data.success && Array.isArray(response.data.groups)) {
          setMyGroups(response.data.groups);
          localStorage.setItem('user_groups', JSON.stringify(response.data.groups));
        }
      } catch (err) {
        console.warn("Could not fetch user groups from backend:", err?.response?.data?.message || err.message);
      } finally {
        setLoadingGroups(false);
      }
    };

    fetchUserGroups();
  }, []);

  const handleJoinGroup = async (codeToJoin) => {
    const targetCode = (codeToJoin || groupCode).trim().toUpperCase();
    if (!targetCode) {
      setErrorMsg("Please enter a valid group code");
      return;
    }

    setErrorMsg("");
    try {
      const response = await api.post('/group/join', { groupCode: targetCode });
      if (response.data.success && response.data.group) {
        const code = response.data.group.groupCode;
        navigate(`/room/${code}`);
      } else {
        navigate(`/room/${targetCode}`);
      }
    } catch (err) {
      console.warn("Join API notice:", err?.response?.data?.message || err.message);
      navigate(`/room/${targetCode}`);
    }
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      setErrorMsg("Please enter a group name");
      return;
    }

    setErrorMsg("");
    try {
      const response = await api.post('/group/create', { groupName: groupName.trim() });
      if (response.data.success && response.data.group) {
        const code = response.data.group.groupCode;
        setShowCreateModal(false);
        setGroupName('');
        navigate(`/room/${code}`);
      }
    } catch (error) {
      console.error("Create group failed:", error);
      setErrorMsg(error?.response?.data?.message || "Failed to create group");
    }
  };

  const handleDeleteGroup = async (group) => {
    if (!group || !group.groupCode) return;
    setDeleting(true);
    try {
      const response = await api.delete(`/group/delete/${group.groupCode}`);
      if (response.data.success) {
        const updated = myGroups.filter(g => g.groupCode !== group.groupCode);
        setMyGroups(updated);
        localStorage.setItem('user_groups', JSON.stringify(updated));
        setGroupToDelete(null);
      }
    } catch (err) {
      console.error("Delete group error:", err);
      alert(err?.response?.data?.message || "Failed to delete group");
    } finally {
      setDeleting(false);
    }
  };

  const filteredGroups = myGroups.filter(g =>
    (g.groupName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (g.groupCode || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-[#0e0e10] min-h-screen text-[#e5e1e4] font-sans flex items-center justify-center p-4 sm:p-6 lg:p-10 relative overflow-hidden">
      {/* Background Radial Lights */}
      <div className="absolute w-[700px] h-[700px] bg-[radial-gradient(circle,rgba(59,130,246,0.12)_0%,rgba(59,130,246,0)_70%)] rounded-full blur-[80px] -z-10 top-[-10%] left-[-10%]" />
      <div className="absolute w-[700px] h-[700px] bg-[radial-gradient(circle,rgba(173,198,255,0.1)_0%,rgba(173,198,255,0)_70%)] rounded-full blur-[80px] -z-10 bottom-[-10%] right-[-10%]" />

      {/* Main Responsive Layout */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start z-10">
        
        {/* LEFT / CENTER PANEL */}
        <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
          {/* Header Branding */}
          <header className="flex flex-col items-start mb-2">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 bg-white/5 rounded-xl border border-white/10 backdrop-blur-md shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                <span className="material-symbols-outlined text-[#adc6ff] text-[32px]">terminal</span>
              </div>
              <div>
                <h1 className="font-sans text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-white via-[#adc6ff] to-[#3b82f6] bg-clip-text text-transparent">
                  CodeTogether
                </h1>
                <p className="text-xs sm:text-sm text-[#c2c6d6]/70">Real-Time Collaborative Pair Programming</p>
              </div>
            </div>
          </header>

          {/* Join / Create Form Card */}
          <section className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 sm:p-8 rounded-2xl shadow-2xl space-y-6">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest font-bold text-[#c2c6d6] flex items-center gap-1.5 ml-0.5">
                <span className="material-symbols-outlined text-[16px] text-[#3b82f6]">vpn_key</span>
                ENTER ROOM CODE TO JOIN
              </label>
              <div className="relative flex items-center">
                <input
                  value={groupCode}
                  onChange={(e) => {
                    setGroupCode(e.target.value);
                    setErrorMsg("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleJoinGroup();
                  }}
                  className="w-full bg-[#050506] border border-white/10 rounded-xl py-3.5 px-4 text-[#e5e1e4] font-mono text-sm uppercase tracking-wider focus:outline-none focus:border-[#adc6ff] focus:ring-2 focus:ring-[#adc6ff]/20 transition-all placeholder:normal-case placeholder:tracking-normal placeholder:opacity-30"
                  placeholder="e.g. ROOM123"
                  type="text"
                />
              </div>
              {errorMsg && (
                <p className="text-xs text-rose-400 font-semibold px-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">error</span>
                  {errorMsg}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleJoinGroup()}
                className="bg-[#3b82f6] hover:bg-[#2563eb] text-white text-xs uppercase tracking-widest font-bold py-3.5 px-4 rounded-xl shadow-[0_0_15px_rgba(59,130,246,0.3)] active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[20px]">login</span>
                JOIN ROOM
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreateModal(true);
                  setErrorMsg("");
                }}
                className="bg-white/5 border border-white/15 hover:bg-white/10 text-[#e5e1e4] text-xs uppercase tracking-widest font-bold py-3.5 px-4 rounded-xl active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[20px] text-[#adc6ff]">add_box</span>
                CREATE NEW ROOM
              </button>
            </div>

            {/* Footer Stats */}
            <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-[#c2c6d6]/60 font-medium">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Engine Active</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-mono">
                <span className="material-symbols-outlined text-[14px] text-[#adc6ff]">lock</span>
                <span>End-to-End Realtime Sync</span>
              </div>
            </div>
          </section>
        </div>

        {/* RIGHT PANEL: User's Joined & Created Groups */}
        <div className="lg:col-span-5 w-full bg-white/5 backdrop-blur-xl border border-white/10 p-5 sm:p-6 rounded-2xl shadow-2xl flex flex-col h-[520px]">
          {/* Header & Filter */}
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#adc6ff] text-[20px]">groups</span>
              <h2 className="text-xs font-bold uppercase tracking-widest text-[#e5e1e4]">
                YOUR ROOMS & GROUPS
              </h2>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-[#3b82f6]/20 text-[#adc6ff] border border-[#3b82f6]/30 text-[10px] font-bold">
              {myGroups.length} TOTAL
            </span>
          </div>

          {/* Search Input Filter */}
          {myGroups.length > 0 && (
            <div className="relative mb-3 shrink-0">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#c2c6d6]/40 text-[16px]">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search your rooms..."
                className="w-full bg-[#050506] border border-white/10 rounded-lg py-2 pl-9 pr-3 text-xs text-[#e5e1e4] placeholder-[#c2c6d6]/30 outline-none focus:border-[#adc6ff]/50"
              />
            </div>
          )}

          {/* Scrollable Groups List */}
          <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 min-h-0 custom-scrollbar">
            {loadingGroups && myGroups.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-xs text-[#c2c6d6]/50 space-y-2">
                <span className="material-symbols-outlined text-2xl animate-spin text-[#3b82f6]">sync</span>
                <span>Loading your rooms...</span>
              </div>
            ) : filteredGroups.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-6 border border-dashed border-white/10 rounded-xl">
                <span className="material-symbols-outlined text-3xl text-[#c2c6d6]/30 mb-2">meeting_room</span>
                <p className="text-xs text-[#c2c6d6]/60 font-semibold">No Rooms Found</p>
                <p className="text-[11px] text-[#c2c6d6]/40 mt-1">
                  {searchQuery ? "No matching room names" : "Create or join a room above to see it here!"}
                </p>
              </div>
            ) : (
              filteredGroups.map((group) => {
                const isOwner = group.owner === currentUser?._id || group.owner === currentUser?.id;
                
                return (
                  <div
                    key={group._id || group.groupCode}
                    onClick={() => handleJoinGroup(group.groupCode)}
                    className="p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#3b82f6]/50 transition-all cursor-pointer group flex items-center justify-between gap-3 shadow-sm hover:shadow-[0_0_15px_rgba(59,130,246,0.15)]"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-9 h-9 rounded-lg bg-[#0e0e10] border border-white/10 flex items-center justify-center text-[#adc6ff] group-hover:text-white shrink-0 transition-colors">
                        <span className="material-symbols-outlined text-[20px]">code</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-xs font-bold text-[#e5e1e4] group-hover:text-[#adc6ff] truncate transition-colors">
                            {group.groupName || "Unnamed Room"}
                          </h3>
                          {isOwner ? (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#3b82f6]/20 text-[#3b82f6] border border-[#3b82f6]/30 uppercase shrink-0">
                              OWNER
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase shrink-0">
                              MEMBER
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] font-mono text-[#c2c6d6]/60 tracking-wider truncate mt-0.5">
                          CODE: <span className="text-[#adc6ff] font-bold">{group.groupCode}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {isOwner && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setGroupToDelete(group);
                          }}
                          className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 hover:border-rose-500/40 transition-all shrink-0 cursor-pointer"
                          title="Delete Group"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      )}

                      <button
                        type="button"
                        className="p-2 rounded-lg bg-white/5 group-hover:bg-[#3b82f6] text-[#c2c6d6] group-hover:text-white transition-all shrink-0 cursor-pointer"
                        title="Enter Room"
                      >
                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

      {/* Create Room Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-[#121216] border border-white/15 rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-2xl space-y-5">
            <div className="flex justify-between items-center pb-2 border-b border-white/10">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-[#adc6ff]">add_box</span>
                Create New Room
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-[#c2c6d6]/50 hover:text-white transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase font-bold tracking-widest text-[#c2c6d6]">
                ROOM NAME
              </label>
              <input
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCreateGroup();
                }}
                autoFocus
                className="w-full bg-[#050506] border border-white/10 rounded-xl py-3.5 px-4 text-xs text-[#e5e1e4] focus:outline-none focus:border-[#adc6ff] focus:ring-2 focus:ring-[#adc6ff]/20 transition-all placeholder:opacity-30"
                placeholder="e.g. Frontend Dev Team Room"
                type="text"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleCreateGroup}
                className="flex-1 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-bold py-3 rounded-xl shadow-[0_0_12px_rgba(59,130,246,0.4)] active:scale-95 transition-all cursor-pointer text-xs uppercase tracking-widest"
              >
                Create Room
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreateModal(false);
                  setGroupName('');
                }}
                className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-3 rounded-xl active:scale-95 transition-all cursor-pointer text-xs uppercase tracking-widest"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {groupToDelete && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-[#121216] border border-rose-500/30 rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-2xl space-y-5">
            <div className="flex items-center gap-3 text-rose-400 pb-2 border-b border-white/10">
              <span className="material-symbols-outlined text-2xl">warning</span>
              <h2 className="text-lg font-bold text-white">Delete Group</h2>
            </div>

            <p className="text-xs text-[#c2c6d6] leading-relaxed">
              Are you sure you want to delete <span className="font-bold text-white font-mono">"{groupToDelete.groupName}"</span> (Code: <span className="text-[#adc6ff] font-mono">{groupToDelete.groupCode}</span>)?
              This action is permanent and will remove the group and chat history.
            </p>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                disabled={deleting}
                onClick={() => handleDeleteGroup(groupToDelete)}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 rounded-xl shadow-[0_0_12px_rgba(225,29,72,0.4)] active:scale-95 transition-all cursor-pointer text-xs uppercase tracking-widest flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <span className="material-symbols-outlined text-[16px] animate-spin">sync</span>
                ) : (
                  <span className="material-symbols-outlined text-[16px]">delete</span>
                )}
                {deleting ? "Deleting..." : "Delete Group"}
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={() => setGroupToDelete(null)}
                className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-3 rounded-xl active:scale-95 transition-all cursor-pointer text-xs uppercase tracking-widest"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupLobbyBox;
