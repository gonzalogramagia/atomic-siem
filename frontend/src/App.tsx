import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Logs from './pages/Logs'
import Alerts from './pages/Alerts'
import Rules from './pages/Rules'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/logs" element={<Logs />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/rules" element={<Rules />} />
      </Routes>
    </Layout>
  )
}

export default App
