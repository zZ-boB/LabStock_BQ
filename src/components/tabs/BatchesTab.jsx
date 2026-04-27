import React from 'react'
import { Search } from 'lucide-react'
import { getActiveBatches, getTotalQty } from '../../utils/helpers'

const BatchesTab = ({
  inventory, activeSubTab, setActiveSubTab, searchTerm,
  traceDate, setTraceDate, traceRecords
}) => {
  return (
    <div className="space-y-10 animate-in">
      {/* 1. 療程使用批號即時追蹤 (搜尋功能) */}
      <div className="space-y-4">
        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm">
          <h3 className="font-bold text-blue-800 flex items-center gap-2 text-lg"><Search size={22} /> 療程使用批號即時追蹤</h3>
          <div className="flex items-center gap-3">
            <span className="text-blue-600 text-sm font-bold">查詢日期:</span>
            <input type="text" value={traceDate} onChange={e => setTraceDate(e.target.value)} placeholder="YYYY/MM/DD" className="p-2 px-4 rounded-xl border border-blue-200 outline-none font-bold text-blue-800 bg-white shadow-sm focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-2xl border shadow-sm overflow-x-auto text-base">
          <table className="w-full table-fixed text-left" style={{ minWidth: '500px' }}>
            <thead className="bg-blue-50/50 text-blue-800 font-bold border-b text-sm">
              <tr><th className="p-3 px-6 whitespace-nowrap" style={{ width: '34%' }}>項目名稱</th><th className="p-3 text-center whitespace-nowrap" style={{ width: '33%' }}>該日使用批號</th><th className="p-3 text-center whitespace-nowrap" style={{ width: '33%' }}>啟用日期</th></tr>
            </thead>
            <tbody className="divide-y font-medium text-slate-700">
              {traceRecords.map(r => (
                <tr key={r.id} className="hover:bg-blue-50/10 transition">
                  <td className="p-3 px-6 font-bold text-lg whitespace-nowrap overflow-hidden text-ellipsis">{r.itemName}</td>
                  <td className="p-3 font-mono text-blue-700 font-bold text-center text-lg whitespace-nowrap overflow-hidden text-ellipsis">{r.batchNo}</td>
                  <td className="p-3 text-slate-400 font-mono text-sm text-center whitespace-nowrap overflow-hidden text-ellipsis">{r.startDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex gap-2 mb-4 bg-slate-200 p-1 w-fit rounded-xl font-bold text-sm shadow-inner">
        {['Media/REAG.', 'CONS.'].map(t => (
          <button key={t} onClick={() => setActiveSubTab(t)} className={`px-6 py-2 rounded-lg transition ${activeSubTab === t ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>{t}</button>
        ))}
      </div>

      {/* 2. 當前庫存與優先使用批號 (FEFO) */}
      <div className="space-y-8 pt-6 border-t border-slate-100">
        <header className="px-2">
          <h2 className="text-2xl font-bold text-slate-800">各品項當前批號狀態</h2>
          <p className="text-sm text-slate-400 mt-1 italic">藍色為優先消耗 (FEFO)，灰色為備用庫存</p>
        </header>

        <div className="space-y-12">
          {inventory.filter(i => i.category === activeSubTab && i.name.toLowerCase().includes(searchTerm.toLowerCase())).map(item => {
            const activeB = getActiveBatches(item.batches)
            const totalQty = getTotalQty(item.batches)

            return (
              <div key={item.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative transition hover:shadow-md">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-3xl font-black text-slate-800 tracking-tight">{item.name}</h3>
                    <span className="text-slate-400 text-sm font-medium uppercase tracking-widest">({item.vendor})</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Total Stock</div>
                    <div className="bg-slate-900 text-white px-5 py-2 rounded-2xl text-base font-black shadow-lg">
                      {totalQty} <span className="text-slate-500 text-sm font-normal ml-1">{item.unit}</span>
                    </div>
                  </div>
                </div>

                {activeB.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {activeB.map((batch, idx) => {
                      const isFEFO = idx === 0
                      return (
                        <div key={batch.id} className={`p-6 rounded-3xl border-2 transition relative flex flex-col justify-between h-52 ${isFEFO ? 'border-blue-500 bg-blue-50/40 shadow-sm' : 'border-slate-100 bg-slate-50/50 hover:bg-white hover:border-slate-200'}`}>
                          {isFEFO && <div className="absolute -top-3 -right-3 bg-blue-600 text-white px-3 py-1 text-xs font-black rounded-lg shadow-md uppercase tracking-tighter z-10">Priority</div>}

                          <div>
                            <div className={`${isFEFO ? 'text-blue-600' : 'text-slate-400'} font-black text-xs mb-4 uppercase tracking-widest flex items-center gap-2`}>
                              {isFEFO && <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>}
                              {isFEFO ? '優先消耗 (FEFO)' : '備用批次'}
                            </div>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center border-b border-black/5 pb-2">
                                <span className="text-slate-400 text-xs font-black uppercase">Batch No</span>
                                <span className="text-slate-800 font-black font-mono text-xl">{batch.batchNo}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-slate-400 text-xs font-black uppercase">Expiry</span>
                                <span className={`${isFEFO ? 'text-rose-600' : 'text-slate-500'} font-black font-mono text-xl`}>{batch.expiry}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-between items-end mt-4">
                            <span className="text-slate-400 text-xs font-black uppercase mb-1">Remaining</span>
                            <div className={`${isFEFO ? 'text-blue-700' : 'text-slate-700'} text-3xl font-black font-mono leading-none`}>
                              {batch.qty}
                              <span className="text-xs font-bold ml-1 uppercase">{item.unit}</span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="bg-slate-50 p-12 rounded-[2rem] border border-dashed border-slate-200 text-slate-400 text-center italic font-medium">目前無任何可用庫存批號</div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default BatchesTab
