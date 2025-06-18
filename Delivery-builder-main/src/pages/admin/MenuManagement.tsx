import { useState, useEffect, useCallback } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Pizza, Package, Star, Slice, GlassWater, AlertTriangle, ListCollapse } from "lucide-react";
import { PizzaType, PizzaFlavor, PizzaExtra, PizzaCrust, Beverage, BeverageCategory } from "@/types";
import { api } from "@/services/apiService";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);
};

// --- DIÁLOGOS DE EDIÇÃO E CRIAÇÃO (Sem alterações no código dos diálogos) ---

const TypeDialog = ({ open, setOpen, editingItem, onSave, pizzaExtras, pizzaCrusts }) => {
    const { toast } = useToast();
    const [formData, setFormData] = useState({ name: "", description: "", basePrice: 0 });
    const [selectedExtraIds, setSelectedExtraIds] = useState<Set<string>>(new Set());
    const [selectedCrustIds, setSelectedCrustIds] = useState<Set<string>>(new Set());
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
  
    useEffect(() => {
      if (open) {
        if (editingItem) {
          setFormData({ name: editingItem.name, description: editingItem.description, basePrice: editingItem.basePrice });
          setSelectedExtraIds(new Set(editingItem.availableExtras?.map((e) => e.id) || []));
          setSelectedCrustIds(new Set(editingItem.availableCrusts?.map((c) => c.id) || []));
        } else {
          setFormData({ name: "", description: "", basePrice: 0 });
          setSelectedExtraIds(new Set());
          setSelectedCrustIds(new Set());
        }
        setImageFile(null);
      }
    }, [editingItem, open]);
  
    const handleExtraChange = (id: string, checked: boolean) => {
      setSelectedExtraIds((prev) => { const newSet = new Set(prev); if (checked) newSet.add(id); else newSet.delete(id); return newSet; });
    };

    const handleCrustChange = (id: string, checked: boolean) => {
      setSelectedCrustIds((prev) => { const newSet = new Set(prev); if (checked) newSet.add(id); else newSet.delete(id); return newSet; });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      const payload = {
        ...formData,
        availableExtras: Array.from(selectedExtraIds).map((id) => ({ id })),
        availableCrusts: Array.from(selectedCrustIds).map((id) => ({ id })),
      };
  
      try {
        let savedType;
        if (editingItem) {
          savedType = await api.admin.updatePizzaType(editingItem.id, payload as any);
        } else {
          savedType = await api.admin.createPizzaType(payload as any);
        }
  
        if (imageFile && savedType) {
          await api.admin.uploadPizzaTypeImage(savedType.id, imageFile);
        }
        toast({ title: "Sucesso!", description: `Tipo "${savedType.name}" salvo com sucesso.` });
        onSave();
      } catch (error) {
        toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };
  
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>{editingItem ? "Editar Tipo de Pizza" : "Novo Tipo de Pizza"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-4">
            <div><Label htmlFor="name">Nome</Label><Input id="name" value={formData.name} onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))} required /></div>
            <div><Label htmlFor="description">Descrição</Label><Textarea id="description" value={formData.description} onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))} required /></div>
            <div><Label htmlFor="basePrice">Preço Base (R$)</Label><Input id="basePrice" type="number" step="0.01" value={formData.basePrice} onChange={(e) => setFormData((p) => ({ ...p, basePrice: parseFloat(e.target.value) || 0 }))} required /></div>
            <div><Label htmlFor="typeImage">Imagem do Tipo</Label><Input id="typeImage" type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)} /></div>
  
            <div>
                <Label>Bordas Disponíveis</Label>
                <Card className="p-3 mt-2 max-h-40 overflow-y-auto"><div className="space-y-2">
                    {pizzaCrusts.map((crust) => (<div key={crust.id} className="flex items-center space-x-2"><Checkbox id={`type-crust-${crust.id}`} checked={selectedCrustIds.has(crust.id)} onCheckedChange={(checked) => handleCrustChange(crust.id, !!checked)} /><Label htmlFor={`type-crust-${crust.id}`} className="font-normal cursor-pointer">{crust.name}</Label></div>))}
                </div></Card>
            </div>
            <div>
                <Label>Adicionais Disponíveis</Label>
                <Card className="p-3 mt-2 max-h-40 overflow-y-auto"><div className="space-y-2">
                    {pizzaExtras.map((extra) => (<div key={extra.id} className="flex items-center space-x-2"><Checkbox id={`type-extra-${extra.id}`} checked={selectedExtraIds.has(extra.id)} onCheckedChange={(checked) => handleExtraChange(extra.id, !!checked)} /><Label htmlFor={`type-extra-${extra.id}`} className="font-normal cursor-pointer">{extra.name}</Label></div>))}
                </div></Card>
            </div>

            <div className="flex justify-end space-x-2 pt-4"><Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>Cancelar</Button><Button type="submit" className="bg-red-600 hover:bg-red-700" disabled={isLoading}>{isLoading ? 'Salvando...' : 'Salvar'}</Button></div>
          </form>
        </DialogContent>
      </Dialog>
    );
};
  
