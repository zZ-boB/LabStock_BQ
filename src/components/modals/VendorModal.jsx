import React from 'react'
import { X } from 'lucide-react'

const VendorModal = ({ vendorForm, setVendorForm, onSubmit, onClose }) => {
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in">
        <div className="p-6 border-b flex justify-between items-center bg-slate-50 font-bold text-slate-800">廠商資訊設定 <button onClick={onClose}><X size={20} /></button></div>
        <form onSubmit={onSubmit} className="p-6 space-y-5 font-sans">
          <div><label className="text-[10px] font-extrabold block mb-1 uppercase">廠商公司名稱</label><input type="text" required className="w-full p-3 border rounded-xl font-bold outline-none" value={vendorForm.company} onChange={e => setVendorForm({ ...vendorForm, company: e.target.value })} /></div>
          <div><label className="text-[10px] font-extrabold block mb-1 uppercase">業務姓名</label><input type="text" className="w-full p-3 border rounded-xl font-bold outline-none" value={vendorForm.name} onChange={e => setVendorForm({ ...vendorForm, name: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-[10px] font-extrabold block mb-1 uppercase">聯絡電話</label><input type="text" className="w-full p-3 border rounded-xl font-bold" value={vendorForm.phone} onChange={e => setVendorForm({ ...vendorForm, phone: e.target.value })} /></div>
            <div><label className="text-[10px] font-extrabold block mb-1 uppercase">Email</label><input type="email" className="w-full p-3 border rounded-xl font-bold" value={vendorForm.email} onChange={e => setVendorForm({ ...vendorForm, email: e.target.value })} /></div>
          </div>
          <div><label className="text-[10px] font-extrabold block mb-1 uppercase text-slate-400">備註事項</label><textarea className="w-full p-3 border rounded-xl text-slate-600 font-medium bg-slate-50 outline-none" rows="3" value={vendorForm.note} onChange={e => setVendorForm({ ...vendorForm, note: e.target.value })}></textarea></div>
          <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-xl hover:bg-blue-700 transition active:scale-95">儲存廠商資訊</button>
        </form>
      </div>
    </div>
  )
}

export default VendorModal
