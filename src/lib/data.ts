export interface Product {
  id: string;
  name: string;
  genericName: string;
  category: string;
  manufacturer: string;
  barcode: string;
  price: number;
  costPrice: number;
  stock: number;
  minStock: number;
  maxStock: number;
  expiryDate: string;
  batchNumber: string;
  pharmacyId: string;
  pharmacyName: string;
  status: "ok" | "low" | "critical" | "expired";
  requiresPrescription: boolean;
  uses: string[];
  dosage: string;
}

export interface Sale {
  id: string;
  pharmacyId: string;
  pharmacyName: string;
  products: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    total: number;
  }[];
  total: number;
  paymentMethod: "cash" | "card" | "transfer";
  customerId?: string;
  customerName?: string;
  soldBy: string;
  soldByName: string;
  date: string;
  time: string;
  hasPrescription: boolean;
}

export interface Pharmacy {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  manager: string;
  status: "active" | "inactive";
  productsCount: number;
  totalSales: number;
  monthlySales: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "pharmacist" | "cashier";
  pharmacyId: string;
  pharmacyName: string;
  status: "active" | "inactive";
  lastLogin: string;
}

export interface DashboardStats {
  totalProducts: number;
  lowStockProducts: number;
  expiringSoon: number;
  totalSales: number;
  todaySales: number;
  monthSales: number;
  activePharmacies: number;
  totalUsers: number;
}

export interface AIMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  products?: Product[];
}

