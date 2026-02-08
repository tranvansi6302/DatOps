import { PlugZap2, Loader2 } from "lucide-react";

interface SettingsModalProps {
  show: boolean;
  loading: boolean;
  scriptUrl: string;
  leaderFileId: string;
  docUrl: string;
  connectedSheetName: string;
  onClose: () => void;
  onScriptUrlChange: (value: string) => void;
  onLeaderFileIdChange: (value: string) => void;
  onDocUrlChange: (value: string) => void;
  onTestConnection: () => void;
  onSaveConfig: () => void;
}

export default function SettingsModal({
  show,
  loading,
  scriptUrl,
  leaderFileId,
  docUrl,
  connectedSheetName,
  onClose,
  onScriptUrlChange,
  onLeaderFileIdChange,
  onDocUrlChange,
  onTestConnection,
  onSaveConfig,
}: SettingsModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded w-full max-w-2xl flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <PlugZap2 className="w-5 h-5 text-indigo-400" />

            <h2 className="text-base font-bold text-zinc-100  tracking-wide">
              Connect to Google Sheets
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-200 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-400 mb-2  tracking-wider">
              Google Apps Script URL
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 text-zinc-300 rounded text-xs outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all font-mono"
              placeholder="https://script.google.com/macros/s/.../exec"
              value={scriptUrl}
              onChange={(e) => onScriptUrlChange(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-400 mb-2  tracking-wider">
              Leader File ID or URL
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 text-zinc-300 rounded text-xs outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all font-mono"
              placeholder="Paste full URL or just the File ID"
              value={leaderFileId}
              onChange={(e) => onLeaderFileIdChange(e.target.value)}
            />
            <p className="text-[10px] text-zinc-500 mt-1">
              Paste:{" "}
              <strong>
                https://docs.google.com/spreadsheets/d/FILE_ID/edit
              </strong>{" "}
              or just the <strong>FILE_ID</strong>
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-400 mb-2 tracking-wider">
              Google Doc URL (Optional)
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 text-zinc-300 rounded text-xs outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all font-mono"
              placeholder="https://docs.google.com/document/d/.../edit"
              value={docUrl}
              onChange={(e) => onDocUrlChange(e.target.value)}
            />
          </div>

          {connectedSheetName && (
            <div className="p-3 bg-emerald-950/20 border border-emerald-800/50 rounded">
              <p className="text-xs text-emerald-400">
                ✓ Connected to: <strong>{connectedSheetName}</strong>
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-zinc-800">
          <button
            onClick={onTestConnection}
            disabled={loading}
            className="px-4 h-[30px]  text-xs font-semibold rounded bg-blue-400/10 text-blue-400 hover:bg-blue-400/20 transition-all  tracking-wide disabled:opacity-50 flex items-center justify-center gap-2 min-w-[130px]"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Testing...
              </>
            ) : (
              "Test Connection"
            )}
          </button>
          <button
            onClick={onClose}
            className="px-4 h-[30px]  text-xs font-semibold rounded bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-all  tracking-wide"
          >
            Cancel
          </button>
          <button
            onClick={onSaveConfig}
            className="px-4 h-[30px]  text-xs font-bold rounded bg-green-400/10 text-green-400 hover:bg-green-400/20 transition-all active:scale-95 shadow-lg  tracking-wide"
          >
            Save Connect
          </button>
        </div>
      </div>
    </div>
  );
}
