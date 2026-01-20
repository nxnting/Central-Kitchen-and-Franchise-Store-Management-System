import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockRecipes, Recipe } from '@/data/mockData';
import { 
  Plus, 
  Search, 
  BookOpen,
  Edit, 
  Trash2,
  Eye,
  ChevronDown,
  ChevronUp,
  Coffee
} from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const RecipeManagement: React.FC = () => {
  const [recipes, setRecipes] = useState(mockRecipes);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRecipes, setExpandedRecipes] = useState<string[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredRecipes = recipes.filter(r => 
    r.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleExpand = (id: string) => {
    setExpandedRecipes(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleDelete = (id: string) => {
    setRecipes(prev => prev.filter(r => r.id !== id));
    toast.success('Đã xóa công thức');
  };

  const handleView = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsDialogOpen(true);
  };

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Công thức & BOM" 
        subtitle="Quản lý công thức pha chế và định mức nguyên liệu"
        action={{
          label: 'Thêm công thức',
          icon: Plus,
          onClick: () => { setSelectedRecipe(null); setIsDialogOpen(true); }
        }}
      />

      {/* Search */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder="Tìm kiếm công thức..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Recipe List */}
      <div className="space-y-4">
        {filteredRecipes.map(recipe => {
          const isExpanded = expandedRecipes.includes(recipe.id);
          const totalCost = recipe.ingredients.reduce((sum, ing) => sum + (ing.cost || 0), 0);
          
          return (
            <Collapsible key={recipe.id} open={isExpanded} onOpenChange={() => toggleExpand(recipe.id)}>
              <div className="bg-card border rounded-xl overflow-hidden">
                <CollapsibleTrigger asChild>
                  <div className="p-5 cursor-pointer hover:bg-muted/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Coffee className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{recipe.productName}</h3>
                          <p className="text-sm text-muted-foreground">
                            {recipe.ingredients.length} nguyên liệu • Sản lượng: {recipe.yield} {recipe.unit}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Chi phí ước tính</p>
                          <p className="font-semibold text-primary">{totalCost.toLocaleString('vi-VN')}đ</p>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleView(recipe); }}>
                            <Eye size={16} />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleView(recipe); }}>
                            <Edit size={16} />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-destructive" onClick={(e) => { e.stopPropagation(); handleDelete(recipe.id); }}>
                            <Trash2 size={16} />
                          </Button>
                        </div>
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                    </div>
                  </div>
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <div className="px-5 pb-5 border-t">
                    <h4 className="font-medium py-3">Định mức nguyên liệu (BOM)</h4>
                    <div className="bg-muted/30 rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left p-3 text-sm font-medium text-muted-foreground">Nguyên liệu</th>
                            <th className="text-right p-3 text-sm font-medium text-muted-foreground">Định mức</th>
                            <th className="text-right p-3 text-sm font-medium text-muted-foreground">Đơn vị</th>
                            <th className="text-right p-3 text-sm font-medium text-muted-foreground">Chi phí</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recipe.ingredients.map((ing, idx) => (
                            <tr key={idx} className="border-b border-border last:border-0">
                              <td className="p-3 font-medium">{ing.productName}</td>
                              <td className="p-3 text-right">{ing.quantity}</td>
                              <td className="p-3 text-right text-muted-foreground">{ing.unit}</td>
                              <td className="p-3 text-right">{(ing.cost || 0).toLocaleString('vi-VN')}đ</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="bg-muted/50">
                            <td colSpan={3} className="p-3 font-semibold text-right">Tổng chi phí:</td>
                            <td className="p-3 text-right font-semibold text-primary">{totalCost.toLocaleString('vi-VN')}đ</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          );
        })}
      </div>

      {/* Recipe Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {selectedRecipe ? 'Chi tiết công thức' : 'Thêm công thức mới'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label>Tên sản phẩm</Label>
              <Input 
                defaultValue={selectedRecipe?.productName || ''} 
                placeholder="VD: Trà sữa trân châu đường đen"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Sản lượng</Label>
                <Input 
                  type="number"
                  defaultValue={selectedRecipe?.yield || ''} 
                  placeholder="VD: 1"
                />
              </div>
              <div>
                <Label>Đơn vị</Label>
                <Input 
                  defaultValue={selectedRecipe?.unit || ''} 
                  placeholder="VD: ly"
                />
              </div>
            </div>
            
            <div>
              <Label className="flex items-center justify-between">
                Nguyên liệu
                <Button variant="outline" size="sm">
                  <Plus size={14} className="mr-1" />
                  Thêm
                </Button>
              </Label>
              <div className="mt-2 space-y-2">
                {(selectedRecipe?.ingredients || []).map((ing, idx) => (
                  <div key={idx} className="flex gap-2 items-center p-2 bg-muted/30 rounded-lg">
                    <span className="flex-1 text-sm">{ing.productName}</span>
                    <span className="text-sm">{ing.quantity} {ing.unit}</span>
                  </div>
                ))}
                {!selectedRecipe && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Chưa có nguyên liệu. Nhấn "Thêm" để bổ sung.
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setIsDialogOpen(false)}>
                Đóng
              </Button>
              <Button className="flex-1" onClick={() => { toast.success('Đã lưu công thức'); setIsDialogOpen(false); }}>
                Lưu công thức
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RecipeManagement;
