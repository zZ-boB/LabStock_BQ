import React from 'react'
import { Package, Layers, History, BarChart2, FileText, Settings, LogOut, Phone } from 'lucide-react'

const navItems = [
  { id: 'inventory', label: '庫存清單', icon: Package },
  { id: 'batches', label: '使用批號查詢', icon: Layers },
  { id: 'history', label: '出入庫追蹤', icon: History },
  { id: 'stats', label: '月使用量統計', icon: BarChart2 },
  { id: 'purchase', label: '實驗室報帳', icon: FileText },
  { id: 'vendors', label: '廠商聯絡', icon: Phone },
  { id: 'settings', label: '品項設定', icon: Settings },
]

const Sidebar = ({ activeTab, setActiveTab, isCloudLoading, onLogout }) => {
  return (
    <nav className="bg-slate-900 text-white w-full md:w-64 p-6 flex flex-col shrink-0">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3 text-lg font-bold">
          <img src="/app-icon.png" className="w-8 h-8 object-contain" />
          <span>LabStock</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isCloudLoading ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]'}`}></div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{isCloudLoading ? 'Syncing' : 'Cloud Online'}</span>
        </div>
      </div>
      <div className="flex-1 space-y-1">
        {navItems.map(item => (
          <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-3 p-3 rounded-xl transition ${activeTab === item.id ? 'bg-blue-600 shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}>
            <item.icon size={18} /> {item.label}
          </button>
        ))}
      </div>
      <button onClick={onLogout} className="mt-10 p-3 text-red-400 hover:bg-red-500/10 rounded-xl transition flex items-center gap-2 font-bold"><LogOut size={18} /> 登出</button>
    </nav>
  )
}

export default Sidebar
