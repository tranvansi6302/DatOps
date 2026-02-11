import { useState } from "react";
import {
  Rocket,
  Loader2,
  Upload,
  FileSpreadsheet,
  Table2,
  FileJson,
  PlugZap2,
  Menu,
  X,
  LayoutGrid,
} from "lucide-react";

interface HeaderProps {
  connectedSheetName: string;
  loading: boolean;
  tasksLength: number;
  onSettingsClick: () => void;
  onImportClick: () => void;
  onSubmit: () => void;
  onLogoClick: () => void;
  pushQueue?: any[];
}

export default function Header({
  connectedSheetName,
  loading,
  tasksLength,
  onSettingsClick,
  onImportClick,
  onSubmit,
  onLogoClick,
  pushQueue = [],
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showQueueDetails, setShowQueueDetails] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const activeQueueCount = pushQueue.length;
  const isSyncing = activeQueueCount > 0 || loading;

  return (
    <div className="sticky top-0 z-50 px-3 py-1.5 group/header">
      {/* Dynamic Header Container */}
      <div className="mx-auto bg-zinc-900/90 backdrop-blur-xl border border-white/5 rounded-full px-3 py-1 shadow-[0_8px_32px_rgba(0,0,0,0.6)] flex justify-between items-center transition-all duration-500 relative overflow-hidden">
        {/* Animated Top Light Beam */}
        <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-blue-500/20 to-transparent -translate-x-full group-hover/header:translate-x-full transition-transform duration-1000 ease-in-out"></div>

        <button
          onClick={onLogoClick}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
          type="button"
        >
          <div className="relative group/logo">
            <div className="absolute -inset-1.5 bg-linear-to-tr from-blue-600/20 to-cyan-400/20 rounded-lg blur-md opacity-0 group-hover/logo:opacity-100 transition-opacity duration-500 animate-pulse"></div>
            <div className="relative flex items-center justify-center w-8 h-8 bg-zinc-950 rounded-full border border-zinc-800 shadow-inner text-blue-400 group-hover/logo:border-blue-500/50 transition-colors">
              <LayoutGrid className="w-4 h-4 group-hover/logo:scale-110 transition-transform duration-300" />
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-1.5">
              <h1 className="text-[16px] font-black tracking-tight uppercase flex items-center leading-none">
                <span className="bg-clip-text text-transparent bg-linear-to-r from-blue-400 via-cyan-400 to-blue-500">
                  DatOps
                </span>
              </h1>
              <div className="h-1.5 w-1.5 rounded-full bg-cyan-400/80 animate-pulse shadow-[0_0_10px_rgba(34,211,238,0.6)]"></div>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="flex gap-0.5">
                <div className="w-1 h-1 rounded-full bg-zinc-800"></div>
                <div className="w-3 h-px bg-zinc-800 self-center"></div>
              </div>
              <span className="text-[8px] text-zinc-500 font-black tracking-[0.25em] uppercase leading-none opacity-80">
                Data Operations Hub
              </span>
            </div>
          </div>
        </button>

        <div className="hidden lg:flex gap-3 items-center">
          {connectedSheetName &&
            connectedSheetName !== "No connection" &&
            connectedSheetName.trim() !== "" && (
              <div className="flex items-center gap-2 text-[11px] bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 h-8 hover:border-emerald-500/30 transition-all cursor-default group overflow-hidden relative">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-20"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500/80 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                </span>

                <div className="flex items-center gap-3">
                  {connectedSheetName.split("|").length >= 2 ? (
                    <>
                      <div
                        className="flex items-center gap-1.5"
                        title="Detail Sheet"
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500/70" />
                        <span className="text-zinc-400 font-medium truncate max-w-[80px]">
                          {connectedSheetName
                            .split("|")[0]
                            .replace(/^[📊\s]+/, "")}
                        </span>
                      </div>
                      <div className="w-px h-3 bg-zinc-800"></div>
                      <div
                        className="flex items-center gap-1.5"
                        title="Leader Sheet"
                      >
                        <Table2 className="w-3.5 h-3.5 text-blue-500/70" />
                        <span className="text-zinc-400 font-medium truncate max-w-[80px]">
                          {connectedSheetName
                            .split("|")[1]
                            .replace(/^[📋\s]+/, "")}
                        </span>
                      </div>
                      {connectedSheetName.split("|")[2] && (
                        <>
                          <div className="w-px h-3 bg-zinc-800"></div>
                          <div
                            className="flex items-center gap-1.5"
                            title="Google Doc"
                          >
                            <FileJson className="w-3.5 h-3.5 text-amber-500/70" />
                            <span className="text-zinc-400 font-medium truncate max-w-[80px]">
                              {connectedSheetName.split("|")[2]}
                            </span>
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500/70" />
                      <span className="text-zinc-400 font-medium truncate max-w-[150px]">
                        {connectedSheetName.replace(/^[📊\s]+/, "")}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

          <div className="flex items-center bg-zinc-950/50 rounded-lg border border-zinc-800/50 overflow-hidden">
            <button
              type="button"
              onClick={onSettingsClick}
              className="h-8 px-4 text-zinc-400 hover:text-blue-400 hover:bg-blue-500/5 transition-all flex items-center gap-2 text-xs font-semibold"
            >
              <PlugZap2 className="w-3.5 h-3.5" />
              Connect
            </button>

            <button
              type="button"
              onClick={onImportClick}
              className="h-8 px-4 text-zinc-400 hover:text-purple-400 hover:bg-purple-500/5 transition-all flex items-center gap-2 text-xs font-semibold border-l border-zinc-800/50"
            >
              <Upload className="w-3.5 h-3.5" />
              Import
            </button>

            <div
              className="relative"
              onMouseEnter={() => setShowQueueDetails(true)}
              onMouseLeave={() => setShowQueueDetails(false)}
            >
              <button
                type="button"
                onClick={onSubmit}
                disabled={loading || tasksLength === 0}
                className={`h-8 px-4 border-l border-zinc-800/50 transition-all flex items-center gap-2 text-xs font-bold disabled:opacity-20 disabled:hover:bg-transparent disabled:cursor-not-allowed ${
                  activeQueueCount > 0
                    ? "bg-amber-500/10 text-amber-400 hover:bg-amber-500 hover:text-white"
                    : "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white"
                }`}
              >
                {isSyncing ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    {activeQueueCount > 0
                      ? `In Queue (${activeQueueCount})`
                      : "Syncing"}
                  </>
                ) : (
                  <>
                    <Rocket className="w-3.5 h-3.5" />
                    Push Cloud
                  </>
                )}
              </button>

              {/* Queue Details Popover */}
              {showQueueDetails && activeQueueCount > 0 && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-zinc-900 border border-zinc-800 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.7)] p-2 animate-in fade-in slide-in-from-top-2 duration-200 z-100">
                  <div className="px-2 py-1.5 border-b border-zinc-800 mb-2 flex justify-between items-center">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                      Sync Queue
                    </span>
                    <span className="text-[10px] bg-amber-500/20 text-amber-500 px-1.5 py-0.5 rounded-full font-bold">
                      {activeQueueCount} items
                    </span>
                  </div>
                  <div className="max-h-60 overflow-y-auto custom-scrollbar flex flex-col gap-1">
                    {pushQueue.map((item) => (
                      <div
                        key={item.id}
                        className="p-2 rounded-lg bg-zinc-950/50 border border-zinc-800/50 flex flex-col gap-1"
                      >
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] font-bold text-zinc-300 truncate max-w-[150px]">
                            {item.payload[0]?.epicName || "Unnamed Epic"}
                          </span>
                          {item.status === "processing" ? (
                            <span className="text-[8px] bg-blue-500/20 text-blue-400 px-1 py-0.5 rounded animate-pulse">
                              Syncing...
                            </span>
                          ) : (
                            <span className="text-[8px] bg-zinc-800 text-zinc-500 px-1 py-0.5 rounded">
                              Waiting
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] text-zinc-500 font-mono">
                            {item.payload[0]?.epicCode || "N/A"}
                          </span>
                          <span className="text-[9px] text-zinc-600 font-medium italic">
                            •{" "}
                            {new Date(item.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:hidden flex items-center gap-1.5">
          {connectedSheetName &&
            connectedSheetName !== "No connection" &&
            connectedSheetName.trim() !== "" && (
              <div className="flex items-center gap-1 px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                </span>
                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-tighter">
                  Connected
                </span>
              </div>
            )}
          <button
            type="button"
            onClick={toggleMenu}
            className="p-1.5 rounded-lg bg-zinc-800/50 border border-zinc-700/50 text-zinc-400"
          >
            {isMenuOpen ? (
              <X className="w-4 h-4" />
            ) : (
              <Menu className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="lg:hidden mt-1 p-3 bg-zinc-900/95 backdrop-blur-xl border border-zinc-800 rounded-xl shadow-2xl animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-3">
            {connectedSheetName &&
              connectedSheetName !== "No connection" &&
              connectedSheetName.trim() !== "" && (
                <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl space-y-2">
                  <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1">
                    Connected Resources
                  </div>
                  {connectedSheetName.split("|").length >= 2 ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs">
                        <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                        <span className="text-zinc-300 truncate">
                          {connectedSheetName.split("|")[0]}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <Table2 className="w-4 h-4 text-blue-500" />
                        <span className="text-zinc-300 truncate">
                          {connectedSheetName.split("|")[1]}
                        </span>
                      </div>
                      {connectedSheetName.split("|")[2] && (
                        <div className="flex items-center gap-2 text-xs">
                          <FileJson className="w-4 h-4 text-amber-500" />
                          <span className="text-zinc-300 truncate">
                            {connectedSheetName.split("|")[2]}
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-xs">
                      <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                      <span className="text-zinc-300 truncate">
                        {connectedSheetName}
                      </span>
                    </div>
                  )}
                </div>
              )}

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  onSettingsClick();
                  toggleMenu();
                }}
                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold hover:bg-blue-500/20 transition-all"
              >
                <PlugZap2 className="w-4 h-4" />
                Connect
              </button>
              <button
                type="button"
                onClick={() => {
                  onImportClick();
                  toggleMenu();
                }}
                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-semibold hover:bg-purple-500/20 transition-all"
              >
                <Upload className="w-4 h-4" />
                Import
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                onSubmit();
                toggleMenu();
              }}
              disabled={loading || tasksLength === 0}
              className="flex items-center justify-center gap-2 p-4 rounded-xl bg-emerald-500 text-zinc-950 text-sm font-bold hover:bg-emerald-400 transition-all disabled:opacity-20 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Synchronizing...
                </>
              ) : (
                <>
                  <Rocket className="w-4 h-4" />
                  Push to Cloud
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
