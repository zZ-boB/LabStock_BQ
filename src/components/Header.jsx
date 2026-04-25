import React from 'react'
import { Search } from 'lucide-react'

const tabTitles = {
  inventory: '實驗室庫存清單',
  batches: '當前庫存與優先使用批號 (FEFO)',
  history: '出入庫追蹤',
  vendors: '廠商業務聯絡資訊',
  stats: '月使用量統計',
  purchase: '實驗室報帳報表',
  settings: '品項設定',
}

const Header = ({ activeTab, searchTerm, setSearchTerm }) => {
  return (
    <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 bg-white p-6 rounded-2xl border shadow-sm gap-4">
      <h2 className="text-2xl font-bold">{tabTitles[activeTab]}</h2>
      <div className="relative w-full md:w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
        <input type="text" placeholder="搜尋項目..." className="w-full pl-10 pr-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
      </div>
    </header>
  )
}

export default Header
