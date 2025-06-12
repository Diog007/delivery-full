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
import { Plus, Edit, Trash2, Pizza, Package, Star } from "lucide-react";
import { PizzaType, PizzaFlavor, PizzaExtra } from "@/types";
import { api } from "@/services/apiService";

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);
};

const TypeDialog = ({ open, setOpen, editingItem, onSave }) => {
  const [formData, setFormData] = useState({ name: "", description: "", basePrice: 0 });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setFormData(editingItem || { name: "", description: "", basePrice: 0 });
    setImageFile(null);
  }, [editingItem, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let savedType;
      if (editingItem) {
        savedType = await api.admin.updatePizzaType(editingItem.id, formData);
      } else {
        savedType = await api.admin.createPizzaType(formData);
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingItem ? "Editar Tipo de Pizza" : "Novo Tipo de Pizza"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><Label htmlFor="name">Nome</Label><Input id="name" value={formData.name} onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))} required /></div>
          <div><Label htmlFor="description">Descrição</Label><Textarea id="description" value={formData.description} onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))} required /></div>
          <div><Label htmlFor="basePrice">Preço Base (R$)</Label><Input id="basePrice" type="number" step="0.01" value={formData.basePrice} onChange={(e) => setFormData(p => ({ ...p, basePrice: parseFloat(e.target.value) || 0 }))} required /></div>
          <div><Label htmlFor="typeImage">Imagem do Tipo</Label><Input id="typeImage" type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)} /></div>
          <div className="flex justify-end space-x-2"><Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>Cancelar</Button><Button type="submit" className="bg-red-600 hover:bg-red-700" disabled={isLoading}>{isLoading ? 'Salvando...' : 'Salvar'}</Button></div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const FlavorDialog = ({ open, setOpen, editingItem, onSave, pizzaTypes }) => {
  const [formData, setFormData] = useState({ name: "", description: "", price: 0, pizzaTypeId: "" });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (editingItem) {
      setFormData({ ...editingItem, pizzaTypeId: editingItem.pizzaType.id });
    } else {
      setFormData({ name: "", description: "", price: 0, pizzaTypeId: "" });
    }
    setImageFile(null);
  }, [editingItem, open]);

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

