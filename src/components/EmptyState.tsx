import { Settings, FileJson, Zap } from "lucide-react";

interface EmptyStateProps {
  onSettingsClick: () => void;
}

export default function EmptyState({ onSettingsClick }: EmptyStateProps) {
  return (
    <div className="w-full min-h-[calc(100vh-120px)] flex items-center justify-center px-4">
      <div className="max-w-lg w-full">
        {/* Main Card */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-8 shadow-lg backdrop-blur-sm">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-center">
              <Zap className="w-8 h-8 text-indigo-400" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-xl font-bold text-center text-zinc-100 mb-2">
            Welcome to DatOps
          </h1>
          <p className="text-center text-zinc-400 text-sm mb-6">
            Connect your Google Sheets and Docs to get started
          </p>

          {/* Steps */}
          <div className="space-y-3 mb-6">
            {/* Step 1 */}
            <div className="flex items-start gap-3 p-3 bg-zinc-950/50 border border-zinc-800 rounded-lg">
              <div className="shrink-0 w-6 h-6 bg-indigo-500/20 border border-indigo-500/30 rounded-md flex items-center justify-center">
                <span className="text-indigo-400 font-bold text-xs">1</span>
              </div>
              <div>
                <h3 className="text-zinc-200 font-semibold text-sm mb-0.5">
                  Configure Connection
                </h3>
                <p className="text-zinc-500 text-xs">
                  Add your Google Apps Script URL and Sheet IDs
                </p>
              </div>
              <Settings className="w-4 h-4 text-zinc-600 ml-auto mt-1" />
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-3 p-3 bg-zinc-950/50 border border-zinc-800 rounded-lg">
              <div className="shrink-0 w-6 h-6 bg-purple-500/20 border border-purple-500/30 rounded-md flex items-center justify-center">
                <span className="text-purple-400 font-bold text-xs">2</span>
              </div>
              <div>
                <h3 className="text-zinc-200 font-semibold text-sm mb-0.5">
                  Import Tasks
                </h3>
                <p className="text-zinc-500 text-xs">
                  Import from JSON to start managing tasks
                </p>
              </div>
              <FileJson className="w-4 h-4 text-zinc-600 ml-auto mt-1" />
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-3 p-3 bg-zinc-950/50 border border-zinc-800 rounded-lg">
              <div className="shrink-0 w-6 h-6 bg-emerald-500/20 border border-emerald-500/30 rounded-md flex items-center justify-center">
                <span className="text-emerald-400 font-bold text-xs">3</span>
              </div>
              <div>
                <h3 className="text-zinc-200 font-semibold text-sm mb-0.5">
                  Sync & Collaborate
                </h3>
                <p className="text-zinc-500 text-xs">
                  Push to Google Sheets and Docs
                </p>
              </div>
              <Zap className="w-4 h-4 text-zinc-600 ml-auto mt-1" />
            </div>
          </div>

          {/* CTA Button */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={onSettingsClick}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg transition-colors flex items-center gap-2 text-sm"
            >
              <Settings className="w-4 h-4" />
              <span>Configure Connection</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
