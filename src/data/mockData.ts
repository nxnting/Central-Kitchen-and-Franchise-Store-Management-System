// Mock data for the Central Kitchen & Franchise Store Management System

export interface Order {
  id: string;
  storeId: string;
  storeName: string;
  items: OrderItem[];
  status: 'pending' | 'processing' | 'delivered' | 'cancelled';
  createdAt: string;
  deliveryDate: string;
  totalAmount: number;
  notes?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  unit: string;
  price: number;
  stock: number;
  minStock: number;
  expiryDate?: string;
  batchNumber?: string;
}

export interface Recipe {
  id: string;
  productId: string;
  productName: string;
  ingredients: RecipeIngredient[];
  yield: number;
  unit: string;
  instructions: string;
}

export interface RecipeIngredient {
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
}

export interface Store {
  id: string;
  name: string;
  address: string;
  phone: string;
  manager: string;
  status: 'active' | 'inactive';
}

export interface DeliverySchedule {
  id: string;
  orderId: string;
  storeName: string;
  scheduledDate: string;
  scheduledTime: string;
  status: 'scheduled' | 'in_transit' | 'delivered' | 'delayed';
  driver: string;
  vehicle: string;
}

export interface ProductionPlan {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
  scheduledDate: string;
  status: 'planned' | 'in_progress' | 'completed';
  assignedTo: string;
}

export interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  category: string;
  quantity: number;
  unit: string;
  batchNumber: string;
  expiryDate: string;
  location: string;
}

export interface UserAccount {
  id: string;
  username: string;
  displayName: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  lastLogin: string;
}

// Mock Orders
export const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    storeId: 'ST-001',
    storeName: 'Downtown Branch',
    items: [
      { productId: 'P-001', productName: 'Bread Dough', quantity: 50, unit: 'kg', unitPrice: 5.00 },
      { productId: 'P-002', productName: 'Pizza Base', quantity: 100, unit: 'pcs', unitPrice: 2.50 },
    ],
    status: 'pending',
    createdAt: '2024-01-15 09:30',
    deliveryDate: '2024-01-16',
    totalAmount: 500.00,
  },
  {
    id: 'ORD-002',
    storeId: 'ST-002',
    storeName: 'Mall Outlet',
    items: [
      { productId: 'P-003', productName: 'Tomato Sauce', quantity: 20, unit: 'L', unitPrice: 8.00 },
      { productId: 'P-004', productName: 'Cheese Blend', quantity: 15, unit: 'kg', unitPrice: 25.00 },
    ],
    status: 'processing',
    createdAt: '2024-01-15 10:15',
    deliveryDate: '2024-01-16',
    totalAmount: 535.00,
  },
  {
    id: 'ORD-003',
    storeId: 'ST-003',
    storeName: 'Airport Terminal',
    items: [
      { productId: 'P-001', productName: 'Bread Dough', quantity: 30, unit: 'kg', unitPrice: 5.00 },
    ],
    status: 'delivered',
    createdAt: '2024-01-14 14:00',
    deliveryDate: '2024-01-15',
    totalAmount: 150.00,
  },
  {
    id: 'ORD-004',
    storeId: 'ST-001',
    storeName: 'Downtown Branch',
    items: [
      { productId: 'P-005', productName: 'Pastry Cream', quantity: 10, unit: 'kg', unitPrice: 12.00 },
    ],
    status: 'cancelled',
    createdAt: '2024-01-13 08:00',
    deliveryDate: '2024-01-14',
    totalAmount: 120.00,
    notes: 'Store requested cancellation',
  },
  {
    id: 'ORD-005',
    storeId: 'ST-004',
    storeName: 'University Campus',
    items: [
      { productId: 'P-002', productName: 'Pizza Base', quantity: 200, unit: 'pcs', unitPrice: 2.50 },
      { productId: 'P-003', productName: 'Tomato Sauce', quantity: 30, unit: 'L', unitPrice: 8.00 },
    ],
    status: 'processing',
    createdAt: '2024-01-15 11:00',
    deliveryDate: '2024-01-17',
    totalAmount: 740.00,
  },
];

