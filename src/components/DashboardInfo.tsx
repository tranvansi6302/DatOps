import { FileSpreadsheet, Table2, FileText, FileJson } from "lucide-react";

interface SheetTab {
  id: number;
  name: string;
}

interface SheetsInfo {
  devFileName: string;
  leaderFileName: string;
  docName?: string;
  docTabs?: { id: string; title: string }[];
  devSheets: SheetTab[];
  leaderSheets: SheetTab[];
}

interface DashboardInfoProps {
  sheetsInfo: SheetsInfo;
  isPushing?: boolean;
  onImportClick?: () => void;
}

export default function DashboardInfo({
  sheetsInfo,
  isPushing = false,
  onImportClick,
}: DashboardInfoProps) {
  return (
    <div className="w-full flex flex-col md:flex-row items-center justify-center py-10 px-4 md:gap-0 animate-in fade-in zoom-in-95 duration-700">
      {/* 1. INPUT NODE (SOURCE) */}
      <div className="relative z-10 flex flex-col items-center gap-3 md:mr-[-10px]">
        <div
          onClick={!isPushing ? onImportClick : undefined}
          className={`w-20 h-20 md:w-24 md:h-24 bg-zinc-950 border-2 ${isPushing ? "border-indigo-500 shadow-[0_0_60px_rgba(99,102,241,0.6)] animate-pulse" : "border-dashed border-zinc-800 shadow-xl shadow-indigo-900/10 hover:border-indigo-500/50 hover:bg-zinc-900/40"} rounded-2xl flex items-center justify-center group transition-all duration-300 ${!isPushing ? "cursor-pointer" : "cursor-wait"}`}
        >
          <FileJson
            className={`w-8 h-8 md:w-10 md:h-10 ${isPushing ? "text-indigo-400" : "text-zinc-600"} group-hover:text-indigo-400 transition-colors duration-500`}
          />
        </div>
        <div className="text-center">
          <h3
            className={`text-[10px] md:text-xs font-bold ${isPushing ? "text-indigo-400" : "text-zinc-500"} uppercase tracking-widest transition-colors`}
          >
            {isPushing ? "Sending Data" : "JSON Input"}
          </h3>
          <p className="text-[9px] md:text-[10px] text-zinc-700 font-medium">
            {isPushing ? "Syncing..." : "Tasks Data"}
          </p>
        </div>
        {/* Connector Dot */}
        <div
          className={`hidden md:flex absolute top-10 md:top-12 -right-1.5 w-3 h-3 bg-zinc-900 border ${isPushing ? "border-indigo-500" : "border-zinc-700"} rounded-full items-center justify-center z-20`}
        >
          <div
            className={`w-1 h-1 ${isPushing ? "bg-indigo-400" : "bg-indigo-500"} rounded-full animate-pulse`}
          ></div>
        </div>
      </div>

      {/* 2. SVG CONNECTORS */}
      <div className="hidden md:block w-24 lg:w-32 h-[340px] relative shrink-0">
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 340"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <path id="path-detail" d="M 0 170 C 50 170, 50 50, 100 50" />
            <path id="path-leader" d="M 0 170 C 50 170, 50 170, 100 170" />
            <path id="path-doc" d="M 0 170 C 50 170, 50 290, 100 290" />

            <filter id="glow-emerald">
              <feGaussianBlur stdDeviation="1" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="glow-blue">
              <feGaussianBlur stdDeviation="1" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="glow-yellow">
              <feGaussianBlur stdDeviation="1" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background Paths */}
          <use
            href="#path-detail"
            stroke={isPushing ? "#10b981" : "#3f3f46"}
            strokeWidth="1.5"
            strokeDasharray="4 4"
            className={isPushing ? "opacity-30" : "opacity-40"}
          />
          <use
            href="#path-leader"
            stroke={isPushing ? "#3b82f6" : "#3f3f46"}
            strokeWidth="1.5"
            strokeDasharray="4 4"
            className={isPushing ? "opacity-30" : "opacity-40"}
          />
          <use
            href="#path-doc"
            stroke={isPushing ? "#eab308" : "#3f3f46"}
            strokeWidth="1.5"
            strokeDasharray="4 4"
            className={isPushing ? "opacity-30" : "opacity-40"}
          />

          {/* End Circles */}
          <circle
            cx="100"
            cy="50"
            r="3"
            fill="#3f3f46"
            className="opacity-60"
          />
          <circle
            cx="100"
            cy="170"
            r="3"
            fill="#3f3f46"
            className="opacity-60"
          />
          <circle
            cx="100"
            cy="290"
            r="3"
            fill="#3f3f46"
            className="opacity-60"
          />

          {/* Animation Particles */}
          {isPushing && (
            <>
              <circle r="3" fill="#10b981" filter="url(#glow-emerald)">
                <animateMotion
                  dur="1s"
                  repeatCount="indefinite"
                  begin="0s"
                  calcMode="paced"
                >
                  <mpath href="#path-detail" />
                </animateMotion>
              </circle>
              <circle r="3" fill="#3b82f6" filter="url(#glow-blue)">
                <animateMotion
                  dur="1s"
                  repeatCount="indefinite"
                  begin="0.2s"
                  calcMode="paced"
                >
                  <mpath href="#path-leader" />
                </animateMotion>
              </circle>
              <circle r="3" fill="#eab308" filter="url(#glow-yellow)">
                <animateMotion
                  dur="1s"
                  repeatCount="indefinite"
                  begin="0.4s"
                  calcMode="paced"
                >
                  <mpath href="#path-doc" />
                </animateMotion>
              </circle>
            </>
          )}
        </svg>
      </div>

      {/* 3. OUTPUT NODES */}
      <div className="flex flex-col gap-5 w-full max-w-sm mt-8 md:mt-0 md:ml-[-10px] relative z-10">
        {/* CARD 1: DETAIL SHEET */}
        <div
          className={`bg-zinc-900/60 border ${isPushing ? "border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.2)]" : "border-zinc-800/80"} rounded-xl p-4 transition-all duration-500 group shadow-lg backdrop-blur-sm relative h-[100px] flex flex-col justify-between`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`p-2 bg-zinc-950 rounded-lg border ${isPushing ? "border-emerald-500/40" : "border-zinc-800"} group-hover:border-emerald-500/30 transition-colors`}
            >
              <FileSpreadsheet
                className={`w-4 h-4 ${isPushing ? "text-emerald-500" : "text-emerald-600"} transition-colors`}
              />
            </div>
            <div className="overflow-hidden">
              <h4 className="text-xs font-semibold text-zinc-300 truncate">
                {sheetsInfo.devFileName}
              </h4>
              <p className="text-[10px] text-zinc-600">Detail / Dev Sheet</p>
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></span>
            </div>
          </div>

          <div className="mt-2 flex items-center justify-between text-[10px] text-zinc-500">
            <span>
              Active Sheets:{" "}
              <span className="text-zinc-300 font-mono">
                {sheetsInfo.devSheets.length}
              </span>
            </span>
            {sheetsInfo.devSheets.length > 0 && (
              <span className="px-1.5 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-zinc-400 truncate max-w-[120px]">
                {sheetsInfo.devSheets[0].name}{" "}
                {sheetsInfo.devSheets.length > 1 &&
                  `+${sheetsInfo.devSheets.length - 1}`}
              </span>
            )}
          </div>
        </div>

        {/* CARD 2: LEADER SHEET */}
        <div
          className={`bg-zinc-900/60 border ${isPushing ? "border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.2)]" : "border-zinc-800/80"} rounded-xl p-4 transition-all duration-500 group shadow-lg backdrop-blur-sm relative h-[100px] flex flex-col justify-between`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`p-2 bg-zinc-950 rounded-lg border ${isPushing ? "border-blue-500/40" : "border-zinc-800"} group-hover:border-blue-500/30 transition-colors`}
            >
              <Table2
                className={`w-4 h-4 ${isPushing ? "text-blue-500" : "text-blue-600"} transition-colors`}
              />
            </div>
            <div className="overflow-hidden">
              <h4 className="text-xs font-semibold text-zinc-300 truncate">
                {sheetsInfo.leaderFileName}
              </h4>
              <p className="text-[10px] text-zinc-600">Leader Sheet</p>
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)]"></span>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between text-[10px] text-zinc-500">
            <span>
              Active Sheets:{" "}
              <span className="text-zinc-300 font-mono">
                {sheetsInfo.leaderSheets.length}
              </span>
            </span>
            {sheetsInfo.leaderSheets.length > 0 && (
              <span className="px-1.5 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-zinc-400 truncate max-w-[120px]">
                {sheetsInfo.leaderSheets[0].name}
              </span>
            )}
          </div>
        </div>

        {/* CARD 3: DOC */}
        <div
          className={`bg-zinc-900/60 border ${isPushing ? "border-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.2)]" : "border-zinc-800/80"} rounded-xl p-4 transition-all duration-500 group shadow-lg backdrop-blur-sm relative min-h-[100px] flex flex-col justify-between`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`p-2 bg-zinc-950 rounded-lg border ${isPushing ? "border-yellow-500/40" : "border-zinc-800"} group-hover:border-yellow-500/30 transition-colors`}
            >
              <FileText
                className={`w-4 h-4 ${isPushing ? "text-yellow-500" : "text-yellow-600"} transition-colors`}
              />
            </div>
            <div className="overflow-hidden">
              <h4 className="text-xs font-semibold text-zinc-300 truncate">
                {sheetsInfo.docName || "Not Connected"}
              </h4>
              <p className="text-[10px] text-zinc-600">Google Doc</p>
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              <span
                className={`w-1.5 h-1.5 rounded-full ${sheetsInfo.docName ? "bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.4)]" : "bg-zinc-700"}`}
              ></span>
            </div>
          </div>

          <div className="mt-3">
            {sheetsInfo.docTabs && sheetsInfo.docTabs.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {sheetsInfo.docTabs.slice(0, 3).map((t) => (
                  <span
                    key={t.id}
                    className="text-[9px] px-1.5 py-0.5 bg-zinc-950 border border-zinc-800 rounded text-zinc-400"
                  >
                    {t.title}
                  </span>
                ))}
                {sheetsInfo.docTabs.length > 3 && (
                  <span className="text-[9px] px-1.5 py-0.5 text-zinc-600">
                    +{sheetsInfo.docTabs.length - 3}
                  </span>
                )}
              </div>
            ) : (
              <p className="text-[9px] text-zinc-600 italic">
                {sheetsInfo.docName ? "Single Tab Mode" : "No Doc configured"}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
