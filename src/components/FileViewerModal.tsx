import React, { useState } from 'react';
import { X, Download, FileCode, Copy, Check } from 'lucide-react';
import { CAPABILITY_FILES, SystemFile } from '../services/capabilities';
import { FILE_DETAILS } from '../services/fileContent';

interface FileViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialFileName?: string;
}

export const FileViewerModal: React.FC<FileViewerModalProps> = ({
  isOpen,
  onClose,
  initialFileName
}) => {
  const [selectedFile, setSelectedFile] = useState<string>(initialFileName || 'Db.ts');
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen) return null;

  const currentFile = CAPABILITY_FILES.find(f => f.name === selectedFile) || CAPABILITY_FILES[0];
  const fileDetail = FILE_DETAILS[currentFile.name] || {
    title: currentFile.description,
    lines: 100,
    snippet: `// Content for ${currentFile.name}`
  };

  const handleDownload = () => {
    const blob = new Blob([fileDetail.snippet], { type: 'text/typescript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = currentFile.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(fileDetail.snippet);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <FileCode className="w-5 h-5 text-blue-600" />
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Quản lý Tệp Khả Năng (Files Capability)
              </h2>
              <p className="text-xs text-slate-500">
                Các tệp hệ thống đã thêm: Db.ts, Artifact.ts, Files.ts, Sample.ts, User.ts,...
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Split */}
        <div className="flex-1 flex min-h-0 overflow-hidden">
          {/* Left file roster */}
          <div className="w-60 border-r border-slate-200 bg-slate-50/70 p-2 overflow-y-auto space-y-1 shrink-0">
            {CAPABILITY_FILES.map((file) => {
              const isSelected = file.name === currentFile.name;
              return (
                <button
                  key={file.name}
                  onClick={() => setSelectedFile(file.name)}
                  className={`w-full text-left p-2.5 rounded-lg text-xs transition-colors flex flex-col ${
                    isSelected
                      ? 'bg-blue-600 text-white font-medium shadow-xs'
                      : 'hover:bg-slate-200/70 text-slate-700'
                  }`}
                >
                  <span className="font-mono font-semibold">{file.name}</span>
                  <span className={`text-[10px] mt-0.5 truncate ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                    {file.description}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right file preview */}
          <div className="flex-1 flex flex-col bg-white overflow-hidden">
            <div className="p-3 border-b border-slate-200 flex items-center justify-between text-xs bg-slate-50/30">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-slate-800">{currentFile.name}</span>
                <span className="text-slate-400">·</span>
                <span className="text-slate-500">{fileDetail.title}</span>
                <span className="text-slate-400">·</span>
                <span className="font-mono tabular-nums text-slate-400">{(currentFile.size / 1024).toFixed(1)} KB</span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleCopy}
                  className="px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-200 rounded hover:bg-slate-50 transition-colors flex items-center gap-1"
                >
                  {isCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{isCopied ? 'Đã chép' : 'Sao chép'}</span>
                </button>
                <button
                  onClick={handleDownload}
                  className="px-2.5 py-1 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors flex items-center gap-1 shadow-xs"
                >
                  <Download className="w-3 h-3" />
                  <span>Tải Xuống</span>
                </button>
              </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto bg-slate-950 text-slate-200 font-mono text-xs leading-relaxed">
              <pre><code>{fileDetail.snippet}</code></pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
