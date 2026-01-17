import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { DataTable } from '@/components/ui/DataTable';
import { Input } from '@/components/ui/input';
import { mockInventory, InventoryItem } from '@/data/mockData';
import { Search, AlertTriangle, Clock } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const KitchenInventory: React.FC = () => {
  const [search, setSearch] = useState('');

  const filteredInventory = mockInventory.filter(i =>
    i.productName.toLowerCase().includes(search.toLowerCase()) ||
    i.category.toLowerCase().includes(search.toLowerCase()) ||
    i.batchNumber.toLowerCase().includes(search.toLowerCase())
  );

  const getDaysUntilExpiry = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    return Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  const columns = [
    { key: 'batchNumber', label: 'Batch #' },
    { key: 'productName', label: 'Product' },
    { key: 'category', label: 'Category' },
    { 
      key: 'quantity', 
      label: 'Quantity',
      render: (item: InventoryItem) => `${item.quantity} ${item.unit}`
    },
    { key: 'location', label: 'Location' },
    { 
      key: 'expiryDate', 
      label: 'Expiry Date',
      render: (item: InventoryItem) => {
        const days = getDaysUntilExpiry(item.expiryDate);
        return (
          <div className="flex items-center gap-2">
            <span className={days <= 7 ? 'text-destructive font-medium' : days <= 14 ? 'text-warning' : ''}>
              {item.expiryDate}
            </span>
            {days <= 7 && <AlertTriangle size={14} className="text-destructive" />}
          </div>
        );
      }
    },
    { 
      key: 'daysLeft', 
      label: 'Days Left',
      render: (item: InventoryItem) => {
        const days = getDaysUntilExpiry(item.expiryDate);
        if (days <= 0) return <span className="text-destructive font-medium">Expired</span>;
        if (days <= 7) return <span className="text-destructive">{days} days</span>;
        if (days <= 14) return <span className="text-warning">{days} days</span>;
        return <span className="text-muted-foreground">{days} days</span>;
      }
    },
  ];

  const rawMaterials = filteredInventory.filter(i => i.category === 'Raw Material');
  const semiFinished = filteredInventory.filter(i => i.category !== 'Raw Material');

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Kitchen Inventory" 
        subtitle="Manage raw materials, batches, and expiry dates (FEFO)"
      />

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by product, category, or batch..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-card rounded-xl border p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Clock size={16} />
            <span className="text-sm">Expiring in 7 days</span>
          </div>
          <p className="text-2xl font-semibold text-destructive">
            {mockInventory.filter(i => getDaysUntilExpiry(i.expiryDate) <= 7 && getDaysUntilExpiry(i.expiryDate) > 0).length}
          </p>
        </div>
        <div className="bg-card rounded-xl border p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Batches</p>
          <p className="text-2xl font-semibold">{mockInventory.length}</p>
        </div>
        <div className="bg-card rounded-xl border p-4">
          <p className="text-sm text-muted-foreground mb-1">Raw Materials</p>
          <p className="text-2xl font-semibold">{rawMaterials.length}</p>
        </div>
        <div className="bg-card rounded-xl border p-4">
          <p className="text-sm text-muted-foreground mb-1">Semi-finished</p>
          <p className="text-2xl font-semibold">{semiFinished.length}</p>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Items</TabsTrigger>
          <TabsTrigger value="raw">Raw Materials</TabsTrigger>
          <TabsTrigger value="semi">Semi-finished</TabsTrigger>
          <TabsTrigger value="expiring">Expiring Soon</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <DataTable columns={columns} data={filteredInventory} />
        </TabsContent>
        <TabsContent value="raw">
          <DataTable columns={columns} data={rawMaterials} />
        </TabsContent>
        <TabsContent value="semi">
          <DataTable columns={columns} data={semiFinished} />
        </TabsContent>
        <TabsContent value="expiring">
          <DataTable 
            columns={columns} 
            data={filteredInventory.filter(i => getDaysUntilExpiry(i.expiryDate) <= 14)} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default KitchenInventory;