// Mock Products
export const mockProducts: Product[] = [
  { id: 'P-001', name: 'Bread Dough', category: 'Dough', unit: 'kg', price: 5.00, stock: 200, minStock: 50 },
  { id: 'P-002', name: 'Pizza Base', category: 'Semi-finished', unit: 'pcs', price: 2.50, stock: 500, minStock: 100 },
  { id: 'P-003', name: 'Tomato Sauce', category: 'Sauce', unit: 'L', price: 8.00, stock: 100, minStock: 30 },
  { id: 'P-004', name: 'Cheese Blend', category: 'Dairy', unit: 'kg', price: 25.00, stock: 80, minStock: 20 },
  { id: 'P-005', name: 'Pastry Cream', category: 'Cream', unit: 'kg', price: 12.00, stock: 50, minStock: 15 },
  { id: 'P-006', name: 'Croissant Dough', category: 'Dough', unit: 'kg', price: 8.00, stock: 120, minStock: 40 },
  { id: 'P-007', name: 'Chicken Filling', category: 'Protein', unit: 'kg', price: 18.00, stock: 60, minStock: 25 },
  { id: 'P-008', name: 'Vegetable Mix', category: 'Vegetables', unit: 'kg', price: 6.00, stock: 90, minStock: 30 },
];

// Mock Recipes
export const mockRecipes: Recipe[] = [
  {
    id: 'R-001',
    productId: 'P-002',
    productName: 'Pizza Base',
    ingredients: [
      { productId: 'RM-001', productName: 'All-Purpose Flour', quantity: 0.3, unit: 'kg' },
      { productId: 'RM-002', productName: 'Yeast', quantity: 0.01, unit: 'kg' },
      { productId: 'RM-003', productName: 'Olive Oil', quantity: 0.02, unit: 'L' },
      { productId: 'RM-004', productName: 'Salt', quantity: 0.005, unit: 'kg' },
    ],
    yield: 1,
    unit: 'pcs',
    instructions: 'Mix flour, yeast, and salt. Add water and olive oil. Knead for 10 minutes. Let rise for 1 hour. Shape into base.',
  },
  {
    id: 'R-002',
    productId: 'P-003',
    productName: 'Tomato Sauce',
    ingredients: [
      { productId: 'RM-005', productName: 'Crushed Tomatoes', quantity: 2, unit: 'kg' },
      { productId: 'RM-006', productName: 'Garlic', quantity: 0.05, unit: 'kg' },
      { productId: 'RM-003', productName: 'Olive Oil', quantity: 0.1, unit: 'L' },
      { productId: 'RM-007', productName: 'Basil', quantity: 0.02, unit: 'kg' },
    ],
    yield: 2,
    unit: 'L',
    instructions: 'Sauté garlic in olive oil. Add crushed tomatoes. Simmer for 30 minutes. Add basil and blend.',
  },
];

// Mock Stores
export const mockStores: Store[] = [
  { id: 'ST-001', name: 'Downtown Branch', address: '123 Main Street, City Center', phone: '+1 555-0101', manager: 'John Smith', status: 'active' },
  { id: 'ST-002', name: 'Mall Outlet', address: '456 Shopping Mall, Level 2', phone: '+1 555-0102', manager: 'Emily Davis', status: 'active' },
  { id: 'ST-003', name: 'Airport Terminal', address: 'Terminal 3, Airport Road', phone: '+1 555-0103', manager: 'Michael Lee', status: 'active' },
  { id: 'ST-004', name: 'University Campus', address: '789 College Avenue', phone: '+1 555-0104', manager: 'Lisa Wong', status: 'active' },
  { id: 'ST-005', name: 'Business District', address: '321 Corporate Plaza', phone: '+1 555-0105', manager: 'Robert Brown', status: 'inactive' },
];

// Mock Delivery Schedules
export const mockDeliveries: DeliverySchedule[] = [
  { id: 'DEL-001', orderId: 'ORD-001', storeName: 'Downtown Branch', scheduledDate: '2024-01-16', scheduledTime: '06:00', status: 'scheduled', driver: 'Tom Wilson', vehicle: 'Truck A' },
  { id: 'DEL-002', orderId: 'ORD-002', storeName: 'Mall Outlet', scheduledDate: '2024-01-16', scheduledTime: '07:30', status: 'scheduled', driver: 'Tom Wilson', vehicle: 'Truck A' },
  { id: 'DEL-003', orderId: 'ORD-003', storeName: 'Airport Terminal', scheduledDate: '2024-01-15', scheduledTime: '05:00', status: 'delivered', driver: 'James Taylor', vehicle: 'Truck B' },
  { id: 'DEL-004', orderId: 'ORD-005', storeName: 'University Campus', scheduledDate: '2024-01-17', scheduledTime: '08:00', status: 'scheduled', driver: 'James Taylor', vehicle: 'Truck B' },
];

