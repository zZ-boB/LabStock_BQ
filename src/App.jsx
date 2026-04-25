import React, { useState, useMemo, useEffect } from 'react'
import * as XLSX from 'xlsx'
import { supabaseClient } from './config/supabase'
import { initialInventory, initialVendors } from './data/initialData'
import { formatDateTime, getTotalQty, getActiveBatches, getDefaultDate, getDefaultMonth } from './utils/helpers'
import LoginPage from './components/LoginPage'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import InventoryTab from './components/tabs/InventoryTab'
import BatchesTab from './components/tabs/BatchesTab'
import HistoryTab from './components/tabs/HistoryTab'
import StatsTab from './components/tabs/StatsTab'
import PurchaseTab from './components/tabs/PurchaseTab'
import VendorsTab from './components/tabs/VendorsTab'
import SettingsTab from './components/tabs/SettingsTab'
import InboundModal from './components/modals/InboundModal'
import OutboundModal from './components/modals/OutboundModal'
import ItemModal from './components/modals/ItemModal'
import VendorModal from './components/modals/VendorModal'

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [activeTab, setActiveTab] = useState('inventory')
  const [activeSubTab, setActiveSubTab] = useState('Media/REAG.')
  const [isCloudLoading, setIsCloudLoading] = useState(true)

  // --- 資料狀態 ---
  const [inventory, setInventory] = useState(initialInventory)
  const [vendors, setVendors] = useState(initialVendors)
  const [history, setHistory] = useState([])
  const [notices, setNotices] = useState([
    { id: 1, text: "歡迎使用 LabStockTrack_BQ 系統！", date: "2026/04/25" }
  ])
  const [noticeInput, setNoticeInput] = useState('')

  // --- 雲端載入 ---
  const fetchCloudData = async (silent = false) => {
    if (!silent) setIsCloudLoading(true)
    try {
      const { data: inv } = await supabaseClient.from('inventory').select('*')
      if (inv) setInventory(inv)

      const { data: ven } = await supabaseClient.from('vendors').select('*')
      if (ven) setVendors(ven)

      const { data: his } = await supabaseClient.from('history').select('*').order('date', { ascending: false }).limit(200)
      if (his) setHistory(his)

      const { data: nts } = await supabaseClient.from('notices').select('*').order('date', { ascending: false })
      if (nts) setNotices(nts)
    } catch (error) {
      console.error("雲端載入失敗:", error)
    } finally {
      if (!silent) setIsCloudLoading(false)
    }
  }

  useEffect(() => {
    fetchCloudData()
  }, [])

  // --- 雲端即時更新 (Realtime) ---
  useEffect(() => {
    const channel = supabaseClient
      .channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'inventory' }, () => fetchCloudData(true))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'vendors' }, () => fetchCloudData(true))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'history' }, () => fetchCloudData(true))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notices' }, () => fetchCloudData(true))
      .subscribe()

    return () => {
      supabaseClient.removeChannel(channel)
    }
  }, [])

  // --- 雲端儲存 ---
  const syncInventoryToCloud = async (newData) => {
    const { error } = await supabaseClient.from('inventory').upsert(newData)
    if (error) console.error("同步庫存失敗:", error)
  }

  const syncHistoryToCloud = async (newLog) => {
    const { error } = await supabaseClient.from('history').insert(newLog)
    if (error) console.error("同步紀錄失敗:", error)
  }

  const syncVendorsToCloud = async (newData) => {
    const { error } = await supabaseClient.from('vendors').upsert(newData)
    if (error) console.error("同步廠商失敗:", error)
  }

  const syncNoticesToCloud = async (newNotices) => {
    const { error } = await supabaseClient.from('notices').upsert(newNotices)
    if (error) console.error("同步公告失敗:", error)
  }

  const handleAddNotice = async () => {
    if (!noticeInput.trim()) return
    const newNotice = { text: noticeInput, date: formatDateTime().split(' ')[0] }
    setNoticeInput('')
    const { error } = await supabaseClient.from('notices').insert(newNotice)
    if (error) console.error("同步公告失敗:", error)
  }

  const handleDeleteNotice = async (id) => {
    const { error } = await supabaseClient.from('notices').delete().eq('id', id)
    if (error) console.error("刪除公告失敗:", error)
  }

  const [searchTerm, setSearchTerm] = useState('')
  const [traceDate, setTraceDate] = useState(getDefaultDate())
  const [purchaseMonth, setPurchaseMonth] = useState(getDefaultMonth())
  const [statsYear, setStatsYear] = useState(new Date().getFullYear().toString())

  const monthOptions = useMemo(() => {
    const options = []
    for (let y = 2027; y >= 2025; y--) {
      for (let m = 12; m >= 1; m--) {
        const monthStr = String(m).padStart(2, '0')
        options.push({ value: y + '/' + monthStr, label: y + ' 年 ' + monthStr + ' 月' })
      }
    }
    return options
  }, [])

  const [showInboundModal, setShowInboundModal] = useState(false)
  const [inboundForm, setInboundForm] = useState({ itemId: null, batchNo: '', packageQty: 1, unitsPerPackage: 1, expiry: '', invoiceDate: '' })
  const [showOutboundModal, setShowOutboundModal] = useState(false)
  const [outboundForm, setOutboundForm] = useState({ itemId: null, batchId: '', qty: 1 })
  const [showItemModal, setShowItemModal] = useState(false)
  const [itemForm, setItemForm] = useState({ id: null, name: '', vendor: '', minQty: 1, category: 'Media/REAG.', unit: '個', unitPrice: '' })

  const purchaseReport = useMemo(() => {
    const records = (history || [])
      .filter(log => log.type === "入庫" && log.invoiceDate && log.invoiceDate.startsWith(purchaseMonth))
      .map(log => {
        const item = inventory.find(i => i.id == log.itemId)
        const qty = parseInt(String(log.change || '0').replace('+', '')) || 0
        const price = item ? (Number(item.unitPrice) || 0) * qty : 0
        return { ...log, itemName: item?.name, vendor: item?.vendor, unit: item?.unit, unitPrice: item?.unitPrice, totalPrice: price }
      })
    return { records, totalMonthSpend: records.reduce((sum, r) => sum + (Number(r.totalPrice) || 0), 0) }
  }, [history, inventory, purchaseMonth])

  const traceRecords = useMemo(() => {
    if (!traceDate) return []
    const targetDateEnd = traceDate + " 23:59:59"
    return inventory.filter(i => i.category === activeSubTab).map(item => {
      const outLogs = (history || []).filter(log => log.itemId == item.id && log.type === "出庫" && log.date && log.date <= targetDateEnd)
      outLogs.sort((a, b) => new Date(String(b.date || '').replace(/-/g, '/')) - new Date(String(a.date || '').replace(/-/g, '/')))
      const recentLog = outLogs[0]
      return { id: item.id, itemName: item.name, vendor: item.vendor, batchNo: recentLog ? recentLog.batchNo : '尚未啟用', startDate: recentLog ? String(recentLog.date || '').split(' ')[0] : '-' }
    })
  }, [history, traceDate, inventory, activeSubTab])

  const yearlyUsageStats = useMemo(() => {
    const data = {}
    inventory.forEach(i => { data[i.id] = { item: i, months: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0 }, total: 0 } })
    history.forEach(log => {
      if (log.type === "出庫" && log.date && log.date.startsWith(statsYear)) {
        var month = parseInt(log.date.substring(5, 7), 10)
        var qty = Math.abs(parseInt(String(log.change || '0'))) || 0
        if (data[log.itemId] && !isNaN(month)) { data[log.itemId].months[month] += qty; data[log.itemId].total += qty }
      }
    })
    return Object.values(data).sort((a, b) => (a.item.category || '').localeCompare(b.item.category || ''))
  }, [history, inventory, statsYear])

  const alerts = useMemo(() => {
    const today = new Date(); today.setHours(0, 0, 0, 0)
    const thirtyLater = new Date(today); thirtyLater.setDate(today.getDate() + 30)
    const lowStock = inventory.filter(item => getTotalQty(item.batches) <= item.minQty)
    const expiringSoon = []
    inventory.forEach(item => {
      (item.batches || []).forEach(batch => {
        if (batch.qty > 0) {
          const expDate = new Date(String(batch.expiry || '').replace(/-/g, '/'))
          if (expDate <= thirtyLater) expiringSoon.push({ ...item, ...batch })
        }
      })
    })
    return { lowStock, expiringSoon }
  }, [inventory])

  const [showVendorModal, setShowVendorModal] = useState(false)
  const [vendorForm, setVendorForm] = useState({ id: null, company: '', name: '', phone: '', email: '', note: '' })

  const handleSaveVendor = async (e) => {
    e.preventDefault()
    if (vendorForm.id) {
      const { error } = await supabaseClient.from('vendors').update(vendorForm).eq('id', vendorForm.id)
      if (error) console.error("更新廠商失敗:", error)
    } else {
      const { id, ...saveData } = vendorForm
      const { error } = await supabaseClient.from('vendors').insert(saveData)
      if (error) console.error("新增廠商失敗:", error)
    }
    setShowVendorModal(false)
  }

  const handleDeleteVendor = async (id) => {
    if (confirm('確定要刪除此廠商資訊嗎？')) {
      const { error } = await supabaseClient.from('vendors').delete().eq('id', id)
      if (error) console.error("刪除廠商失敗:", error)
    }
  }

  const handleOutboundSubmit = async (e) => {
    e.preventDefault()
    const { itemId, batchId, qty } = outboundForm
    const item = inventory.find(i => i.id == itemId)
    const targetBatch = item.batches.find(b => b.id == batchId)
    if (!targetBatch || Number(targetBatch.qty) < Number(qty)) { alert('庫存不足'); return }

    const newBatches = item.batches.map(b => b.id == batchId ? { ...b, qty: Number(b.qty) - Number(qty) } : b)
    const newLog = { itemId, type: "出庫", change: '-' + qty, batchNo: targetBatch.batchNo, user: "lab", date: formatDateTime() }

    const { error: invErr } = await supabaseClient.from('inventory').update({ batches: newBatches }).eq('id', itemId)
    const { error: logErr } = await supabaseClient.from('history').insert(newLog)
    
    if (invErr || logErr) console.error("出庫失敗:", invErr, logErr)
    setShowOutboundModal(false)
  }

  const handleInbound = async (e) => {
    e.preventDefault()
    const { itemId, batchNo, packageQty, unitsPerPackage, expiry, invoiceDate } = inboundForm
    const total = Number(packageQty) * Number(unitsPerPackage)
    const item = inventory.find(i => i.id == itemId)
    const newBatches = (item.batches || []).map(b => ({ ...b, qty: Number(b.qty) }))
    const existIdx = newBatches.findIndex(b => b.batchNo === batchNo && b.expiry === expiry.replace(/-/g, '/'))

    if (existIdx >= 0) newBatches[existIdx].qty += total
    else newBatches.push({ id: Date.now().toString(), batchNo, qty: total, expiry: expiry.replace(/-/g, '/') })

    const newLog = { itemId, type: '入庫', change: '+' + total, batchNo, invoiceDate: invoiceDate.replace(/-/g, '/'), user: 'lab', date: formatDateTime() }

    const { error: invErr } = await supabaseClient.from('inventory').update({ batches: newBatches }).eq('id', itemId)
    const { error: logErr } = await supabaseClient.from('history').insert(newLog)

    if (invErr || logErr) console.error("入庫失敗:", invErr, logErr)
    setShowInboundModal(false)
  }

  const handleSaveItem = async (e) => {
    e.preventDefault()
    const saveData = { ...itemForm, unitPrice: Number(itemForm.unitPrice) || 0 }
    if (saveData.id) {
      const { error } = await supabaseClient.from('inventory').update(saveData).eq('id', saveData.id)
      if (error) console.error("更新品項失敗:", error)
    } else {
      const { id, ...insertData } = saveData
      const { error } = await supabaseClient.from('inventory').insert({ ...insertData, batches: [] })
      if (error) console.error("新增品項失敗:", error)
    }
    setShowItemModal(false)
  }

  const handleExportExcel = () => {
    if (purchaseReport.records.length === 0) {
      alert('本月尚無進貨紀錄可供匯出')
      return
    }

    const data = purchaseReport.records.map(r => ({
      '發票日期': r.invoiceDate,
      '品項名稱': r.itemName,
      '廠牌': r.vendor,
      '進貨數量': r.change,
      '單位': r.unit,
      '基準單價': r.unitPrice,
      '小計金額': r.totalPrice
    }))

    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "報帳明細")

    // 調整欄寬
    const wscols = [
      {wch: 15}, {wch: 30}, {wch: 15}, {wch: 10}, {wch: 8}, {wch: 12}, {wch: 12}
    ]
    worksheet['!cols'] = wscols

    XLSX.writeFile(workbook, `實驗室報帳表_${purchaseMonth.replace(/\//g, '_')}.xlsx`)
  }

  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-slate-800 animate-in font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isCloudLoading={isCloudLoading} onLogout={() => setIsLoggedIn(false)} />

      <main className="flex-1 p-6 md:p-10 overflow-y-auto h-screen">
        <Header activeTab={activeTab} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        {activeTab === 'inventory' && (
          <InventoryTab
            inventory={inventory} alerts={alerts} activeSubTab={activeSubTab} setActiveSubTab={setActiveSubTab}
            searchTerm={searchTerm} setInboundForm={setInboundForm} setShowInboundModal={setShowInboundModal}
            setOutboundForm={setOutboundForm} setShowOutboundModal={setShowOutboundModal}
            notices={notices} noticeInput={noticeInput} setNoticeInput={setNoticeInput}
            onAddNotice={handleAddNotice} onDeleteNotice={handleDeleteNotice}
          />
        )}

        {activeTab === 'batches' && (
          <BatchesTab
            inventory={inventory} activeSubTab={activeSubTab} setActiveSubTab={setActiveSubTab}
            searchTerm={searchTerm} traceDate={traceDate} setTraceDate={setTraceDate} traceRecords={traceRecords}
          />
        )}

        {activeTab === 'history' && <HistoryTab history={history} inventory={inventory} />}

        {activeTab === 'stats' && <StatsTab statsYear={statsYear} setStatsYear={setStatsYear} yearlyUsageStats={yearlyUsageStats} />}

        {activeTab === 'purchase' && (
          <PurchaseTab
            purchaseMonth={purchaseMonth} setPurchaseMonth={setPurchaseMonth}
            monthOptions={monthOptions} purchaseReport={purchaseReport} handleExportExcel={handleExportExcel}
          />
        )}

        {activeTab === 'vendors' && (
          <VendorsTab vendors={vendors} setVendorForm={setVendorForm} setShowVendorModal={setShowVendorModal} handleDeleteVendor={handleDeleteVendor} />
        )}

        {activeTab === 'settings' && (
          <SettingsTab inventory={inventory} activeSubTab={activeSubTab} setActiveSubTab={setActiveSubTab} setItemForm={setItemForm} setShowItemModal={setShowItemModal} />
        )}
      </main>

      {/* Modals */}
      {showInboundModal && <InboundModal inventory={inventory} inboundForm={inboundForm} setInboundForm={setInboundForm} onSubmit={handleInbound} onClose={() => setShowInboundModal(false)} />}
      {showOutboundModal && <OutboundModal inventory={inventory} outboundForm={outboundForm} setOutboundForm={setOutboundForm} onSubmit={handleOutboundSubmit} onClose={() => setShowOutboundModal(false)} />}
      {showItemModal && <ItemModal itemForm={itemForm} setItemForm={setItemForm} onSubmit={handleSaveItem} onClose={() => setShowItemModal(false)} />}
      {showVendorModal && <VendorModal vendorForm={vendorForm} setVendorForm={setVendorForm} onSubmit={handleSaveVendor} onClose={() => setShowVendorModal(false)} />}
    </div>
  )
}

export default App
