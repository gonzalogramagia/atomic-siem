import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ScrollText, Bell, Shield } from 'lucide-react';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const location = useLocation();

    const navItems = [
        { path: '/', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/logs', label: 'Logs', icon: ScrollText },
        { path: '/alerts', label: 'Alerts', icon: Bell },
        { path: '/rules', label: 'Rules', icon: Shield },
    ];

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 text-white flex flex-col">
                <div className="h-20 px-6 flex items-center border-b border-gray-800">
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Shield className="text-blue-500" />
                        Atomic SIEM
                    </h1>
                </div>
                <nav className="flex-1 px-4 pb-4 pt-6 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                    }`}
                            >
                                <Icon size={20} />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
                <div className="p-4 border-t border-gray-800 text-sm text-gray-500">
                    v0.2.3
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white shadow-sm h-20 flex items-center px-8">
                    <h2 className="text-xl font-semibold text-gray-800">
                        {navItems.find((i) => i.path === location.pathname)?.label || 'Dashboard'}
                    </h2>
                </header>
                <div className="flex-1 overflow-auto p-8">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
