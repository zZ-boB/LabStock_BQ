import React from 'react'
import { Bell, Calendar, PlusCircle, MinusCircle, MessageSquare, X } from 'lucide-react'
import { getTotalQty, getActiveBatches, getDefaultDate } from '../../utils/helpers'

const InventoryTab = ({
  inventory, alerts, activeSubTab, setActiveSubTab, searchTerm,
  setInboundForm, setShowInboundModal, setOutboundForm, setShowOutboundModal,
  notices, noticeInput, setNoticeInput, onAddNotice, onDeleteNotice
}) => {
  return (
    <div className="space-y-6 animate-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-5 rounded-2xl border-l-4 border-l-rose-500 shadow-sm">
          <h3 className="text-rose-600 font-bold flex items-center gap-2 mb-3"><Bell size={18} /> 訂貨提醒 ({alerts.lowStock.length})</h3>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {alerts.lowStock.map(item => (
              <div key={item.id} className="flex justify-between text-sm p-2 bg-rose-50 rounded-lg">
                <span className="font-bold">{item.name}</span>
                <span className="text-rose-600 font-bold font-mono">{getTotalQty(item.batches)} / {item.minQty}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border-l-4 border-l-amber-500 shadow-sm">
          <h3 className="text-amber-600 font-bold flex items-center gap-2 mb-3"><Calendar size={18} /> 效期預警 ({alerts.expiringSoon.length})</h3>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {alerts.expiringSoon.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm p-2 bg-amber-50 rounded-lg">
                <span className="font-bold">{item.name} <span className="text-[10px] text-slate-400 font-normal">({item.batchNo})</span></span>
                <span className="text-amber-600 font-bold font-mono">{item.expiry}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border-l-4 border-l-sky-500 shadow-sm">
          <h3 className="text-sky-600 font-bold flex items-center gap-2 mb-3"><MessageSquare size={18} /> 望周知</h3>
          <div className="space-y-2 max-h-24 overflow-y-auto mb-3">
            {notices.map(notice => (
              <div key={notice.id} className="flex justify-between items-start text-xs p-2 bg-sky-50 rounded-lg group">
                <div>
                  <p className="font-bold text-slate-700">{notice.text}</p>
                  <p className="text-[9px] text-sky-400 mt-1">{notice.date}</p>
                </div>
                <button onClick={() => onDeleteNotice(notice.id)} className="text-rose-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition"><X size={12} /></button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="輸入公告..." 
              className="flex-1 text-xs p-2 border rounded-lg outline-none focus:ring-1 focus:ring-sky-500" 
              value={noticeInput} 
              onChange={e => setNoticeInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && onAddNotice()}
            />
            <button onClick={onAddNotice} className="bg-sky-500 text-white p-2 rounded-lg hover:bg-sky-600 transition">
              <PlusCircle size={14} />
            </button>
          </div>
        </div>
      </div>
      <div className="flex gap-2 mb-4 bg-slate-200 p-1 w-fit rounded-xl font-bold text-xs shadow-inner">
        {['Media/REAG.', 'CONS.'].map(t => (
          <button key={t} onClick={() => setActiveSubTab(t)} className={`px-6 py-2 rounded-lg transition ${activeSubTab === t ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>{t}</button>
        ))}
      </div>
      <div className="bg-white rounded-2xl border shadow-sm overflow-x-auto">
        <table className="w-full table-fixed text-left" style={{ minWidth: '600px' }}>
          <thead className="bg-slate-50 border-b text-slate-500 text-sm font-bold uppercase tracking-wider text-[10px]">
            <tr><th className="p-5" style={{ width: '50%' }}>項目</th><th className="p-5" style={{ width: '25%' }}>當前庫存</th><th className="p-5 text-center" style={{ width: '25%' }}>操作</th></tr>
          </thead>
          <tbody className="divide-y text-sm">
            {inventory.filter(i => i.category === activeSubTab && i.name.toLowerCase().includes(searchTerm.toLowerCase())).map(item => {
              const qty = getTotalQty(item.batches)
              return (
                <tr key={item.id} className="hover:bg-slate-50 transition border-b border-slate-100 last:border-0">
                  <td className="p-4 md:p-5 whitespace-nowrap overflow-hidden text-ellipsis">
                    <div className="text-lg md:text-xl font-black text-slate-800">{item.name}</div>
                    <div className="text-[10px] text-slate-400 font-medium uppercase tracking-widest mt-1">{item.vendor}</div>
                  </td>
                  <td className="p-4 md:p-5 whitespace-nowrap">
                    <span className={`px-3 py-1.5 md:px-4 md:py-2 rounded-xl font-black text-base md:text-lg shadow-sm inline-block ${qty <= item.minQty ? 'bg-rose-100 text-rose-600 border border-rose-200' : 'bg-emerald-100 text-emerald-700 border border-emerald-200'}`}>
                      {qty} <span className="text-[9px] md:text-[10px] uppercase ml-1 font-bold">{item.unit}</span>
                    </span>
                  </td>
                  <td className="p-5 text-center">
                    <div className="flex justify-center gap-3">
                      <button onClick={() => { setInboundForm({ itemId: item.id, batchNo: '', packageQty: 1, unitsPerPackage: 1, expiry: '', invoiceDate: getDefaultDate() }); setShowInboundModal(true); }} className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-600 hover:text-white transition"><PlusCircle size={18} /></button>
                      <button onClick={() => { const b = getActiveBatches(item.batches); if (b.length > 0) { setOutboundForm({ itemId: item.id, batchId: b[0].id, qty: 1 }); setShowOutboundModal(true); } }} disabled={qty === 0} className="p-2 text-rose-600 bg-rose-50 rounded-lg disabled:opacity-20 transition"><MinusCircle size={18} /></button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default InventoryTab
