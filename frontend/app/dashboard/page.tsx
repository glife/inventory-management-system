'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Bell, HelpCircle, Settings, User, Package, TrendingDown, Clock, CheckCircle, AlertTriangle, ArrowUp, ArrowDown, TrendingUp, Truck, Warehouse, FileText, Activity, BarChart3, Box, RefreshCw, LogOut, type LucideIcon } from 'lucide-react';
import { isAuthenticated, logout, getUser } from '@/lib/auth';
import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import KPICard from './components/KPICard';
import OperationsCard from './components/OperationsCard';
import WarehouseMap from './maps/WarehouseMap';
import WarehouseCapacity from './components/WarehouseCapacity';
import FastMovingSKUs from './components/FastMovingSKUs';
import RecentActivity from './components/RecentActivity';
import AlertsList from './components/AlertsList';
import StockHealth from './components/StockHealth';
import QuickActions from './components/QuickActions';
import {
  mockKPIData,
  mockRecentActivity,
  mockAlerts,
  mockWarehouses,
  mockFastMoving,
  mockWarehouseLocations,
} from './data/mockData';

// Type Definitions
interface KPIData {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  period: string;
}

interface RecentActivity {
  type: 'receipt' | 'delivery' | 'transfer' | 'adjustment' | 'alert';
  action: string;
  user: string;
  time: string;
  icon: LucideIcon;
  color: string;
}

interface Alert {
  sku: string;
  product: string;
  location: string;
  priority: 'high' | 'medium' | 'low';
  issue: string;
}

interface WarehouseData {
  name: string;
  stock: string;
  lowStock: number;
  operations: number;
  status: 'normal' | 'high' | 'low';
}

interface FastMovingItem {
  name: string;
  sku: string;
  moved: number;
  trend: string;
}

interface NavItem {
  id: string;
  icon: LucideIcon;
  label: string;
}


export default function Dashboard() {
  const router = useRouter();
  const [activeNav, setActiveNav] = useState<string>('dashboard');
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

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h1 className="text-xl font-semibold text-gray-700">Loading dashboard...</h1>
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
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => router.push(`/${item.id === 'dashboard' ? 'dashboard' : item.id}`)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeNav === item.id
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-100'
                }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white border-b border-gray-200 h-16">
          <div className="flex items-center justify-between px-6 h-full">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for SKUs, products, documents..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 ml-6">
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

        {/* Dashboard Content Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Header Section */}

          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Warehouse & Inventory Dashboard</h1>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-gray-600">Real-time operational overview across all warehouses</p>
              <span className="text-sm text-gray-500">• Last updated: 15 sec ago</span>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">

            {mockKPIData.map((kpi, index) => (
              <KPICard key={index} kpi={kpi} />
            ))}
          </div>

          {/* Operations Snapshot */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <OperationsCard
              type="receipt"
              title="Receipts"
              count={18}
              late={5}
              pending={18}
              total={234}
            />
            <OperationsCard
              type="delivery"
              title="Deliveries"
              count={34}
              late={8}
              pending={12}
              waiting={12}
              total={189}
            />
          </div>

          {/* Widgets Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

            <WarehouseMap locations={mockWarehouseLocations} />
            <RecentActivity activities={mockRecentActivity} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <WarehouseCapacity warehouses={mockWarehouses} />
            <FastMovingSKUs items={mockFastMoving} />
            <StockHealth />
          </div>

          <AlertsList alerts={mockAlerts} />

          <QuickActions />
        </main>
      </div>
    </div>
  );
}
