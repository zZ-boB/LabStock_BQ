import React from 'react'
import { X } from 'lucide-react'

const InboundModal = ({ inventory, inboundForm, setInboundForm, onSubmit, onClose }) => {
  const item = inventory.find(i => i.id == inboundForm.itemId)
  const totalInbound = Number(inboundForm.packageQty || 0) * Number(inboundForm.unitsPerPackage || 0)

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in font-sans">
        <div className="p-6 border-b flex justify-between items-center bg-slate-50 font-bold">
          進貨登記 <button onClick={onClose}><X size={20} /></button>
        </div>
        <form onSubmit={onSubmit} className="p-6 space-y-5">
          <div>
            <label className="text-[10px] font-extrabold text-slate-400 block mb-1 uppercase tracking-widest">品項名稱</label>
            <input type="text" disabled className="w-full p-3 border rounded-xl bg-slate-50 font-bold text-slate-400" value={item?.name || ''} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-extrabold block mb-1 uppercase tracking-widest">批號</label>
              <input type="text" required className="w-full p-3 border rounded-xl font-mono uppercase font-bold focus:ring-2 focus:ring-blue-500 outline-none shadow-sm" value={inboundForm.batchNo} onChange={e => setInboundForm({ ...inboundForm, batchNo: e.target.value.toUpperCase() })} />
            </div>
            <div>
              <label className="text-[10px] font-extrabold block mb-1 uppercase tracking-widest">發票日期</label>
              <input type="text" required placeholder="YYYY/MM/DD" className="w-full p-3 border rounded-xl font-bold bg-blue-50 border-blue-100 outline-none shadow-sm" value={inboundForm.invoiceDate} onChange={e => setInboundForm({ ...inboundForm, invoiceDate: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-extrabold block mb-1 uppercase tracking-widest">進貨箱數</label>
              <input type="number" required min="1" className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 shadow-sm" value={inboundForm.packageQty} onChange={e => setInboundForm({ ...inboundForm, packageQty: e.target.value })} />
            </div>
            <div>
              <label className="text-[10px] font-extrabold block mb-1 uppercase tracking-widest">每箱數量 ({item?.unit})</label>
              <input type="number" required min="1" className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 shadow-sm" value={inboundForm.unitsPerPackage} onChange={e => setInboundForm({ ...inboundForm, unitsPerPackage: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-extrabold block mb-1 uppercase tracking-widest">有效期限 (YYYY/MM/DD)</label>
            <input type="text" required placeholder="YYYY/MM/DD" className="w-full p-3 border rounded-xl font-bold focus:ring-2 focus:ring-blue-500 outline-none shadow-sm" value={inboundForm.expiry} onChange={e => setInboundForm({ ...inboundForm, expiry: e.target.value })} />
          </div>
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex justify-between items-center">
            <span className="text-blue-800 text-xs font-bold">預計入庫總數：</span>
            <span className="text-blue-600 font-black text-lg">{totalInbound} {item?.unit}</span>
          </div>
          <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-xl hover:bg-blue-700 transition active:scale-[0.98]">
            確認入庫登記
          </button>
        </form>
      </div>
    </div>
  )
}

export default InboundModal
