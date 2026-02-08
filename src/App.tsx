import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./loader.css";

import Header from "./components/Header";
import DashboardInfo from "./components/DashboardInfo";
import EpicHeader from "./components/EpicHeader";
import TaskItem from "./components/TaskItem";
import ImportJsonModal from "./components/ImportJsonModal";
import SettingsModal from "./components/SettingsModal";
import LoadingScreen from "./components/LoadingScreen";
import DocTabSelectModal from "./components/DocTabSelectModal";
import EmptyState from "./components/EmptyState";
import { showSuccess, showError, showWarning } from "./utils/toast";

interface SheetTab {
  id: number;
  name: string;
}

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
  epicOverview?: string;
  epicRequirements?: string; // Serialized JSON array of requirements
  epicResults?: string; // Serialized JSON array of results
  isTestCase?: boolean;
}

export default function App() {
  /* CONSTANTS FOR DROPDOWN OPTIONS */
  const PRIORITY_OPTIONS = ["HIGH", "MEDIUM", "LOW", "N/A"];
  const COMPLEXITY_OPTIONS = ["COMPLEX", "MEDIUM", "SIMPLE", "N/A"];
  const STATUS_LEADER_OPTIONS = [
    "Done",
    "In progress",
    "Not started yet",
    "Delay",
  ];
  const STATUS_PM_OPTIONS = ["PASSED", "FAILED", "SKIPPED", "N/A"];
  const POINT_OPTIONS = ["1", "2", "3", "4", "5", "6", "7", "N/A"];
  const SYSTEM_ACTOR_PREFIX_OPTIONS = ["User", "Partner", "Admin"];

  const CHIP_CONFIG = {
    PRIORITY: {
      colors: {
        HIGH: ["#fca5a533", "#fca5a5"], // Red
        MEDIUM: ["#fcd34d33", "#fcd34d"], // Yellow
        LOW: ["#6ee7b733", "#6ee7b7"], // Green
        "N/A": ["#9ca3af33", "#9ca3af"], // Gray
      },
    },
    COMPLEX: {
      colors: {
        COMPLEX: ["#fca5a533", "#fca5a5"],
        MEDIUM: ["#fcd34d33", "#fcd34d"],
        SIMPLE: ["#6ee7b733", "#6ee7b7"],
        "N/A": ["#9ca3af33", "#9ca3af"],
      },
    },
    L_STATUS: {
      colors: {
        Done: ["#93c5fd33", "#93c5fd"], // Blue
        "In progress": ["#7dd3fc33", "#7dd3fc"], // Sky
        "Not started yet": ["#9ca3af33", "#9ca3af"], // Gray
        Delay: ["#fca5a533", "#fca5a5"], // Red
      },
    },
    PM_STATUS: {
      colors: {
        PASSED: ["#93c5fd33", "#93c5fd"], // Blue
        FAILED: ["#fca5a533", "#fca5a5"], // Red
        SKIPPED: ["#fdba7433", "#fdba74"], // Orange
        "N/A": ["#9ca3af33", "#9ca3af"], // Gray
      },
    },
  };

  const getChipStyle = (
    type: keyof typeof CHIP_CONFIG,
    value: string,
  ): React.CSSProperties => {
    const config = CHIP_CONFIG[type];
    const colors = config.colors[value as keyof typeof config.colors];
    if (!colors) return {};
    return {
      backgroundColor: "#18181b", // zinc-900 (Dark background like before)
      color: colors[1],
      fontWeight: 600,
    };
  };

  const [jsonInput, setJsonInput] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showDocTabModal, setShowDocTabModal] = useState(false);

  // Upload progress tracking
  const [submitting, setSubmitting] = useState(false);

  // Configuration states
  const [scriptUrl, setScriptUrl] = useState(
    localStorage.getItem("googleScriptUrl") || "No connection",
  );
  const [leaderFileId, setLeaderFileId] = useState(
    localStorage.getItem("leaderFileId") || "No connection",
  );
  const [docUrl, setDocUrl] = useState(localStorage.getItem("docUrl") || "");
  const [connectedSheetName, setConnectedSheetName] = useState(
    localStorage.getItem("connectedSheetName") || "",
  );

  // Dashboard Info State
  const [sheetsInfo, setSheetsInfo] = useState<{
    devFileName: string;
    leaderFileName: string;
    docName?: string;
    currentDocVersion?: string;
    docTabs?: { id: string; title: string }[];
    devSheets: SheetTab[];
    leaderSheets: SheetTab[];
  } | null>(null);

  const [collapsedEpics, setCollapsedEpics] = useState<Set<string>>(new Set());

  const toggleEpicCollapse = (epicName: string) => {
    setCollapsedEpics((prev) => {
      const next = new Set(prev);
      if (next.has(epicName)) {
        next.delete(epicName);
      } else {
        next.add(epicName);
      }
      return next;
    });
  };

  // Auto-fetch info on load
  useEffect(() => {
    const initializeApp = async () => {
      if (
        scriptUrl &&
        scriptUrl !== "No connection" &&
        localStorage.getItem("googleScriptUrl")
      ) {
        await testConnection(true);
      }
      // Minimum loading time for smooth UX
      setTimeout(() => {
        setInitialLoading(false);
      }, 800);
    };

    initializeApp();
  }, []);

  // Extract File ID from Google Sheets URL
  const extractFileIdFromUrl = (input: string): string => {
    const trimmed = input.trim();

    // If it's already just an ID (no slashes), return as-is
    if (!trimmed.includes("/") && !trimmed.includes("http")) {
      return trimmed;
    }

    // Extract from URL: https://docs.google.com/spreadsheets/d/FILE_ID/edit...
    const match = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    if (match && match[1]) {
      return match[1];
    }

    // If no match, return original (might be a direct ID)
    return trimmed;
  };

  // Extract Doc ID from Google Docs URL
  const extractDocIdFromUrl = (input: string): string => {
    const trimmed = input.trim();
    if (!trimmed.includes("/") && !trimmed.includes("http")) {
      return trimmed;
    }
    const match = trimmed.match(/\/document\/d\/([a-zA-Z0-9-_]+)/);
    if (match && match[1]) {
      return match[1];
    }
    return trimmed;
  };

  // Save config to localStorage
  const saveConfig = async () => {
    localStorage.setItem("googleScriptUrl", scriptUrl);
    localStorage.setItem("leaderFileId", leaderFileId);
    localStorage.setItem("docUrl", docUrl);
    localStorage.setItem("connectedSheetName", connectedSheetName);
    setShowSettingsModal(false);
    showSuccess("Configuration saved!");
    // Refresh connection info after saving
    await testConnection(true);
  };

  // Test connection and get sheet name
  const testConnection = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      let detailSheetName = "";
      let leaderSheetName = "";
      let docName = "";
      let errors: string[] = [];

      try {
        const url = new URL(scriptUrl);
        if (leaderFileId) {
          url.searchParams.append("leaderFileId", leaderFileId);
        }
        if (docUrl) {
          url.searchParams.append("docId", extractDocIdFromUrl(docUrl));
        }

        const response = await fetch(url.toString());
        const data = await response.json();

        if (data.status === "success") {
          // 1. Detail Sheet Name
          if (data.sheetName) {
            detailSheetName = data.sheetName;
          } else {
            errors.push("Script URL: No detail sheet name returned");
          }

          // 2. Leader Sheet Name
          if (data.leaderSheetName) {
            if (data.leaderSheetName.startsWith("Error:")) {
              errors.push(`Leader File ID: ${data.leaderSheetName}`);
            } else {
              leaderSheetName = data.leaderSheetName;
            }
          } else if (leaderFileId) {
            errors.push("Leader File ID: Could not fetch sheet name");
          }

          // 3. Google Doc Name
          if (data.docName) {
            if (data.docName.startsWith("Error:")) {
              errors.push(`Doc URL: ${data.docName}`);
            } else {
              docName = data.docName;
            }
          }

          let docTabs = [];
          if (data.docTabs) {
            docTabs = data.docTabs;
          }

          // Save sheets info for dashboard
          if (data.data || data.leaderSheets) {
            setSheetsInfo({
              devFileName: detailSheetName || "Development File",
              leaderFileName:
                leaderSheetName && !leaderSheetName.startsWith("Error")
                  ? leaderSheetName
                  : "Leader File",
              docName: docName || undefined,
              currentDocVersion: data.currentDocVersion || "1.0",
              docTabs: docTabs,
              devSheets: data.data || [],
              leaderSheets: data.leaderSheets || [],
            });
          }
        } else {
          errors.push("Script URL: " + (data.message || "Unknown error"));
        }
      } catch (error) {
        errors.push("Script URL: Failed to connect - " + error);
      }

      // Construct connectedSheetName key: Detail|Leader|Doc
      let parts = [detailSheetName];
      if (leaderSheetName || docName) {
        parts.push(leaderSheetName || "");
        if (docName) {
          parts.push(docName);
        }
      }
      const newConnectedName = parts.join("|");

      // Show results
      if (errors.length === 0 && detailSheetName) {
        setConnectedSheetName(newConnectedName);
        localStorage.setItem("connectedSheetName", newConnectedName);

        let msg = `✅ Connection Successful!\n\nDetail Sheet: ${detailSheetName}`;
        if (leaderSheetName) msg += `\nLeader Sheet: ${leaderSheetName}`;
        if (docName) msg += `\nGoogle Doc: ${docName}`;

        if (!silent) showSuccess(msg);
      } else if (detailSheetName && errors.length > 0) {
        // Partial success
        setConnectedSheetName(newConnectedName);
        localStorage.setItem("connectedSheetName", newConnectedName);
        showWarning(
          `⚠️ Partial Success\n\nDetail Sheet: ${detailSheetName}\n❌ ${errors.join("\n")}`,
        );
      } else {
        if (!silent) showError(`❌ Connection Failed\n\n${errors.join("\n")}`);
      }
    } catch (error) {
      if (!silent)
        showError(
          "Failed to test connection. Please check your configuration.",
        );
    } finally {
      if (!silent) setLoading(false);
    }
  };

  // --- UI LOGIC (Highlighter etc.) ---
  const highlightJson = (json: string) => {
    if (!json) return "";
    let formatted = json
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    return formatted.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?|[\[\]{}:,])/g,
      function (match) {
        let cls = "text-yellow-500";
        if (/^"/.test(match)) {
          cls = /:$/.test(match)
            ? "text-sky-300 font-semibold"
            : "text-emerald-300";
        } else if (/true|false/.test(match)) {
          cls = "text-purple-400 font-semibold";
        } else if (/null/.test(match)) {
          cls = "text-gray-500";
        } else if (/^-?\d/.test(match)) {
          cls = "text-blue-400";
        } else if (/[\[\]{}]/.test(match)) {
          cls = "text-yellow-500 font-bold";
        } else {
          cls = "text-gray-400";
        }
        return `<span class="${cls}">${match}</span>`;
      },
    );
  };

  const handleScroll = () => {
    // This will be handled by ImportJsonModal component
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text");
    try {
      const parsed = JSON.parse(text);
      setJsonInput(JSON.stringify(parsed, null, 2));
    } catch (err) {
      setJsonInput(text);
    }
  };

  // --- IMPORT LOGIC ---
  const handleJsonImport = () => {
    if (!jsonInput.trim()) {
      showWarning("Please paste JSON.");
      return;
    }
    try {
      const parsed = JSON.parse(jsonInput);
      const epics = Array.isArray(parsed) ? parsed : [parsed];
      let allTasks: Task[] = [];
      const now = new Date();
      const dd = String(now.getDate()).padStart(2, "0");
      const mm = String(now.getMonth() + 1).padStart(2, "0");
      const yyyy = now.getFullYear();
      const today = `${dd}/${mm}/${yyyy}`;

      // Duyệt qua từng Epic trong mảng JSON
      epics.forEach((epicItem: any) => {
        const epicTitle = epicItem.epicName || epicItem.epic || "No Epic Title";
        const epicCode = epicItem.code || epicItem.epicCode || "N/A";
        const epicSystem = epicItem.system || epicItem.epicSystem || "N/A";
        const epicActor = epicItem.actor || epicItem.epicActor || "N/A";
        const epicOverview = epicItem.overview || "";

        const rawReqs = epicItem.requirements || epicItem.requirdment || [];
        const reqStr = JSON.stringify(Array.isArray(rawReqs) ? rawReqs : []);

        const resList: string[] = [];
        if (epicItem.tasks && Array.isArray(epicItem.tasks)) {
          epicItem.tasks.forEach((t: any) => {
            if (t.results && Array.isArray(t.results)) {
              resList.push(...t.results);
            }
          });
        }
        const resStr = JSON.stringify(resList);

        // Hàm xử lý chung để đẩy Test Case vào mảng allTasks
        const pushTestCase = (
          tc: any,
          parentTaskPriority?: string,
          parentTaskComplexity?: string,
        ) => {
          let rawTcSubs = tc.subTests || tc.subTasks || "";
          if (Array.isArray(rawTcSubs)) {
            rawTcSubs = rawTcSubs
              .map((s: any) => (typeof s === "object" ? s.name : s))
              .join("\n");
          }
          const formattedTcSubs = rawTcSubs
            .split("\n")
            .map((line: string) => {
              const trimmed = line.trim();
              if (!trimmed) return "";
              return trimmed.startsWith("•") || trimmed.startsWith("-")
                ? trimmed
                : `• ${trimmed}`;
            })
            .filter((l: string) => l !== "")
            .join("\n");

          allTasks.push({
            id: crypto.randomUUID(),
            epicName: epicTitle,
            mainTask: tc.mainTest || tc.mainTask || "Test Case",
            subTasks: formattedTcSubs,
            status: tc.status || "PASSED",
            priority: tc.priority || parentTaskPriority || "MEDIUM",
            complexity: tc.complexity || parentTaskComplexity || "MEDIUM",
            timeValue: tc.timeValue?.toString() || "0.1",
            startDate: tc.startDate || today,
            endDate: tc.endDate || today,
            finishedDate: tc.finishedDate || today,
            delayDate: tc.delayDate || "",
            statusLeader: tc.statusLeader || "Done",
            pointsLeader: tc.pointsLeader || "3",
            sourceVersion: tc.sourceVersion || "V1",
            business: tc.business || "",
            statusPm: tc.statusPm || "PASSED",
            pointsPm: tc.pointsPm || "3",
            pointsDev: tc.pointsDev || "3",
            code: epicCode,
            system: epicSystem,
            systemPrefix: "User",
            actor: epicActor,
            actorPrefix: "User",
            epicOverview: epicOverview,
            epicRequirements: reqStr,
            epicResults: resStr,
            isTestCase: true,
          });
        };

        // 1. Xử lý các Task chính
        const tasksArray = epicItem.tasks || [];
        tasksArray.forEach((taskObj: any) => {
          let rawSubs = taskObj.subTasks || "";
          if (Array.isArray(rawSubs)) {
            rawSubs = rawSubs
              .map((s: any) => (typeof s === "object" ? s.name : s))
              .join("\n");
          }
          const formattedSubtasks = rawSubs
            .split("\n")
            .map((line: string) => {
              const trimmed = line.trim();
              if (!trimmed) return "";
              return trimmed.startsWith("•") || trimmed.startsWith("-")
                ? trimmed
                : `• ${trimmed}`;
            })
            .filter((l: string) => l !== "")
            .join("\n");

          allTasks.push({
            id: crypto.randomUUID(),
            epicName: epicTitle,
            mainTask: taskObj.mainTask || "N/A",
            subTasks: formattedSubtasks,
            status: taskObj.status || "PASSED",
            priority: taskObj.priority || "MEDIUM",
            complexity: taskObj.complexity || "MEDIUM",
            timeValue: taskObj.timeValue?.toString() || "0.5",
            startDate: taskObj.startDate || today,
            endDate: taskObj.endDate || today,
            finishedDate: taskObj.finishedDate || today,
            delayDate: taskObj.delayDate || "",
            statusLeader: taskObj.statusLeader || "Done",
            pointsLeader: taskObj.pointsLeader || "3",
            sourceVersion: taskObj.sourceVersion || "V1",
            business: taskObj.business || "",
            statusPm: taskObj.statusPm || "PASSED",
            pointsPm: taskObj.pointsPm || "3",
            pointsDev: taskObj.pointsDev || "3",
            code: epicCode,
            system: epicSystem,
            systemPrefix: "User",
            actor: epicActor,
            actorPrefix: "User",
            epicOverview: epicOverview,
            epicRequirements: reqStr,
            epicResults: resStr,
            isTestCase: false,
          });

          // Check if test cases are nested inside this task
          if (taskObj.testCases && Array.isArray(taskObj.testCases)) {
            taskObj.testCases.forEach((tc: any) =>
              pushTestCase(tc, taskObj.priority, taskObj.complexity),
            );
          }
        });

        // 2. Xử lý các Test Cases ở cấp epic (nếu có)
        if (epicItem.testCases && Array.isArray(epicItem.testCases)) {
          epicItem.testCases.forEach((tc: any) => pushTestCase(tc));
        }
      });

      setTasks(allTasks);
      setJsonInput("");
      showSuccess(`Loaded ${allTasks.length} tasks successfully!`);
    } catch (error) {
      showError("Invalid JSON format.");
    }
  };

  const updateTask = (id: string, field: keyof Task, value: string) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, [field]: value } : t)));
  };

  const updateEpicMeta = (
    epicName: string,
    field: "code" | "system" | "actor" | "systemPrefix" | "actorPrefix",
    value: string,
  ) => {
    setTasks((prev) =>
      prev.map((t) => (t.epicName === epicName ? { ...t, [field]: value } : t)),
    );
  };

  const executePush = async (
    tabId: string | null,
    version?: string,
    summary?: string,
    requirementsMap?: Record<string, string[]>,
    resultsMap?: Record<string, string[]>,
    overviewMap?: Record<string, string>,
    detailSheetName?: string | null,
    leaderSheetName?: string | null,
  ) => {
    setSubmitting(true);
    setLoading(true);
    // Close modal if open
    setShowDocTabModal(false);

    try {
      // --- GIỮ NGUYÊN LOGIC NHÓM TASK CŨ ---
      const epicsMap = tasks.reduce((acc: any, t) => {
        if (!acc[t.epicName]) acc[t.epicName] = [];
        acc[t.epicName].push({
          mainTask: t.mainTask,
          timeValue: t.timeValue,
          priority: t.priority,
          complexity: t.complexity,
          startDate: t.startDate,
          endDate: t.endDate,
          finishedDate: t.finishedDate,
          delayDate: t.delayDate,
          statusLeader: t.statusLeader,
          pointsLeader: t.pointsLeader,
          sourceVersion: t.sourceVersion,
          business: t.business,
          statusPm: t.statusPm,
          pointsPm: t.pointsPm,
          pointsDev: t.pointsDev,
          isTestCase: t.isTestCase || false,
          subTasks: t.subTasks.split("\n").map((s) => ({
            name: s.replace(/^[•-]\s*/, "").trim(),
            status: t.status,
            priority: t.priority,
            complexity: t.complexity,
            timeValue: t.timeValue,
            startDate: t.startDate,
            endDate: t.endDate,
          })),
        });
        return acc;
      }, {});

      // --- CHUYỂN ĐỔI PAYLOAD (Đảm bảo lấy đúng epicCode cho tiêu đề) ---
      const payload = Object.keys(epicsMap).map((name) => {
        const sampleTask = tasks.find((t) => t.epicName === name);
        return {
          epicName: name,
          epicCode: sampleTask?.code || "N/A", // Dùng làm tiêu đề trang Doc
          epicSystem: sampleTask
            ? `${sampleTask.systemPrefix} ${sampleTask.system}`.trim()
            : "",
          epicActor: sampleTask
            ? `${sampleTask.actorPrefix} ${sampleTask.actor}`.trim()
            : "",
          overview:
            overviewMap && overviewMap[name] !== undefined
              ? overviewMap[name]
              : sampleTask?.epicOverview || "",
          requirements:
            requirementsMap && requirementsMap[name]
              ? requirementsMap[name]
              : sampleTask?.epicRequirements
                ? JSON.parse(sampleTask.epicRequirements)
                : [],
          results:
            resultsMap && resultsMap[name]
              ? resultsMap[name]
              : sampleTask?.epicResults
                ? JSON.parse(sampleTask.epicResults)
                : [],
          tasks: epicsMap[name],
        };
      });

      // --- CHUẨN BỊ PARAMS GỬI ĐI ---
      const params = new URLSearchParams();
      params.append("tasksData", JSON.stringify(payload));
      params.append("leaderFileId", leaderFileId);

      // Gửi thêm docId nếu người dùng có nhập docUrl
      if (docUrl) {
        const docId = extractDocIdFromUrl(docUrl);
        params.append("docId", docId);
        if (tabId) {
          params.append("docTabId", tabId);
        }
        if (version) params.append("version", version);
        if (summary) params.append("summary", summary);
      }

      if (detailSheetName) params.append("detailSheetName", detailSheetName);
      if (leaderSheetName) params.append("leaderSheetName", leaderSheetName);

      // --- GỬI REQUEST ---
      await fetch(scriptUrl, {
        method: "POST",
        body: params,
        mode: "no-cors",
      });

      showSuccess("Data pushed to Sheets & Doc successfully!");
      setTasks([]);
      // Refresh connection info after push
      await testConnection(true);
    } catch (err) {
      console.error(err);
      showError("Submit failed!");
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e?: FormEvent) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    if (tasks.length === 0) {
      showWarning("No tasks to submit.");
      return;
    }

    // If Doc URL is set, show modal to allow Version inputs / Tab selection
    if (docUrl) {
      setShowDocTabModal(true);
    } else {
      // No Doc configured, push directly to Sheets
      executePush(null);
    }
  };

  const handleCancel = () => {
    if (submitting) {
      setSubmitting(false);
      setLoading(false);
      showWarning("Operation cancelled.");
    }
    if (initialLoading) {
      setInitialLoading(false);
    }
  };

  return (
    <div
      className={`w-full min-h-screen bg-zinc-950 font-sans text-xs text-zinc-300 ${submitting ? "pointer-events-none select-none" : ""}`}
    >
      {/* Show loading screen during initial load or submitting */}
      {/* Show loading screen during initial load only */}
      {initialLoading && (
        <LoadingScreen
          message="Loading Configuration"
          description="Connecting to Google Sheets..."
          onCancel={handleCancel}
        />
      )}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <div className="flex flex-col gap-4 max-w-full mx-auto">
        {/* Task Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 ">
          {/* Header */}
          <Header
            connectedSheetName={connectedSheetName}
            loading={loading}
            tasksLength={tasks.length}
            onSettingsClick={() => setShowSettingsModal(true)}
            onImportClick={() => setShowImportModal(true)}
            onSubmit={() => handleSubmit()}
            onLogoClick={() => setTasks([])}
          />

          {/* Empty State when no connection */}
          {!sheetsInfo && tasks.length === 0 && !submitting && (
            <EmptyState onSettingsClick={() => setShowSettingsModal(true)} />
          )}

          {/* Dashboard Info (Empty State or Pushing) */}
          {((tasks.length === 0 && sheetsInfo) ||
            (submitting && sheetsInfo)) && (
            <DashboardInfo
              sheetsInfo={sheetsInfo}
              isPushing={submitting}
              onImportClick={() => setShowImportModal(true)}
            />
          )}

          {/* Tasks List */}
          <div
            className={`flex flex-col gap-4 mb-4 px-4 ${tasks.length === 0 || submitting ? "hidden" : ""}`}
          >
            {/* Group tasks by Epic */}
            {Object.entries(
              tasks.reduce(
                (acc, task) => {
                  if (!acc[task.epicName]) acc[task.epicName] = [];
                  acc[task.epicName].push(task);
                  return acc;
                },
                {} as Record<string, Task[]>,
              ),
            ).map(([epicName, epicTasks]) => {
              const isCollapsed = collapsedEpics.has(epicName);
              return (
                <div
                  key={epicName}
                  className="bg-zinc-900/20 border border-zinc-800 rounded overflow-hidden shadow-sm"
                >
                  {/* Epic Header */}
                  <EpicHeader
                    epicName={epicName}
                    epicTasks={epicTasks}
                    systemActorPrefixOptions={SYSTEM_ACTOR_PREFIX_OPTIONS}
                    onUpdateEpicMeta={updateEpicMeta}
                    isCollapsed={isCollapsed}
                    onToggleCollapse={() => toggleEpicCollapse(epicName)}
                  />

                  {/* Tasks */}
                  {!isCollapsed && (
                    <div className="overflow-x-auto">
                      <div className="divide-y divide-zinc-800/50 min-w-[800px]">
                        {epicTasks.map((task, idx) => (
                          <TaskItem
                            key={task.id}
                            task={task}
                            idx={idx}
                            priorityOptions={PRIORITY_OPTIONS}
                            complexityOptions={COMPLEXITY_OPTIONS}
                            statusLeaderOptions={STATUS_LEADER_OPTIONS}
                            statusPmOptions={STATUS_PM_OPTIONS}
                            pointOptions={POINT_OPTIONS}
                            getChipStyle={getChipStyle}
                            onUpdateTask={updateTask}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Action Bar Removed */}
        </form>

        {/* Import JSON Modal */}
        <ImportJsonModal
          show={showImportModal}
          jsonInput={jsonInput}
          onClose={() => setShowImportModal(false)}
          onJsonInputChange={setJsonInput}
          onImport={handleJsonImport}
          highlightJson={highlightJson}
          onScroll={handleScroll}
          onPaste={handlePaste}
        />

        {/* Settings Modal */}
        <SettingsModal
          show={showSettingsModal}
          loading={loading}
          scriptUrl={scriptUrl}
          leaderFileId={leaderFileId}
          docUrl={docUrl}
          connectedSheetName={connectedSheetName}
          onClose={() => setShowSettingsModal(false)}
          onScriptUrlChange={setScriptUrl}
          onLeaderFileIdChange={(value) =>
            setLeaderFileId(extractFileIdFromUrl(value))
          }
          onDocUrlChange={setDocUrl}
          onTestConnection={() => testConnection(false)}
          onSaveConfig={saveConfig}
        />

        <DocTabSelectModal
          show={showDocTabModal}
          tabs={sheetsInfo?.docTabs || []}
          devSheets={sheetsInfo?.devSheets || []}
          leaderSheets={sheetsInfo?.leaderSheets || []}
          defaultVersion={sheetsInfo?.currentDocVersion || "1.0"}
          initialEpics={Object.values(
            tasks.reduce(
              (acc, t) => {
                if (!acc[t.epicName]) {
                  const reqs = t.epicRequirements
                    ? JSON.parse(t.epicRequirements)
                    : [];
                  const res = t.epicResults ? JSON.parse(t.epicResults) : [];
                  acc[t.epicName] = {
                    name: t.epicName,
                    overview: t.epicOverview || "",
                    requirements: Array.isArray(reqs) ? reqs : [],
                    results: Array.isArray(res) ? res : [],
                  };
                }
                return acc;
              },
              {} as Record<
                string,
                {
                  name: string;
                  overview: string;
                  requirements: string[];
                  results: string[];
                }
              >,
            ),
          )}
          onSelect={(
            tabId,
            version,
            summary,
            requirementsMap,
            resultsMap,
            overviewMap,
            detailSheetName,
            leaderSheetName,
          ) =>
            executePush(
              tabId,
              version,
              summary,
              requirementsMap,
              resultsMap,
              overviewMap,
              detailSheetName,
              leaderSheetName,
            )
          }
          onCancel={() => setShowDocTabModal(false)}
        />
      </div>
    </div>
  );
}