const ExtraDialog = ({ open, setOpen, editingItem, onSave }) => {
  const [formData, setFormData] = useState({ name: "", description: "", price: 0 });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setFormData(editingItem || { name: "", description: "", price: 0 });
  }, [editingItem]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (editingItem) {
        await api.admin.updatePizzaExtra(editingItem.id, formData);
      } else {
        await api.admin.createPizzaExtra(formData);
      }
      onSave();
    } catch (error) {
      console.error("Failed to save pizza extra", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader><DialogTitle>{editingItem ? "Editar Adicional" : "Novo Adicional"}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><Label htmlFor="extraName">Nome do Adicional</Label><Input id="extraName" value={formData.name} onChange={(e) => setFormData(p => ({...p, name: e.target.value}))} required /></div>
          <div><Label htmlFor="extraDescription">Descrição</Label><Textarea id="extraDescription" value={formData.description} onChange={(e) => setFormData(p => ({...p, description: e.target.value}))} required /></div>
          <div><Label htmlFor="extraPrice">Preço (R$)</Label><Input id="extraPrice" type="number" step="0.01" value={formData.price} onChange={(e) => setFormData(p => ({...p, price: parseFloat(e.target.value) || 0}))} required /></div>
          <div className="flex justify-end space-x-2"><Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>Cancelar</Button><Button type="submit" className="bg-red-600 hover:bg-red-700" disabled={isLoading}>{isLoading ? 'Salvando...' : 'Salvar'}</Button></div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export const MenuManagement = () => {
  const [pizzaTypes, setPizzaTypes] = useState<PizzaType[]>([]);
  const [pizzaFlavors, setPizzaFlavors] = useState<PizzaFlavor[]>([]);
  const [pizzaExtras, setPizzaExtras] = useState<PizzaExtra[]>([]);
  const [isTypeDialogOpen, setIsTypeDialogOpen] = useState(false);
  const [editingType, setEditingType] = useState<PizzaType | null>(null);
  const [isFlavorDialogOpen, setIsFlavorDialogOpen] = useState(false);
  const [editingFlavor, setEditingFlavor] = useState<PizzaFlavor | null>(null);
  const [isExtraDialogOpen, setIsExtraDialogOpen] = useState(false);
  const [editingExtra, setEditingExtra] = useState<PizzaExtra | null>(null);

  const loadData = useCallback(async () => {
    try {
      const [types, flavors, extras] = await Promise.all([
        api.public.getPizzaTypes(),
        api.public.getPizzaFlavors(),
        api.public.getPizzaExtras(),
      ]);
      setPizzaTypes(Array.isArray(types) ? types : []);
      setPizzaFlavors(Array.isArray(flavors) ? flavors : []);
      setPizzaExtras(Array.isArray(extras) ? extras : []);
    } catch (error) { console.error("Failed to load menu data", error); }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleSave = () => {
    setIsTypeDialogOpen(false); setEditingType(null);
    setIsFlavorDialogOpen(false); setEditingFlavor(null);
    setIsExtraDialogOpen(false); setEditingExtra(null);
    loadData();
  };

  const actions = {
    type: {
      new: () => { setEditingType(null); setIsTypeDialogOpen(true); },
      edit: (item) => { setEditingType(item); setIsTypeDialogOpen(true); },
      delete: async (id) => {
        if (window.confirm("Tem certeza que deseja excluir este tipo? Sabores associados podem causar erros.")) {
          try { await api.admin.deletePizzaType(id); loadData(); } 
          catch (error) { alert("Falha ao excluir. Verifique se não há sabores associados."); }
        }
      },
    },
    flavor: {
      new: () => { setEditingFlavor(null); setIsFlavorDialogOpen(true); },
      edit: (item) => { setEditingFlavor(item); setIsFlavorDialogOpen(true); },
      delete: async (id) => {
        if (window.confirm("Tem certeza que deseja excluir este sabor?")) {
          try { await api.admin.deletePizzaFlavor(id); loadData(); } 
          catch (error) { alert("Falha ao excluir."); }
        }
      },
    },
    extra: {
      new: () => { setEditingExtra(null); setIsExtraDialogOpen(true); },
      edit: (item) => { setEditingExtra(item); setIsExtraDialogOpen(true); },
      delete: async (id) => {
        if (window.confirm("Tem certeza que deseja excluir este adicional?")) {
          try { await api.admin.deletePizzaExtra(id); loadData(); }
          catch (error) { alert("Falha ao excluir."); }
        }
      },
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
            <TabsTrigger value="extras"><Package className="h-4 w-4 mr-2" />Adicionais</TabsTrigger>
          </TabsList>
          
          <TabsContent value="types">
            <Card>
              <CardHeader className="flex-row justify-between items-center"><CardTitle>Tipos de Pizza</CardTitle><Button onClick={actions.type.new} className="bg-red-600 hover:bg-red-700"><Plus className="h-4 w-4 mr-2" />Novo Tipo</Button></CardHeader>
              <CardContent className="grid gap-4">
                {pizzaTypes.map((item) => (
                  <div key={item.id} className="flex items-center p-4 border rounded-lg">
                    {item.imageUrl ? (
                        <img src={`http://localhost:8090${item.imageUrl}`} alt={item.name} className="w-20 h-20 rounded-md object-cover mr-4" />
                    ) : (
                        <div className="w-20 h-20 rounded-md bg-gray-100 flex items-center justify-center text-gray-400 mr-4 flex-shrink-0">
                            <Pizza className="h-8 w-8" />
                        </div>
                    )}
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
                    {item.imageUrl ? (
                        <img src={`http://localhost:8090${item.imageUrl}`} alt={item.name} className="w-20 h-20 rounded-md object-cover mr-4" />
                    ) : (
                        <div className="w-20 h-20 rounded-md bg-gray-100 flex items-center justify-center text-gray-400 mr-4 flex-shrink-0">
                            <Star className="h-8 w-8" />
                        </div>
                    )}
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

        <TypeDialog open={isTypeDialogOpen} setOpen={setIsTypeDialogOpen} editingItem={editingType} onSave={handleSave} />
        <FlavorDialog open={isFlavorDialogOpen} setOpen={setIsFlavorDialogOpen} editingItem={editingFlavor} onSave={handleSave} pizzaTypes={pizzaTypes} />
        <ExtraDialog open={isExtraDialogOpen} setOpen={setIsExtraDialogOpen} editingItem={editingExtra} onSave={handleSave} />
      </div>
    </AdminLayout>
  );
};