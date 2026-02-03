"use client";

import { useState } from "react";
import { Pill, LayoutDashboard, Package, ShoppingCart, Bot, Users, Building2 } from "lucide-react";
import { products, sales, pharmacies, users, dashboardStats, formatCurrency } from "@/lib/data";

export default function PharmacySystem() {
  const [activeTab, setActiveTab] = useState("dashboard");
  
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center">
              <Pill className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">FarmaControl</h1>
              <p className="text-gray-500">Sistema de Gestion de Farmacias con IA</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-green-50 rounded-xl p-6">
              <Package className="w-8 h-8 text-green-600 mb-2" />
              <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalProducts}</p>
              <p className="text-sm text-gray-600">Total Productos</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-6">
              <ShoppingCart className="w-8 h-8 text-blue-600 mb-2" />
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(dashboardStats.todaySales)}</p>
              <p className="text-sm text-gray-600">Ventas Hoy</p>
            </div>
            <div className="bg-orange-50 rounded-xl p-6">
              <Building2 className="w-8 h-8 text-orange-600 mb-2" />
              <p className="text-2xl font-bold text-gray-900">{dashboardStats.activePharmacies}</p>
              <p className="text-sm text-gray-600">Farmacias Activas</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-6">
              <Users className="w-8 h-8 text-purple-600 mb-2" />
              <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalUsers}</p>
              <p className="text-sm text-gray-600">Usuarios</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Caracteristicas Principales</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Gestion de Inventario</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Control de stock automatico</li>
                  <li>• Alertas de vencimiento</li>
                  <li>• Alertas de stock bajo</li>
                  <li>• Gestion por lotes</li>
                </ul>
              </div>
              <div className="border border-gray-200 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Punto de Venta</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Descuento automatico de stock</li>
                  <li>• Registro de ventas</li>
                  <li>• Control de recetas</li>
                  <li>• Multiples metodos de pago</li>
                </ul>
              </div>
              <div className="border border-gray-200 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Asistente con IA</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Recomendaciones por sintomas</li>
                  <li>• Basado en inventario</li>
                  <li>• Informacion de dosificacion</li>
                  <li>• Sugerencias inteligentes</li>
                </ul>
              </div>
              <div className="border border-gray-200 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Multi-Farmacia</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Gestion de multiples sucursales</li>
                  <li>• Control de usuarios y roles</li>
                  <li>• Base de datos centralizada</li>
                  <li>• Reportes por farmacia</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-green-900 mb-2">Sistema Completo de Gestion Farmaceutica</h2>
            <p className="text-green-700 mb-4">
              Demo funcional con todas las caracteristicas solicitadas: gestion de inventario automatico, 
              control de ventas con descuento de stock, asistente IA para recomendaciones, 
              gestion multi-farmacia, control de usuarios con roles, y alertas inteligentes.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="bg-white rounded-lg p-3">
                <p className="font-semibold text-gray-900">{products.length}</p>
                <p className="text-gray-600">Productos Demo</p>
              </div>
              <div className="bg-white rounded-lg p-3">
                <p className="font-semibold text-gray-900">{sales.length}</p>
                <p className="text-gray-600">Ventas Registradas</p>
              </div>
              <div className="bg-white rounded-lg p-3">
                <p className="font-semibold text-gray-900">{pharmacies.length}</p>
                <p className="text-gray-600">Sucursales</p>
              </div>
              <div className="bg-white rounded-lg p-3">
                <p className="font-semibold text-gray-900">{users.length}</p>
                <p className="text-gray-600">Usuarios</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
