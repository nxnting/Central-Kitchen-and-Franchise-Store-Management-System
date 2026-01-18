// Mock data cho Hệ thống Quản lý Bếp Trung tâm & Cửa hàng Franchise Trà Sữa

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

// Mock Đơn hàng
export const mockOrders: Order[] = [
  {
    id: 'DH-001',
    storeId: 'CH-001',
    storeName: 'Chi nhánh Quận 1',
    items: [
      { productId: 'SP-001', productName: 'Trân châu đen', quantity: 10, unit: 'kg', unitPrice: 85000 },
      { productId: 'SP-002', productName: 'Sữa tươi không đường', quantity: 50, unit: 'L', unitPrice: 28000 },
    ],
    status: 'pending',
    createdAt: '2024-01-15 09:30',
    deliveryDate: '2024-01-16',
    totalAmount: 2250000,
  },
  {
    id: 'DH-002',
    storeId: 'CH-002',
    storeName: 'Chi nhánh Quận 3',
    items: [
      { productId: 'SP-003', productName: 'Bột trà xanh Nhật Bản', quantity: 5, unit: 'kg', unitPrice: 450000 },
      { productId: 'SP-004', productName: 'Kem cheese', quantity: 20, unit: 'L', unitPrice: 95000 },
    ],
    status: 'processing',
    createdAt: '2024-01-15 10:15',
    deliveryDate: '2024-01-16',
    totalAmount: 4150000,
  },
  {
    id: 'DH-003',
    storeId: 'CH-003',
    storeName: 'Chi nhánh Quận 7',
    items: [
      { productId: 'SP-001', productName: 'Trân châu đen', quantity: 8, unit: 'kg', unitPrice: 85000 },
    ],
    status: 'delivered',
    createdAt: '2024-01-14 14:00',
    deliveryDate: '2024-01-15',
    totalAmount: 680000,
  },
  {
    id: 'DH-004',
    storeId: 'CH-001',
    storeName: 'Chi nhánh Quận 1',
    items: [
      { productId: 'SP-005', productName: 'Sirô đào', quantity: 10, unit: 'L', unitPrice: 125000 },
    ],
    status: 'cancelled',
    createdAt: '2024-01-13 08:00',
    deliveryDate: '2024-01-14',
    totalAmount: 1250000,
    notes: 'Cửa hàng yêu cầu huỷ đơn',
  },
  {
    id: 'DH-005',
    storeId: 'CH-004',
    storeName: 'Chi nhánh Thủ Đức',
    items: [
      { productId: 'SP-002', productName: 'Sữa tươi không đường', quantity: 100, unit: 'L', unitPrice: 28000 },
      { productId: 'SP-003', productName: 'Bột trà xanh Nhật Bản', quantity: 3, unit: 'kg', unitPrice: 450000 },
    ],
    status: 'processing',
    createdAt: '2024-01-15 11:00',
    deliveryDate: '2024-01-17',
    totalAmount: 4150000,
  },
];

// Mock Sản phẩm
export const mockProducts: Product[] = [
  { id: 'SP-001', name: 'Trân châu đen', category: 'Topping', unit: 'kg', price: 85000, stock: 50, minStock: 15 },
  { id: 'SP-002', name: 'Sữa tươi không đường', category: 'Nguyên liệu chính', unit: 'L', price: 28000, stock: 200, minStock: 50 },
  { id: 'SP-003', name: 'Bột trà xanh Nhật Bản', category: 'Bột trà', unit: 'kg', price: 450000, stock: 20, minStock: 5 },
  { id: 'SP-004', name: 'Kem cheese', category: 'Topping', unit: 'L', price: 95000, stock: 30, minStock: 10 },
  { id: 'SP-005', name: 'Sirô đào', category: 'Sirô', unit: 'L', price: 125000, stock: 25, minStock: 8 },
  { id: 'SP-006', name: 'Bột oolong', category: 'Bột trà', unit: 'kg', price: 380000, stock: 18, minStock: 6 },
  { id: 'SP-007', name: 'Thạch dừa', category: 'Topping', unit: 'kg', price: 65000, stock: 40, minStock: 12 },
  { id: 'SP-008', name: 'Pudding trứng', category: 'Topping', unit: 'kg', price: 120000, stock: 15, minStock: 8 },
];

