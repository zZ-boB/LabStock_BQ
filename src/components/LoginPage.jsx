import React, { useState } from 'react'

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (username === 'lab' && password === '1234') {
      onLogin('user')
    } else if (username === 'admin' && password === 'admin888') {
      onLogin('admin')
    } else {
      setLoginError('帳號或密碼錯誤')
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm text-center">
        <img src="/app-icon.png" alt="Logo" className="w-24 h-24 mx-auto mb-6 object-contain" />
        <h1 className="text-2xl font-bold mb-6">實驗室庫存管理系統</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" className="w-full p-3 border rounded-xl outline-none" placeholder="帳號" value={username} onChange={e => setUsername(e.target.value)} />
          <input type="password" className="w-full p-3 border rounded-xl outline-none" placeholder="密碼" value={password} onChange={e => setPassword(e.target.value)} />
          {loginError && <p className="text-red-500 text-sm font-bold">{loginError}</p>}
          <button className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl shadow-lg transition active:scale-95">登入系統</button>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
