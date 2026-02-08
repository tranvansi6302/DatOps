import { useRef } from "react";
import { FileJson, Upload } from "lucide-react";

interface ImportJsonModalProps {
  show: boolean;
  jsonInput: string;
  onClose: () => void;
  onJsonInputChange: (value: string) => void;
  onImport: () => void;
  highlightJson: (json: string) => string;
  onScroll: () => void;
  onPaste: (e: React.ClipboardEvent<HTMLTextAreaElement>) => void;
}

export default function ImportJsonModal({
  show,
  jsonInput,
  onClose,
  onJsonInputChange,
  onImport,
  highlightJson,
  onScroll,
  onPaste,
}: ImportJsonModalProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <FileJson className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold text-zinc-100  tracking-wide">
              Import JSON
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

        {/* Modal Body */}
        <div className="flex-1 p-6 overflow-hidden flex flex-col gap-4">
          <div className="relative flex-1 min-h-[500px] border border-zinc-800 rounded-lg bg-zinc-950 overflow-hidden shadow-inner">
            <pre
              ref={preRef}
              className="absolute inset-0 p-3 m-0 font-mono text-[11px] leading-relaxed whitespace-pre-wrap wrap-break-word pointer-events-none z-0 overflow-auto"
              dangerouslySetInnerHTML={{
                __html: highlightJson(jsonInput),
              }}
            />
            <textarea
              ref={textareaRef}
              className="absolute inset-0 w-full h-full p-3 font-mono text-[11px] leading-relaxed bg-transparent text-transparent caret-blue-400 resize-none focus:outline-none z-10 overflow-auto whitespace-pre-wrap wrap-break-word"
              placeholder="Paste JSON array of Epics here..."
              value={jsonInput}
              onChange={(e) => onJsonInputChange(e.target.value)}
              onScroll={onScroll}
              onPaste={onPaste}
              spellCheck={false}
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-zinc-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded h-[32px] bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-all  tracking-wide"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onImport();
              onClose();
            }}
            className="h-[32px] px-3 rounded bg-purple-500/10 border border-purple-500/20 text-purple-400 hover:text-purple-200 text-xs font-medium transition-all flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Import to UI
          </button>
        </div>
      </div>
    </div>
  );
}
