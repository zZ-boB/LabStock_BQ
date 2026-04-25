import React from 'react'
import { FileText } from 'lucide-react'

const PurchaseTab = ({ purchaseMonth, setPurchaseMonth, monthOptions, purchaseReport, handleExportExcel }) => {
  return (
    <div className="space-y-6 animate-in">
      <div className="bg-white p-6 rounded-2xl border shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <label className="font-bold text-slate-600">月份：</label>
          <select value={purchaseMonth} onChange={e => setPurchaseMonth(e.target.value)} className="p-2 px-4 border rounded-xl font-bold bg-slate-50 shadow-sm cursor-pointer outline-none">{monthOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}</select>
        </div>
        <div className="flex items-center gap-6">
          <button onClick={handleExportExcel} className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-3 rounded-xl font-bold shadow-lg hover:bg-emerald-700 transition active:scale-95 text-sm">
            <FileText size={18} /> 匯出 Excel 報表
          </button>
          <div className="text-right">
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Total Spend</p>
            <h3 className="text-3xl font-extrabold text-blue-600 font-mono">NT$ {purchaseReport.totalMonthSpend.toLocaleString()}</h3>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl border shadow-sm overflow-x-auto text-sm font-medium">
        <table className="w-full text-left font-sans">
          <thead className="bg-slate-50 border-b text-slate-400 font-bold uppercase text-[10px]">
            <tr><th className="p-4">發票日期</th><th className="p-4">品項</th><th className="p-4 text-center">數量</th><th className="p-4 text-right">單價</th><th className="p-4 text-right">小計</th></tr>
          </thead>
          <tbody className="divide-y">
            {purchaseReport.records.map((r, idx) => (
              <tr key={idx} className="hover:bg-slate-50 transition">
                <td className="p-4 font-mono text-xs text-slate-400">{r.invoiceDate}</td>
                <td className="p-4 font-bold text-slate-800">{r.itemName} <span className="text-[10px] text-slate-400 font-normal">({r.vendor})</span></td>
                <td className="p-4 text-center text-blue-600 font-bold">{r.change} {r.unit}</td>
                <td className="p-4 text-right font-mono text-slate-500">$ {r.unitPrice?.toLocaleString()}</td>
                <td className="p-4 text-right font-bold text-blue-600 font-mono">$ {r.totalPrice.toLocaleString()}</td>
              </tr>
            ))}
            {purchaseReport.records.length === 0 && <tr><td colSpan="5" className="p-16 text-center text-slate-300 italic">無進貨紀錄</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default PurchaseTab
