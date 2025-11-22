'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Bell, HelpCircle, Settings, User, Package, Warehouse, FileText, Activity, BarChart3, Box, Clock, List, LayoutGrid, Plus, Truck, AlertTriangle, LogOut } from 'lucide-react';
import { isAuthenticated, logout, getUser } from '@/lib/auth';

// Type Definitions
interface StockItem {
    id: string;
    product: string;
    sku: string;
    category: string;
    onHand: number;
    available: number;
    incoming: number;
    outgoing: number;
    minStock: number;
    location: string;
    value: string;
}

export default function StockPage() {
    const router = useRouter();
    const [activeNav, setActiveNav] = useState<string>('stock');
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

    // Dummy data for stock
    const stockData: StockItem[] = [
        { id: '1', product: 'Industrial Bearing XL', sku: 'SKU-4892', category: 'Components', onHand: 45, available: 40, incoming: 10, outgoing: 5, minStock: 20, location: 'WH/Stock/A1', value: '$1,250' },
        { id: '2', product: 'Steel Bolt M12', sku: 'SKU-2341', category: 'Hardware', onHand: 1200, available: 1150, incoming: 500, outgoing: 50, minStock: 500, location: 'WH/Stock/B2', value: '$360' },
        { id: '3', product: 'Hydraulic Pump', sku: 'SKU-7823', category: 'Machinery', onHand: 8, available: 8, incoming: 2, outgoing: 0, minStock: 10, location: 'WH/Stock/C1', value: '$4,800' },
        { id: '4', product: 'Copper Wire Roll', sku: 'SKU-9273', category: 'Materials', onHand: 156, available: 140, incoming: 20, outgoing: 16, minStock: 50, location: 'WH/Stock/A2', value: '$2,340' },
        { id: '5', product: 'Valve Assembly', sku: 'SKU-7234', category: 'Components', onHand: 34, available: 30, incoming: 0, outgoing: 4, minStock: 15, location: 'WH/Stock/B1', value: '$850' },
    ];

    // Filter stock based on search query
    const filteredStock = stockData.filter(item => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            item.product.toLowerCase().includes(query) ||
            item.sku.toLowerCase().includes(query) ||
            item.category.toLowerCase().includes(query)
        );
    });

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
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors bg-blue-50 text-blue-600"
                    >
                        <Box className="w-5 h-5" />
                        Stock
                    </button>
                    <button
                        onClick={() => router.push('/history')}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-gray-700 hover:bg-gray-100"
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

                {/* Stock Content */}
                <main className="flex-1 overflow-y-auto p-6">
                    {/* Header */}
                    <div className="mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <h1 className="text-2xl font-bold text-gray-900">Current Stock</h1>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search stock..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-100 text-gray-900"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Stock Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Product</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">SKU</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Category</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Location</th>
                                        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">On Hand</th>
                                        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Available</th>
                                        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Value</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredStock.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                                No stock items found
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredStock.map((item) => (
                                            <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        <div className="text-sm font-medium text-gray-900">{item.product}</div>
                                                        <div title="Low Stock">
                                                            <AlertTriangle className="w-4 h-4 text-red-500" />
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-700">{item.sku}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-700">{item.category}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-700">{item.location}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                    <div className={`text-sm font-medium ${item.onHand <= item.minStock ? 'text-red-600' : 'text-gray-900'}`}>
                                                        {item.onHand}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                    <div className="text-sm text-gray-900">{item.available}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                    <div className="text-sm text-gray-900">{item.value}</div>
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
