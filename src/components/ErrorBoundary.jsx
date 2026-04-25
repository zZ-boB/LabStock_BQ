import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error: error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-10 text-center font-sans">
          <h1 className="text-2xl font-bold text-red-600">系統發生錯誤</h1>
          <pre className="mt-4 p-4 bg-slate-100 rounded text-left text-xs overflow-auto max-h-60">{String(this.state.error)}</pre>
          <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg font-bold">清除快取並重新整理</button>
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
