import { useState, useEffect } from "react";
import { FileText, Upload, GitCommit, Tag } from "lucide-react";

interface DocTabSelectModalProps {
  show: boolean;
  tabs: { id: string; title: string }[];
  devSheets: { id: number; name: string }[];
  leaderSheets: { id: number; name: string }[];
  defaultVersion: string;
  initialEpics: {
    name: string;
    overview: string;
    requirements: string[];
    results: string[];
  }[];
  onSelect: (
    tabId: string,
    version: string,
    summary: string,
    requirementsMap: Record<string, string[]>,
    resultsMap: Record<string, string[]>,
    overviewMap: Record<string, string>,
    selectedDetailSheet: string | null,
    selectedLeaderSheet: string | null,
  ) => void;
  onCancel: () => void;
}

export default function DocTabSelectModal({
  show,
  tabs,
  devSheets,
  leaderSheets,
  defaultVersion,
  initialEpics,
  onSelect,
  onCancel,
}: DocTabSelectModalProps) {
  const [selectedTabId, setSelectedTabId] = useState<string>("");
  const [selectedDetailSheet, setSelectedDetailSheet] = useState<string>("NEW");
  const [selectedLeaderSheet, setSelectedLeaderSheet] = useState<string>("");
  const [version, setVersion] = useState(defaultVersion);
  const [summary, setSummary] = useState("");
  const [requirementsMap, setRequirementsMap] = useState<
    Record<string, string>
  >({});
  const [resultsMap, setResultsMap] = useState<Record<string, string>>({});
  const [overviewMap, setOverviewMap] = useState<Record<string, string>>({});

  useEffect(() => {
    if (show) {
      setVersion(defaultVersion || "1.0");
      setSummary("");
      setSelectedTabId("");
      setSelectedDetailSheet("NEW");

      // Default to first leader sheet if available
      if (leaderSheets && leaderSheets.length > 0) {
        setSelectedLeaderSheet(leaderSheets[0].name);
      } else {
        setSelectedLeaderSheet("");
      }

      // Initialize maps (name -> joined string)
      const initialReqMap: Record<string, string> = {};
      const initialResMap: Record<string, string> = {};
      const initialOverMap: Record<string, string> = {};
      initialEpics.forEach((epic) => {
        initialReqMap[epic.name] = (epic.requirements || []).join("\n");
        initialResMap[epic.name] = (epic.results || []).join("\n");
        initialOverMap[epic.name] = epic.overview || "";
      });
      setRequirementsMap(initialReqMap);
      setResultsMap(initialResMap);
      setOverviewMap(initialOverMap);
    }
  }, [show, defaultVersion, initialEpics, leaderSheets]);

  if (!show) return null;

  const hasTabs = tabs && tabs.length > 0;

  const handleConfirm = () => {
    if (hasTabs && !selectedTabId) return;

    // Convert string inputs back to arrays
    const finalReqs: Record<string, string[]> = {};
    Object.entries(requirementsMap).forEach(([name, val]) => {
      finalReqs[name] = val
        .split("\n")
        .map((s) => s.trim())
        .filter((s) => s !== "");
    });

    const finalRes: Record<string, string[]> = {};
    Object.entries(resultsMap).forEach(([name, val]) => {
      finalRes[name] = val
        .split("\n")
        .map((s) => s.trim())
        .filter((s) => s !== "");
    });

    onSelect(
      selectedTabId,
      version,
      summary,
      finalReqs,
      finalRes,
      overviewMap,
      selectedDetailSheet === "NEW" ? null : selectedDetailSheet,
      selectedLeaderSheet || null,
    );
  };

  const handleRequirementChange = (epicName: string, val: string) => {
    setRequirementsMap((prev) => ({
      ...prev,
      [epicName]: val,
    }));
  };

  const handleResultChange = (epicName: string, val: string) => {
    setResultsMap((prev) => ({
      ...prev,
      [epicName]: val,
    }));
  };

  const handleOverviewChange = (epicName: string, val: string) => {
    setOverviewMap((prev) => ({
      ...prev,
      [epicName]: val,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-800 rounded w-full max-w-[95vw] lg:max-w-6xl flex flex-col shadow-2xl relative max-h-[95vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4 border-b border-zinc-800 shrink-0">
          <div className="flex items-center gap-2">
            <Upload className="w-4 sm:w-5 h-4 sm:h-5 text-indigo-400" />
            <h2 className="text-xs sm:text-sm font-bold text-zinc-100 tracking-wide">
              <span className="hidden sm:inline">Push to Document</span>
              <span className="sm:hidden">Push Doc</span>
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onCancel}
              className="px-3 sm:px-4 py-2 text-xs font-semibold rounded h-[32px] bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-all tracking-wide"
            >
              <span className="hidden sm:inline">Cancel</span>
              <span className="sm:hidden">✕</span>
            </button>
            <button
              onClick={handleConfirm}
              disabled={hasTabs && !selectedTabId}
              className={`h-[32px] px-3 sm:px-4 rounded text-xs font-medium transition-all flex items-center gap-1.5 ${
                hasTabs && !selectedTabId
                  ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                  : "bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-900/20"
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Submit</span>
            </button>
          </div>
        </div>

        {/* Body - Horizontal Layout */}
        <div className="p-3 sm:p-6 overflow-hidden flex flex-col lg:flex-row gap-4 sm:gap-6 h-full">
          {/* Left Column: Settings */}
          <div className="w-full lg:w-1/4 flex flex-col gap-4 sm:gap-5 shrink-0 overflow-y-auto custom-scrollbar max-h-[50vh] lg:max-h-none">
            {/* Tab Selection */}
            {hasTabs && (
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Destination Doc Tab <span className="text-red-400">*</span>
                </label>
                <select
                  value={selectedTabId}
                  onChange={(e) => setSelectedTabId(e.target.value)}
                  className="w-full rounded-md border border-zinc-800 bg-zinc-950/30 text-zinc-200 px-3 py-2 text-sm outline-none transition focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option
                    value=""
                    disabled
                    className="bg-zinc-950 text-zinc-500"
                  >
                    -- Select destination tab --
                  </option>
                  {tabs
                    .filter(
                      (t) =>
                        t.title.toUpperCase() !== "SPRINT" &&
                        t.title.toUpperCase() !== "TEMPLATE",
                    )
                    .map((tab) => (
                      <option
                        key={tab.id}
                        value={tab.id}
                        className="bg-zinc-950 text-zinc-200"
                      >
                        {tab.title}
                      </option>
                    ))}
                </select>
              </div>
            )}

            {/* Sheets Selection */}
            <div className="flex flex-col gap-4 py-2 border-t border-zinc-800/50">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Detail Sheet
                </label>
                <select
                  value={selectedDetailSheet}
                  onChange={(e) => setSelectedDetailSheet(e.target.value)}
                  className="w-full rounded-md border border-zinc-800 bg-zinc-950/30 text-zinc-200 px-3 py-2 text-sm outline-none transition focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option
                    value="NEW"
                    className="bg-zinc-950 text-zinc-200 font-semibold"
                  >
                    + Create New (Auto-Name)
                  </option>
                  <option value="SPRINT" className="bg-zinc-950 text-zinc-200">
                    SPRINT
                  </option>
                  <option
                    value="TEMPLATE"
                    className="bg-zinc-950 text-zinc-200"
                  >
                    TEMPLATE
                  </option>
                  {devSheets
                    .filter(
                      (s) =>
                        s.name.toUpperCase() !== "SPRINT" &&
                        s.name.toUpperCase() !== "TEMPLATE",
                    )
                    .map((sheet) => (
                      <option
                        key={sheet.id}
                        value={sheet.name}
                        className="bg-zinc-950 text-zinc-200"
                      >
                        {sheet.name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Leader Sheet
                </label>
                <select
                  value={selectedLeaderSheet}
                  onChange={(e) => setSelectedLeaderSheet(e.target.value)}
                  className="w-full rounded-md border border-zinc-800 bg-zinc-950/30 text-zinc-200 px-3 py-2 text-sm outline-none transition focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20"
                >
                  {leaderSheets.map((sheet) => (
                    <option
                      key={sheet.id}
                      value={sheet.name}
                      className="bg-zinc-950 text-zinc-200"
                    >
                      {sheet.name}
                    </option>
                  ))}
                  {leaderSheets.length === 0 && (
                    <option value="" disabled>
                      No leader sheets found
                    </option>
                  )}
                </select>
              </div>
            </div>

            {/* Version Info */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                <Tag className="w-3.5 h-3.5" />
                Version
              </label>
              <input
                type="text"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500/50 transition-all font-mono"
                placeholder="e.g. 1.1"
              />
              <p className="text-[10px] text-zinc-500">
                Current detected version in doc is <b>{defaultVersion}</b>
              </p>
            </div>

            {/* Change Summary */}
            <div className="flex flex-col gap-2 flex-1">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                <GitCommit className="w-3.5 h-3.5" />
                Change Summary
              </label>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500/50 transition-all h-[120px] resize-none"
                placeholder="Ex. Added requirements for new feature..."
              />
            </div>
          </div>

          {/* Right Column: Epic Details (Overview, Reqs, Results) */}
          {initialEpics.length > 0 && (
            <div className="w-full lg:w-3/4 flex flex-col gap-3 border-t lg:border-t-0 lg:border-l border-zinc-800/50 lg:pl-6 pt-4 lg:pt-0 overflow-hidden">
              <div className="flex items-center justify-between shrink-0">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5" />
                  Epic Content Configuration
                </label>
              </div>

              <div className="flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-2 pb-4 h-full">
                {initialEpics.map((epic) => (
                  <div
                    key={epic.name}
                    className="flex flex-col gap-4 bg-zinc-900/50 rounded-xl border border-zinc-800/50 p-4"
                  >
                    <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
                      <span className="text-xs font-bold text-indigo-400 tracking-wide uppercase">
                        Epic:
                      </span>
                      <span
                        className="text-xs font-semibold text-zinc-100 truncate"
                        title={epic.name}
                      >
                        {epic.name}
                      </span>
                    </div>

                    {/* Overview */}
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                        <span className="w-1 h-1 bg-sky-500 rounded-full"></span>
                        Overview
                      </label>
                      <textarea
                        value={overviewMap[epic.name] || ""}
                        onChange={(e) =>
                          handleOverviewChange(epic.name, e.target.value)
                        }
                        className="w-full bg-zinc-950 border border-zinc-800/50 rounded-lg px-3 py-2 text-xs text-sky-200/90 focus:outline-none focus:border-sky-500/30 transition-all min-h-[80px] resize-none placeholder-zinc-800 leading-relaxed"
                        placeholder="Enter epic overview description..."
                        spellCheck={false}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Requirements */}
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                          <span className="w-1 h-1 bg-indigo-500 rounded-full"></span>
                          Requirements
                        </label>
                        <textarea
                          value={requirementsMap[epic.name] || ""}
                          onChange={(e) =>
                            handleRequirementChange(epic.name, e.target.value)
                          }
                          className="w-full bg-zinc-950 border border-zinc-800/50 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-indigo-500/50 transition-all min-h-[120px] h-full resize-none placeholder-zinc-800 leading-relaxed"
                          placeholder="List requirements (one per line)..."
                          spellCheck={false}
                        />
                      </div>

                      {/* Results */}
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                          <span className="w-1 h-1 bg-emerald-500 rounded-full"></span>
                          Implementation Results
                        </label>
                        <textarea
                          value={resultsMap[epic.name] || ""}
                          onChange={(e) =>
                            handleResultChange(epic.name, e.target.value)
                          }
                          className="w-full bg-zinc-950 border border-zinc-800/50 rounded-lg px-3 py-2 text-xs text-emerald-300/80 focus:outline-none focus:border-emerald-500/30 transition-all min-h-[120px] h-full resize-none placeholder-zinc-800 leading-relaxed"
                          placeholder="List implementation results (one per line)..."
                          spellCheck={false}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
