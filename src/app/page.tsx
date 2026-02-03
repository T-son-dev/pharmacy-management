"use client";

import { useState, useMemo } from "react";
import { Pill, LayoutDashboard, Package, ShoppingCart, Bot, Users, Building2, Search, Plus, AlertCircle, Clock, TrendingUp, ChevronDown, X, Send, CheckCircle } from "lucide-react";
import { products, sales, pharmacies, users, dashboardStats, formatCurrency, getDaysUntilExpiry, type Product, type Sale, type Pharmacy, type User } from "@/lib/data";

type TabType = "dashboard" | "inventory" | "sales" | "ai" | "pharmacies" | "users";

export default function PharmacySystem() {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [pharmacyFilter, setPharmacyFilter] = useState("all");

  // Sales state
  const [cart, setCart] = useState<Array<{ product: Product; quantity: number }>>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showAddToCart, setShowAddToCart] = useState(false);
  const [saleSuccess, setSaleSuccess] = useState(false);

  // AI state
  const [aiMessages, setAiMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([
    { role: "assistant", content: "Hola! Soy el asistente de FarmaControl. Puedo ayudarte a encontrar medicamentos basándome en síntomas o necesidades. ¿En qué puedo ayudarte?" }
  ]);
  const [aiInput, setAiInput] = useState("");
  const [aiTyping, setAiTyping] = useState(false);

  // Inventory state
  const [inventoryData, setInventoryData] = useState(products);

  // Filtered products for inventory
  const filteredProducts = useMemo(() => {
    return inventoryData.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.genericName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
      const matchesStatus = statusFilter === "all" || product.status === statusFilter;
      const matchesPharmacy = pharmacyFilter === "all" || product.pharmacyId === pharmacyFilter;
      return matchesSearch && matchesCategory && matchesStatus && matchesPharmacy;
    });
  }, [inventoryData, searchTerm, categoryFilter, statusFilter, pharmacyFilter]);

  // Get unique categories
  const categories = useMemo(() => {
    return Array.from(new Set(products.map(p => p.category)));
  }, []);

  // Alerts
  const alerts = useMemo(() => {
    const lowStock = inventoryData.filter(p => p.status === "low" || p.status === "critical");
    const expiring = inventoryData.filter(p => {
      const days = getDaysUntilExpiry(p.expiryDate);
      return days <= 30 && days >= 0;
    });
    const expired = inventoryData.filter(p => p.status === "expired");
    return { lowStock, expiring, expired };
  }, [inventoryData]);

  // Handle add to cart
  const handleAddToCart = (quantity: number) => {
    if (selectedProduct) {
      const existingItem = cart.find(item => item.product.id === selectedProduct.id);
      if (existingItem) {
        setCart(cart.map(item =>
          item.product.id === selectedProduct.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        ));
      } else {
        setCart([...cart, { product: selectedProduct, quantity }]);
      }
      setShowAddToCart(false);
      setSelectedProduct(null);
    }
  };

  // Handle complete sale
  const handleCompleteSale = () => {
    // Update inventory by reducing stock
    const updatedInventory = inventoryData.map(product => {
      const cartItem = cart.find(item => item.product.id === product.id);
      if (cartItem) {
        const newStock = product.stock - cartItem.quantity;
        return {
          ...product,
          stock: newStock,
          status: newStock <= 0 ? "critical" as const :
                 newStock <= product.minStock ? "low" as const : "ok" as const
        };
      }
      return product;
    });

    setInventoryData(updatedInventory);
    setCart([]);
    setSaleSuccess(true);
    setTimeout(() => setSaleSuccess(false), 3000);
  };

  // Handle AI message
  const handleAiMessage = () => {
    if (!aiInput.trim()) return;

    const userMessage = aiInput;
    setAiMessages([...aiMessages, { role: "user", content: userMessage }]);
    setAiInput("");
    setAiTyping(true);

    // Simulate AI response based on symptoms
    setTimeout(() => {
      let response = "";
      const lowerInput = userMessage.toLowerCase();

      if (lowerInput.includes("dolor de cabeza") || lowerInput.includes("cefalea")) {
        const available = inventoryData.filter(p =>
          p.uses.some(use => use.toLowerCase().includes("dolor de cabeza")) && p.stock > 0
        );
        response = `Para dolor de cabeza, tengo disponibles:\n\n${available.map(p =>
          `• ${p.name} - ${formatCurrency(p.price)} (Stock: ${p.stock})\n  Dosis: ${p.dosage}`
        ).join('\n\n')}\n\n¿Necesitas más información sobre alguno?`;
      } else if (lowerInput.includes("fiebre") || lowerInput.includes("temperatura")) {
        const available = inventoryData.filter(p =>
          p.uses.some(use => use.toLowerCase().includes("fiebre")) && p.stock > 0
        );
        response = `Para fiebre, recomiendo:\n\n${available.map(p =>
          `• ${p.name} - ${formatCurrency(p.price)} (Stock: ${p.stock})\n  Dosis: ${p.dosage}`
        ).join('\n\n')}`;
      } else if (lowerInput.includes("gripe") || lowerInput.includes("resfriado")) {
        const available = inventoryData.filter(p =>
          p.uses.some(use => use.toLowerCase().includes("gripe") || use.toLowerCase().includes("resfriado")) && p.stock > 0
        );
        response = `Para gripe o resfriado:\n\n${available.map(p =>
          `• ${p.name} - ${formatCurrency(p.price)} (Stock: ${p.stock})\n  Dosis: ${p.dosage}`
        ).join('\n\n')}`;
      } else if (lowerInput.includes("alergia")) {
        const available = inventoryData.filter(p =>
          p.uses.some(use => use.toLowerCase().includes("alergia")) && p.stock > 0
        );
        response = available.length > 0
          ? `Para alergias:\n\n${available.map(p => `• ${p.name} - ${formatCurrency(p.price)} (Stock: ${p.stock})\n  Dosis: ${p.dosage}`).join('\n\n')}`
          : "Para alergias, generalmente recomendamos antihistamínicos. Por favor consulta con el farmacéutico sobre opciones disponibles.";
      } else {
        response = "Entiendo. ¿Podrías describir los síntomas específicos? Por ejemplo: dolor de cabeza, fiebre, tos, dolor muscular, etc. Así podré recomendarte el mejor medicamento de nuestro inventario.";
      }

      setAiMessages(prev => [...prev, { role: "assistant", content: response }]);
      setAiTyping(false);
    }, 1500);
  };

  // Cart total
  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  }, [cart]);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
              <Pill className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">FarmaControl</h1>
              <p className="text-xs text-gray-500">Sistema con IA</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
              activeTab === "dashboard" ? "bg-green-50 text-green-700" : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab("inventory")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
              activeTab === "inventory" ? "bg-green-50 text-green-700" : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Package className="w-5 h-5" />
            <span className="font-medium">Inventario</span>
          </button>

          <button
            onClick={() => setActiveTab("sales")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
              activeTab === "sales" ? "bg-green-50 text-green-700" : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="font-medium">Punto de Venta</span>
            {cart.length > 0 && (
              <span className="ml-auto bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("ai")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
              activeTab === "ai" ? "bg-green-50 text-green-700" : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Bot className="w-5 h-5" />
            <span className="font-medium">Asistente IA</span>
          </button>

          <button
            onClick={() => setActiveTab("pharmacies")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
              activeTab === "pharmacies" ? "bg-green-50 text-green-700" : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Building2 className="w-5 h-5" />
            <span className="font-medium">Farmacias</span>
          </button>

          <button
            onClick={() => setActiveTab("users")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
              activeTab === "users" ? "bg-green-50 text-green-700" : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="font-medium">Usuarios</span>
          </button>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="bg-green-50 rounded-lg p-3">
            <p className="text-xs text-green-700 font-medium">Usuario Actual</p>
            <p className="text-sm font-semibold text-green-900">Admin Principal</p>
            <p className="text-xs text-green-600">Administrador</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Dashboard */}
          {activeTab === "dashboard" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <Package className="w-8 h-8 text-green-600 mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalProducts}</p>
                  <p className="text-sm text-gray-600">Total Productos</p>
                </div>
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <ShoppingCart className="w-8 h-8 text-blue-600 mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(dashboardStats.todaySales)}</p>
                  <p className="text-sm text-gray-600">Ventas Hoy</p>
                </div>
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <Building2 className="w-8 h-8 text-orange-600 mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{dashboardStats.activePharmacies}</p>
                  <p className="text-sm text-gray-600">Farmacias Activas</p>
                </div>
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <Users className="w-8 h-8 text-purple-600 mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalUsers}</p>
                  <p className="text-sm text-gray-600">Usuarios</p>
                </div>
              </div>

              {/* Alerts */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 border border-red-200">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <h3 className="font-semibold text-gray-900">Stock Bajo/Crítico</h3>
                  </div>
                  <p className="text-3xl font-bold text-red-600 mb-2">{alerts.lowStock.length}</p>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {alerts.lowStock.slice(0, 5).map(p => (
                      <div key={p.id} className="text-sm">
                        <p className="font-medium text-gray-900">{p.name}</p>
                        <p className="text-xs text-gray-600">Stock: {p.stock} ({p.status})</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-orange-200">
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="w-5 h-5 text-orange-600" />
                    <h3 className="font-semibold text-gray-900">Por Vencer (30 días)</h3>
                  </div>
                  <p className="text-3xl font-bold text-orange-600 mb-2">{alerts.expiring.length}</p>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {alerts.expiring.slice(0, 5).map(p => (
                      <div key={p.id} className="text-sm">
                        <p className="font-medium text-gray-900">{p.name}</p>
                        <p className="text-xs text-gray-600">{getDaysUntilExpiry(p.expiryDate)} días</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-300">
                  <div className="flex items-center gap-2 mb-4">
                    <X className="w-5 h-5 text-gray-600" />
                    <h3 className="font-semibold text-gray-900">Productos Vencidos</h3>
                  </div>
                  <p className="text-3xl font-bold text-gray-600 mb-2">{alerts.expired.length}</p>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {alerts.expired.slice(0, 5).map(p => (
                      <div key={p.id} className="text-sm">
                        <p className="font-medium text-gray-900">{p.name}</p>
                        <p className="text-xs text-gray-600">Vencido</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Sales */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Ventas Recientes</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">ID</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Productos</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Total</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Farmacia</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Fecha</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sales.slice(0, 5).map(sale => (
                        <tr key={sale.id} className="border-b border-gray-100">
                          <td className="py-3 px-4 text-sm text-gray-900">{sale.id}</td>
                          <td className="py-3 px-4 text-sm text-gray-600">{sale.products.length} item(s)</td>
                          <td className="py-3 px-4 text-sm font-medium text-gray-900">{formatCurrency(sale.total)}</td>
                          <td className="py-3 px-4 text-sm text-gray-600">{sale.pharmacyName}</td>
                          <td className="py-3 px-4 text-sm text-gray-600">{sale.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Inventory */}
          {activeTab === "inventory" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Gestión de Inventario</h2>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Agregar Producto
                </button>
              </div>

              {/* Filters */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Nombre o genérico..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="all">Todas</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="all">Todos</option>
                      <option value="ok">OK</option>
                      <option value="low">Bajo</option>
                      <option value="critical">Crítico</option>
                      <option value="expired">Vencido</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Farmacia</label>
                    <select
                      value={pharmacyFilter}
                      onChange={(e) => setPharmacyFilter(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="all">Todas</option>
                      {pharmacies.map(ph => (
                        <option key={ph.id} value={ph.id}>{ph.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Products Table */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Producto</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Categoría</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Stock</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Precio</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Vencimiento</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Estado</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Farmacia</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map(product => {
                        const daysUntilExpiry = getDaysUntilExpiry(product.expiryDate);
                        return (
                          <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <p className="font-medium text-gray-900">{product.name}</p>
                              <p className="text-sm text-gray-600">{product.genericName}</p>
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-600">{product.category}</td>
                            <td className="py-3 px-4">
                              <p className="font-medium text-gray-900">{product.stock}</p>
                              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                                <div
                                  className={`h-1.5 rounded-full ${
                                    product.status === "ok" ? "bg-green-600" :
                                    product.status === "low" ? "bg-orange-600" :
                                    product.status === "critical" ? "bg-red-600" :
                                    "bg-gray-600"
                                  }`}
                                  style={{ width: `${Math.min((product.stock / product.maxStock) * 100, 100)}%` }}
                                />
                              </div>
                            </td>
                            <td className="py-3 px-4 text-sm font-medium text-gray-900">{formatCurrency(product.price)}</td>
                            <td className="py-3 px-4">
                              <p className="text-sm text-gray-900">{product.expiryDate}</p>
                              <p className={`text-xs ${
                                daysUntilExpiry < 0 ? "text-gray-600" :
                                daysUntilExpiry <= 30 ? "text-red-600" :
                                daysUntilExpiry <= 90 ? "text-orange-600" :
                                "text-green-600"
                              }`}>
                                {daysUntilExpiry < 0 ? "Vencido" : `${daysUntilExpiry} días`}
                              </p>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                product.status === "ok" ? "bg-green-100 text-green-700" :
                                product.status === "low" ? "bg-orange-100 text-orange-700" :
                                product.status === "critical" ? "bg-red-100 text-red-700" :
                                "bg-gray-100 text-gray-700"
                              }`}>
                                {product.status.toUpperCase()}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-600">{product.pharmacyName}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Sales / POS */}
          {activeTab === "sales" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Punto de Venta</h2>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Products Selection */}
                <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-4">Seleccionar Productos</h3>

                  <div className="mb-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar producto..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                    {inventoryData
                      .filter(p => p.stock > 0 && p.status !== "expired")
                      .filter(p => searchTerm === "" || p.name.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map(product => (
                        <div
                          key={product.id}
                          onClick={() => {
                            setSelectedProduct(product);
                            setShowAddToCart(true);
                          }}
                          className="border border-gray-200 rounded-lg p-4 hover:border-green-500 cursor-pointer transition-colors"
                        >
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-600">{product.genericName}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="font-semibold text-green-600">{formatCurrency(product.price)}</span>
                            <span className="text-xs text-gray-600">Stock: {product.stock}</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Cart */}
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-4">Carrito</h3>

                  {cart.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">Carrito vacío</p>
                  ) : (
                    <>
                      <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                        {cart.map((item, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-3">
                            <div className="flex items-start justify-between mb-2">
                              <p className="font-medium text-gray-900 text-sm">{item.product.name}</p>
                              <button
                                onClick={() => setCart(cart.filter((_, i) => i !== index))}
                                className="text-red-600 hover:text-red-700"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => {
                                    if (item.quantity > 1) {
                                      setCart(cart.map((cartItem, i) =>
                                        i === index ? { ...cartItem, quantity: cartItem.quantity - 1 } : cartItem
                                      ));
                                    }
                                  }}
                                  className="w-6 h-6 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50"
                                >
                                  -
                                </button>
                                <span className="text-sm font-medium">{item.quantity}</span>
                                <button
                                  onClick={() => {
                                    if (item.quantity < item.product.stock) {
                                      setCart(cart.map((cartItem, i) =>
                                        i === index ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
                                      ));
                                    }
                                  }}
                                  className="w-6 h-6 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50"
                                >
                                  +
                                </button>
                              </div>
                              <span className="text-sm font-semibold text-gray-900">
                                {formatCurrency(item.product.price * item.quantity)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="border-t border-gray-200 pt-4 mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-600">Subtotal</span>
                          <span className="font-medium text-gray-900">{formatCurrency(cartTotal)}</span>
                        </div>
                        <div className="flex items-center justify-between text-lg font-bold">
                          <span className="text-gray-900">Total</span>
                          <span className="text-green-600">{formatCurrency(cartTotal)}</span>
                        </div>
                      </div>

                      <button
                        onClick={handleCompleteSale}
                        className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="w-5 h-5" />
                        Completar Venta
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* AI Assistant */}
          {activeTab === "ai" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Asistente con IA</h2>

              <div className="bg-white rounded-xl border border-gray-200 h-[600px] flex flex-col">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {aiMessages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-md px-4 py-3 rounded-lg ${
                          message.role === "user"
                            ? "bg-green-600 text-white"
                            : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>
                    </div>
                  ))}

                  {aiTyping && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 px-4 py-3 rounded-lg">
                        <div className="typing-indicator flex gap-1">
                          <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                          <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                          <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input */}
                <div className="border-t border-gray-200 p-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={aiInput}
                      onChange={(e) => setAiInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleAiMessage()}
                      placeholder="Describe los síntomas o necesidades..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <button
                      onClick={handleAiMessage}
                      disabled={!aiInput.trim() || aiTyping}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Pharmacies */}
          {activeTab === "pharmacies" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Gestión de Farmacias</h2>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Nueva Farmacia
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pharmacies.map(pharmacy => (
                  <div key={pharmacy.id} className="bg-white rounded-xl p-6 border border-gray-200">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{pharmacy.name}</h3>
                        <p className="text-sm text-gray-600">{pharmacy.address}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        pharmacy.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                      }`}>
                        {pharmacy.status === "active" ? "Activa" : "Inactiva"}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Teléfono</span>
                        <span className="font-medium text-gray-900">{pharmacy.phone}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Gerente</span>
                        <span className="font-medium text-gray-900">{pharmacy.manager}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Productos</span>
                        <span className="font-medium text-gray-900">
                          {inventoryData.filter(p => p.pharmacyId === pharmacy.id).length}
                        </span>
                      </div>
                    </div>

                    <button className="w-full py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700">
                      Ver Detalles
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Users */}
          {activeTab === "users" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h2>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Nuevo Usuario
                </button>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Usuario</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Email</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Rol</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Farmacia</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Estado</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Último Acceso</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(user => (
                        <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <p className="font-medium text-gray-900">{user.name}</p>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">{user.email}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              user.role === "admin" ? "bg-purple-100 text-purple-700" :
                              user.role === "manager" ? "bg-blue-100 text-blue-700" :
                              user.role === "pharmacist" ? "bg-green-100 text-green-700" :
                              "bg-orange-100 text-orange-700"
                            }`}>
                              {user.role === "admin" ? "Administrador" :
                               user.role === "manager" ? "Gerente" :
                               user.role === "pharmacist" ? "Farmacéutico" :
                               "Cajero"}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">{user.pharmacyName}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              user.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                            }`}>
                              {user.status === "active" ? "Activo" : "Inactivo"}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {new Date(user.lastLogin).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add to Cart Modal */}
      {showAddToCart && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Agregar al Carrito</h3>
            <div className="mb-4">
              <p className="font-medium text-gray-900">{selectedProduct.name}</p>
              <p className="text-sm text-gray-600">{selectedProduct.genericName}</p>
              <p className="text-lg font-semibold text-green-600 mt-2">{formatCurrency(selectedProduct.price)}</p>
              <p className="text-sm text-gray-600">Stock disponible: {selectedProduct.stock}</p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Cantidad</label>
              <input
                type="number"
                min="1"
                max={selectedProduct.stock}
                defaultValue="1"
                id="quantity-input"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowAddToCart(false);
                  setSelectedProduct(null);
                }}
                className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  const quantity = parseInt((document.getElementById("quantity-input") as HTMLInputElement).value);
                  if (quantity > 0 && quantity <= selectedProduct.stock) {
                    handleAddToCart(quantity);
                  }
                }}
                className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Agregar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sale Success Message */}
      {saleSuccess && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50">
          <CheckCircle className="w-5 h-5" />
          <span>Venta completada con éxito</span>
        </div>
      )}
    </div>
  );
}
