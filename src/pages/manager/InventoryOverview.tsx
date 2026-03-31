import React, { useState, useEffect, useMemo } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Warehouse,
  Store,
  AlertTriangle,
  TrendingDown,
  Package,
  Loader2
} from 'lucide-react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from '@/components/ui/button';
import { adminFranchisesApi } from '@/api/admin/franchises.api';
import { adminCentralKitchensApi } from '@/api/admin/centralKitchens.api';
import { getStoreInventorySummary } from '@/api/store/inventoryApi';
import { inventoryApi } from '@/api/kitchen/inventoryApi';
import { authApi } from '@/api/auth';
import type { AdminFranchise } from '@/types/admin/franchise.types';
import type { AdminCentralKitchen } from '@/types/admin/centralKitchen.types';
import type { FranchiseInventorySummaryResponse, FranchiseInventorySummaryItemResponse } from '@/types/store/inventory';
import type { CentralKitchenInventorySummaryResponse, CentralKitchenInventorySummaryItemResponse } from '@/types/kitchen/inventoryBatch.types';

interface StoreWithInventory extends AdminFranchise {
  summary?: FranchiseInventorySummaryResponse;
}

interface CKWithInventory extends AdminCentralKitchen {
  summary?: CentralKitchenInventorySummaryResponse;
}

