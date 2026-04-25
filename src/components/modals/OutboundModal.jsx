import React from 'react'
import { X } from 'lucide-react'
import { getActiveBatches } from '../../utils/helpers'

const OutboundModal = ({ inventory, outboundForm, setOutboundForm, onSubmit, onClose }) => {
  const item = inventory.find(i => i.id == outboundForm.itemId)
  const activeB = getActiveBatches(item?.batches)

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in">
        <div className="p-6 border-b flex justify-between items-center bg-slate-50 font-bold text-slate-800">出庫作業 <button onClick={onClose}><X size={20} /></button></div>
        <form onSubmit={onSubmit} className="p-6 space-y-5">
          <div><label className="text-[10px] font-extrabold text-slate-400 block mb-1 uppercase">項目</label><input type="text" disabled className="w-full p-3 border rounded-xl bg-slate-50 font-bold text-slate-400" value={item?.name} /></div>
          <div><label className="text-[10px] font-extrabold block mb-1 uppercase">批號 (FEFO 自動)</label>
            <select className="w-full p-3 border rounded-xl font-bold text-blue-700 outline-none" value={outboundForm.batchId} onChange={e => setOutboundForm({ ...outboundForm, batchId: e.target.value })}>
              {activeB.map(b => <option key={b.id} value={b.id}>{b.batchNo} (餘: {b.qty} / 效: {b.expiry})</option>)}
            </select>
          </div>
          <div><label className="text-[10px] font-extrabold block mb-1 uppercase">數量 ({item?.unit})</label><input type="number" min="1" className="w-full p-3 border rounded-xl font-bold outline-none" value={outboundForm.qty} onChange={e => setOutboundForm({ ...outboundForm, qty: Number(e.target.value) })} /></div>
          <button type="submit" className="w-full py-4 bg-rose-600 text-white rounded-2xl font-bold shadow-xl hover:bg-rose-700 transition active:scale-95">確認扣庫</button>
        </form>
      </div>
    </div>
  )
}

export default OutboundModal