const FlavorDialog = ({ open, setOpen, editingItem, onSave, pizzaTypes }) => {
    const { toast } = useToast();
    const [formData, setFormData] = useState({ name: "", description: "", price: 0 });
    const [selectedTypeIds, setSelectedTypeIds] = useState<Set<string>>(new Set());
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
  
    useEffect(() => {
      if (open) {
        if (editingItem) {
          setFormData({ name: editingItem.name, description: editingItem.description, price: editingItem.price });
          setSelectedTypeIds(new Set(editingItem.pizzaTypes?.map((pt) => pt.id) || []));
        } else {
          setFormData({ name: "", description: "", price: 0 });
          setSelectedTypeIds(new Set());
        }
        setImageFile(null);
      }
    }, [editingItem, open]);
  
    const handleTypeChange = (typeId: string, checked: boolean) => {
      setSelectedTypeIds((prev) => {
        const newSet = new Set(prev);
        if (checked) newSet.add(typeId);
        else newSet.delete(typeId);
        return newSet;
      });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      
      const payload = {
          ...formData,
          pizzaTypeIds: Array.from(selectedTypeIds)
      };
  
      try {
        let savedFlavor;
        if (editingItem) {
          savedFlavor = await api.admin.updatePizzaFlavor(editingItem.id, payload as any);
        } else {
          savedFlavor = await api.admin.createPizzaFlavor(payload as any);
        }
        
        if (imageFile && savedFlavor) {
          await api.admin.uploadFlavorImage(savedFlavor.id, imageFile);
        }
  
        toast({ title: "Sucesso!", description: `Sabor "${savedFlavor.name}" salvo com sucesso.` });
        onSave();
      } catch (error) {
        toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };
  
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingItem ? "Editar Sabor" : "Novo Sabor"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-4">
            <div><Label htmlFor="flavorName">Nome do Sabor</Label><Input id="flavorName" value={formData.name} onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))} required /></div>
            <div><Label htmlFor="flavorDescription">Descrição</Label><Textarea id="flavorDescription" value={formData.description} onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))} required /></div>
            
            <div>
              <Label>Disponível nos Tipos de Pizza</Label>
              <Card className="p-3 mt-2 max-h-48 overflow-y-auto">
                <div className="space-y-2">
                  {pizzaTypes.map(type => (
                    <div key={type.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`flavor-type-${type.id}`}
                        checked={selectedTypeIds.has(type.id)}
                        onCheckedChange={checked => handleTypeChange(type.id, !!checked)}
                      />
                      <Label htmlFor={`flavor-type-${type.id}`} className="font-normal cursor-pointer">{type.name}</Label>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <div><Label htmlFor="flavorPrice">Preço Adicional (R$)</Label><Input id="flavorPrice" type="number" step="0.01" value={formData.price} onChange={(e) => setFormData(p => ({ ...p, price: parseFloat(e.target.value) || 0 }))} required /></div>
            <div><Label htmlFor="image">Imagem do Sabor</Label><Input id="image" type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)} /></div>
            <div className="flex justify-end space-x-2 pt-4"><Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>Cancelar</Button><Button type="submit" className="bg-red-600 hover:bg-red-700" disabled={isLoading}>{isLoading ? 'Salvando...' : 'Salvar'}</Button></div>
          </form>
        </DialogContent>
      </Dialog>
    );
};
  
