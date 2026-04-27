import { Trash2 } from 'lucide-react'

const HistoryTab = ({ history, inventory, userRole, onDelete }) => {
  return (
    <div className="bg-white rounded-2xl border shadow-sm overflow-hidden text-base animate-in">
      <table className="w-full text-left">
        <thead className="bg-slate-50 border-b font-bold text-slate-400 tracking-widest text-xs uppercase">
          <tr><th className="p-4 text-center">時間</th><th className="p-4">品項</th><th className="p-4 text-center">動作</th><th className="p-4 text-center">變動</th><th className="p-4 text-center">批號</th>{userRole === 'admin' && <th className="p-4 text-center">管理</th>}</tr>
        </thead>
        <tbody className="divide-y text-slate-600">
          {history.map((log, idx) => {
            const item = inventory.find(i => i.id == log.itemId)
            return (
              <tr key={idx} className="hover:bg-slate-50 transition">
                <td className="p-4 font-mono text-sm text-slate-400 text-center">{log.date}</td>
                <td className="p-4 font-bold text-slate-800 text-lg">{item?.name || '已刪除項目'}</td>
                <td className="p-4 text-center"><span className={`px-3 py-1 rounded text-xs font-bold ${log.type === '入庫' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>{log.type}</span></td>
                <td className="p-4 text-center font-bold text-slate-800 text-lg">{log.change}</td>
                <td className="p-4 text-center font-mono text-sm">{log.batchNo}</td>
                {userRole === 'admin' && (
                  <td className="p-4 text-center">
                    <button onClick={() => onDelete(log.id)} className="text-slate-300 hover:text-rose-500 transition p-2"><Trash2 size={18} /></button>
                  </td>
                )}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default HistoryTab
