import React from 'react'
import { X, DollarSign } from 'lucide-react'

const ItemModal = ({ itemForm, setItemForm, onSubmit, onClose }) => {
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in">
        <div className="p-6 border-b flex justify-between items-center bg-slate-50 font-bold text-slate-800">品項設定 <button onClick={onClose}><X size={20} /></button></div>
        <form onSubmit={onSubmit} className="p-6 space-y-5 font-sans">
          <div className="flex gap-2 bg-slate-100 p-1 rounded-xl">
            {['Media/REAG.', 'CONS.'].map(cat => (
              <button type="button" key={cat} onClick={() => setItemForm({ ...itemForm, category: cat })} className={`flex-1 py-2 rounded-lg font-bold text-sm transition ${itemForm.category === cat ? 'bg-blue-600 text-white shadow' : 'text-slate-500'}`}>{cat}</button>
            ))}
          </div>
          <div><label className="text-[10px] font-extrabold block mb-1 uppercase">名稱</label><input type="text" required className="w-full p-3 border rounded-xl font-bold outline-none" value={itemForm.name} onChange={e => setItemForm({ ...itemForm, name: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-[10px] font-extrabold block mb-1 uppercase">廠牌-訂貨商</label><input type="text" required className="w-full p-3 border rounded-xl font-bold" value={itemForm.vendor} onChange={e => setItemForm({ ...itemForm, vendor: e.target.value })} /></div>
            <div><label className="text-[10px] font-extrabold block mb-1 uppercase">單位</label><input type="text" required className="w-full p-3 border rounded-xl font-bold" value={itemForm.unit} onChange={e => setItemForm({ ...itemForm, unit: e.target.value })} /></div>
          </div>
          <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
            <label className="text-[10px] font-extrabold block mb-2 text-blue-800 uppercase flex items-center gap-1"><DollarSign size={14} /> 報帳用單價 (NT$)</label>
            <input type="number" required className="w-full p-3 border border-blue-200 rounded-xl font-bold text-blue-700 bg-white font-mono outline-none" value={itemForm.unitPrice} onChange={e => setItemForm({ ...itemForm, unitPrice: e.target.value })} />
          </div>
          <div><label className="text-[10px] font-extrabold block mb-1 uppercase text-rose-600">安全存量</label><input type="number" required min="0" className="w-full p-3 border border-rose-100 rounded-xl text-rose-500 font-bold bg-rose-50/20 outline-none" value={itemForm.minQty} onChange={e => setItemForm({ ...itemForm, minQty: Number(e.target.value) })} /></div>
          <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-xl hover:bg-blue-700 transition active:scale-95">儲存變更</button>
        </form>
      </div>
    </div>
  )
}

export default ItemModal