const ExtraDialog = ({ open, setOpen, editingItem, onSave, pizzaTypes }) => {
    const { toast } = useToast();
    const [formData, setFormData] = useState({ name: "", description: "", price: 0 });
    const [selectedTypeIds, setSelectedTypeIds] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (open) {
            if (editingItem) {
                setFormData({ name: editingItem.name, description: editingItem.description, price: editingItem.price });
                const associatedTypeIds = pizzaTypes.filter(type => type.availableExtras?.some(extra => extra.id === editingItem.id)).map(type => type.id);
                setSelectedTypeIds(new Set(associatedTypeIds));
            } else {
                setFormData({ name: "", description: "", price: 0 });
                setSelectedTypeIds(new Set());
            }
        }
    }, [editingItem, open, pizzaTypes]);

    const handleTypeChange = (typeId: string, checked: boolean) => {
        setSelectedTypeIds(prev => { const newSet = new Set(prev); if (checked) newSet.add(typeId); else newSet.delete(typeId); return newSet; });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const payload = { ...formData, pizzaTypeIds: Array.from(selectedTypeIds) };
        try {
            let savedItem;
            if (editingItem) {
                savedItem = await api.admin.updatePizzaExtra(editingItem.id, payload);
            } else {
                savedItem = await api.admin.createPizzaExtra(payload);
            }
            toast({ title: "Sucesso!", description: `Adicional "${savedItem.name}" salvo com sucesso.` });
            onSave();
        } catch (error) {
            toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}><DialogContent>
            <DialogHeader><DialogTitle>{editingItem ? "Editar Adicional" : "Novo Adicional"}</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div><Label htmlFor="extraName">Nome do Adicional</Label><Input id="extraName" value={formData.name} onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))} required /></div>
                <div><Label htmlFor="extraDescription">Descrição</Label><Textarea id="extraDescription" value={formData.description} onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))} required /></div>
                <div><Label htmlFor="extraPrice">Preço (R$)</Label><Input id="extraPrice" type="number" step="0.01" value={formData.price} onChange={(e) => setFormData(p => ({ ...p, price: parseFloat(e.target.value) || 0 }))} required /></div>
                <div>
                    <Label>Disponível nos Tipos de Pizza</Label>
                    <Card className="p-3 mt-2 max-h-48 overflow-y-auto"><div className="space-y-2">
                        {pizzaTypes.map(type => (<div key={type.id} className="flex items-center space-x-2"><Checkbox id={`extra-type-${type.id}`} checked={selectedTypeIds.has(type.id)} onCheckedChange={checked => handleTypeChange(type.id, !!checked)} /><Label htmlFor={`extra-type-${type.id}`} className="font-normal cursor-pointer">{type.name}</Label></div>))}
                    </div></Card>
                </div>
                <div className="flex justify-end space-x-2"><Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>Cancelar</Button><Button type="submit" className="bg-red-600 hover:bg-red-700" disabled={isLoading}>{isLoading ? 'Salvando...' : 'Salvar'}</Button></div>
            </form>
        </DialogContent></Dialog>
    );
};

const CrustDialog = ({ open, setOpen, editingItem, onSave, pizzaTypes }) => {
    const { toast } = useToast();
    const [formData, setFormData] = useState({ name: "", description: "", price: 0 });
    const [selectedTypeIds, setSelectedTypeIds] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (open) {
            if (editingItem) {
                setFormData({ name: editingItem.name, description: editingItem.description, price: editingItem.price });
                const associatedTypeIds = pizzaTypes.filter(type => type.availableCrusts?.some(crust => crust.id === editingItem.id)).map(type => type.id);
                setSelectedTypeIds(new Set(associatedTypeIds));
            } else {
                setFormData({ name: "", description: "", price: 0 });
                setSelectedTypeIds(new Set());
            }
        }
    }, [editingItem, open, pizzaTypes]);

    const handleTypeChange = (typeId: string, checked: boolean) => {
        setSelectedTypeIds(prev => { const newSet = new Set(prev); if (checked) newSet.add(typeId); else newSet.delete(typeId); return newSet; });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const payload = { ...formData, pizzaTypeIds: Array.from(selectedTypeIds) };
        try {
            let savedItem;
            if (editingItem) {
                savedItem = await api.admin.updatePizzaCrust(editingItem.id, payload);
            } else {
                savedItem = await api.admin.createPizzaCrust(payload);
            }
            toast({ title: "Sucesso!", description: `Borda "${savedItem.name}" salva com sucesso.` });
            onSave();
        } catch (error) {
            toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}><DialogContent>
            <DialogHeader><DialogTitle>{editingItem ? "Editar Borda" : "Nova Borda"}</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div><Label htmlFor="crustName">Nome da Borda</Label><Input id="crustName" value={formData.name} onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))} required /></div>
                <div><Label htmlFor="crustDescription">Descrição</Label><Textarea id="crustDescription" value={formData.description} onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))} required /></div>
                <div><Label htmlFor="crustPrice">Preço (R$)</Label><Input id="crustPrice" type="number" step="0.01" value={formData.price} onChange={(e) => setFormData(p => ({ ...p, price: parseFloat(e.target.value) || 0 }))} required /></div>
                <div>
                    <Label>Disponível nos Tipos de Pizza</Label>
                    <Card className="p-3 mt-2 max-h-48 overflow-y-auto"><div className="space-y-2">
                        {pizzaTypes.map(type => (<div key={type.id} className="flex items-center space-x-2"><Checkbox id={`crust-type-${type.id}`} checked={selectedTypeIds.has(type.id)} onCheckedChange={checked => handleTypeChange(type.id, !!checked)} /><Label htmlFor={`crust-type-${type.id}`} className="font-normal cursor-pointer">{type.name}</Label></div>))}
                    </div></Card>
                </div>
                <div className="flex justify-end space-x-2"><Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>Cancelar</Button><Button type="submit" className="bg-red-600 hover:bg-red-700" disabled={isLoading}>{isLoading ? 'Salvando...' : 'Salvar'}</Button></div>
            </form>
        </DialogContent></Dialog>
    );
};

