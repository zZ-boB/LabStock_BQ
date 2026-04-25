import React from 'react'
import { Users, Pencil, X, Phone, Mail } from 'lucide-react'

const VendorsTab = ({ vendors, setVendorForm, setShowVendorModal, handleDeleteVendor }) => {
  return (
    <div className="space-y-6 animate-in">
      <div className="flex justify-end">
        <button onClick={() => { setVendorForm({ id: null, company: '', name: '', phone: '', email: '', note: '' }); setShowVendorModal(true); }} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition active:scale-95">新增廠商聯絡</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vendors.map(v => (
          <div key={v.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm relative transition hover:shadow-md">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-blue-100 text-blue-700 p-3 rounded-2xl"><Users size={24} /></div>
              <div className="flex gap-1">
                <button onClick={() => { setVendorForm(v); setShowVendorModal(true); }} className="text-slate-300 hover:text-blue-600 p-2"><Pencil size={18} /></button>
                <button onClick={() => handleDeleteVendor(v.id)} className="text-slate-300 hover:text-red-500 p-2"><X size={18} /></button>
              </div>
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-1">{v.company}</h3>
            <p className="text-blue-600 font-bold mb-4">{v.name || '尚未填寫姓名'}</p>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-slate-500 font-medium"><Phone size={14} /> {v.phone || '-'}</div>
              <div className="flex items-center gap-3 text-slate-500 font-medium"><Mail size={14} /> {v.email || '-'}</div>
              {v.note && <div className="mt-4 p-3 bg-slate-50 rounded-xl text-xs text-slate-400 italic">"{v.note}"</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default VendorsTab