// Mock Công thức
export const mockRecipes: Recipe[] = [
  {
    id: 'CT-001',
    productId: 'TP-001',
    productName: 'Trà sữa trân châu đường đen',
    ingredients: [
      { productId: 'SP-001', productName: 'Trân châu đen', quantity: 0.05, unit: 'kg' },
      { productId: 'SP-002', productName: 'Sữa tươi không đường', quantity: 0.15, unit: 'L' },
      { productId: 'NL-001', productName: 'Đường đen', quantity: 0.03, unit: 'kg' },
      { productId: 'NL-002', productName: 'Trà đen Ceylon', quantity: 0.01, unit: 'kg' },
    ],
    yield: 1,
    unit: 'ly',
    instructions: 'Pha trà đen, thêm sữa tươi, thêm đường đen, thêm trân châu đã nấu chín.',
  },
  {
    id: 'CT-002',
    productId: 'TP-002',
    productName: 'Trà xanh matcha kem cheese',
    ingredients: [
      { productId: 'SP-003', productName: 'Bột trà xanh Nhật Bản', quantity: 0.008, unit: 'kg' },
      { productId: 'SP-004', productName: 'Kem cheese', quantity: 0.05, unit: 'L' },
      { productId: 'SP-002', productName: 'Sữa tươi không đường', quantity: 0.12, unit: 'L' },
    ],
    yield: 1,
    unit: 'ly',
    instructions: 'Pha bột matcha với nước nóng, thêm sữa, đổ kem cheese lên trên.',
  },
];

// Mock Cửa hàng
export const mockStores: Store[] = [
  { id: 'CH-001', name: 'Chi nhánh Quận 1', address: '123 Nguyễn Huệ, Quận 1, TP.HCM', phone: '028-3821-0001', manager: 'Nguyễn Văn An', status: 'active' },
  { id: 'CH-002', name: 'Chi nhánh Quận 3', address: '456 Võ Văn Tần, Quận 3, TP.HCM', phone: '028-3821-0002', manager: 'Trần Thị Hoa', status: 'active' },
  { id: 'CH-003', name: 'Chi nhánh Quận 7', address: '789 Nguyễn Thị Thập, Quận 7, TP.HCM', phone: '028-3821-0003', manager: 'Lê Minh Tuấn', status: 'active' },
  { id: 'CH-004', name: 'Chi nhánh Thủ Đức', address: '321 Võ Văn Ngân, TP. Thủ Đức', phone: '028-3821-0004', manager: 'Phạm Thị Lan', status: 'active' },
  { id: 'CH-005', name: 'Chi nhánh Bình Thạnh', address: '654 Phan Văn Trị, Bình Thạnh', phone: '028-3821-0005', manager: 'Hoàng Văn Nam', status: 'inactive' },
];

// Mock Lịch giao hàng
export const mockDeliveries: DeliverySchedule[] = [
  { id: 'GH-001', orderId: 'DH-001', storeName: 'Chi nhánh Quận 1', scheduledDate: '2024-01-16', scheduledTime: '06:00', status: 'scheduled', driver: 'Nguyễn Văn Tài', vehicle: 'Xe tải 59C-12345' },
  { id: 'GH-002', orderId: 'DH-002', storeName: 'Chi nhánh Quận 3', scheduledDate: '2024-01-16', scheduledTime: '07:30', status: 'scheduled', driver: 'Nguyễn Văn Tài', vehicle: 'Xe tải 59C-12345' },
  { id: 'GH-003', orderId: 'DH-003', storeName: 'Chi nhánh Quận 7', scheduledDate: '2024-01-15', scheduledTime: '05:00', status: 'delivered', driver: 'Trần Văn Bình', vehicle: 'Xe tải 59C-67890' },
  { id: 'GH-004', orderId: 'DH-005', storeName: 'Chi nhánh Thủ Đức', scheduledDate: '2024-01-17', scheduledTime: '08:00', status: 'scheduled', driver: 'Trần Văn Bình', vehicle: 'Xe tải 59C-67890' },
];

// Mock Kế hoạch sản xuất
export const mockProductionPlans: ProductionPlan[] = [
  { id: 'SX-001', productId: 'SP-001', productName: 'Trân châu đen', quantity: 30, unit: 'kg', scheduledDate: '2024-01-16', status: 'planned', assignedTo: 'Tổ sản xuất 1' },
  { id: 'SX-002', productId: 'SP-004', productName: 'Kem cheese', quantity: 50, unit: 'L', scheduledDate: '2024-01-16', status: 'in_progress', assignedTo: 'Tổ sản xuất 2' },
  { id: 'SX-003', productId: 'SP-007', productName: 'Thạch dừa', quantity: 20, unit: 'kg', scheduledDate: '2024-01-16', status: 'completed', assignedTo: 'Tổ sản xuất 1' },
  { id: 'SX-004', productId: 'SP-008', productName: 'Pudding trứng', quantity: 25, unit: 'kg', scheduledDate: '2024-01-17', status: 'planned', assignedTo: 'Tổ sản xuất 2' },
];

