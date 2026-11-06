import React, { useState } from 'react';
import { X, UserCheck, Shield, Key, Search } from 'lucide-react';
import { currentViewer } from '../services/capabilities';

interface UserViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserViewerModal: React.FC<UserViewerModalProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const mockDirectory = [
    { id: 'u_1', name: 'Đặng Tuấn', email: 'dangvatuan90@gmail.com', role: 'Owner' },
    { id: 'u_2', name: 'Nguyễn Văn An', email: 'an.nguyen@example.com', role: 'Editor' },
    { id: 'u_3', name: 'Trần Thị Mai', email: 'mai.tran@example.com', role: 'Contributor' }
  ];

  const filtered = mockDirectory.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-purple-600" />
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Thông Tin Người Dùng (User Capability)
              </h2>
              <p className="text-xs text-slate-500">
                Truy vấn danh tính người xem, quyền hạn & danh bạ tổ chức
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

        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* Active Viewer Card */}
          <div className="p-4 rounded-xl border border-purple-100 bg-purple-50/50 flex items-center gap-3.5">
            <img
              src={currentViewer.avatarUrl}
              alt={currentViewer.name}
              className="w-12 h-12 rounded-full border border-purple-200 bg-white"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm truncate">{currentViewer.name}</span>
                <span className="px-1.5 py-0.5 rounded bg-purple-200/80 text-purple-800 text-[10px] font-semibold">
                  Chủ sở hữu (Owner)
                </span>
              </div>
              <p className="text-slate-500 font-mono text-[11px] truncate mt-0.5">{currentViewer.email}</p>
              <p className="text-slate-400 font-mono text-[10px] mt-0.5">ID: {currentViewer.id}</p>
            </div>
          </div>

          {/* Capabilities & Permissions Checklist */}
          <div className="space-y-2">
            <span className="font-semibold text-slate-700 block">Quyền Hạn Đã Cấp:</span>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 rounded-lg border border-slate-200 bg-white flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                <span>isOwner: <strong>true</strong></span>
              </div>
              <div className="p-2.5 rounded-lg border border-slate-200 bg-white flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                <span>canEdit: <strong>true</strong></span>
              </div>
              <div className="p-2.5 rounded-lg border border-slate-200 bg-white flex items-center gap-2">
                <Key className="w-3.5 h-3.5 text-blue-600" />
                <span>data.write: <strong>true</strong></span>
              </div>
              <div className="p-2.5 rounded-lg border border-slate-200 bg-white flex items-center gap-2">
                <Key className="w-3.5 h-3.5 text-blue-600" />
                <span>files.write: <strong>true</strong></span>
              </div>
            </div>
          </div>

          {/* Typeahead Directory Search (User.ts search()) */}
          <div className="space-y-2">
            <span className="font-semibold text-slate-700 block">Tìm Kiếm Danh Bạ (user.search):</span>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Nhập tên hoặc email..."
                className="w-full pl-8 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs"
              />
            </div>
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg max-h-36 overflow-y-auto bg-white">
              {filtered.map(u => (
                <div key={u.id} className="p-2.5 flex items-center justify-between">
                  <div>
                    <span className="font-medium text-slate-800">{u.name}</span>
                    <span className="text-slate-400 text-[10px] ml-1.5">{u.email}</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">{u.role}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
