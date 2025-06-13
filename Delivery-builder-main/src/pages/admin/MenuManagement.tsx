import { useState, useEffect, useCallback } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Pizza, Package, Star, Slice } from "lucide-react";
import { PizzaType, PizzaFlavor, PizzaExtra, PizzaCrust } from "@/types";
import { api } from "@/services/apiService";
import { Checkbox } from "@/components/ui/checkbox";

// Helper para formatar preços em Reais
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);
};

// --- Componente de Diálogo para Tipos de Pizza ---
const TypeDialog = ({ open, setOpen, editingItem, onSave, pizzaExtras, pizzaCrusts }) => {
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
        onSave();
      } catch (error) {
        console.error("Failed to save pizza type", error);
        alert("Erro ao salvar o tipo de pizza: " + error.message);
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
  
// --- Componente de Diálogo para Sabores de Pizza ---
const FlavorDialog = ({ open, setOpen, editingItem, onSave, pizzaTypes }) => {
    const [formData, setFormData] = useState({ name: "", description: "", price: 0, pizzaTypeId: "" });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
  
    useEffect(() => {
      if (open) {
        if (editingItem) {
          setFormData({ ...editingItem, pizzaTypeId: editingItem.pizzaType.id });
        } else {
          setFormData({ name: "", description: "", price: 0, pizzaTypeId: pizzaTypes[0]?.id || "" });
        }
        setImageFile(null);
      }
    }, [editingItem, open, pizzaTypes]);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      
      const payload = {
          name: formData.name,
          description: formData.description,
          price: formData.price,
          pizzaType: { id: formData.pizzaTypeId }
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
  
        onSave();
      } catch (error) {
        console.error("Failed to save pizza flavor", error);
        alert("Erro ao salvar sabor: " + error.message);
      } finally {
        setIsLoading(false);
      }
    };
  
    return (
      <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
              <DialogHeader><DialogTitle>{editingItem ? "Editar Sabor" : "Novo Sabor"}</DialogTitle></DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                  <div><Label htmlFor="flavorName">Nome do Sabor</Label><Input id="flavorName" value={formData.name} onChange={(e) => setFormData(p => ({...p, name: e.target.value}))} required /></div>
                  <div><Label htmlFor="flavorDescription">Descrição</Label><Textarea id="flavorDescription" value={formData.description} onChange={(e) => setFormData(p => ({...p, description: e.target.value}))} required /></div>
                  <div><Label htmlFor="typeId">Tipo de Pizza</Label>
                      <Select value={formData.pizzaTypeId} onValueChange={(value) => setFormData(p => ({...p, pizzaTypeId: value}))} required>
                          <SelectTrigger><SelectValue placeholder="Selecione o tipo" /></SelectTrigger>
                          <SelectContent>{pizzaTypes.map((type) => (<SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>))}</SelectContent>
                      </Select>
                  </div>
                  <div><Label htmlFor="flavorPrice">Preço Adicional (R$)</Label><Input id="flavorPrice" type="number" step="0.01" value={formData.price} onChange={(e) => setFormData(p => ({...p, price: parseFloat(e.target.value) || 0}))} required /></div>
                  <div><Label htmlFor="image">Imagem do Sabor</Label><Input id="image" type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)} /></div>
                  <div className="flex justify-end space-x-2"><Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>Cancelar</Button><Button type="submit" className="bg-red-600 hover:bg-red-700" disabled={isLoading}>{isLoading ? 'Salvando...' : 'Salvar'}</Button></div>
              </form>
          </DialogContent>
      </Dialog>
    );
};
  
