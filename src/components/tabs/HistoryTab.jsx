import React from 'react'

const HistoryTab = ({ history, inventory }) => {
  return (
    <div className="bg-white rounded-2xl border shadow-sm overflow-hidden text-sm animate-in">
      <table className="w-full text-left">
        <thead className="bg-slate-50 border-b font-bold text-slate-400 tracking-widest text-[10px] uppercase">
          <tr><th className="p-4 text-center">時間</th><th className="p-4">品項</th><th className="p-4 text-center">動作</th><th className="p-4 text-center">變動</th><th className="p-4 text-center">批號</th></tr>
        </thead>
        <tbody className="divide-y text-slate-600">
          {history.map((log, idx) => {
            const item = inventory.find(i => i.id == log.itemId)
            return (
              <tr key={idx} className="hover:bg-slate-50 transition">
                <td className="p-4 font-mono text-xs text-slate-400 text-center">{log.date}</td>
                <td className="p-4 font-bold text-slate-800">{item?.name || '已刪除項目'}</td>
                <td className="p-4 text-center"><span className={`px-2 py-0.5 rounded text-[10px] font-bold ${log.type === '入庫' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>{log.type}</span></td>
                <td className="p-4 text-center font-bold text-slate-800">{log.change}</td>
                <td className="p-4 text-center font-mono text-xs">{log.batchNo}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default HistoryTab
