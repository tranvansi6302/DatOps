interface Task {
  id: string;
  epicName: string;
  mainTask: string;
  subTasks: string;
  status: string;
  priority: string;
  complexity: string;
  timeValue: string;
  startDate: string;
  endDate: string;
  finishedDate: string;
  delayDate: string;
  statusLeader: string;
  pointsLeader: string;
  sourceVersion: string;
  business: string;
  statusPm: string;
  pointsPm: string;
  pointsDev: string;
  code: string;
  system: string;
  systemPrefix: string;
  actor: string;
  actorPrefix: string;
}

interface EpicHeaderProps {
  epicName: string;
  epicTasks: Task[];
  systemActorPrefixOptions: string[];
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onUpdateEpicMeta: (
    epicName: string,
    field: "code" | "system" | "actor" | "systemPrefix" | "actorPrefix",
    value: string,
  ) => void;
}

export default function EpicHeader({
  epicName,
  epicTasks,
  systemActorPrefixOptions,
  isCollapsed,
  onToggleCollapse,
  onUpdateEpicMeta,
}: EpicHeaderProps) {
  return (
    <div className="bg-zinc-900 border-b border-zinc-800 px-3 py-1 items-center transition-colors">
      <div className="flex items-center gap-4">
        {/* Collapse Toggle & Epic Title */}
        <div className="flex items-center gap-2 pr-4 overflow-hidden min-w-[250px]">
          <button
            onClick={onToggleCollapse}
            className="w-5 h-5 flex items-center justify-center rounded hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 transition-all shrink-0"
            type="button"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-transform duration-200 ${isCollapsed ? "-rotate-90" : ""}`}
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
          <h3
            className="text-sm font-bold text-zinc-100 tracking-wide truncate"
            title={epicName}
          >
            {epicName}
          </h3>
          <span className="text-[9px] font-bold text-zinc-500 bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-700 shrink-0">
            {epicTasks.length}
          </span>
        </div>

        {/* Meta Inputs */}
        <div className="flex items-center gap-6 ml-auto">
          {/* Code */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-zinc-400">Code</label>
            <input
              className="w-[120px] h-[30px] bg-zinc-950 border border-zinc-800 text-zinc-300 text-xs rounded px-2 outline-none focus:border-indigo-500 transition-all font-mono"
              placeholder="#PROJECT.CODE"
              value={epicTasks[0]?.code || ""}
              onChange={(e) =>
                onUpdateEpicMeta(epicName, "code", e.target.value)
              }
            />
          </div>

          {/* System: Dropdown + Text */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-zinc-400">System</label>
            <div className="flex rounded bg-zinc-950 border border-zinc-800 overflow-hidden focus-within:border-indigo-500 h-[30px]">
              <select
                className="bg-zinc-900 text-zinc-300 text-[10px] px-1 outline-none border-r border-zinc-800 w-[65px] cursor-pointer"
                value={epicTasks[0]?.systemPrefix || "User"}
                onChange={(e) =>
                  onUpdateEpicMeta(epicName, "systemPrefix", e.target.value)
                }
              >
                {systemActorPrefixOptions.map((opt) => (
                  <option key={opt} className="bg-zinc-900 text-zinc-300">
                    {opt}
                  </option>
                ))}
              </select>
              <input
                className="bg-transparent text-zinc-300 text-xs px-2 py-1 outline-none w-[120px]"
                placeholder="SYSTEM"
                value={epicTasks[0]?.system || ""}
                onChange={(e) =>
                  onUpdateEpicMeta(epicName, "system", e.target.value)
                }
              />
            </div>
          </div>

          {/* Actor: ONLY Dropdown */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-zinc-400">Actor</label>
            <select
              className="w-[100px] h-[30px] bg-zinc-950 border border-zinc-800 text-zinc-300 text-xs rounded px-2 outline-none focus:border-indigo-500 transition-all cursor-pointer"
              value={epicTasks[0]?.actorPrefix || "User"}
              onChange={(e) =>
                onUpdateEpicMeta(epicName, "actorPrefix", e.target.value)
              }
            >
              {systemActorPrefixOptions.map((opt) => (
                <option key={opt} className="bg-zinc-900 text-zinc-300">
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
