import React from 'react'
import { Pencil, Trash2 } from 'lucide-react'

const SettingsTab = ({ inventory, activeSubTab, setActiveSubTab, setItemForm, setShowItemModal, userRole, onDeleteItem }) => {
  return (
    <div className="space-y-6 animate-in">
      <div className="flex justify-end"><button onClick={() => { setItemForm({ id: null, name: '', vendor: '', minQty: 1, category: activeSubTab, unit: '個', unitPrice: '' }); setShowItemModal(true); }} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition active:scale-95">新增品項</button></div>
      <div className="flex gap-2 mb-4 bg-slate-200 p-1 w-fit rounded-xl font-bold text-sm shadow-inner">
        {['Media/REAG.', 'CONS.'].map(t => (
          <button key={t} onClick={() => setActiveSubTab(t)} className={`px-6 py-2 rounded-lg transition ${activeSubTab === t ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>{t}</button>
        ))}
      </div>
      <div className="bg-white rounded-2xl border shadow-sm overflow-x-auto text-base font-medium">
        <table className="w-full table-fixed text-left" style={{ minWidth: '700px' }}>
          <thead className="bg-slate-50 border-b font-bold text-slate-500 uppercase text-xs">
            <tr><th className="p-4 whitespace-nowrap" style={{ width: '30%' }}>項目名稱</th><th className="p-4 whitespace-nowrap" style={{ width: '25%' }}>廠牌-訂貨商</th><th className="p-4 whitespace-nowrap" style={{ width: '15%' }}>單位</th><th className="p-4 text-right whitespace-nowrap" style={{ width: '15%' }}>基準單價</th><th className="p-4 text-center whitespace-nowrap" style={{ width: '15%' }}>操作</th></tr>
          </thead>
          <tbody className="divide-y text-slate-600">
            {inventory.filter(i => i.category === activeSubTab).map(item => (
              <tr key={item.id} className="hover:bg-slate-50 transition">
                <td className="p-4 font-bold text-slate-800 whitespace-nowrap overflow-hidden text-ellipsis">{item.name}</td>
                <td className="p-4 whitespace-nowrap overflow-hidden text-ellipsis">{item.vendor}</td>
                <td className="p-4 text-sm font-bold text-slate-400 whitespace-nowrap">{item.unit}</td>
                <td className="p-4 text-right text-blue-600 font-bold font-mono whitespace-nowrap">$ {item.unitPrice.toLocaleString()}</td>
                <td className="p-4 text-center whitespace-nowrap">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => { setItemForm({ ...item, unitPrice: String(item.unitPrice) }); setShowItemModal(true); }} className="text-slate-300 hover:text-blue-600 transition p-2"><Pencil size={18} /></button>
                    {userRole === 'admin' && <button onClick={() => onDeleteItem(item.id)} className="text-slate-200 hover:text-rose-500 transition p-2"><Trash2 size={18} /></button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default SettingsTab
