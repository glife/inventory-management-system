'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Bell, HelpCircle, Settings, User, Package, Warehouse, FileText, Activity, BarChart3, Box, Clock, List, LayoutGrid, Plus, Truck, LogOut, ArrowRight, ArrowLeft, Filter } from 'lucide-react';
import { isAuthenticated, logout, getUser } from '@/lib/auth';

// Type Definitions
interface MoveHistoryItem {
    id: string;
    reference: string;
    product: string;
    sku: string;
    from: string;
    to: string;
    quantity: number;
    date: string;
    user: string;
    type: 'receipt' | 'delivery' | 'transfer' | 'adjustment';
}

export default function HistoryPage() {
    const router = useRouter();
    const [activeNav, setActiveNav] = useState<string>('history');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<{ name: string; email: string } | null>(null);

    // Check authentication on mount
    useEffect(() => {
        if (!isAuthenticated()) {
            router.push('/login');
        } else {
            const userData = getUser();
            setUser(userData);
            setLoading(false);
        }
    }, [router]);

    // Dummy data for history
    const historyData: MoveHistoryItem[] = [
        { id: '1', reference: 'WH/IN/0001', product: 'Industrial Bearing XL', sku: 'SKU-4892', from: 'Vendor', to: 'WH/Stock/A1', quantity: 50, date: '2024-01-22 14:30', user: 'John Smith', type: 'receipt' },
        { id: '2', reference: 'WH/OUT/0001', product: 'Steel Bolt M12', sku: 'SKU-2341', from: 'WH/Stock/B2', to: 'Customer A', quantity: 200, date: '2024-01-22 11:15', user: 'Sarah Lee', type: 'delivery' },
        { id: '3', reference: 'WH/INT/0001', product: 'Copper Wire Roll', sku: 'SKU-9273', from: 'WH/Stock/A2', to: 'WH/Stock/B1', quantity: 20, date: '2024-01-21 16:45', user: 'Mike Johnson', type: 'transfer' },
        { id: '4', reference: 'WH/ADJ/0001', product: 'Valve Assembly', sku: 'SKU-7234', from: 'WH/Stock/B1', to: 'Virtual Loss', quantity: 2, date: '2024-01-21 09:20', user: 'Admin', type: 'adjustment' },
        { id: '5', reference: 'WH/IN/0002', product: 'Gasket Pack', sku: 'SKU-3498', from: 'Vendor', to: 'WH/Stock/C1', quantity: 100, date: '2024-01-20 15:10', user: 'John Smith', type: 'receipt' },
    ];

    // Filter history based on search query
    const filteredHistory = historyData.filter(item => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            item.reference.toLowerCase().includes(query) ||
            item.product.toLowerCase().includes(query) ||
            item.sku.toLowerCase().includes(query) ||
            item.user.toLowerCase().includes(query)
        );
    });

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'receipt': return 'bg-green-100 text-green-800';
            case 'delivery': return 'bg-blue-100 text-blue-800';
            case 'transfer': return 'bg-purple-100 text-purple-800';
            case 'adjustment': return 'bg-orange-100 text-orange-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <h1 className="text-xl font-semibold text-gray-700">Loading...</h1>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <Package className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-semibold text-gray-900">InventoryMS</span>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    <button
                        onClick={() => router.push('/receipts')}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-gray-700 hover:bg-gray-100"
                    >
                        <Package className="w-5 h-5" />
                        Receipt Operations
                    </button>
                    <button
                        onClick={() => router.push('/delivery')}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-gray-700 hover:bg-gray-100"
                    >
                        <Truck className="w-5 h-5" />
                        Delivery Operations
                    </button>
                    <button
                        onClick={() => router.push('/stock')}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-gray-700 hover:bg-gray-100"
                    >
                        <Box className="w-5 h-5" />
                        Stock
                    </button>
                    <button
                        onClick={() => router.push('/history')}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors bg-blue-50 text-blue-600"
                    >
                        <Clock className="w-5 h-5" />
                        Move History
                    </button>
                    <button
                        onClick={() => router.push('/settings')}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-gray-700 hover:bg-gray-100"
                    >
                        <Settings className="w-5 h-5" />
                        Settings
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Navigation */}
                <header className="bg-white border-b border-gray-200 px-6 py-3">
                    <div className="flex items-center justify-end">
                        <div className="flex items-center gap-3">
                            <button className="p-2 hover:bg-gray-100 rounded-lg relative">
                                <Bell className="w-5 h-5 text-gray-600" />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                            </button>
                            <button className="p-2 hover:bg-gray-100 rounded-lg">
                                <HelpCircle className="w-5 h-5 text-gray-600" />
                            </button>
                            <button className="p-2 hover:bg-gray-100 rounded-lg">
                                <Settings className="w-5 h-5 text-gray-600" />
                            </button>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                    <User className="w-5 h-5 text-white" />
                                </div>
                                {user && (
                                    <div className="hidden md:block text-sm">
                                        <div className="font-medium text-gray-900">{user.name}</div>
                                        <div className="text-xs text-gray-500">{user.email}</div>
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={logout}
                                className="flex items-center gap-2 p-2 hover:bg-red-50 rounded-lg text-red-600 transition-colors"
                                title="Logout"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </header>

                {/* History Content */}
                <main className="flex-1 overflow-y-auto p-6">
                    {/* Header */}
                    <div className="mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <h1 className="text-2xl font-bold text-gray-900">Stock Moves History</h1>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search history..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-100 text-gray-900"
                                />
                            </div>
                            <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">
                                <Filter className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* History Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Reference</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Product</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">From</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">To</th>
                                        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Quantity</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Type</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredHistory.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                                No history found
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredHistory.map((item) => (
                                            <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-500">{item.date}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">{item.reference}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div>
                                                        <div className="text-sm text-gray-900">{item.product}</div>
                                                        <div className="text-xs text-gray-500">{item.sku}</div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-700">{item.from}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-700">{item.to}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                    <div className="text-sm font-medium text-gray-900">{item.quantity}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}>
                                                        {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
