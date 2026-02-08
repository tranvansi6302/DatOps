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
  isTestCase?: boolean;
}

interface TaskItemProps {
  task: Task;
  idx: number;
  priorityOptions: string[];
  complexityOptions: string[];
  statusLeaderOptions: string[];
  statusPmOptions: string[];
  pointOptions: string[];
  getChipStyle: (type: any, value: string) => React.CSSProperties;
  onUpdateTask: (id: string, field: keyof Task, value: string) => void;
}

export default function TaskItem({
  task,
  idx,
  priorityOptions,
  complexityOptions,
  statusLeaderOptions,
  statusPmOptions,
  pointOptions,
  getChipStyle,
  onUpdateTask,
}: TaskItemProps) {
  const handleCellClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const focusable = e.currentTarget.querySelector(
      "input, select, textarea",
    ) as any;
    if (focusable && e.target !== focusable) {
      focusable.focus();
      if (focusable.showPicker) {
        try {
          focusable.showPicker();
        } catch (e) {
          focusable.click();
        }
      } else {
        focusable.click();
      }
    }
  };

  const cellClass =
    "flex flex-col justify-center p-1.5 min-w-0 transition-colors cursor-pointer hover:bg-zinc-800/20 group/cell";
  const labelClass =
    "text-[10px] text-zinc-500 font-bold uppercase mb-0.5 truncate px-1 transition-colors group-hover/cell:text-zinc-300";

  return (
    <div
      className={`transition-all group border-b border-zinc-800/50 ${
        task.isTestCase
          ? "bg-blue-900/5 hover:bg-blue-900/10 shadow-[inset_3px_0_0_0_rgba(59,130,246,0.5)]"
          : "hover:bg-zinc-800/10"
      }`}
    >
      <div className="flex w-full min-h-[70px]">
        {/* Index Column */}
        <div className="w-[36px] flex items-center justify-center border-r border-zinc-800/30 bg-zinc-950/20 shrink-0">
          <span className="text-xs text-zinc-600 font-mono font-bold">
            {String(idx + 1).padStart(2, "0")}
          </span>
        </div>

        {/* Left: Task & Details (35%) */}
        <div className="w-[35%] p-2 flex flex-col justify-center gap-1.5 border-r border-zinc-800/40 shrink-0">
          <div
            className="flex flex-col gap-0.5 transition-colors cursor-pointer hover:bg-zinc-800/10 rounded-sm p-1"
            onClick={handleCellClick}
          >
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">
                {task.isTestCase ? "Test Case" : "Task Content"}
              </span>
              {task.isTestCase && (
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
              )}
            </div>
            <input
              className="w-full px-2 py-1 bg-zinc-900/40 border border-zinc-800 text-zinc-100 rounded text-xs font-semibold outline-none focus:border-blue-500/50 focus:bg-zinc-900/80 transition-all placeholder:text-zinc-700 h-[28px]"
              placeholder="Task summary..."
              value={task.mainTask}
              onChange={(e) =>
                onUpdateTask(task.id, "mainTask", e.target.value)
              }
            />
          </div>
          <div
            className="flex flex-col gap-0.5 transition-colors cursor-pointer hover:bg-zinc-800/10 rounded-sm p-1"
            onClick={handleCellClick}
          >
            <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">
              Checklist / Logic
            </span>
            <textarea
              className="w-full p-2 bg-zinc-950/20 border border-zinc-800/50 text-zinc-400 rounded resize-none outline-none text-xs leading-normal focus:border-zinc-700 focus:bg-zinc-950/40 transition-all placeholder:text-zinc-800 overflow-hidden font-medium"
              placeholder="Technical details..."
              rows={Math.max(1, task.subTasks.split("\n").length)}
              value={task.subTasks}
              onChange={(e) =>
                onUpdateTask(task.id, "subTasks", e.target.value)
              }
            />
          </div>
        </div>

        {/* Right: Metadata Matrix (65%) */}
        <div className="w-[65%] grid grid-rows-2">
          {/* Row 1: Core Specs */}
          <div className="grid grid-cols-8 divide-x divide-zinc-800/50 border-b border-zinc-800/50">
            {/* Priority */}
            <div
              className={`${cellClass} bg-zinc-950/10`}
              onClick={handleCellClick}
            >
              <span className={labelClass}>Priority</span>
              <select
                className="w-full text-xs font-bold rounded-sm px-1 h-[22px] outline-none appearance-none cursor-pointer border-none bg-transparent"
                style={getChipStyle("PRIORITY", task.priority)}
                value={task.priority}
                onChange={(e) =>
                  onUpdateTask(task.id, "priority", e.target.value)
                }
              >
                {priorityOptions.map((opt) => (
                  <option key={opt} className="bg-zinc-900 text-zinc-300">
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Complex */}
            <div
              className={`${cellClass} bg-zinc-950/10`}
              onClick={handleCellClick}
            >
              <span className={labelClass}>Complex</span>
              <select
                className="w-full text-xs font-bold rounded-sm px-1 h-[22px] outline-none appearance-none cursor-pointer border-none bg-transparent"
                style={getChipStyle("COMPLEX", task.complexity)}
                value={task.complexity}
                onChange={(e) =>
                  onUpdateTask(task.id, "complexity", e.target.value)
                }
              >
                {complexityOptions.map((opt) => (
                  <option key={opt} className="bg-zinc-900 text-zinc-300">
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Start Date */}
            <div className={cellClass} onClick={handleCellClick}>
              <span className={labelClass}>Start</span>
              <input
                type="text"
                className="w-full bg-transparent text-zinc-300 text-xs font-bold h-[22px] outline-none placeholder:text-zinc-800 px-1 focus:bg-zinc-800/20"
                placeholder="--/--/--"
                value={task.startDate}
                onChange={(e) =>
                  onUpdateTask(task.id, "startDate", e.target.value)
                }
              />
            </div>

            {/* End Date */}
            <div className={cellClass} onClick={handleCellClick}>
              <span className={labelClass}>End</span>
              <input
                type="text"
                className="w-full bg-transparent text-zinc-300 text-xs font-bold h-[22px] outline-none placeholder:text-zinc-800 px-1 focus:bg-zinc-800/20"
                placeholder="--/--/--"
                value={task.endDate}
                onChange={(e) =>
                  onUpdateTask(task.id, "endDate", e.target.value)
                }
              />
            </div>

            {/* Dev Points */}
            <div className={cellClass} onClick={handleCellClick}>
              <span className={labelClass}>Dev.Pts</span>
              <select
                className="w-full bg-transparent text-emerald-400 text-xs font-black h-[22px] outline-none appearance-none cursor-pointer px-1"
                value={task.pointsDev}
                onChange={(e) =>
                  onUpdateTask(task.id, "pointsDev", e.target.value)
                }
              >
                {pointOptions.map((opt) => (
                  <option key={opt} className="bg-zinc-900 text-zinc-300">
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Time Value */}
            <div className={cellClass} onClick={handleCellClick}>
              <span className={labelClass}>Hrs</span>
              <input
                type="text"
                className="w-full bg-transparent text-zinc-300 text-xs font-black h-[22px] outline-none placeholder:text-zinc-800 px-1 text-center focus:bg-zinc-800/20"
                placeholder="0.0"
                value={task.timeValue}
                onChange={(e) =>
                  onUpdateTask(task.id, "timeValue", e.target.value)
                }
              />
            </div>

            {/* Version Status */}
            <div
              className={`${cellClass} col-span-2 bg-zinc-950/20 border-l border-zinc-800/40`}
              onClick={handleCellClick}
            >
              <span className={`${labelClass} text-blue-500/70`}>Version</span>
              <input
                className="w-full bg-transparent text-blue-400 text-xs font-mono font-bold h-[22px] outline-none placeholder:text-zinc-800 px-1 focus:bg-blue-500/10"
                placeholder="Hash"
                value={task.sourceVersion}
                onChange={(e) =>
                  onUpdateTask(task.id, "sourceVersion", e.target.value)
                }
              />
            </div>
          </div>

          {/* Row 2: Status & Results */}
          <div className="grid grid-cols-8 divide-x divide-zinc-800/50 relative">
            <div
              className={`${cellClass} bg-zinc-800/5`}
              onClick={handleCellClick}
            >
              <span className={labelClass}>L.Status</span>
              <select
                className="w-full text-xs font-bold rounded-sm px-1 h-[22px] outline-none appearance-none cursor-pointer border-none bg-transparent"
                style={getChipStyle("L_STATUS", task.statusLeader)}
                value={task.statusLeader}
                onChange={(e) =>
                  onUpdateTask(task.id, "statusLeader", e.target.value)
                }
              >
                {statusLeaderOptions.map((opt) => (
                  <option key={opt} className="bg-zinc-900 text-zinc-300">
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            <div
              className={`${cellClass} bg-zinc-800/5`}
              onClick={handleCellClick}
            >
              <span className={labelClass}>L.Pts</span>
              <select
                className="w-full bg-transparent text-zinc-300 text-xs font-bold h-[22px] outline-none appearance-none cursor-pointer px-1"
                value={task.pointsLeader}
                onChange={(e) =>
                  onUpdateTask(task.id, "pointsLeader", e.target.value)
                }
              >
                {pointOptions.map((opt) => (
                  <option key={opt} className="bg-zinc-900 text-zinc-300">
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            <div
              className={`${cellClass} bg-zinc-800/5`}
              onClick={handleCellClick}
            >
              <span className={labelClass}>PM.St</span>
              <select
                className="w-full text-xs font-bold rounded-sm px-1 h-[22px] outline-none appearance-none cursor-pointer border-none bg-transparent"
                style={getChipStyle("PM_STATUS", task.statusPm)}
                value={task.statusPm}
                onChange={(e) =>
                  onUpdateTask(task.id, "statusPm", e.target.value)
                }
              >
                {statusPmOptions.map((opt) => (
                  <option key={opt} className="bg-zinc-900 text-zinc-300">
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            <div
              className={`${cellClass} bg-zinc-800/5`}
              onClick={handleCellClick}
            >
              <span className={labelClass}>PM.Pts</span>
              <select
                className="w-full bg-transparent text-amber-200/80 text-xs font-bold h-[22px] outline-none appearance-none cursor-pointer px-1"
                value={task.pointsPm}
                onChange={(e) =>
                  onUpdateTask(task.id, "pointsPm", e.target.value)
                }
              >
                {pointOptions.map((opt) => (
                  <option key={opt} className="bg-zinc-900 text-zinc-300">
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            <div className={cellClass} onClick={handleCellClick}>
              <span className={labelClass}>Finish</span>
              <input
                type="text"
                className="w-full bg-transparent text-zinc-100 text-xs font-bold h-[22px] outline-none placeholder:text-zinc-800 px-1 focus:bg-zinc-800/20"
                placeholder="--/--/--"
                value={task.finishedDate}
                onChange={(e) =>
                  onUpdateTask(task.id, "finishedDate", e.target.value)
                }
              />
            </div>
            <div className={cellClass} onClick={handleCellClick}>
              <span className={`${labelClass} text-amber-500/70`}>Delay</span>
              <input
                type="text"
                className="w-full bg-transparent text-amber-500 text-xs font-mono font-bold h-[22px] outline-none placeholder:text-zinc-800 px-1 text-center focus:bg-amber-500/10"
                placeholder="--"
                value={task.delayDate}
                onChange={(e) =>
                  onUpdateTask(task.id, "delayDate", e.target.value)
                }
              />
            </div>
            <div
              className={`${cellClass} col-span-2 bg-zinc-950/20 border-l border-zinc-800/40`}
              onClick={handleCellClick}
            >
              <span className={labelClass}>Business Style</span>
              <input
                className="w-full bg-transparent text-zinc-400 text-xs font-medium h-[22px] outline-none placeholder:text-zinc-800 italic px-1 focus:bg-zinc-800/20"
                placeholder="Details..."
                value={task.business}
                onChange={(e) =>
                  onUpdateTask(task.id, "business", e.target.value)
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