// --- Componente de Diálogo para Adicionais ---
const ExtraDialog = ({ open, setOpen, editingItem, onSave, pizzaTypes }) => {
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
            if (editingItem) {
                await api.admin.updatePizzaExtra(editingItem.id, payload);
            } else {
                await api.admin.createPizzaExtra(payload);
            }
            onSave();
        } catch (error) {
            console.error("Failed to save pizza extra", error);
            alert("Erro ao salvar o adicional: " + error.message);
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

// --- Componente de Diálogo para Bordas ---
const CrustDialog = ({ open, setOpen, editingItem, onSave, pizzaTypes }) => {
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
            if (editingItem) {
                await api.admin.updatePizzaCrust(editingItem.id, payload);
            } else {
                await api.admin.createPizzaCrust(payload);
            }
            onSave();
        } catch (error) {
            alert("Erro ao salvar a borda: " + error.message);
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


export const MenuManagement = () => {
    const [pizzaTypes, setPizzaTypes] = useState<PizzaType[]>([]);
    const [pizzaFlavors, setPizzaFlavors] = useState<PizzaFlavor[]>([]);
    const [pizzaExtras, setPizzaExtras] = useState<PizzaExtra[]>([]);
    const [pizzaCrusts, setPizzaCrusts] = useState<PizzaCrust[]>([]);

    const [isTypeDialogOpen, setIsTypeDialogOpen] = useState(false);
    const [editingType, setEditingType] = useState<PizzaType | null>(null);
    const [isFlavorDialogOpen, setIsFlavorDialogOpen] = useState(false);
    const [editingFlavor, setEditingFlavor] = useState<PizzaFlavor | null>(null);
    const [isExtraDialogOpen, setIsExtraDialogOpen] = useState(false);
    const [editingExtra, setEditingExtra] = useState<PizzaExtra | null>(null);
    const [isCrustDialogOpen, setIsCrustDialogOpen] = useState(false);
    const [editingCrust, setEditingCrust] = useState<PizzaCrust | null>(null);

    const loadData = useCallback(async () => {
        try {
            const [types, flavors, extras, crusts] = await Promise.all([
                api.public.getPizzaTypes(),
                api.public.getPizzaFlavors(),
                api.public.getPizzaExtras(),
                api.public.getAllCrusts(),
            ]);
            setPizzaTypes(Array.isArray(types) ? types : []);
            setPizzaFlavors(Array.isArray(flavors) ? flavors : []);
            setPizzaExtras(Array.isArray(extras) ? extras : []);
            setPizzaCrusts(Array.isArray(crusts) ? crusts : []);
        } catch (error) { console.error("Failed to load menu data", error); }
    }, []);

    useEffect(() => { loadData(); }, [loadData]);

    const handleSave = () => {
        setIsTypeDialogOpen(false); setEditingType(null);
        setIsFlavorDialogOpen(false); setEditingFlavor(null);
        setIsExtraDialogOpen(false); setEditingExtra(null);
        setIsCrustDialogOpen(false); setEditingCrust(null);
        loadData();
    };

    const actions = {
        type: {
            new: () => { setEditingType(null); setIsTypeDialogOpen(true); },
            edit: (item) => { setEditingType(item); setIsTypeDialogOpen(true); },
            delete: async (id) => { if (window.confirm("Tem certeza?")) { try { await api.admin.deletePizzaType(id); loadData(); } catch (error) { alert("Falha ao excluir."); } } },
        },
        flavor: {
            new: () => { setEditingFlavor(null); setIsFlavorDialogOpen(true); },
            edit: (item) => { setEditingFlavor(item); setIsFlavorDialogOpen(true); },
            delete: async (id) => { if (window.confirm("Tem certeza?")) { try { await api.admin.deletePizzaFlavor(id); loadData(); } catch (error) { alert("Falha ao excluir."); } } },
        },
        extra: {
            new: () => { setEditingExtra(null); setIsExtraDialogOpen(true); },
            edit: (item) => { setEditingExtra(item); setIsExtraDialogOpen(true); },
            delete: async (id) => { if (window.confirm("Tem certeza?")) { try { await api.admin.deletePizzaExtra(id); loadData(); } catch (error) { alert("Falha ao excluir."); } } },
        },
        crust: {
            new: () => { setEditingCrust(null); setIsCrustDialogOpen(true); },
            edit: (item) => { setEditingCrust(item); setIsCrustDialogOpen(true); },
            delete: async (id) => { if (window.confirm("Tem certeza?")) { try { await api.admin.deletePizzaCrust(id); loadData(); } catch (error) { alert("Falha ao excluir."); } } },
        },
    };

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
                    </TabsList>
                    
                    <TabsContent value="types">
                      <Card>
                        <CardHeader className="flex-row justify-between items-center"><CardTitle>Tipos de Pizza</CardTitle><Button onClick={actions.type.new} className="bg-red-600 hover:bg-red-700"><Plus className="h-4 w-4 mr-2" />Novo Tipo</Button></CardHeader>
                        <CardContent className="grid gap-4">
                          {pizzaTypes.map((item) => (
                            <div key={item.id} className="flex items-center p-4 border rounded-lg">
                              {item.imageUrl ? (<img src={`http://localhost:8090${item.imageUrl}`} alt={item.name} className="w-20 h-20 rounded-md object-cover mr-4" />) : (<div className="w-20 h-20 rounded-md bg-gray-100 flex items-center justify-center text-gray-400 mr-4 flex-shrink-0"><Pizza className="h-8 w-8" /></div>)}
                              <div className="flex-1">
                                <h3 className="font-semibold text-lg">{item.name}</h3>
                                <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                                <Badge variant="secondary" className="mt-2">Base: {formatPrice(item.basePrice)}</Badge>
                              </div>
                              <div className="flex space-x-2"><Button variant="outline" size="icon" onClick={() => actions.type.edit(item)}><Edit className="h-4 w-4" /></Button><Button variant="destructive" size="icon" onClick={() => actions.type.delete(item.id)}><Trash2 className="h-4 w-4" /></Button></div>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="flavors">
                      <Card>
                        <CardHeader className="flex-row justify-between items-center"><CardTitle>Sabores de Pizza</CardTitle><Button onClick={actions.flavor.new} className="bg-red-600 hover:bg-red-700"><Plus className="h-4 w-4 mr-2" />Novo Sabor</Button></CardHeader>
                        <CardContent className="grid gap-4">
                          {pizzaFlavors.map((item) => (
                            <div key={item.id} className="flex items-center p-4 border rounded-lg">
                              {item.imageUrl ? (<img src={`http://localhost:8090${item.imageUrl}`} alt={item.name} className="w-20 h-20 rounded-md object-cover mr-4" />) : (<div className="w-20 h-20 rounded-md bg-gray-100 flex items-center justify-center text-gray-400 mr-4 flex-shrink-0"><Star className="h-8 w-8" /></div>)}
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1"><h3 className="font-semibold">{item.name}</h3><Badge variant="outline">{item.pizzaType?.name}</Badge></div>
                                <p className="text-sm text-gray-600">{item.description}</p>
                                <Badge variant="secondary" className="mt-2">{item.price === 0 ? "Incluso" : `+${formatPrice(item.price)}`}</Badge>
                              </div>
                              <div className="flex space-x-2"><Button variant="outline" size="icon" onClick={() => actions.flavor.edit(item)}><Edit className="h-4 w-4" /></Button><Button variant="destructive" size="icon" onClick={() => actions.flavor.delete(item.id)}><Trash2 className="h-4 w-4" /></Button></div>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="crusts">
                        <Card>
                            <CardHeader className="flex-row justify-between items-center"><CardTitle>Bordas</CardTitle><Button onClick={actions.crust.new} className="bg-red-600 hover:bg-red-700"><Plus className="h-4 w-4 mr-2" />Nova Borda</Button></CardHeader>
                            <CardContent className="grid gap-4">
                                {pizzaCrusts.map((item) => (
                                    <div key={item.id} className="flex items-center p-4 border rounded-lg">
                                        <div className="flex-1">
                                            <h3 className="font-semibold">{item.name}</h3>
                                            <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                                            <Badge variant="secondary" className="mt-2">{formatPrice(item.price)}</Badge>
                                        </div>
                                        <div className="flex space-x-2">
                                            <Button variant="outline" size="icon" onClick={() => actions.crust.edit(item)}><Edit className="h-4 w-4" /></Button>
                                            <Button variant="destructive" size="icon" onClick={() => actions.crust.delete(item.id)}><Trash2 className="h-4 w-4" /></Button>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </TabsContent>
                    
                    <TabsContent value="extras">
                      <Card>
                        <CardHeader className="flex-row justify-between items-center"><CardTitle>Adicionais</CardTitle><Button onClick={actions.extra.new} className="bg-red-600 hover:bg-red-700"><Plus className="h-4 w-4 mr-2" />Novo Adicional</Button></CardHeader>
                        <CardContent className="grid gap-4">
                          {pizzaExtras.map((item) => (
                            <div key={item.id} className="flex items-center p-4 border rounded-lg">
                              <div className="flex-1">
                                <h3 className="font-semibold">{item.name}</h3>
                                <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                                <Badge variant="secondary" className="mt-2">{formatPrice(item.price)}</Badge>
                              </div>
                              <div className="flex space-x-2"><Button variant="outline" size="icon" onClick={() => actions.extra.edit(item)}><Edit className="h-4 w-4" /></Button><Button variant="destructive" size="icon" onClick={() => actions.extra.delete(item.id)}><Trash2 className="h-4 w-4" /></Button></div>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    </TabsContent>
                </Tabs>
  
                <TypeDialog open={isTypeDialogOpen} setOpen={setIsTypeDialogOpen} editingItem={editingType} onSave={handleSave} pizzaExtras={pizzaExtras} pizzaCrusts={pizzaCrusts}/>
                <FlavorDialog open={isFlavorDialogOpen} setOpen={setIsFlavorDialogOpen} editingItem={editingFlavor} onSave={handleSave} pizzaTypes={pizzaTypes} />
                <ExtraDialog open={isExtraDialogOpen} setOpen={setIsExtraDialogOpen} editingItem={editingExtra} onSave={handleSave} pizzaTypes={pizzaTypes} />
                <CrustDialog open={isCrustDialogOpen} setOpen={setIsCrustDialogOpen} editingItem={editingCrust} onSave={handleSave} pizzaTypes={pizzaTypes}/>
            </div>
        </AdminLayout>
    );
};
