import React, { useState, useMemo } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Pagination } from '@/components/common/Pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2,
  Eye,
  ChevronDown,
  ChevronUp,
  Coffee,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

// API hooks
import { useProducts } from '@/hooks/products/useProducts';
import { useRecipes, useCreateRecipe, useUpdateRecipe, useChangeRecipeStatus } from '@/hooks/manager/useRecipe';
import { useBoms, useCreateBom, useUpdateBom, useChangeBomStatus } from '@/hooks/manager/useBom';
import { useIngredients } from '@/hooks/ingredients/useIngredients';

interface CombinedData {
  productId: number;
  productName: string;
  productUnit: string;
  recipeItem: any; // from Recipe
  bomItem: any;    // from BOM
}

const RecipeManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRecipes, setExpandedRecipes] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  
  // Queries
  const { data: productsRes, isLoading: loadingProducts } = useProducts({ productType: 'FINISHED', pageSize: 1000 });
  const { data: recipesRes, isLoading: loadingRecipes } = useRecipes({ pageSize: 1000 });
  const { data: bomsRes, isLoading: loadingBoms } = useBoms({ pageSize: 1000 });
  const { data: ingredientsRes } = useIngredients({ pageSize: 1000 });

  const products = productsRes?.data?.items || [];
  const recipes = recipesRes?.data?.items || [];
  const boms = bomsRes?.data?.items || [];
  const ingredients = ingredientsRes?.data?.items || [];

  // Mutations
  const createRecipe = useCreateRecipe();
  const updateRecipe = useUpdateRecipe();
  const createBom = useCreateBom();
  const updateBom = useUpdateBom();

  // Combine data
  const combinedData: CombinedData[] = useMemo(() => {
    return products.map(p => {
      const recipe = recipes.find(r => r.productId === p.id);
      const bom = boms.find(b => b.productId === p.id);
      return {
        productId: p.id,
        productName: p.name,
        productUnit: p.unit,
        recipeItem: recipe,
        bomItem: bom,
      };
    }).filter(d => d.recipeItem || d.bomItem || d.productId);
  }, [products, recipes, boms]);

  const filteredData = combinedData.filter(d => 
    d.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage, pageSize]);

  // Handle Search Change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Form State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [isNewRecipe, setIsNewRecipe] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | ''>('');
  const [formInstructions, setFormInstructions] = useState('');
  const [formIngredients, setFormIngredients] = useState<{ ingredientId: number, quantity: number }[]>([]);

  const toggleExpand = (id: number) => {
    setExpandedRecipes(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const openAddDialog = () => {
    setIsViewMode(false);
    setIsNewRecipe(true);
    setSelectedProductId('');
    setFormInstructions('');
    setFormIngredients([]);
    setIsDialogOpen(true);
  };

  const openEditDialog = (data: CombinedData, viewOnly: boolean = false) => {
    setIsViewMode(viewOnly);
    setSelectedProductId(data.productId);
    setIsNewRecipe(!data.recipeItem && !data.bomItem);
    setFormInstructions(data.recipeItem?.instructions || '');
    if (data.bomItem?.items) {
      setFormIngredients(data.bomItem.items.map((i: any) => ({ ingredientId: i.ingredientId, quantity: i.quantity })));
    } else {
      setFormIngredients([]);
    }
    setIsDialogOpen(true);
  };

  const handleAddIngredient = () => {
    if (!isViewMode) {
      setFormIngredients([...formIngredients, { ingredientId: 0, quantity: 0 }]);
    }
  };

  const handleUpdateIngredient = (index: number, field: 'ingredientId' | 'quantity', value: number) => {
    const updated = [...formIngredients];
    updated[index] = { ...updated[index], [field]: value };
    setFormIngredients(updated);
  };

  const handleRemoveIngredient = (index: number) => {
    const updated = [...formIngredients];
    updated.splice(index, 1);
    setFormIngredients(updated);
  };

  const handleSave = async () => {
    console.log('--- START SAVING ---');
    console.log('Selected Product ID:', selectedProductId);
    console.log('Form Instructions:', formInstructions);
    console.log('Form Ingredients:', formIngredients);

    if (!selectedProductId) {
      toast.error('Vui lòng chọn sản phẩm');
      return;
    }

    try {
      const existingData = combinedData.find(d => d.productId === selectedProductId);
      const recipeId = existingData?.recipeItem?.id;
      const bomId = existingData?.bomItem?.id;
      
      console.log('Existing Recipe ID:', recipeId);
      console.log('Existing BOM ID:', bomId);

      let recipePromise = null;
      let bomPromise = null;

      // Save Recipe if instructions exist or updating
      if (formInstructions.trim() || recipeId) {
        if (recipeId) {
          recipePromise = updateRecipe.mutateAsync({ id: recipeId, data: { instructions: formInstructions } });
        } else {
          recipePromise = createRecipe.mutateAsync({ productId: selectedProductId as number, instructions: formInstructions });
        }
      }

      // Save BOM if items exist
      const bomItems = formIngredients.filter(i => {
        const isValid = i.ingredientId > 0 && i.quantity > 0;
        if (!isValid) {
            console.log('Filtering out invalid ingredient:', i);
        }
        return isValid;
      });
      console.log('Valid BOM Items to save:', bomItems);
      
      if (bomItems.length > 0) {
        if (bomId) {
          const mappedBomItems = bomItems.map(i => ({
            ingredientId: i.ingredientId,
            quantity: i.quantity
          }));
          
          if (existingData?.bomItem?.status === 'ACTIVE') {
            toast.error('Không thể cập nhật BOM đang hoạt động. Vui lòng tạo phiên bản mới (chức năng này sẽ được cập nhật sau).');
            return;
          }
          console.log('Updating BOM with payload:', { id: bomId, data: { items: mappedBomItems } });
          bomPromise = updateBom.mutateAsync({ id: bomId, data: { items: mappedBomItems } });
        } else {
          const payload = { productId: selectedProductId as number, items: bomItems.map(i => ({ ingredientId: i.ingredientId, quantity: i.quantity })) };
          console.log('Creating BOM with payload:', payload);
          bomPromise = createBom.mutateAsync(payload);
        }
      } else if (bomId && bomItems.length === 0) {
        toast.error('BOM cần ít nhất 1 nguyên liệu.');
        return;
      }

      if (!recipePromise && !bomPromise) {
        toast.error('Vui lòng nhập công thức hoặc thêm ít nhất 1 nguyên liệu.');
        return;
      }

      await Promise.all([recipePromise, bomPromise].filter(Boolean));

      toast.success('Đã lưu công thức và BOM thành công');
      setIsDialogOpen(false);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Có lỗi xảy ra khi lưu. Vui lòng thử lại.';
      toast.error(errorMessage);
      console.error(error);
    }
  };

  const isLoading = loadingProducts || loadingRecipes || loadingBoms;

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Công thức & BOM" 
        subtitle="Quản lý công thức pha chế và định mức nguyên liệu"
        action={{
          label: 'Thêm công thức',
          icon: Plus,
          onClick: openAddDialog
        }}
      />

      {/* Search */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder="Tìm kiếm công thức..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-sm text-muted-foreground">
            Tổng: <span className="font-semibold text-foreground">{totalItems}</span> công thức
          </span>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-10">Đang tải dữ liệu...</div>
      ) : (
        <div className="space-y-4">
          {paginatedData.map(data => {
            const isExpanded = expandedRecipes.includes(data.productId);
            const bomItemsCount = data.bomItem?.items?.length || 0;
            
            return (
              <Collapsible key={data.productId} open={isExpanded} onOpenChange={() => toggleExpand(data.productId)}>
                <div className="bg-card border rounded-xl overflow-hidden">
                  <CollapsibleTrigger asChild>
                    <div className="p-5 cursor-pointer hover:bg-muted/30 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Coffee className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{data.productName}</h3>
                            <p className="text-sm text-muted-foreground">
                              {bomItemsCount > 0 ? `${bomItemsCount} nguyên liệu` : 'Chưa thiết lập nguyên liệu'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); openEditDialog(data, true); }}>
                              <Eye size={16} />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); openEditDialog(data); }}>
                              <Edit size={16} />
                            </Button>
                          </div>
                          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </div>
                      </div>
                    </div>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <div className="px-5 pb-5 border-t">
                      {data.recipeItem?.instructions && (
                        <div className="py-3 text-sm">
                          <span className="font-medium mr-2">Hướng dẫn:</span>
                          <span className="text-muted-foreground">{data.recipeItem.instructions}</span>
                        </div>
                      )}

                      <h4 className="font-medium py-3">Định mức nguyên liệu (BOM)</h4>
                      {data.bomItem?.items?.length > 0 ? (
                        <div className="bg-muted/30 rounded-lg overflow-hidden">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-border">
                                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Nguyên liệu</th>
                                <th className="text-right p-3 text-sm font-medium text-muted-foreground">Định mức</th>
                                <th className="text-right p-3 text-sm font-medium text-muted-foreground">Đơn vị</th>
                              </tr>
                            </thead>
                            <tbody>
                              {data.bomItem.items.map((ing: any, idx: number) => (
                                <tr key={idx} className="border-b border-border last:border-0">
                                  <td className="p-3 font-medium">{ing.ingredientName || '---'}</td>
                                  <td className="p-3 text-right">{ing.quantity}</td>
                                  <td className="p-3 text-right text-muted-foreground">{ing.ingredientUnit}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground text-center py-4 bg-muted/30 rounded-lg">Không có dữ liệu BOM</p>
                      )}
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            );
          })}

          <div className="bg-card border rounded-xl overflow-hidden mt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }}
            />
          </div>
        </div>
      )}

      {/* Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isViewMode ? 'Chi tiết công thức' : (isNewRecipe ? 'Thêm công thức mới' : 'Chỉnh sửa công thức')}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 pt-4">
            <div>
              <Label>Sản phẩm</Label>
              <select 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(Number(e.target.value))}
                disabled={isViewMode || !!combinedData.find(d => d.productId === selectedProductId)?.recipeItem}
              >
                <option value="">-- Chọn sản phẩm --</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.unit})</option>
                ))}
              </select>
            </div>

            <div>
              <Label>Hướng dẫn pha chế</Label>
              <textarea 
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background min-h-[80px] disabled:cursor-not-allowed disabled:opacity-50"
                value={formInstructions}
                onChange={(e) => setFormInstructions(e.target.value)}
                placeholder="Ví dụ: Pha trà nóng, sau đó thêm đường..."
                disabled={isViewMode}
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Định mức nguyên liệu (BOM)</Label>
                {!isViewMode && (
                  <Button variant="outline" size="sm" onClick={handleAddIngredient}>
                    <Plus size={14} className="mr-1" />
                    Thêm NVL
                  </Button>
                )}
              </div>
              <div className="space-y-2">
                {formIngredients.map((ing, idx) => (
                  <div key={idx} className="flex gap-2 items-center p-2 bg-muted/30 rounded-lg">
                    <select 
                      className="flex-1 h-9 rounded-md border border-input bg-background px-3 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                      value={ing.ingredientId}
                      onChange={(e) => handleUpdateIngredient(idx, 'ingredientId', Number(e.target.value))}
                      disabled={isViewMode}
                    >
                      <option value={0}>-- Chọn nguyên liệu --</option>
                      {ingredients.map(i => (
                        <option key={i.id} value={Number(i.id)}>{i.name} ({i.unit})</option>
                      ))}
                    </select>
                    
                    <Input 
                      type="number"
                      step="0.01"
                      placeholder="Số lượng"
                      className="w-24 h-9"
                      value={ing.quantity || ''}
                      onChange={(e) => handleUpdateIngredient(idx, 'quantity', Number(e.target.value))}
                      disabled={isViewMode}
                    />
                    
                    {!isViewMode && (
                      <Button variant="ghost" size="icon" className="text-destructive h-9 w-9" onClick={() => handleRemoveIngredient(idx)}>
                        <X size={16} />
                      </Button>
                    )}
                  </div>
                ))}
                {formIngredients.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4 bg-muted/30 rounded-lg">
                    Chưa có nguyên liệu.
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <Button variant="outline" className={isViewMode ? 'w-full' : 'flex-1'} onClick={() => setIsDialogOpen(false)}>
                Đóng
              </Button>
              {!isViewMode && (
                <Button className="flex-1" onClick={handleSave} disabled={createRecipe.isPending || updateRecipe.isPending || createBom.isPending || updateBom.isPending}>
                  {createRecipe.isPending || updateRecipe.isPending ? 'Đang lưu...' : 'Lưu công thức'}
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RecipeManagement;
