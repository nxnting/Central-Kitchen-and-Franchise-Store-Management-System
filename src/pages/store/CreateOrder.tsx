import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { mockProducts } from '@/data/mockData';
import { Plus, Minus, Trash2, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
}

const CreateOrder: React.FC = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<OrderItem[]>([]);
  const [notes, setNotes] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');

  const addProduct = (product: typeof mockProducts[0]) => {
    const existing = items.find(i => i.productId === product.id);
    if (existing) {
      setItems(items.map(i => 
        i.productId === product.id 
          ? { ...i, quantity: i.quantity + 1 }
          : i
      ));
    } else {
      setItems([...items, {
        productId: product.id,
        productName: product.name,
        quantity: 1,
        unit: product.unit,
        unitPrice: product.price,
      }]);
    }
  };

  const updateQuantity = (productId: string, delta: number) => {
    setItems(items.map(i => {
      if (i.productId === productId) {
        const newQty = Math.max(0, i.quantity + delta);
        return { ...i, quantity: newQty };
      }
      return i;
    }).filter(i => i.quantity > 0));
  };

  const removeItem = (productId: string) => {
    setItems(items.filter(i => i.productId !== productId));
  };

  const total = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);

  const handleSubmit = () => {
    if (items.length === 0) {
      toast.error('Please add at least one item to your order');
      return;
    }
    if (!deliveryDate) {
      toast.error('Please select a delivery date');
      return;
    }
    toast.success('Order submitted successfully!');
    navigate('/store/orders');
  };

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Create New Order" 
        subtitle="Order ingredients and semi-finished products from Central Kitchen"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Selection */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-xl border p-6">
            <h2 className="text-lg font-semibold mb-4">Available Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {mockProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-4 rounded-lg border hover:border-primary/50 hover:bg-muted/30 transition-all cursor-pointer"
                  onClick={() => addProduct(product)}
                >
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">{product.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${product.price.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">per {product.unit}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-xl border p-6 sticky top-8">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <ShoppingCart size={20} />
              Order Summary
            </h2>

            {items.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Click on products to add them to your order
              </p>
            ) : (
              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div key={item.productId} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.productName}</p>
                      <p className="text-xs text-muted-foreground">
                        ${item.unitPrice.toFixed(2)} × {item.quantity} {item.unit}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateQuantity(item.productId, -1)}
                        className="w-7 h-7 rounded bg-muted flex items-center justify-center hover:bg-muted-foreground/20"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, 1)}
                        className="w-7 h-7 rounded bg-muted flex items-center justify-center hover:bg-muted-foreground/20"
                      >
                        <Plus size={14} />
                      </button>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="w-7 h-7 rounded bg-destructive/10 flex items-center justify-center hover:bg-destructive/20 text-destructive ml-1"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="border-t pt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="deliveryDate">Delivery Date</Label>
                <Input
                  id="deliveryDate"
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Any special instructions..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex items-center justify-between text-lg font-semibold pt-2">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <Button onClick={handleSubmit} className="w-full" size="lg">
                Submit Order
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateOrder;
