import React from 'react'

const StatsTab = ({ statsYear, setStatsYear, yearlyUsageStats }) => {
  return (
    <div className="space-y-6 animate-in">
      <div className="bg-white p-6 rounded-2xl border shadow-sm flex items-center gap-4">
        <label className="font-bold text-slate-600">統計年份：</label>
        <select value={statsYear} onChange={e => setStatsYear(e.target.value)} className="p-2 px-4 border rounded-xl font-bold bg-slate-50 cursor-pointer outline-none shadow-sm">
          <option value="2026">2026 年</option>
          <option value="2025">2025 年</option>
        </select>
      </div>
      <div className="bg-white rounded-2xl border shadow-sm overflow-x-auto text-[11px]">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="bg-slate-100 text-slate-500 font-bold border-b">
            <tr>
              <th className="p-3 sticky left-0 bg-slate-100 z-10 border-r">項目名稱</th>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => <th key={m} className="p-3 text-center">{m}月</th>)}
              <th className="p-3 text-center font-bold text-blue-700 bg-blue-50">總計</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {yearlyUsageStats.map(({ item, months, total }) => (
              <tr key={item.id} className="hover:bg-slate-50 transition">
                <td className="p-3 font-bold sticky left-0 bg-white border-r">{item.name}</td>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => <td key={m} className={`p-3 text-center ${months[m] > 0 ? 'font-bold text-slate-700' : 'text-slate-300'}`}>{months[m] > 0 ? months[m] : '-'}</td>)}
                <td className="p-3 text-center font-bold text-blue-600 bg-blue-50/50">{total > 0 ? total : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default StatsTab