// Mock Production Plans
export const mockProductionPlans: ProductionPlan[] = [
  { id: 'PP-001', productId: 'P-001', productName: 'Bread Dough', quantity: 100, unit: 'kg', scheduledDate: '2024-01-16', status: 'planned', assignedTo: 'Team Alpha' },
  { id: 'PP-002', productId: 'P-002', productName: 'Pizza Base', quantity: 300, unit: 'pcs', scheduledDate: '2024-01-16', status: 'in_progress', assignedTo: 'Team Beta' },
  { id: 'PP-003', productId: 'P-003', productName: 'Tomato Sauce', quantity: 50, unit: 'L', scheduledDate: '2024-01-16', status: 'completed', assignedTo: 'Team Alpha' },
  { id: 'PP-004', productId: 'P-004', productName: 'Cheese Blend', quantity: 30, unit: 'kg', scheduledDate: '2024-01-17', status: 'planned', assignedTo: 'Team Beta' },
];

// Mock Inventory
export const mockInventory: InventoryItem[] = [
  { id: 'INV-001', productId: 'RM-001', productName: 'All-Purpose Flour', category: 'Raw Material', quantity: 500, unit: 'kg', batchNumber: 'B-2024-001', expiryDate: '2024-06-15', location: 'Warehouse A' },
  { id: 'INV-002', productId: 'RM-005', productName: 'Crushed Tomatoes', category: 'Raw Material', quantity: 200, unit: 'kg', batchNumber: 'B-2024-002', expiryDate: '2024-03-20', location: 'Cold Storage' },
  { id: 'INV-003', productId: 'P-001', productName: 'Bread Dough', category: 'Semi-finished', quantity: 80, unit: 'kg', batchNumber: 'B-2024-003', expiryDate: '2024-01-18', location: 'Production Floor' },
  { id: 'INV-004', productId: 'RM-004', productName: 'Cheese Mozzarella', category: 'Dairy', quantity: 100, unit: 'kg', batchNumber: 'B-2024-004', expiryDate: '2024-02-10', location: 'Cold Storage' },
  { id: 'INV-005', productId: 'RM-002', productName: 'Yeast', category: 'Raw Material', quantity: 50, unit: 'kg', batchNumber: 'B-2024-005', expiryDate: '2024-04-30', location: 'Warehouse A' },
];

// Mock Users
export const mockUsers: UserAccount[] = [
  { id: 'U-001', username: 'store1', displayName: 'John Smith', email: 'john.smith@example.com', role: 'Franchise Store Staff', status: 'active', lastLogin: '2024-01-15 09:00' },
  { id: 'U-002', username: 'kitchen1', displayName: 'Maria Garcia', email: 'maria.garcia@example.com', role: 'Central Kitchen Staff', status: 'active', lastLogin: '2024-01-15 06:00' },
  { id: 'U-003', username: 'supply1', displayName: 'David Chen', email: 'david.chen@example.com', role: 'Supply Coordinator', status: 'active', lastLogin: '2024-01-15 07:30' },
  { id: 'U-004', username: 'manager1', displayName: 'Sarah Johnson', email: 'sarah.johnson@example.com', role: 'Manager', status: 'active', lastLogin: '2024-01-15 08:00' },
  { id: 'U-005', username: 'admin1', displayName: 'Admin User', email: 'admin@example.com', role: 'Admin', status: 'active', lastLogin: '2024-01-15 08:30' },
];

// Dashboard KPIs
export const dashboardKPIs = {
  totalOrders: 156,
  pendingOrders: 23,
  processingOrders: 18,
  deliveredOrders: 112,
  cancelledOrders: 3,
  totalRevenue: 45680,
  productionEfficiency: 94.5,
  inventoryValue: 125000,
  activeStores: 4,
  lowStockItems: 5,
};

// Chart data for manager dashboard
export const productionChartData = [
  { name: 'Mon', produced: 120, target: 150 },
  { name: 'Tue', produced: 145, target: 150 },
  { name: 'Wed', produced: 160, target: 150 },
  { name: 'Thu', produced: 138, target: 150 },
  { name: 'Fri', produced: 155, target: 150 },
  { name: 'Sat', produced: 90, target: 100 },
  { name: 'Sun', produced: 0, target: 0 },
];

export const orderTrendData = [
  { name: 'Week 1', orders: 32, value: 8500 },
  { name: 'Week 2', orders: 45, value: 12300 },
  { name: 'Week 3', orders: 38, value: 9800 },
  { name: 'Week 4', orders: 41, value: 11200 },
];

export const storePerformanceData = [
  { name: 'Downtown', orders: 45, revenue: 12500 },
  { name: 'Mall', orders: 38, revenue: 9800 },
  { name: 'Airport', orders: 52, revenue: 15200 },
  { name: 'University', orders: 21, revenue: 5400 },
];