// Sample Products
export const products: Product[] = [
  {
    id: "p1",
    name: "Paracetamol 500mg",
    genericName: "Acetaminofeno",
    category: "Analgesico",
    manufacturer: "Bayer",
    barcode: "7891234567890",
    price: 12.50,
    costPrice: 8.00,
    stock: 450,
    minStock: 100,
    maxStock: 1000,
    expiryDate: "2026-08-15",
    batchNumber: "LOT2024-001",
    pharmacyId: "f1",
    pharmacyName: "Farmacia Central",
    status: "ok",
    requiresPrescription: false,
    uses: ["dolor de cabeza", "fiebre", "dolor muscular"],
    dosage: "1 comprimido cada 6-8 horas",
  },
  {
    id: "p2",
    name: "Ibuprofeno 400mg",
    genericName: "Ibuprofeno",
    category: "Antiinflamatorio",
    manufacturer: "Pfizer",
    barcode: "7891234567891",
    price: 18.90,
    costPrice: 12.00,
    stock: 85,
    minStock: 100,
    maxStock: 800,
    expiryDate: "2026-12-20",
    batchNumber: "LOT2024-002",
    pharmacyId: "f1",
    pharmacyName: "Farmacia Central",
    status: "low",
    requiresPrescription: false,
    uses: ["inflamacion", "dolor", "fiebre"],
    dosage: "1 comprimido cada 8 horas con alimentos",
  },
  {
    id: "p3",
    name: "Amoxicilina 500mg",
    genericName: "Amoxicilina",
    category: "Antibiotico",
    manufacturer: "EMS",
    barcode: "7891234567892",
    price: 45.00,
    costPrice: 28.00,
    stock: 220,
    minStock: 80,
    maxStock: 500,
    expiryDate: "2026-06-30",
    batchNumber: "LOT2024-003",
    pharmacyId: "f1",
    pharmacyName: "Farmacia Central",
    status: "ok",
    requiresPrescription: true,
    uses: ["infeccion bacteriana", "garganta", "oido"],
    dosage: "1 capsula cada 8 horas por 7-10 dias",
  },
  {
    id: "p4",
    name: "Omeprazol 20mg",
    genericName: "Omeprazol",
    category: "Gastroprotector",
    manufacturer: "Medley",
    barcode: "7891234567893",
    price: 25.50,
    costPrice: 16.00,
    stock: 320,
    minStock: 120,
    maxStock: 600,
    expiryDate: "2027-03-15",
    batchNumber: "LOT2024-004",
    pharmacyId: "f1",
    pharmacyName: "Farmacia Central",
    status: "ok",
    requiresPrescription: false,
    uses: ["acidez", "gastritis", "reflujo"],
    dosage: "1 capsula en ayunas 30 min antes del desayuno",
  },
  {
    id: "p5",
    name: "Loratadina 10mg",
    genericName: "Loratadina",
    category: "Antihistaminico",
    manufacturer: "Novartis",
    barcode: "7891234567894",
    price: 15.80,
    costPrice: 10.00,
    stock: 180,
    minStock: 100,
    maxStock: 500,
    expiryDate: "2026-09-10",
    batchNumber: "LOT2024-005",
    pharmacyId: "f1",
    pharmacyName: "Farmacia Central",
    status: "ok",
    requiresPrescription: false,
    uses: ["alergia", "rinitis", "picazon"],
    dosage: "1 comprimido al dia",
  },
  {
    id: "p6",
    name: "Diclofenaco 50mg",
    genericName: "Diclofenaco Sodico",
    category: "Antiinflamatorio",
    manufacturer: "Sandoz",
    barcode: "7891234567895",
    price: 22.00,
    costPrice: 14.00,
    stock: 45,
    minStock: 80,
    maxStock: 400,
    expiryDate: "2026-04-25",
    batchNumber: "LOT2024-006",
    pharmacyId: "f2",
    pharmacyName: "Farmacia del Norte",
    status: "critical",
    requiresPrescription: false,
    uses: ["dolor intenso", "inflamacion", "artritis"],
    dosage: "1 comprimido cada 12 horas con alimentos",
  },
  {
    id: "p7",
    name: "Metformina 850mg",
    genericName: "Clorhidrato de Metformina",
    category: "Antidiabetico",
    manufacturer: "Roche",
    barcode: "7891234567896",
    price: 35.00,
    costPrice: 22.00,
    stock: 280,
    minStock: 150,
    maxStock: 600,
    expiryDate: "2027-01-18",
    batchNumber: "LOT2024-007",
    pharmacyId: "f2",
    pharmacyName: "Farmacia del Norte",
    status: "ok",
    requiresPrescription: true,
    uses: ["diabetes tipo 2"],
    dosage: "1 comprimido 2-3 veces al dia con las comidas",
  },
  {
    id: "p8",
    name: "Losartan 50mg",
    genericName: "Losartan Potasico",
    category: "Antihipertensivo",
    manufacturer: "AstraZeneca",
    barcode: "7891234567897",
    price: 28.50,
    costPrice: 18.00,
    stock: 195,
    minStock: 120,
    maxStock: 500,
    expiryDate: "2026-11-05",
    batchNumber: "LOT2024-008",
    pharmacyId: "f2",
    pharmacyName: "Farmacia del Norte",
    status: "ok",
    requiresPrescription: true,
    uses: ["presion arterial alta", "hipertension"],
    dosage: "1 comprimido al dia",
  },
  {
    id: "p9",
    name: "Ranitidina 150mg",
    genericName: "Ranitidina",
    category: "Gastroprotector",
    manufacturer: "Glenmark",
    barcode: "7891234567898",
    price: 18.00,
    costPrice: 11.00,
    stock: 35,
    minStock: 60,
    maxStock: 300,
    expiryDate: "2026-02-10",
    batchNumber: "LOT2024-009",
    pharmacyId: "f3",
    pharmacyName: "Farmacia Sur",
    status: "critical",
    requiresPrescription: false,
    uses: ["acidez", "ulcera", "gastritis"],
    dosage: "1 comprimido cada 12 horas",
  },
  {
    id: "p10",
    name: "Dipirona 500mg",
    genericName: "Metamizol Sodico",
    category: "Analgesico",
    manufacturer: "Sanofi",
    barcode: "7891234567899",
    price: 14.90,
    costPrice: 9.00,
    stock: 520,
    minStock: 150,
    maxStock: 1000,
    expiryDate: "2027-05-22",
    batchNumber: "LOT2024-010",
    pharmacyId: "f3",
    pharmacyName: "Farmacia Sur",
    status: "ok",
    requiresPrescription: false,
    uses: ["dolor", "fiebre", "colico"],
    dosage: "1 comprimido cada 6 horas segun necesidad",
  },
  {
    id: "p11",
    name: "Aspirina 100mg",
    genericName: "Acido Acetilsalicilico",
    category: "Anticoagulante",
    manufacturer: "Bayer",
    barcode: "7891234567900",
    price: 16.50,
    costPrice: 10.50,
    stock: 340,
    minStock: 100,
    maxStock: 600,
    expiryDate: "2026-07-12",
    batchNumber: "LOT2024-011",
    pharmacyId: "f3",
    pharmacyName: "Farmacia Sur",
    status: "ok",
    requiresPrescription: false,
    uses: ["prevencion cardiovascular", "dolor leve"],
    dosage: "1 comprimido al dia",
  },
  {
    id: "p12",
    name: "Dimenhidrinato 50mg",
    genericName: "Dimenhidrinato",
    category: "Antiemetico",
    manufacturer: "Pfizer",
    barcode: "7891234567901",
    price: 19.80,
    costPrice: 12.50,
    stock: 88,
    minStock: 80,
    maxStock: 400,
    expiryDate: "2026-03-08",
    batchNumber: "LOT2024-012",
    pharmacyId: "f1",
    pharmacyName: "Farmacia Central",
    status: "low",
    requiresPrescription: false,
    uses: ["nauseas", "vomitos", "mareos"],
    dosage: "1 comprimido cada 6-8 horas",
  },
];

