import { useState, useEffect, useMemo } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Users, Edit, Trash2, Search, MapPin } from "lucide-react";
import { Customer, Address } from "@/types";
import { api } from "@/services/apiService";

const AddressForm = ({ address, onSave, onCancel }) => {
    const [formData, setFormData] = useState(address);
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async () => {
        setIsLoading(true);
        try {
            await api.admin.updateAddress(formData.id, formData);
            toast({ title: "Endereço salvo!", description: "O endereço foi atualizado com sucesso." });
            onSave();
        } catch (error) {
             toast({ title: "Erro", description: "Não foi possível salvar o endereço.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="space-y-3 p-4 border rounded-lg bg-gray-50 my-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2"><Label>Rua</Label><Input value={formData.street} onChange={e => setFormData({...formData, street: e.target.value})} /></div>
                <div><Label>Número</Label><Input value={formData.number} onChange={e => setFormData({...formData, number: e.target.value})} /></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div><Label>Bairro</Label><Input value={formData.neighborhood} onChange={e => setFormData({...formData, neighborhood: e.target.value})} /></div>
                <div><Label>Cidade</Label><Input value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} /></div>
                <div><Label>CEP</Label><Input value={formData.zipCode} onChange={e => setFormData({...formData, zipCode: e.target.value})} /></div>
            </div>
            <div><Label>Complemento</Label><Input value={formData.complement || ''} onChange={e => setFormData({...formData, complement: e.target.value})} /></div>
            <div className="flex justify-end space-x-2 pt-2">
                <Button variant="ghost" onClick={onCancel} disabled={isLoading}>Cancelar</Button>
                <Button onClick={handleSave} disabled={isLoading} className="bg-red-600 hover:bg-red-700">{isLoading ? 'Salvando...' : 'Salvar Endereço'}</Button>
            </div>
        </div>
    );
};

const EditCustomerDialog = ({ customer, open, onOpenChange, onSave }) => {
    const [formData, setFormData] = useState(customer);
    const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (customer) {
            setFormData(customer);
        }
        setEditingAddressId(null);
    }, [customer]);

    if (!customer) return null;

    const handleCustomerSave = async () => {
        setIsLoading(true);
        // --- CORREÇÃO: Enviar apenas os dados permitidos pela API ---
        const updatePayload = {
            name: formData.name,
            email: formData.email,
            whatsapp: formData.whatsapp,
            cpf: formData.cpf,
        };
        try {
            await api.admin.updateCustomer(customer.id, updatePayload);
            toast({ title: "Sucesso", description: "Dados do cliente atualizados." });
            onSave(); 
        } catch (error) {
            toast({ title: "Erro", description: `Não foi possível atualizar o cliente: ${error.message}`, variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleAddressDelete = async (addressId: string) => {
        await api.admin.deleteAddress(addressId);
        toast({ title: "Endereço excluído" });
        onSave();
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Detalhes do Cliente: {customer.name}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div><Label>Nome</Label><Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
                        <div><Label>Email</Label><Input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} /></div>
                        <div><Label>WhatsApp</Label><Input value={formData.whatsapp || ''} onChange={e => setFormData({...formData, whatsapp: e.target.value})} /></div>
                        <div><Label>CPF</Label><Input value={formData.cpf || ''} onChange={e => setFormData({...formData, cpf: e.target.value})} /></div>
                    </div>
                     <div className="space-y-4 pt-4 border-t">
                        <h4 className="font-semibold flex items-center"><MapPin className="h-5 w-5 mr-2 text-red-600" /> Endereços Salvos</h4>
                        <div className="space-y-2">
                           {formData.addresses?.length > 0 ? formData.addresses.map(addr => (
                               editingAddressId === addr.id ? (
                                   <AddressForm 
                                       key={addr.id}
                                       address={addr}
                                       onSave={() => { setEditingAddressId(null); onSave(); }}
                                       onCancel={() => setEditingAddressId(null)}
                                   />
                               ) : (
                                   <div key={addr.id} className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50">
                                       <p className="text-sm text-gray-700">{addr.street}, {addr.number} - {addr.city}</p>
                                       <div>
                                           <Button variant="ghost" size="sm" onClick={() => setEditingAddressId(addr.id)}><Edit className="h-4 w-4 mr-1"/>Editar</Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild><Button variant="ghost" size="sm" className="text-red-600"><Trash2 className="h-4 w-4 mr-1"/>Excluir</Button></AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader><AlertDialogTitle>Excluir Endereço?</AlertDialogTitle><AlertDialogDescription>Esta ação não pode ser desfeita. Deseja realmente excluir este endereço?</AlertDialogDescription></AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleAddressDelete(addr.id)}>Sim, excluir</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                       </div>
                                   </div>
                               )
                           )) : <p className="text-sm text-gray-500 text-center py-4">Nenhum endereço cadastrado.</p>}
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild><Button variant="outline" disabled={isLoading}>Fechar</Button></DialogClose>
                    <Button onClick={handleCustomerSave} disabled={isLoading || !!editingAddressId} className="bg-red-600 hover:bg-red-700">Salvar Dados do Cliente</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};


export const CustomerManagement = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

    const fetchCustomers = async () => {
        setIsLoading(true);
        try {
            const data = await api.admin.getAllCustomers();
            setCustomers(data);
        } catch (error) {
            toast({ title: "Erro ao buscar clientes", description: "Não foi possível carregar a lista de clientes.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const handleDeleteCustomer = async (customerId: string) => {
        try {
            await api.admin.deleteCustomer(customerId);
            toast({ title: "Cliente Excluído", description: "O cliente foi removido com sucesso." });
            fetchCustomers();
        } catch (error) {
            toast({ title: "Erro", description: `Não foi possível excluir o cliente: ${error.message}`, variant: "destructive" });
        }
    };
    
    const filteredCustomers = useMemo(() =>
        customers.filter(c =>
            c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.email.toLowerCase().includes(searchTerm.toLowerCase())
        ), [customers, searchTerm]);
    
    return (
        <AdminLayout>
            {editingCustomer && (
                <EditCustomerDialog 
                    customer={editingCustomer}
                    open={!!editingCustomer}
                    onOpenChange={() => setEditingCustomer(null)}
                    onSave={() => {
                        setEditingCustomer(null);
                        fetchCustomers();
                    }}
                />
            )}
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center"><Users className="h-8 w-8 mr-3"/>Gerenciar Clientes</h1>
                    <p className="text-gray-600">Visualize, edite e remova clientes e seus endereços.</p>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center flex-wrap gap-4">
                            <div>
                                <CardTitle>Lista de Clientes</CardTitle>
                                <CardDescription>{filteredCustomers.length} cliente(s) encontrado(s).</CardDescription>
                            </div>
                            <div className="relative w-full sm:w-auto sm:max-w-xs">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input 
                                    placeholder="Buscar por nome ou email..."
                                    className="pl-8"
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nome</TableHead>
                                    <TableHead className="hidden sm:table-cell">Email</TableHead>
                                    <TableHead className="hidden md:table-cell">Endereços Salvos</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow><TableCell colSpan={4} className="text-center h-24">Carregando...</TableCell></TableRow>
                                ) : filteredCustomers.length > 0 ? (
                                    filteredCustomers.map(customer => (
                                        <TableRow key={customer.id}>
                                            <TableCell className="font-medium">{customer.name}</TableCell>
                                            <TableCell className="hidden sm:table-cell">{customer.email}</TableCell>
                                            <TableCell className="hidden md:table-cell">{customer.addresses?.length || 0}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="outline" size="sm" onClick={() => setEditingCustomer(customer)}>
                                                    <Edit className="h-4 w-4 mr-2" />
                                                    Ver / Editar
                                                </Button>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700 ml-1">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Esta ação não pode ser desfeita. Isso excluirá permanentemente o cliente e todos os seus dados, incluindo o histórico de pedidos e endereços.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                            <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={() => handleDeleteCustomer(customer.id)}>
                                                                Sim, excluir cliente
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow><TableCell colSpan={4} className="text-center h-24">Nenhum cliente encontrado.</TableCell></TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
};