import React, { useState } from 'react';
import { X, Database, Plus, Trash2, Save } from 'lucide-react';
import { dbService, DbRecord } from '../services/capabilities';

interface DbViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  records: DbRecord[];
}

export const DbViewerModal: React.FC<DbViewerModalProps> = ({
  isOpen,
  onClose,
  records
}) => {
  const [collection, setCollection] = useState('notes');
  const [docId, setDocId] = useState('');
  const [docJson, setDocJson] = useState('{\n  "title": "Ghi chú mới",\n  "content": "Nội dung ghi chú VoiceOS"\n}');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSaveDoc = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsed = JSON.parse(docJson);
      const cleanId = docId.trim() || `doc_${Date.now()}`;
      dbService.setDoc(collection.trim() || 'notes', cleanId, parsed);
      setDocId('');
      setError(null);
    } catch {
      setError('JSON không hợp lệ, vui lòng kiểm tra lại');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-600" />
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Cơ Sở Dữ Liệu Thời Gian Thực (Db Capability)
              </h2>
              <p className="text-xs text-slate-500">
                Lưu trữ tài liệu dạng JSON collection/doc theo chuẩn Db.ts
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

        <div className="p-6 overflow-y-auto space-y-6">
          {/* Add Document Form */}
          <form onSubmit={handleSaveDoc} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-emerald-600" />
                Thêm Tài Liệu Mới Vào Db
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Tên Collection</label>
                <input
                  type="text"
                  value={collection}
                  onChange={(e) => setCollection(e.target.value)}
                  placeholder="ví dụ: notes"
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Mã Tài Liệu (Doc ID)</label>
                <input
                  type="text"
                  value={docId}
                  onChange={(e) => setDocId(e.target.value)}
                  placeholder="tùy chọn hoặc tự tạo"
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">Nội dung JSON</label>
              <textarea
                value={docJson}
                onChange={(e) => setDocJson(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg bg-white"
                required
              />
              {error && <p className="text-[11px] text-red-600 mt-1">{error}</p>}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center gap-1.5 shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Lưu Tài Liệu</span>
              </button>
            </div>
          </form>

          {/* Stored Documents */}
          <div>
            <h3 className="text-xs font-bold text-slate-700 mb-2.5">
              Danh Sách Bản Ghi Hiện Tại ({records.length})
            </h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {records.map((rec) => (
                <div
                  key={`${rec.collection}/${rec.id}`}
                  className="p-3 rounded-lg border border-slate-200 bg-white space-y-1.5 text-xs"
                >
                  <div className="flex items-center justify-between text-slate-500 font-mono text-[11px]">
                    <span className="font-semibold text-slate-800">
                      {rec.collection} / {rec.id}
                    </span>
                    <span>{new Date(rec.updatedAt).toLocaleTimeString('vi-VN')}</span>
                  </div>
                  <pre className="p-2 bg-slate-50 rounded text-slate-700 font-mono text-[11px] overflow-x-auto">
                    {JSON.stringify(rec.data, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
