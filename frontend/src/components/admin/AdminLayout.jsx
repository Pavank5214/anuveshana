import { useState } from 'react'
import { Outlet } from "react-router-dom";
import AdminSidebar from './AdminSidebar'
import { Menu, X } from 'lucide-react'

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen)
    }

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-[#0B0F19] relative">
            {/* Mobile Top Bar */}
            <div className="flex items-center md:hidden px-4 py-3 bg-[#0B0F19] border-b border-white/[0.06] z-20 sticky top-0">
                <button onClick={toggleSidebar} className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
                    {isSidebarOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
                <h1 className="ml-3 text-sm font-bold text-white uppercase tracking-wider">Admin Panel</h1>
            </div>

            {/* Overlay for Mobile Sidebar */}
            {isSidebarOpen && (
                <div className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden" onClick={toggleSidebar} />
            )}

            {/* Sidebar */}
            <div className={`bg-[#0D1117] w-64 min-h-screen text-white fixed md:relative transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 md:translate-x-0 md:static md:block z-40 border-r border-white/[0.06]`}>
                <AdminSidebar closeSidebar={() => setIsSidebarOpen(false)} />
            </div>

            {/* Main Content */}
            <div className="flex-grow overflow-auto">
                <Outlet />
            </div>
        </div>
    )
}

export default AdminLayout