// Sample Sales
export const sales: Sale[] = [
  {
    id: "s1",
    pharmacyId: "f1",
    pharmacyName: "Farmacia Central",
    products: [
      {
        productId: "p1",
        productName: "Paracetamol 500mg",
        quantity: 2,
        price: 12.50,
        total: 25.00,
      },
      {
        productId: "p4",
        productName: "Omeprazol 20mg",
        quantity: 1,
        price: 25.50,
        total: 25.50,
      },
    ],
    total: 50.50,
    paymentMethod: "cash",
    soldBy: "u3",
    soldByName: "Maria Santos",
    date: "2025-02-02",
    time: "09:15:00",
    hasPrescription: false,
  },
  {
    id: "s2",
    pharmacyId: "f1",
    pharmacyName: "Farmacia Central",
    products: [
      {
        productId: "p3",
        productName: "Amoxicilina 500mg",
        quantity: 1,
        price: 45.00,
        total: 45.00,
      },
    ],
    total: 45.00,
    paymentMethod: "card",
    customerName: "Carlos Mendoza",
    soldBy: "u3",
    soldByName: "Maria Santos",
    date: "2025-02-02",
    time: "10:30:00",
    hasPrescription: true,
  },
  {
    id: "s3",
    pharmacyId: "f2",
    pharmacyName: "Farmacia del Norte",
    products: [
      {
        productId: "p2",
        productName: "Ibuprofeno 400mg",
        quantity: 3,
        price: 18.90,
        total: 56.70,
      },
    ],
    total: 56.70,
    paymentMethod: "transfer",
    soldBy: "u4",
    soldByName: "Pedro Lima",
    date: "2025-02-02",
    time: "11:45:00",
    hasPrescription: false,
  },
  {
    id: "s4",
    pharmacyId: "f3",
    pharmacyName: "Farmacia Sur",
    products: [
      {
        productId: "p10",
        productName: "Dipirona 500mg",
        quantity: 2,
        price: 14.90,
        total: 29.80,
      },
      {
        productId: "p11",
        productName: "Aspirina 100mg",
        quantity: 1,
        price: 16.50,
        total: 16.50,
      },
    ],
    total: 46.30,
    paymentMethod: "cash",
    soldBy: "u5",
    soldByName: "Ana Rodriguez",
    date: "2025-02-02",
    time: "14:20:00",
    hasPrescription: false,
  },
];

// Sample Pharmacies
export const pharmacies: Pharmacy[] = [
  {
    id: "f1",
    name: "Farmacia Central",
    address: "Av. Principal 123, Centro",
    phone: "+55 11 3456-7890",
    email: "central@farmacia.com",
    manager: "Roberto Silva",
    status: "active",
    productsCount: 847,
    totalSales: 125680.50,
    monthlySales: 18450.00,
  },
  {
    id: "f2",
    name: "Farmacia del Norte",
    address: "Calle Norte 456, Zona Norte",
    phone: "+55 11 3456-7891",
    email: "norte@farmacia.com",
    manager: "Julia Costa",
    status: "active",
    productsCount: 623,
    totalSales: 98340.80,
    monthlySales: 14230.00,
  },
  {
    id: "f3",
    name: "Farmacia Sur",
    address: "Av. Sur 789, Zona Sur",
    phone: "+55 11 3456-7892",
    email: "sur@farmacia.com",
    manager: "Carlos Mendoza",
    status: "active",
    productsCount: 534,
    totalSales: 87520.30,
    monthlySales: 11890.00,
  },
];

// Sample Users
export const users: User[] = [
  {
    id: "u1",
    name: "Admin Principal",
    email: "admin@farmacia.com",
    role: "admin",
    pharmacyId: "all",
    pharmacyName: "Todas",
    status: "active",
    lastLogin: "2025-02-02 08:30:00",
  },
  {
    id: "u2",
    name: "Roberto Silva",
    email: "roberto@farmacia.com",
    role: "manager",
    pharmacyId: "f1",
    pharmacyName: "Farmacia Central",
    status: "active",
    lastLogin: "2025-02-02 09:00:00",
  },
  {
    id: "u3",
    name: "Maria Santos",
    email: "maria@farmacia.com",
    role: "pharmacist",
    pharmacyId: "f1",
    pharmacyName: "Farmacia Central",
    status: "active",
    lastLogin: "2025-02-02 08:45:00",
  },
  {
    id: "u4",
    name: "Pedro Lima",
    email: "pedro@farmacia.com",
    role: "pharmacist",
    pharmacyId: "f2",
    pharmacyName: "Farmacia del Norte",
    status: "active",
    lastLogin: "2025-02-02 09:15:00",
  },
  {
    id: "u5",
    name: "Ana Rodriguez",
    email: "ana@farmacia.com",
    role: "cashier",
    pharmacyId: "f3",
    pharmacyName: "Farmacia Sur",
    status: "active",
    lastLogin: "2025-02-02 10:00:00",
  },
];

// Dashboard Statistics
export const dashboardStats: DashboardStats = {
  totalProducts: 2847,
  lowStockProducts: 23,
  expiringSoon: 12,
  totalSales: 311541.60,
  todaySales: 4850.30,
  monthSales: 44570.00,
  activePharmacies: 3,
  totalUsers: 12,
};

// Format currency
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("es-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

// Get days until expiry
export const getDaysUntilExpiry = (expiryDate: string): number => {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Get product status
export const getProductStatus = (stock: number, minStock: number, expiryDate: string): "ok" | "low" | "critical" | "expired" => {
  const daysUntilExpiry = getDaysUntilExpiry(expiryDate);

  if (daysUntilExpiry < 0) return "expired";
  if (stock === 0) return "critical";
  if (stock < minStock * 0.5) return "critical";
  if (stock < minStock) return "low";
  return "ok";
};