const InventoryOverview: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ckData, setCkData] = useState<CKWithInventory[]>([]);
  const [storesData, setStoresData] = useState<StoreWithInventory[]>([]);
  
  // Pagination state
  const [productPage, setProductPage] = useState(1);
  const [ingredientPage, setIngredientPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // 1. Fetch lists
        const [franchises, kitchensRaw] = await Promise.all([
          adminFranchisesApi.list(),
          adminCentralKitchensApi.list().catch(() => [] as AdminCentralKitchen[])
        ]);

        let kitchens = kitchensRaw || [];

        // FALLBACK: If kitchens list is empty, try to get from current user profile
        if (kitchens.length === 0) {
          const user = authApi.getCurrentUser();
          if (user.centralKitchenId) {
            try {
              const ckDetail = await adminCentralKitchensApi.detail(Number(user.centralKitchenId));
              if (ckDetail) kitchens = [ckDetail];
            } catch (e) {
              console.error("Failed to fetch assigned CK detail", e);
              // Minimum info if detail fails
              kitchens = [{ 
                centralKitchenId: Number(user.centralKitchenId), 
                name: "Bếp của tôi", 
                status: "ACTIVE",
                address: "-",
                location: "-",
                latitude: 0,
                longitude: 0
              }];
            }
          }
        }

        // 2. Fetch summaries for each
        const ckSummariesPromise = kitchens.map(async (ck) => {
          try {
            const summary = await inventoryApi.getCentralKitchenInventorySummary(ck.centralKitchenId);
            return { ...ck, summary };
          } catch (e) {
            console.error(`Failed to fetch CK ${ck.centralKitchenId} inventory`, e);
            return { ...ck };
          }
        });

        const storeSummariesPromise = franchises.map(async (store) => {
          try {
            const summary = await getStoreInventorySummary(store.franchiseId);
            return { ...store, summary };
          } catch (e) {
            console.error(`Failed to fetch Store ${store.franchiseId} inventory`, e);
            return { ...store };
          }
        });

        const [ckResults, storeResults] = await Promise.all([
          Promise.all(ckSummariesPromise),
          Promise.all(storeSummariesPromise)
        ]);

        setCkData(ckResults);
        setStoresData(storeResults);
      } catch (err) {
        console.error("Failed to load inventory overview", err);
        setError("Không thể tải dữ liệu tồn kho. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Reset pagination when search term changes
  useEffect(() => {
    setProductPage(1);
    setIngredientPage(1);
  }, [searchTerm]);

  // Aggregate stats
  const stats = useMemo(() => {
    let totalItems = 0;
    let lowStockCount = 0;
    let expiringCount = 0;

    // From CKs
    ckData.forEach(ck => {
      ck.summary?.items.forEach(item => {
        totalItems++;
        if (item.isLowStock) lowStockCount++;
        
        // Check expiring batches
        const hasExpiring = item.batches.some(batch => {
          if (!batch.expiredAt) return false;
          const expiry = new Date(batch.expiredAt);
          const today = new Date();
          const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          return diffDays <= 7 && diffDays > 0;
        });
        if (hasExpiring) expiringCount++;
      });
    });

    // From Stores
    storesData.forEach(store => {
      store.summary?.items.forEach(item => {
        totalItems++;
        if (item.isLowStock) lowStockCount++;
        
        const hasExpiring = item.batches.some(batch => {
          if (!batch.expiredAt) return false;
          const expiry = new Date(batch.expiredAt);
          const today = new Date();
          const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          return diffDays <= 7 && diffDays > 0;
        });
        if (hasExpiring) expiringCount++;
      });
    });

    return { totalItems, lowStockCount, expiringCount, storeCount: storesData.length };
  }, [ckData, storesData]);

  const filteredCKInventory = useMemo(() => {
    const allItems: (CentralKitchenInventorySummaryItemResponse & { ckName: string })[] = [];
    ckData.forEach(ck => {
      // Flexible extraction: try .data.items, then .items, then .data, then the object itself
      const rawSummary: any = ck.summary;
      let items: any[] = [];
      
      if (rawSummary) {
        if (Array.isArray(rawSummary)) {
          items = rawSummary;
        } else if (rawSummary.data && Array.isArray(rawSummary.data)) {
          items = rawSummary.data;
        } else if (rawSummary.items && Array.isArray(rawSummary.items)) {
          items = rawSummary.items;
        } else if (rawSummary.data && rawSummary.data.items) {
          items = rawSummary.data.items;
        }
      }

      items.forEach(item => {
        const name = item.itemName || item.productName || "Không tên";
        if (name.toLowerCase().includes(searchTerm.toLowerCase())) {
          allItems.push({ ...item, itemName: name, ckName: ck.name });
        }
      });
    });
    return allItems;
  }, [ckData, searchTerm]);

  // Split CK inventory into products and ingredients
  const ckProducts = useMemo(() => 
    filteredCKInventory.filter(item => item.itemType === 'PRODUCT'),
  [filteredCKInventory]);

  const ckIngredients = useMemo(() => 
    filteredCKInventory.filter(item => item.itemType === 'INGREDIENT'),
  [filteredCKInventory]);

  // Paginated versions
  const paginatedProducts = useMemo(() => {
    const start = (productPage - 1) * itemsPerPage;
    return ckProducts.slice(start, start + itemsPerPage);
  }, [ckProducts, productPage]);

  const paginatedIngredients = useMemo(() => {
    const start = (ingredientPage - 1) * itemsPerPage;
    return ckIngredients.slice(start, start + itemsPerPage);
  }, [ckIngredients, ingredientPage]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Đang tải dữ liệu tồn kho từ hệ thống...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center bg-destructive/5 rounded-xl border border-destructive/20">
        <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
        <h2 className="text-xl font-bold text-destructive mb-2">Lỗi hệ thống</h2>
        <p className="text-muted-foreground mb-6">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Tồn kho Tổng" 
        subtitle="Theo dõi tồn kho bếp trung tâm và các cửa hàng"
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-card border rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Package className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.totalItems}</p>
              <p className="text-sm text-muted-foreground">Tổng mặt hàng</p>
            </div>
          </div>
        </div>
        <div className="bg-card border rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.lowStockCount}</p>
              <p className="text-sm text-muted-foreground">Tồn kho thấp</p>
            </div>
          </div>
        </div>
        <div className="bg-card border rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.expiringCount}</p>
              <p className="text-sm text-muted-foreground">Sắp hết hạn</p>
            </div>
          </div>
        </div>
        <div className="bg-card border rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <Store className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.storeCount}</p>
              <p className="text-sm text-muted-foreground">Cửa hàng</p>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="central" className="space-y-4">
        <TabsList className="bg-muted p-1 rounded-lg">
          <TabsTrigger value="central" className="gap-2 px-4 py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Warehouse size={16} />
            Bếp Trung Tâm
          </TabsTrigger>
          <TabsTrigger value="stores" className="gap-2 px-4 py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Store size={16} />
            Cửa hàng ({stats.storeCount})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="central" className="space-y-4 pt-2">
          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="Tìm kiếm mặt hàng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Tabs defaultValue="products" className="w-full">
            <TabsList className="bg-muted/50 p-1 mb-4">
              <TabsTrigger value="products" className="text-xs px-4">Sản phẩm ({ckProducts.length})</TabsTrigger>
              <TabsTrigger value="ingredients" className="text-xs px-4">Nguyên liệu ({ckIngredients.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="products">
              <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/30">
                        <th className="text-left p-4 font-medium">Tên sản phẩm</th>
                        <th className="text-right p-4 font-medium">Số lượng</th>
                        <th className="text-right p-4 font-medium">Tồn tối thiểu</th>
                        <th className="text-left p-4 font-medium">Lô / HSD</th>
                        <th className="text-center p-4 font-medium">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {paginatedProducts.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-muted-foreground font-medium">Không tìm thấy sản phẩm nào</td>
                        </tr>
                      ) : (
                        paginatedProducts.map((item, idx) => {
                          const isExpiringSoon = item.batches.some(batch => {
                            if (!batch.expiredAt) return false;
                            const expiry = new Date(batch.expiredAt);
                            const today = new Date();
                            const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                            return diffDays <= 7 && diffDays > 0;
                          });

                          return (
                            <tr key={`${item.itemId}-${idx}`} className="hover:bg-muted/10 transition-colors">
                              <td className="p-4 font-medium">
                                {item.itemName}
                                {ckData.length > 1 && <p className="text-[10px] text-muted-foreground uppercase">{item.ckName}</p>}
                              </td>
                              <td className="p-4 text-right font-bold">{item.totalQuantity} {item.unit}</td>
                              <td className="p-4 text-right text-muted-foreground">{item.lowStockThreshold ?? '-'} {item.unit}</td>
                              <td className="p-4">
                                <div className="text-[11px] space-y-1">
                                  {item.batches.slice(0, 2).map((batch, bidx) => (
                                    <div key={bidx} className="flex flex-col">
                                      <span className="font-mono">{batch.batchCode}</span>
                                      {batch.expiredAt && (
                                        <span className={isExpiringSoon ? 'text-destructive font-bold' : 'text-muted-foreground'}>
                                          HSD: {batch.expiredAt}
                                        </span>
                                      )}
                                    </div>
                                  ))}
                                  {item.batches.length > 2 && <span className="text-[10px] text-muted-foreground">+{item.batches.length - 2} lô khác</span>}
                                </div>
                              </td>
                              <td className="p-4 text-center">
                                {item.isLowStock ? (
                                  <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-700 uppercase">Tồn thấp</span>
                                ) : isExpiringSoon ? (
                                  <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-destructive/10 text-destructive uppercase">Sắp hết hạn</span>
                                ) : (
                                  <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700 uppercase">Ổn định</span>
                                )}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {ckProducts.length > itemsPerPage && (
                <div className="mt-4 flex items-center justify-between px-2">
                  <p className="text-xs text-muted-foreground">
                    Đang xem {(productPage - 1) * itemsPerPage + 1} - {Math.min(productPage * itemsPerPage, ckProducts.length)} trên {ckProducts.length}
                  </p>
                  <PaginationControls 
                    currentPage={productPage} 
                    totalItems={ckProducts.length} 
                    pageSize={itemsPerPage} 
                    onPageChange={setProductPage} 
                  />
                </div>
              )}
            </TabsContent>

            <TabsContent value="ingredients">
              <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/30">
                        <th className="text-left p-4 font-medium">Tên nguyên liệu</th>
                        <th className="text-right p-4 font-medium">Số lượng</th>
                        <th className="text-right p-4 font-medium">Tồn tối thiểu</th>
                        <th className="text-left p-4 font-medium">Lô / HSD</th>
                        <th className="text-center p-4 font-medium">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {paginatedIngredients.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-muted-foreground font-medium">Không tìm thấy nguyên liệu nào</td>
                        </tr>
                      ) : (
                        paginatedIngredients.map((item, idx) => {
                          const isExpiringSoon = item.batches.some(batch => {
                            if (!batch.expiredAt) return false;
                            const expiry = new Date(batch.expiredAt);
                            const today = new Date();
                            const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                            return diffDays <= 7 && diffDays > 0;
                          });

                          return (
                            <tr key={`${item.itemId}-${idx}`} className="hover:bg-muted/10 transition-colors">
                              <td className="p-4 font-medium">
                                {item.itemName}
                                {ckData.length > 1 && <p className="text-[10px] text-muted-foreground uppercase">{item.ckName}</p>}
                              </td>
                              <td className="p-4 text-right font-bold">{item.totalQuantity} {item.unit}</td>
                              <td className="p-4 text-right text-muted-foreground">{item.lowStockThreshold ?? '-'} {item.unit}</td>
                              <td className="p-4">
                                <div className="text-[11px] space-y-1">
                                  {item.batches.slice(0, 2).map((batch, bidx) => (
                                    <div key={bidx} className="flex flex-col">
                                      <span className="font-mono">{batch.batchCode}</span>
                                      {batch.expiredAt && (
                                        <span className={isExpiringSoon ? 'text-destructive font-bold' : 'text-muted-foreground'}>
                                          HSD: {batch.expiredAt}
                                        </span>
                                      )}
                                    </div>
                                  ))}
                                  {item.batches.length > 2 && <span className="text-[10px] text-muted-foreground">+{item.batches.length - 2} lô khác</span>}
                                </div>
                              </td>
                              <td className="p-4 text-center">
                                {item.isLowStock ? (
                                  <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-700 uppercase">Tồn thấp</span>
                                ) : isExpiringSoon ? (
                                  <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-destructive/10 text-destructive uppercase">Sắp hết hạn</span>
                                ) : (
                                  <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700 uppercase">Ổn định</span>
                                )}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {ckIngredients.length > itemsPerPage && (
                <div className="mt-4 flex items-center justify-between px-2">
                  <p className="text-xs text-muted-foreground">
                    Đang xem {(ingredientPage - 1) * itemsPerPage + 1} - {Math.min(ingredientPage * itemsPerPage, ckIngredients.length)} trên {ckIngredients.length}
                  </p>
                  <PaginationControls 
                    currentPage={ingredientPage} 
                    totalItems={ckIngredients.length} 
                    pageSize={itemsPerPage} 
                    onPageChange={setIngredientPage} 
                  />
                </div>
              )}
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="stores" className="space-y-4 pt-2">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {storesData.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase())).map(store => (
              <div key={store.franchiseId} className="bg-card border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                <div className="px-5 py-4 border-b bg-muted/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Store className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{store.name}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-1">{store.address}</p>
                    </div>
                  </div>
                  {store.summary && (
                    <div className="text-right">
                      <p className="text-lg font-bold">{store.summary.items.length}</p>
                      <p className="text-[10px] text-muted-foreground uppercase">Mặt hàng</p>
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b text-[11px] uppercase tracking-wider text-muted-foreground">
                        <th className="text-left pb-2 font-medium">Mặt hàng</th>
                        <th className="text-right pb-2 font-medium">Tồn kho</th>
                        <th className="text-center pb-2 font-medium">P.Loại</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {!store.summary || store.summary.items.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="py-8 text-center text-xs text-muted-foreground italic">Không có dữ liệu tồn kho</td>
                        </tr>
                      ) : (
                        store.summary.items.slice(0, 8).map((item, idx) => (
                          <tr key={idx} className="hover:bg-muted/10">
                            <td className="py-2.5">
                              <p className="text-sm font-medium">{item.itemName}</p>
                              {item.isLowStock && <span className="text-[9px] text-orange-600 font-bold uppercase">Hết hàng</span>}
                            </td>
                            <td className="py-2.5 text-sm text-right font-mono font-bold">
                              {item.totalQuantity} <span className="text-[10px] font-normal text-muted-foreground">{item.unit}</span>
                            </td>
                            <td className="py-2.5 text-center">
                               <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${item.itemType === 'PRODUCT' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'}`}>
                                {item.itemType === 'PRODUCT' ? 'TP' : 'NL'}
                               </span>
                            </td>
                          </tr>
                        ))
                      )}
                      {store.summary && store.summary.items.length > 8 && (
                        <tr>
                          <td colSpan={3} className="py-2 text-center text-[10px] text-muted-foreground font-medium">
                            + {store.summary.items.length - 8} mặt hàng khác
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface PaginationControlsProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({ 
  currentPage, 
  totalItems, 
  pageSize, 
  onPageChange 
}) => {
  const totalPages = Math.ceil(totalItems / pageSize);
  if (totalPages <= 1) return null;

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              if (currentPage > 1) onPageChange(currentPage - 1);
            }}
            className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
          />
        </PaginationItem>
        
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <PaginationItem key={page}>
            <PaginationLink 
              href="#" 
              isActive={currentPage === page}
              onClick={(e) => {
                e.preventDefault();
                onPageChange(page);
              }}
              className="cursor-pointer"
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              if (currentPage < totalPages) onPageChange(currentPage + 1);
            }}
            className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default InventoryOverview;
