'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';
import { Search, Bell, HelpCircle, Settings, User, Package, Warehouse, FileText, Activity, BarChart3, Box, Clock, List, LayoutGrid, Plus, Truck } from 'lucide-react';

import type { LucideIcon } from 'lucide-react';

// Type Definitions
interface Product {
  id: string;
  productCode: string;
  productName: string;
  quantity: number;
}

interface Receipt {
  id: string;
  reference: string;
  from: string;
  to: string;
  contact: string;
  scheduleDate: string | null;
  status: 'Ready' | 'Draft' | 'In Progress' | 'Done' | 'Cancelled';
  responsible?: string;
  products?: Product[];
}

interface NavItem {
  id: string;
  icon: LucideIcon;
  label: string;
}

interface TopNavItem {
  id: string;
  label: string;
}

export default function ReceiptsPage() {
  const router = useRouter();
  const [activeNav, setActiveNav] = useState<string>('receipt');
  const [activeTopNav, setActiveTopNav] = useState<string>('operations');
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [draggedReceiptId, setDraggedReceiptId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedReceiptId, setSelectedReceiptId] = useState<string | null>(null);
  const [sortColumn, setSortColumn] = useState<keyof Receipt | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [newProduct, setNewProduct] = useState({ productCode: '', productName: '', quantity: 1 });

  // Form state for new receipt
  const [newReceipt, setNewReceipt] = useState({
    from: '',
    to: '',
    contact: '',
    scheduleDate: '',
    status: 'Draft' as Receipt['status'],
  });

  // Dummy data for receipts - using state so it can be updated
  const [receiptsData, setReceiptsData] = useState<Receipt[]>([
    { id: '1', reference: 'WH/IN/0001', from: 'vendor', to: 'WH/Stock1', contact: 'Azure Interior', scheduleDate: null, status: 'Ready', responsible: 'John Doe', products: [{ id: '1', productCode: 'DESK001', productName: 'Desk', quantity: 6 }] },
    { id: '2', reference: 'WH/IN/0002', from: 'vendor', to: 'WH/Stock1', contact: 'Azure Interior', scheduleDate: null, status: 'Ready', responsible: 'Jane Smith', products: [] },
    { id: '3', reference: 'WH/IN/0003', from: 'vendor', to: 'WH/Stock2', contact: 'Tech Solutions', scheduleDate: '2024-01-15', status: 'In Progress', responsible: 'Mike Johnson', products: [] },
    { id: '4', reference: 'WH/IN/0004', from: 'vendor', to: 'WH/Stock1', contact: 'Global Supplies', scheduleDate: '2024-01-16', status: 'Draft', responsible: 'Sarah Lee', products: [] },
    { id: '5', reference: 'WH/IN/0005', from: 'vendor', to: 'WH/Stock3', contact: 'Azure Interior', scheduleDate: '2024-01-17', status: 'Ready', responsible: 'Tom Wilson', products: [] },
    { id: '6', reference: 'WH/IN/0006', from: 'vendor', to: 'WH/Stock2', contact: 'Tech Solutions', scheduleDate: null, status: 'Done', responsible: 'Emily Brown', products: [] },
    { id: '7', reference: 'WH/IN/0007', from: 'vendor', to: 'WH/Stock1', contact: 'Global Supplies', scheduleDate: '2024-01-18', status: 'Ready', responsible: 'David Miller', products: [] },
    { id: '8', reference: 'WH/IN/0008', from: 'vendor', to: 'WH/Stock3', contact: 'Azure Interior', scheduleDate: null, status: 'In Progress', responsible: 'Lisa Anderson', products: [] },
  ]);

  const navItems: NavItem[] = [
    { id: 'dashboard', icon: BarChart3, label: 'Dashboard' },
    { id: 'receipt', icon: Package, label: 'Receipt Operations' },
    { id: 'delivery', icon: Package, label: 'Delivery Operations' },
    { id: 'stock', icon: Box, label: 'Stock' },
    { id: 'warehouse', icon: Warehouse, label: 'Warehouse' },
    { id: 'operations', icon: Activity, label: 'Dashboard Operations' },
    { id: 'history', icon: Clock, label: 'Move History' },
    { id: 'support', icon: HelpCircle, label: 'Support' },
  ];


  const statusOptions: Receipt['status'][] = ['Ready', 'Draft', 'In Progress', 'Done', 'Cancelled'];

  // Generate next reference number
  const generateNextReference = (): string => {
    const maxRef = receiptsData.reduce((max, receipt) => {
      const match = receipt.reference.match(/WH\/IN\/(\d+)/);
      if (match) {
        const num = parseInt(match[1], 10);
        return num > max ? num : max;
      }
      return max;
    }, 0);
    const nextNum = (maxRef + 1).toString().padStart(4, '0');
    return `WH/IN/${nextNum}`;
  };

  // Get selected receipt
  const selectedReceipt = receiptsData.find(r => r.id === selectedReceiptId);

  // Handle adding new receipt
  const handleAddReceipt = () => {
    if (!newReceipt.from || !newReceipt.to || !newReceipt.contact) {
      alert('Please fill in all required fields');
      return;
    }

    const newReceiptData: Receipt = {
      id: (receiptsData.length + 1).toString(),
      reference: generateNextReference(),
      from: newReceipt.from,
      to: newReceipt.to,
      contact: newReceipt.contact,
      scheduleDate: newReceipt.scheduleDate || null,
      status: newReceipt.status,
      responsible: 'Current User', // Auto-fill with logged in user
      products: [],
    };

    setReceiptsData([...receiptsData, newReceiptData]);
    setIsModalOpen(false);
    setNewReceipt({
      from: '',
      to: '',
      contact: '',
      scheduleDate: '',
      status: 'Draft',
    });
  };

  // Handle workflow actions
  const handleToDo = () => {
    if (selectedReceiptId && selectedReceipt?.status === 'Draft') {
      setReceiptsData(prevReceipts =>
        prevReceipts.map(receipt =>
          receipt.id === selectedReceiptId
            ? { ...receipt, status: 'Ready' }
            : receipt
        )
      );
    }
  };

  const handleValidate = () => {
    if (selectedReceiptId && selectedReceipt?.status === 'Ready') {
      setReceiptsData(prevReceipts =>
        prevReceipts.map(receipt =>
          receipt.id === selectedReceiptId
            ? { ...receipt, status: 'Done' }
            : receipt
        )
      );
    }
  };

  const handlePrint = () => {
    if (selectedReceipt) {
      // Create a new window for printing
      const printWindow = window.open('', '_blank');
      if (!printWindow) return;

      const totalQuantity = selectedReceipt.products?.reduce((sum, p) => sum + p.quantity, 0) || 0;
      const currentDate = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Receipt - ${selectedReceipt.reference}</title>
            <style>
              @media print {
                @page {
                  size: A4;
                  margin: 20mm;
                }
                body {
                  margin: 0;
                  padding: 0;
                  font-family: Arial, sans-serif;
                  color: #000;
                }
              }
              body {
                font-family: Arial, sans-serif;
                max-width: 800px;
                margin: 0 auto;
                padding: 40px;
                color: #000;
                background: #fff;
              }
              .header {
                border-bottom: 3px solid #000;
                padding-bottom: 20px;
                margin-bottom: 30px;
              }
              .company-name {
                font-size: 28px;
                font-weight: bold;
                margin-bottom: 5px;
              }
              .receipt-title {
                font-size: 24px;
                font-weight: bold;
                margin: 20px 0;
                text-align: center;
              }
              .receipt-info {
                display: flex;
                justify-content: space-between;
                margin-bottom: 30px;
                padding: 20px;
                background: #f9f9f9;
                border: 1px solid #ddd;
              }
              .info-section {
                flex: 1;
              }
              .info-label {
                font-weight: bold;
                font-size: 12px;
                color: #666;
                margin-bottom: 5px;
                text-transform: uppercase;
              }
              .info-value {
                font-size: 14px;
                margin-bottom: 15px;
              }
              .products-table {
                width: 100%;
                border-collapse: collapse;
                margin: 30px 0;
              }
              .products-table th {
                background: #000;
                color: #fff;
                padding: 12px;
                text-align: left;
                font-weight: bold;
                font-size: 12px;
                text-transform: uppercase;
              }
              .products-table td {
                padding: 12px;
                border-bottom: 1px solid #ddd;
                font-size: 14px;
              }
              .products-table tr:last-child td {
                border-bottom: 2px solid #000;
              }
              .total-section {
                margin-top: 30px;
                padding-top: 20px;
                border-top: 2px solid #000;
              }
              .total-row {
                display: flex;
                justify-content: space-between;
                padding: 10px 0;
                font-size: 16px;
              }
              .total-row.total {
                font-weight: bold;
                font-size: 18px;
                border-top: 1px solid #ddd;
                padding-top: 15px;
                margin-top: 10px;
              }
              .footer {
                margin-top: 50px;
                padding-top: 30px;
                border-top: 1px solid #ddd;
                display: flex;
                justify-content: space-between;
              }
              .signature {
                width: 200px;
                text-align: center;
              }
              .signature-line {
                border-top: 1px solid #000;
                margin-top: 60px;
                padding-top: 5px;
                font-size: 12px;
              }
              .status-badge {
                display: inline-block;
                padding: 5px 15px;
                background: #000;
                color: #fff;
                font-weight: bold;
                font-size: 12px;
                text-transform: uppercase;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="company-name">Inventory Management System</div>
              <div style="font-size: 12px; color: #666;">Warehouse Receipt Document</div>
            </div>

            <div class="receipt-title">RECEIPT</div>

            <div class="receipt-info">
              <div class="info-section">
                <div class="info-label">Receipt Reference</div>
                <div class="info-value" style="font-size: 18px; font-weight: bold;">${selectedReceipt.reference}</div>
                
                <div class="info-label">Status</div>
                <div class="info-value">
                  <span class="status-badge">${selectedReceipt.status}</span>
                </div>
                
                <div class="info-label">Date</div>
                <div class="info-value">${currentDate}</div>
              </div>
              
              <div class="info-section">
                <div class="info-label">Receive From</div>
                <div class="info-value">${selectedReceipt.from}</div>
                
                <div class="info-label">Warehouse Location</div>
                <div class="info-value">${selectedReceipt.to}</div>
                
                <div class="info-label">Contact</div>
                <div class="info-value">${selectedReceipt.contact}</div>
                
                ${selectedReceipt.scheduleDate ? `
                <div class="info-label">Schedule Date</div>
                <div class="info-value">${new Date(selectedReceipt.scheduleDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                ` : ''}
                
                <div class="info-label">Responsible</div>
                <div class="info-value">${selectedReceipt.responsible || 'Current User'}</div>
              </div>
            </div>

            <table class="products-table">
              <thead>
                <tr>
                  <th style="width: 60%;">Product</th>
                  <th style="width: 20%;">Code</th>
                  <th style="width: 20%; text-align: right;">Quantity</th>
                </tr>
              </thead>
              <tbody>
                ${selectedReceipt.products && selectedReceipt.products.length > 0 ? 
                  selectedReceipt.products.map(product => `
                    <tr>
                      <td>${product.productName}</td>
                      <td>${product.productCode}</td>
                      <td style="text-align: right;">${product.quantity}</td>
                    </tr>
                  `).join('') : 
                  '<tr><td colspan="3" style="text-align: center; padding: 30px; color: #999;">No products listed</td></tr>'
                }
              </tbody>
            </table>

            <div class="total-section">
              <div class="total-row">
                <span>Total Items:</span>
                <span><strong>${selectedReceipt.products?.length || 0}</strong></span>
              </div>
              <div class="total-row">
                <span>Total Quantity:</span>
                <span><strong>${totalQuantity}</strong></span>
              </div>
            </div>

            <div class="footer">
              <div class="signature">
                <div class="signature-line">Prepared By</div>
              </div>
              <div class="signature">
                <div class="signature-line">Received By</div>
              </div>
            </div>

            <div style="margin-top: 40px; text-align: center; font-size: 10px; color: #999;">
              This is a computer-generated receipt. No signature required.
            </div>
          </body>
        </html>
      `);

      printWindow.document.close();
      
      // Wait for content to load, then print
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
        // Close window after printing (optional)
        // printWindow.close();
      }, 250);
    }
  };

  // Handle adding product to receipt
  const handleAddProduct = () => {
    if (!selectedReceiptId || !newProduct.productCode || !newProduct.productName) {
      alert('Please fill in product code and name');
      return;
    }

    const product: Product = {
      id: Date.now().toString(),
      productCode: newProduct.productCode,
      productName: newProduct.productName,
      quantity: newProduct.quantity,
    };

    setReceiptsData(prevReceipts =>
      prevReceipts.map(receipt =>
        receipt.id === selectedReceiptId
          ? { ...receipt, products: [...(receipt.products || []), product] }
          : receipt
      )
    );

    setNewProduct({ productCode: '', productName: '', quantity: 1 });
  };

  // Handle column sorting
  const handleSort = (column: keyof Receipt) => {
    if (sortColumn === column) {
      // Toggle direction if clicking same column
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new column and default to ascending
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Filter and sort receipts
  let filteredReceipts = receiptsData.filter(receipt => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        receipt.reference.toLowerCase().includes(query) ||
        receipt.contact.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }
    return true;
  });

  // Apply sorting
  if (sortColumn) {
    filteredReceipts = [...filteredReceipts].sort((a, b) => {
      let aValue = a[sortColumn];
      let bValue = b[sortColumn];

      // Handle null values
      if (aValue === null || aValue === undefined) aValue = '';
      if (bValue === null || bValue === undefined) bValue = '';

      // Convert to string for comparison
      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();

      if (sortDirection === 'asc') {
        return aStr > bStr ? 1 : aStr < bStr ? -1 : 0;
      } else {
        return aStr < bStr ? 1 : aStr > bStr ? -1 : 0;
      }
    });
  }

  // Handle drag and drop
  const handleDragStart = (e: React.DragEvent, receiptId: string) => {
    setDraggedReceiptId(receiptId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, newStatus: Receipt['status']) => {
    e.preventDefault();
    if (draggedReceiptId) {
      setReceiptsData(prevReceipts =>
        prevReceipts.map(receipt =>
          receipt.id === draggedReceiptId
            ? { ...receipt, status: newStatus }
            : receipt
        )
      );
      setDraggedReceiptId(null);
    }
  };

  // Group receipts by status for Kanban view
  const groupedByStatus = {
    'Ready': filteredReceipts.filter(r => r.status === 'Ready'),
    'Draft': filteredReceipts.filter(r => r.status === 'Draft'),
    'In Progress': filteredReceipts.filter(r => r.status === 'In Progress'),
    'Done': filteredReceipts.filter(r => r.status === 'Done'),
    'Cancelled': filteredReceipts.filter(r => r.status === 'Cancelled'),
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ready':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Draft':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Done':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

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
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors bg-blue-50 text-blue-600"
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
        <header className="bg-white border-b border-gray-200 px-6 py-3 relative z-50">
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
              <button className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
              </button>
            </div>
          </div>
        </header>

        {/* Receipts Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Receipts Header */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                NEW
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Receipts</h1>
            </div>

            <div className="flex items-center gap-2">
              {/* Search Icon */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by reference or contact..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-100 text-gray-900"
                />
              </div>

              {/* View Toggle Icons */}
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded transition-colors ${viewMode === 'list'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                    }`}
                  title="List View"
                >
                  <List className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('kanban')}
                  className={`p-2 rounded transition-colors ${viewMode === 'kanban'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                    }`}
                  title="Kanban View"
                >
                  <LayoutGrid className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* List View */}
          {viewMode === 'list' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th 
                        className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleSort('reference')}
                      >
                        <div className="flex items-center gap-2">
                          Reference
                          {sortColumn === 'reference' ? (
                            sortDirection === 'asc' ? (
                              <ArrowUp className="w-4 h-4 text-blue-600" />
                            ) : (
                              <ArrowDown className="w-4 h-4 text-blue-600" />
                            )
                          ) : (
                            <ArrowDown className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleSort('from')}
                      >
                        <div className="flex items-center gap-2">
                          From
                          {sortColumn === 'from' ? (
                            sortDirection === 'asc' ? (
                              <ArrowUp className="w-4 h-4 text-blue-600" />
                            ) : (
                              <ArrowDown className="w-4 h-4 text-blue-600" />
                            )
                          ) : (
                            <ArrowDown className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleSort('to')}
                      >
                        <div className="flex items-center gap-2">
                          To
                          {sortColumn === 'to' ? (
                            sortDirection === 'asc' ? (
                              <ArrowUp className="w-4 h-4 text-blue-600" />
                            ) : (
                              <ArrowDown className="w-4 h-4 text-blue-600" />
                            )
                          ) : (
                            <ArrowDown className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleSort('contact')}
                      >
                        <div className="flex items-center gap-2">
                          Contact
                          {sortColumn === 'contact' ? (
                            sortDirection === 'asc' ? (
                              <ArrowUp className="w-4 h-4 text-blue-600" />
                            ) : (
                              <ArrowDown className="w-4 h-4 text-blue-600" />
                            )
                          ) : (
                            <ArrowDown className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleSort('scheduleDate')}
                      >
                        <div className="flex items-center gap-2">
                          Schedule date
                          {sortColumn === 'scheduleDate' ? (
                            sortDirection === 'asc' ? (
                              <ArrowUp className="w-4 h-4 text-blue-600" />
                            ) : (
                              <ArrowDown className="w-4 h-4 text-blue-600" />
                            )
                          ) : (
                            <ArrowDown className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleSort('status')}
                      >
                        <div className="flex items-center gap-2">
                          Status
                          {sortColumn === 'status' ? (
                            sortDirection === 'asc' ? (
                              <ArrowUp className="w-4 h-4 text-blue-600" />
                            ) : (
                              <ArrowDown className="w-4 h-4 text-blue-600" />
                            )
                          ) : (
                            <ArrowDown className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredReceipts.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                          No receipts found
                        </td>
                      </tr>
                    ) : (
                      filteredReceipts.map((receipt) => (
                        <tr 
                          key={receipt.id} 
                          onClick={() => setSelectedReceiptId(receipt.id)}
                          onDoubleClick={() => {
                            setSelectedReceiptId(receipt.id);
                            setIsDetailModalOpen(true);
                          }}
                          className={`hover:bg-gray-50 transition-colors cursor-pointer ${
                            selectedReceiptId === receipt.id ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                          }`}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{receipt.reference}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-700">{receipt.from}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-700">{receipt.to}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-700">{receipt.contact}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{receipt.scheduleDate || '-'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(receipt.status)}`}>
                              {receipt.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Kanban View */}
          {viewMode === 'kanban' && (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {Object.entries(groupedByStatus).map(([status, receipts]) => (
                <div
                  key={status}
                  className="bg-white rounded-lg border border-gray-200 p-4"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, status as Receipt['status'])}
                >
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-1">{status}</h3>
                    <span className="text-xs text-gray-500">{receipts.length} items</span>
                  </div>
                  <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto">
                    {receipts.map((receipt) => (
                      <div
                        key={receipt.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, receipt.id)}
                        className={`bg-gray-50 rounded-lg p-3 border border-gray-200 hover:shadow-md transition-shadow cursor-move ${draggedReceiptId === receipt.id ? 'opacity-50' : ''
                          }`}
                      >
                        <div className="text-xs font-medium text-gray-900 mb-1">{receipt.reference}</div>
                        <div className="text-xs text-gray-600 mb-2">{receipt.contact}</div>
                        <div className="text-xs text-gray-500">
                          <div>From: {receipt.from}</div>
                          <div>To: {receipt.to}</div>
                          {receipt.scheduleDate && (
                            <div className="mt-1">Date: {receipt.scheduleDate}</div>
                          )}
                        </div>
                      </div>
                    ))}
                    {receipts.length === 0 && (
                      <div className="text-xs text-gray-400 text-center py-4 border-2 border-dashed border-gray-300 rounded-lg p-4">
                        Drop here
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add Receipt Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto z-50">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Add New Receipt</h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      From <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newReceipt.from}
                      onChange={(e) => setNewReceipt({ ...newReceipt, from: e.target.value })}
                      placeholder="Enter source (e.g., vendor)"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      To (Warehouse Location) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newReceipt.to}
                      onChange={(e) => setNewReceipt({ ...newReceipt, to: e.target.value })}
                      placeholder="Enter destination (e.g., WH/Stock1)"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newReceipt.contact}
                      onChange={(e) => setNewReceipt({ ...newReceipt, contact: e.target.value })}
                      placeholder="Enter contact name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Schedule Date
                    </label>
                    <input
                      type="date"
                      value={newReceipt.scheduleDate}
                      onChange={(e) => setNewReceipt({ ...newReceipt, scheduleDate: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={newReceipt.status}
                      onChange={(e) => setNewReceipt({ ...newReceipt, status: e.target.value as Receipt['status'] })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-3 pt-4">
                    <button
                      onClick={handleAddReceipt}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Add Receipt
                    </button>
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Receipt Detail Modal */}
          {isDetailModalOpen && selectedReceipt && (
            <div className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto z-50">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Receipt</h2>
                  <div className="flex items-center gap-3">
                    {/* Status Workflow Indicator */}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className={selectedReceipt.status === 'Draft' ? 'font-semibold text-blue-600' : ''}>Draft</span>
                      <span className="text-gray-400">›</span>
                      <span className={selectedReceipt.status === 'Ready' ? 'font-semibold text-blue-600' : ''}>Ready</span>
                      <span className="text-gray-400">›</span>
                      <span className={selectedReceipt.status === 'Done' ? 'font-semibold text-blue-600' : ''}>Done</span>
                    </div>
                    <button
                      onClick={() => setIsDetailModalOpen(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      New
                    </button>
                    {selectedReceipt.status === 'Draft' && (
                      <button
                        onClick={handleToDo}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        To DO
                      </button>
                    )}
                    {selectedReceipt.status === 'Ready' && (
                      <button
                        onClick={handleValidate}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Validate
                      </button>
                    )}
                    {selectedReceipt.status === 'Done' && (
                      <button
                        onClick={handlePrint}
                        className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                      >
                        <Printer className="w-4 h-4" />
                        Print
                      </button>
                    )}
                    <button
                      onClick={() => setIsDetailModalOpen(false)}
                      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  </div>

                  {/* Receipt Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Reference</label>
                      <div className="text-lg font-semibold text-gray-900">{selectedReceipt.reference}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Receive From</label>
                      <input
                        type="text"
                        value={selectedReceipt.from}
                        onChange={(e) => {
                          setReceiptsData(prevReceipts =>
                            prevReceipts.map(receipt =>
                              receipt.id === selectedReceiptId
                                ? { ...receipt, from: e.target.value }
                                : receipt
                            )
                          );
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Schedule Date</label>
                      <input
                        type="date"
                        value={selectedReceipt.scheduleDate || ''}
                        onChange={(e) => {
                          setReceiptsData(prevReceipts =>
                            prevReceipts.map(receipt =>
                              receipt.id === selectedReceiptId
                                ? { ...receipt, scheduleDate: e.target.value || null }
                                : receipt
                            )
                          );
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Responsible</label>
                      <input
                        type="text"
                        value={selectedReceipt.responsible || 'Current User'}
                        readOnly
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                      />
                      <p className="text-xs text-gray-500 mt-1">Auto-filled with current logged in user</p>
                    </div>
                  </div>

                  {/* Products Section */}
                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Products</h3>
                    
                    {/* Products Table */}
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-4">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Product</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Quantity</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {selectedReceipt.products && selectedReceipt.products.length > 0 ? (
                            selectedReceipt.products.map((product) => (
                              <tr key={product.id}>
                                <td className="px-4 py-3">
                                  <div className="text-sm text-gray-900">
                                    <span className="font-medium">[{product.productCode}]</span> {product.productName}
                                  </div>
                                </td>
                                <td className="px-4 py-3">
                                  <div className="text-sm text-gray-700">{product.quantity}</div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={2} className="px-4 py-8 text-center text-gray-500 text-sm">
                                No products added
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Add New Product */}
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">New Product</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <input
                          type="text"
                          placeholder="Product Code (e.g., DESK001)"
                          value={newProduct.productCode}
                          onChange={(e) => setNewProduct({ ...newProduct, productCode: e.target.value })}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Product Name (e.g., Desk)"
                          value={newProduct.productName}
                          onChange={(e) => setNewProduct({ ...newProduct, productName: e.target.value })}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 text-sm"
                        />
                        <div className="flex gap-2">
                          <input
                            type="number"
                            placeholder="Quantity"
                            value={newProduct.quantity}
                            onChange={(e) => setNewProduct({ ...newProduct, quantity: parseInt(e.target.value) || 1 })}
                            min="1"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 text-sm"
                          />
                          <button
                            onClick={handleAddProduct}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