// Mock Tồn kho
export const mockInventory: InventoryItem[] = [
  { id: 'TK-001', productId: 'NL-001', productName: 'Đường đen Okinawa', category: 'Nguyên liệu', quantity: 100, unit: 'kg', batchNumber: 'LO-2024-001', expiryDate: '2024-06-15', location: 'Kho A' },
  { id: 'TK-002', productId: 'NL-002', productName: 'Trà đen Ceylon', category: 'Nguyên liệu', quantity: 50, unit: 'kg', batchNumber: 'LO-2024-002', expiryDate: '2024-03-20', location: 'Kho B' },
  { id: 'TK-003', productId: 'SP-001', productName: 'Trân châu đen', category: 'Bán thành phẩm', quantity: 40, unit: 'kg', batchNumber: 'LO-2024-003', expiryDate: '2024-01-18', location: 'Kho lạnh' },
  { id: 'TK-004', productId: 'SP-004', productName: 'Kem cheese', category: 'Bán thành phẩm', quantity: 25, unit: 'L', batchNumber: 'LO-2024-004', expiryDate: '2024-02-10', location: 'Kho lạnh' },
  { id: 'TK-005', productId: 'NL-003', productName: 'Bột sữa Đài Loan', category: 'Nguyên liệu', quantity: 80, unit: 'kg', batchNumber: 'LO-2024-005', expiryDate: '2024-04-30', location: 'Kho A' },
];

// Mock Người dùng
export const mockUsers: UserAccount[] = [
  { id: 'U-001', username: 'store1', displayName: 'Nguyễn Văn An', email: 'an.nguyen@example.com', role: 'Nhân viên Cửa hàng', status: 'active', lastLogin: '2024-01-15 09:00' },
  { id: 'U-002', username: 'kitchen1', displayName: 'Trần Thị Bình', email: 'binh.tran@example.com', role: 'Nhân viên Bếp Trung tâm', status: 'active', lastLogin: '2024-01-15 06:00' },
  { id: 'U-003', username: 'supply1', displayName: 'Lê Văn Cường', email: 'cuong.le@example.com', role: 'Điều phối Cung ứng', status: 'active', lastLogin: '2024-01-15 07:30' },
  { id: 'U-004', username: 'manager1', displayName: 'Phạm Thị Dung', email: 'dung.pham@example.com', role: 'Quản lý Vận hành', status: 'active', lastLogin: '2024-01-15 08:00' },
  { id: 'U-005', username: 'admin1', displayName: 'Quản Trị Viên', email: 'admin@example.com', role: 'Quản trị Hệ thống', status: 'active', lastLogin: '2024-01-15 08:30' },
];

// Dashboard KPIs
export const dashboardKPIs = {
  totalOrders: 156,
  pendingOrders: 23,
  processingOrders: 18,
  deliveredOrders: 112,
  cancelledOrders: 3,
  totalRevenue: 456800000,
  productionEfficiency: 94.5,
  inventoryValue: 125000000,
  activeStores: 4,
  lowStockItems: 5,
};

// Dữ liệu biểu đồ
export const productionChartData = [
  { name: 'T2', produced: 120, target: 150 },
  { name: 'T3', produced: 145, target: 150 },
  { name: 'T4', produced: 160, target: 150 },
  { name: 'T5', produced: 138, target: 150 },
  { name: 'T6', produced: 155, target: 150 },
  { name: 'T7', produced: 90, target: 100 },
  { name: 'CN', produced: 0, target: 0 },
];

export const orderTrendData = [
  { name: 'Tuần 1', orders: 32, value: 85000000 },
  { name: 'Tuần 2', orders: 45, value: 123000000 },
  { name: 'Tuần 3', orders: 38, value: 98000000 },
  { name: 'Tuần 4', orders: 41, value: 112000000 },
];

export const storePerformanceData = [
  { name: 'Q.1', orders: 45, revenue: 125000000 },
  { name: 'Q.3', orders: 38, revenue: 98000000 },
  { name: 'Q.7', orders: 52, revenue: 152000000 },
  { name: 'Thủ Đức', orders: 21, revenue: 54000000 },
];