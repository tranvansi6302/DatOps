import { Loader2 } from "lucide-react";

interface LoadingScreenProps {
  message?: string;
  description?: string;
  onCancel?: () => void;
}

export default function LoadingScreen({
  message = "Loading Configuration",
  description = "Connecting to Google Sheets...",
  onCancel,
}: LoadingScreenProps) {
  return (
    <div className="fixed inset-0 bg-zinc-950 flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          {/* Outer spinning ring */}
          <div className="w-16 h-16 border-4 border-zinc-800 border-t-indigo-500 rounded-full animate-spin"></div>
          {/* Inner pulsing dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse"></div>
          </div>
        </div>

        <div className="text-center space-y-2">
          <h3 className="text-sm font-semibold text-zinc-300 flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
            {message}
          </h3>
          <p className="text-xs text-zinc-500">{description}</p>
        </div>

        {/* Animated dots */}
        <div className="flex gap-1 mb-2">
          <span
            className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          ></span>
          <span
            className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          ></span>
          <span
            className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          ></span>
        </div>

        {onCancel && (
          <button
            onClick={onCancel}
            className="px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-400 text-xs hover:bg-zinc-800 hover:text-zinc-200 transition-colors cursor-pointer"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