const BeverageCategoryDialog = ({ open, setOpen, editingItem, onSave }) => {
    const { toast } = useToast();
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (open) {
            setName(editingItem ? editingItem.name : '');
        }
    }, [editingItem, open]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const savedCategory = editingItem 
                ? await api.admin.updateBeverageCategory(editingItem.id, { name })
                : await api.admin.createBeverageCategory({ name });
            toast({ title: "Sucesso!", description: `Categoria "${savedCategory.name}" salva.` });
            onSave();
        } catch (error) {
            toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader><DialogTitle>{editingItem ? 'Editar Categoria' : 'Nova Categoria de Bebida'}</DialogTitle></DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div><Label htmlFor="categoryName">Nome da Categoria</Label><Input id="categoryName" value={name} onChange={(e) => setName(e.target.value)} required /></div>
                    <div className="flex justify-end space-x-2"><Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>Cancelar</Button><Button type="submit" className="bg-red-600 hover:bg-red-700" disabled={isLoading}>{isLoading ? 'Salvando...' : 'Salvar'}</Button></div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

const BeverageDialog = ({ open, setOpen, editingItem, onSave, categories }) => {
    const { toast } = useToast();
    const [formData, setFormData] = useState({ name: "", description: "", price: 0, alcoholic: false, categoryId: "" });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (open) {
            if (editingItem) {
                setFormData({ 
                    name: editingItem.name, 
                    description: editingItem.description, 
                    price: editingItem.price,
                    alcoholic: editingItem.alcoholic || false,
                    categoryId: editingItem.category?.id || ""
                });
            } else {
                setFormData({ name: "", description: "", price: 0, alcoholic: false, categoryId: "" });
            }
            setImageFile(null);
        }
    }, [editingItem, open]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.categoryId) {
            toast({ title: "Campo obrigatório", description: "Por favor, selecione uma categoria.", variant: "destructive" });
            return;
        }
        setIsLoading(true);
        try {
            let savedBeverage;
            if (editingItem) {
                savedBeverage = await api.admin.updateBeverage(editingItem.id, formData);
            } else {
                savedBeverage = await api.admin.createBeverage(formData);
            }
            if (imageFile && savedBeverage) {
                await api.admin.uploadBeverageImage(savedBeverage.id, imageFile);
            }
            toast({ title: "Sucesso!", description: `Bebida "${savedBeverage.name}" salva com sucesso.` });
            onSave();
        } catch (error) {
            toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader><DialogTitle>{editingItem ? "Editar Bebida" : "Nova Bebida"}</DialogTitle></DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div><Label htmlFor="beverageName">Nome</Label><Input id="beverageName" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required /></div>
                    <div>
                        <Label htmlFor="categoryId">Categoria</Label>
                        <Select value={formData.categoryId} onValueChange={value => setFormData({...formData, categoryId: value})}>
                            <SelectTrigger id="categoryId"><SelectValue placeholder="Selecione uma categoria" /></SelectTrigger>
                            <SelectContent>
                                {categories.map(cat => <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div><Label htmlFor="beverageDescription">Descrição</Label><Textarea id="beverageDescription" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required /></div>
                    <div><Label htmlFor="beveragePrice">Preço (R$)</Label><Input id="beveragePrice" type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: parseFloat(e.target.value) || 0})} required /></div>
                    <div className="flex items-center space-x-2 pt-2"><Switch id="alcoholic-switch" checked={formData.alcoholic} onCheckedChange={checked => setFormData({...formData, alcoholic: checked})} /><Label htmlFor="alcoholic-switch">É uma bebida alcoólica?</Label></div>
                    <div><Label htmlFor="beverageImage">Imagem</Label><Input id="beverageImage" type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)} /></div>
                    <div className="flex justify-end space-x-2 pt-4"><Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>Cancelar</Button><Button type="submit" className="bg-red-600 hover:bg-red-700" disabled={isLoading}>{isLoading ? 'Salvando...' : 'Salvar'}</Button></div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export const MenuManagement = () => {
    const [pizzaTypes, setPizzaTypes] = useState<PizzaType[]>([]);
    const [pizzaFlavors, setPizzaFlavors] = useState<PizzaFlavor[]>([]);
    const [pizzaExtras, setPizzaExtras] = useState<PizzaExtra[]>([]);
    const [pizzaCrusts, setPizzaCrusts] = useState<PizzaCrust[]>([]);
    const [beverages, setBeverages] = useState<Beverage[]>([]);
    const [beverageCategories, setBeverageCategories] = useState<BeverageCategory[]>([]);

    const [editingType, setEditingType] = useState<PizzaType | null>(null);
    const [isTypeDialogOpen, setIsTypeDialogOpen] = useState(false);
    const [editingFlavor, setEditingFlavor] = useState<PizzaFlavor | null>(null);
    const [isFlavorDialogOpen, setIsFlavorDialogOpen] = useState(false);
    const [editingExtra, setEditingExtra] = useState<PizzaExtra | null>(null);
    const [isExtraDialogOpen, setIsExtraDialogOpen] = useState(false);
    const [editingCrust, setEditingCrust] = useState<PizzaCrust | null>(null);
    const [isCrustDialogOpen, setIsCrustDialogOpen] = useState(false);
    const [editingBeverage, setEditingBeverage] = useState<Beverage | null>(null);
    const [isBeverageDialogOpen, setIsBeverageDialogOpen] = useState(false);
    const [editingBeverageCat, setEditingBeverageCat] = useState<BeverageCategory | null>(null);
    const [isBeverageCatDialogOpen, setIsBeverageCatDialogOpen] = useState(false);
    const { toast } = useToast();

    // ****** INÍCIO DA CORREÇÃO ******
    const loadData = useCallback(async () => {
        const showErrorToast = (itemType: string, error: any) => {
            toast({
                title: `Erro ao carregar ${itemType}`,
                description: error.message || "Não foi possível buscar os dados do servidor.",
                variant: "destructive",
            });
        };

        // Carrega cada item individualmente para evitar que um erro impeça os outros de carregar
        try {
            const types = await api.public.getPizzaTypes();
            setPizzaTypes(Array.isArray(types) ? types : []);
        } catch (error) {
            showErrorToast("Tipos de Pizza", error);
        }
    
        try {
            const flavors = await api.public.getPizzaFlavors();
            setPizzaFlavors(Array.isArray(flavors) ? flavors : []);
        } catch (error) {
            showErrorToast("Sabores", error);
        }
    
        try {
            const extras = await api.public.getPizzaExtras();
            setPizzaExtras(Array.isArray(extras) ? extras : []);
        } catch (error) {
            showErrorToast("Adicionais", error);
        }
    
        try {
            const crusts = await api.public.getAllCrusts();
            setPizzaCrusts(Array.isArray(crusts) ? crusts : []);
        } catch (error) {
            showErrorToast("Bordas", error);
        }
    
        try {
            const drinks = await api.public.getBeverages();
            setBeverages(Array.isArray(drinks) ? drinks : []);
        } catch (error) {
            showErrorToast("Bebidas", error);
        }
    
        try {
            const bevCats = await api.admin.getAllBeverageCategories();
            setBeverageCategories(Array.isArray(bevCats) ? bevCats : []);
        } catch (error) {
            showErrorToast("Categorias de Bebidas", error);
        }
    }, [toast]);
    // ****** FIM DA CORREÇÃO ******

    useEffect(() => { loadData(); }, [loadData]);
    
    const handleSave = () => {
        setIsTypeDialogOpen(false); setEditingType(null);
        setIsFlavorDialogOpen(false); setEditingFlavor(null);
        setIsExtraDialogOpen(false); setEditingExtra(null);
        setIsCrustDialogOpen(false); setEditingCrust(null);
        setIsBeverageDialogOpen(false); setEditingBeverage(null);
        setIsBeverageCatDialogOpen(false); setEditingBeverageCat(null);
        loadData();
    };
    
    const createDeleteHandler = (itemType: string, deleteApiCall: (id: string) => Promise<any>) => async (id: string, name: string) => {
        try {
            await deleteApiCall(id);
            toast({ title: `${itemType} excluído(a)!`, description: `"${name}" foi removido(a).` });
            loadData();
        } catch (error) {
            toast({ title: `Erro ao excluir`, description: error.message, variant: "destructive" });
        }
    };
    
    const actions = {
        type: {
            new: () => { setEditingType(null); setIsTypeDialogOpen(true); },
            edit: (item) => { setEditingType(item); setIsTypeDialogOpen(true); },
            delete: createDeleteHandler("Tipo", api.admin.deletePizzaType),
        },
        flavor: {
            new: () => { setEditingFlavor(null); setIsFlavorDialogOpen(true); },
            edit: (item) => { setEditingFlavor(item); setIsFlavorDialogOpen(true); },
            delete: createDeleteHandler("Sabor", api.admin.deletePizzaFlavor),
        },
        extra: {
            new: () => { setEditingExtra(null); setIsExtraDialogOpen(true); },
            edit: (item) => { setEditingExtra(item); setIsExtraDialogOpen(true); },
            delete: createDeleteHandler("Adicional", api.admin.deletePizzaExtra),
        },
        crust: {
            new: () => { setEditingCrust(null); setIsCrustDialogOpen(true); },
            edit: (item) => { setEditingCrust(item); setIsCrustDialogOpen(true); },
            delete: createDeleteHandler("Borda", api.admin.deletePizzaCrust),
        },
        beverage: {
            new: () => { setEditingBeverage(null); setIsBeverageDialogOpen(true); },
            edit: (item) => { setEditingBeverage(item); setIsBeverageDialogOpen(true); },
            delete: createDeleteHandler("Bebida", api.admin.deleteBeverage),
        },
        beverageCategory: {
            new: () => { setEditingBeverageCat(null); setIsBeverageCatDialogOpen(true); },
            edit: (item) => { setEditingBeverageCat(item); setIsBeverageCatDialogOpen(true); },
            delete: createDeleteHandler("Categoria de Bebida", api.admin.deleteBeverageCategory),
        },
    };

    const DeleteButton = ({ itemName, itemType, onDelete }) => (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" size="icon"><Trash2 className="h-4 w-4" /></Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Confirmar exclusão de {itemType}</AlertDialogTitle>
                    <AlertDialogDescription>Tem certeza que deseja excluir o item "{itemName}"? Esta ação não pode ser desfeita.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={onDelete} className="bg-destructive hover:bg-destructive/90">Sim, excluir</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div><h1 className="text-3xl font-bold">Gerenciar Cardápio</h1><p className="text-gray-600">Adicione, edite e remova itens do cardápio.</p></div>
                <Tabs defaultValue="types" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="types"><Pizza className="h-4 w-4 mr-2" />Tipos</TabsTrigger>
                        <TabsTrigger value="flavors"><Star className="h-4 w-4 mr-2" />Sabores</TabsTrigger>
                        <TabsTrigger value="crusts"><Slice className="h-4 w-4 mr-2" />Bordas</TabsTrigger>
                        <TabsTrigger value="extras"><Package className="h-4 w-4 mr-2" />Adicionais</TabsTrigger>
                        <TabsTrigger value="beverages"><GlassWater className="h-4 w-4 mr-2" />Bebidas</TabsTrigger>
                        <TabsTrigger value="beverage-categories"><ListCollapse className="h-4 w-4 mr-2" />Categorias (Bebidas)</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="types">
                        <Card>
                            <CardHeader className="flex-row justify-between items-center"><CardTitle>Tipos de Pizza</CardTitle><Button onClick={actions.type.new} className="bg-red-600 hover:bg-red-700"><Plus className="h-4 w-4 mr-2" />Novo Tipo</Button></CardHeader>
                            <CardContent className="grid gap-4">
                                {pizzaTypes.map((item) => (<div key={item.id} className="flex items-center p-4 border rounded-lg">
                                    {item.imageUrl ? (<img src={`http://localhost:8090${item.imageUrl}`} alt={item.name} className="w-20 h-20 rounded-md object-cover mr-4" />) : (<div className="w-20 h-20 rounded-md bg-gray-100 flex items-center justify-center text-gray-400 mr-4 flex-shrink-0"><Pizza className="h-8 w-8" /></div>)}
                                    <div className="flex-1">
                                        <h3 className="font-semibold">{item.name}</h3>
                                        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                                    </div>
                                    <div className="font-semibold mr-4">{formatPrice(item.basePrice)}</div>
                                    <div className="flex space-x-2"><Button variant="outline" size="icon" onClick={() => actions.type.edit(item)}><Edit className="h-4 w-4" /></Button><DeleteButton itemType="Tipo" itemName={item.name} onDelete={() => actions.type.delete(item.id, item.name)} /></div>
                                </div>))}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="flavors">
                        <Card>
                            <CardHeader className="flex-row justify-between items-center"><CardTitle>Sabores</CardTitle><Button onClick={actions.flavor.new} className="bg-red-600 hover:bg-red-700"><Plus className="h-4 w-4 mr-2" />Novo Sabor</Button></CardHeader>
                            <CardContent className="grid gap-4">
                                {pizzaFlavors.map((item) => (<div key={item.id} className="flex items-center p-4 border rounded-lg">
                                    {item.imageUrl ? (<img src={`http://localhost:8090${item.imageUrl}`} alt={item.name} className="w-20 h-20 rounded-md object-cover mr-4" />) : (<div className="w-20 h-20 rounded-md bg-gray-100 flex items-center justify-center text-gray-400 mr-4 flex-shrink-0"><Star className="h-8 w-8" /></div>)}
                                    <div className="flex-1">
                                        <h3 className="font-semibold">{item.name}</h3>
                                        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                                        <div className="mt-2">{item.pizzaTypes?.map(t => <Badge key={t.id} variant="secondary" className="mr-1">{t.name}</Badge>)}</div>
                                    </div>
                                    <div className="font-semibold mr-4">{formatPrice(item.price)}</div>
                                    <div className="flex space-x-2"><Button variant="outline" size="icon" onClick={() => actions.flavor.edit(item)}><Edit className="h-4 w-4" /></Button><DeleteButton itemType="Sabor" itemName={item.name} onDelete={() => actions.flavor.delete(item.id, item.name)} /></div>
                                </div>))}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="crusts">
                        <Card>
                            <CardHeader className="flex-row justify-between items-center"><CardTitle>Bordas</CardTitle><Button onClick={actions.crust.new} className="bg-red-600 hover:bg-red-700"><Plus className="h-4 w-4 mr-2" />Nova Borda</Button></CardHeader>
                            <CardContent className="grid gap-4">
                                {pizzaCrusts.map((item) => (<div key={item.id} className="flex items-center p-4 border rounded-lg">
                                    <div className="flex-1">
                                        <h3 className="font-semibold">{item.name}</h3>
                                        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                                    </div>
                                    <div className="font-semibold mr-4">{formatPrice(item.price)}</div>
                                    <div className="flex space-x-2"><Button variant="outline" size="icon" onClick={() => actions.crust.edit(item)}><Edit className="h-4 w-4" /></Button><DeleteButton itemType="Borda" itemName={item.name} onDelete={() => actions.crust.delete(item.id, item.name)} /></div>
                                </div>))}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="extras">
                        <Card>
                            <CardHeader className="flex-row justify-between items-center"><CardTitle>Adicionais</CardTitle><Button onClick={() => actions.extra.new()} className="bg-red-600 hover:bg-red-700"><Plus className="h-4 w-4 mr-2" />Novo Adicional</Button></CardHeader>
                            <CardContent className="grid gap-4">
                                {pizzaExtras.map((item) => {
                                    const associatedTypes = pizzaTypes.filter(type => type.availableExtras?.some(extra => extra.id === item.id));
                                    return (
                                    <div key={item.id} className="flex items-center p-4 border rounded-lg">
                                        <div className="flex-1">
                                            <h3 className="font-semibold">{item.name}</h3>
                                            <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                                            {associatedTypes.length > 0 && (<div className="mt-2"><span className="text-xs font-semibold text-gray-500">Disponível em: </span>{associatedTypes.map(t => <Badge key={t.id} variant="outline" className="mr-1">{t.name}</Badge>)}</div>)}
                                        </div>
                                        <div className="font-semibold mr-4">{formatPrice(item.price)}</div>
                                        <div className="flex space-x-2"><Button variant="outline" size="icon" onClick={() => actions.extra.edit(item)}><Edit className="h-4 w-4" /></Button><DeleteButton itemType="Adicional" itemName={item.name} onDelete={() => actions.extra.delete(item.id, item.name)} /></div>
                                    </div>);
                                })}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="beverages">
                      <Card>
                        <CardHeader className="flex-row justify-between items-center"><CardTitle>Bebidas</CardTitle><Button onClick={actions.beverage.new} className="bg-red-600 hover:bg-red-700"><Plus className="h-4 w-4 mr-2" />Nova Bebida</Button></CardHeader>
                        <CardContent className="grid gap-4">
                          {beverages.map((item) => (
                            <div key={item.id} className="flex items-center p-4 border rounded-lg">
                              {item.imageUrl ? (<img src={`http://localhost:8090${item.imageUrl}`} alt={item.name} className="w-20 h-20 rounded-md object-cover mr-4" />) : (<div className="w-20 h-20 rounded-md bg-gray-100 flex items-center justify-center text-gray-400 mr-4 flex-shrink-0"><GlassWater className="h-8 w-8" /></div>)}
                              <div className="flex-1">
                                <h3 className="font-semibold text-lg">{item.name}</h3>
                                <p className="text-sm text-gray-500">{item.category?.name || 'Sem Categoria'}</p>
                                <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <Badge variant="secondary">{formatPrice(item.price)}</Badge>
                                    {item.alcoholic && <Badge variant="destructive" className="flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Alcoólica</Badge>}
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                <Button variant="outline" size="icon" onClick={() => actions.beverage.edit(item)}><Edit className="h-4 w-4" /></Button>
                                <DeleteButton itemType="Bebida" itemName={item.name} onDelete={() => actions.beverage.delete(item.id, item.name)} />
                              </div>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="beverage-categories">
                        <Card>
                            <CardHeader className="flex-row justify-between items-center">
                                <CardTitle>Categorias de Bebidas</CardTitle>
                                <Button onClick={actions.beverageCategory.new} className="bg-red-600 hover:bg-red-700"><Plus className="h-4 w-4 mr-2" />Nova Categoria</Button>
                            </CardHeader>
                            <CardContent className="grid gap-4">
                                {beverageCategories.map((item) => (
                                    <div key={item.id} className="flex items-center p-4 border rounded-lg">
                                        <div className="flex-1"><h3 className="font-semibold">{item.name}</h3></div>
                                        <div className="flex space-x-2">
                                            <Button variant="outline" size="icon" onClick={() => actions.beverageCategory.edit(item)}><Edit className="h-4 w-4" /></Button>
                                            <DeleteButton itemType="Categoria" itemName={item.name} onDelete={() => actions.beverageCategory.delete(item.id, item.name)} />
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
  
                <TypeDialog open={isTypeDialogOpen} setOpen={setIsTypeDialogOpen} editingItem={editingType} onSave={handleSave} pizzaExtras={pizzaExtras} pizzaCrusts={pizzaCrusts} />
                <FlavorDialog open={isFlavorDialogOpen} setOpen={setIsFlavorDialogOpen} editingItem={editingFlavor} onSave={handleSave} pizzaTypes={pizzaTypes} />
                <ExtraDialog open={isExtraDialogOpen} setOpen={setIsExtraDialogOpen} editingItem={editingExtra} onSave={handleSave} pizzaTypes={pizzaTypes} />
                <CrustDialog open={isCrustDialogOpen} setOpen={setIsCrustDialogOpen} editingItem={editingCrust} onSave={handleSave} pizzaTypes={pizzaTypes} />
                <BeverageDialog open={isBeverageDialogOpen} setOpen={setIsBeverageDialogOpen} editingItem={editingBeverage} onSave={handleSave} categories={beverageCategories} />
                <BeverageCategoryDialog open={isBeverageCatDialogOpen} setOpen={setIsBeverageCatDialogOpen} editingItem={editingBeverageCat} onSave={handleSave} />
            </div>
        </AdminLayout>
    );
};