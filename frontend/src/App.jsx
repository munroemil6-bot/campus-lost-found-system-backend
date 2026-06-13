import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import AdminDashboard from './pages/AdminDashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import BrowseItems from './pages/BrowseItems'
import ReportLost from './pages/ReportLost'
import ReportFound from './pages/ReportFound'
import MyClaims from './pages/MyClaims'
import './index.css'

export default function App() {
  return (
    <div className="min-h-screen bg-blue-950 text-slate-100">
      <Router>
        <Navbar />

        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/browse" element={<BrowseItems />} />
            <Route path="/report/lost" element={<ReportLost />} />
            <Route path="/report/found" element={<ReportFound />} />
            <Route path="/claims" element={<MyClaims />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>

        <footer className="mt-auto border-t border-blue-800/70 px-4 py-4 text-sm text-slate-300 sm:px-6">
          <p>Campus Lost & Found — a blue and gold experience for campus community reporting.</p>
        </footer>
      </Router>
    </div>
  )
}
