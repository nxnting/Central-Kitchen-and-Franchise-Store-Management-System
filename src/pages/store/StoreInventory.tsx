import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { DataTable } from '@/components/ui/DataTable';
import { Input } from '@/components/ui/input';
import { mockProducts, Product } from '@/data/mockData';
import { Search, AlertTriangle } from 'lucide-react';

const StoreInventory: React.FC = () => {
  const [search, setSearch] = useState('');

  const filteredProducts = mockProducts.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { key: 'id', label: 'Product ID' },
    { key: 'name', label: 'Product Name' },
    { key: 'category', label: 'Category' },
    { 
      key: 'stock', 
      label: 'Current Stock',
      render: (product: Product) => (
        <div className="flex items-center gap-2">
          <span className={product.stock <= product.minStock ? 'text-destructive font-medium' : ''}>
            {product.stock} {product.unit}
          </span>
          {product.stock <= product.minStock && (
            <AlertTriangle size={16} className="text-destructive" />
          )}
        </div>
      )
    },
    { 
      key: 'minStock', 
      label: 'Min Stock',
      render: (product: Product) => `${product.minStock} ${product.unit}`
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (product: Product) => {
        if (product.stock <= product.minStock) {
          return <span className="status-badge status-cancelled">Low Stock</span>;
        }
        if (product.stock <= product.minStock * 1.5) {
          return <span className="status-badge status-pending">Reorder Soon</span>;
        }
        return <span className="status-badge status-delivered">In Stock</span>;
      }
    },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Store Inventory" 
        subtitle="Current stock levels at Downtown Branch"
      />

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-card rounded-xl border p-4">
          <p className="text-sm text-muted-foreground">Total Products</p>
          <p className="text-2xl font-semibold">{mockProducts.length}</p>
        </div>
        <div className="bg-card rounded-xl border p-4">
          <p className="text-sm text-muted-foreground">Low Stock Items</p>
          <p className="text-2xl font-semibold text-destructive">
            {mockProducts.filter(p => p.stock <= p.minStock).length}
          </p>
        </div>
        <div className="bg-card rounded-xl border p-4">
          <p className="text-sm text-muted-foreground">Categories</p>
          <p className="text-2xl font-semibold">
            {new Set(mockProducts.map(p => p.category)).size}
          </p>
        </div>
      </div>

      <DataTable columns={columns} data={filteredProducts} />
    </div>
  );
};

export default StoreInventory;
