import React, { useState, useEffect, useMemo } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Users, Edit, Trash2, Search, MapPin, Mail, Phone, Calendar, ArrowLeft, ArrowUpDown, Building, CheckCircle, AlertCircle, Globe, ShoppingBag, DollarSign } from "lucide-react";
import { Customer, Address } from "@/types";
import { api } from "@/services/apiService";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// IMPORTAÇÕES ADICIONADAS PARA O TOOLTIP
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";


// Tipos e utilitários
type SortByType = 'name' | 'email' | 'lastLogin' | 'totalSpent' | 'totalOrders';
type SortOrderType = 'asc' | 'desc';
type StatusType = 'active' | 'inactive';

const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

const formatDate = (dateString?: string, short: boolean = false) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (short) {
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' });
    }
    return date.toLocaleString('pt-BR');
};

const getStatus = (lastLogin?: string): StatusType => {
    if (!lastLogin) return 'inactive';
    const lastLoginDate = new Date(lastLogin);
    const now = new Date();
    const diffDays = (now.getTime() - lastLoginDate.getTime()) / (1000 * 3600 * 24);
    return diffDays < 30 ? 'active' : 'inactive';
};

const statusConfig: Record<StatusType, { label: string; icon: React.ReactNode; color: string; }> = {
    active: { label: 'Ativo', icon: <CheckCircle className="h-4 w-4" />, color: 'bg-green-100 text-green-800' },
    inactive: { label: 'Inativo', icon: <AlertCircle className="h-4 w-4" />, color: 'bg-yellow-100 text-yellow-800' }
};


// ============================================================================
// Componente da Lista de Clientes
// ============================================================================
interface CustomerListProps {
  customers: Customer[];
  onCustomerSelect: (customer: Customer) => void;
  isLoading: boolean;
}

const CustomerListPage: React.FC<CustomerListProps> = ({ customers, onCustomerSelect, isLoading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortByType>('name');
  const [sortOrder, setSortOrder] = useState<SortOrderType>('asc');
  
  const filteredAndSortedCustomers = useMemo(() => {
    return customers
      .filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        const aValue = a[sortBy] || 0; // Default to 0 for numeric/date fields
        const bValue = b[sortBy] || 0;
        if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [customers, searchTerm, sortBy, sortOrder]);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Clientes</h1>
          <p className="text-gray-600">Gerencie os dados dos seus clientes.</p>
        </div>
        <div className="bg-blue-50 px-4 py-2 rounded-lg">
          <span className="text-sm font-medium text-blue-700">{filteredAndSortedCustomers.length} clientes encontrados</span>
        </div>
      </div>

      <Card className="p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Buscar por nome ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10"
            />
          </div>
          <div className="flex items-center gap-4">
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortByType)}>
              <SelectTrigger className="w-full lg:w-[180px]">
                <SelectValue placeholder="Ordenar por..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Nome</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="totalSpent">Valor Gasto</SelectItem>
                <SelectItem value="totalOrders">Nº Pedidos</SelectItem>
                <SelectItem value="lastLogin">Último Login</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="flex items-center space-x-2"
            >
              <ArrowUpDown className="h-4 w-4" />
              <span>{sortOrder === 'asc' ? 'Crescente' : 'Decrescente'}</span>
            </Button>
          </div>
        </div>
      </Card>

      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-56 w-full rounded-xl"/>)}
        </div>
      ) : filteredAndSortedCustomers.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredAndSortedCustomers.map((customer) => {
                const status = getStatus(customer.lastLogin);
                const statusInfo = statusConfig[status];
                return (
                    <Card
                        key={customer.id}
                        className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col"
                        onClick={() => onCustomerSelect(customer)}
                    >
                        <CardHeader className="flex-row items-center gap-4">
                            <Avatar>
                                <AvatarImage src={customer.pictureUrl} alt={customer.name} />
                                <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <CardTitle className="text-base">{customer.name}</CardTitle>
                                <p className="text-xs text-gray-500 truncate">{customer.email}</p>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm flex-1">
                            <div><Badge variant="outline" className={statusInfo.color}>{statusInfo.icon}{statusInfo.label}</Badge></div>
                            <div className="space-y-2 text-gray-600">
                                {customer.whatsapp && <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-gray-400" /><span>{customer.whatsapp}</span></div>}
                                <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-gray-400" /><span>{customer.addresses?.length || 0} endereço(s) salvo(s)</span></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                                <div className="text-center">
                                    <div className="flex items-center justify-center space-x-1 mb-1"><ShoppingBag className="h-4 w-4 text-blue-500" /><span className="text-lg font-semibold text-gray-800">{customer.totalOrders}</span></div>
                                    <p className="text-xs text-gray-500">Pedidos</p>
                                </div>
                                <div className="text-center">
                                    <div className="flex items-center justify-center space-x-1 mb-1"><span className="text-lg font-semibold text-green-600">{formatCurrency(customer.totalSpent)}</span></div>
                                    <p className="text-xs text-gray-500">Total Gasto</p>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="text-xs text-gray-500 bg-gray-50/50 p-3">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-3 w-3" />
                                <span>Último acesso: {formatDate(customer.lastLogin, true)}</span>
                            </div>
                        </CardFooter>
                    </Card>
                );
            })}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">Nenhum cliente encontrado</h3>
          <p className="text-gray-500">Tente ajustar os filtros ou termo de busca</p>
        </div>
      )}
    </div>
  );
};


// Componente de Detalhes do Cliente
interface CustomerDetailProps {
  customer: Customer;
  onBack: () => void;
  onEdit: () => void;
  onDelete: (customerId: string) => void;
}

const CustomerDetailPage: React.FC<CustomerDetailProps> = ({ customer, onBack, onEdit, onDelete }) => {
    const status = getStatus(customer.lastLogin);
    const statusInfo = statusConfig[status];
  return (
    <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
                <Button onClick={onBack} variant="outline" size="icon" className="h-8 w-8">
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Detalhes do Cliente</h1>
                    <p className="text-gray-600">{customer.name}</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Button onClick={onEdit}><Edit className="h-4 w-4 mr-2"/>Editar</Button>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive"><Trash2 className="h-4 w-4 mr-2"/>Excluir</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                            <AlertDialogDescription>
                                Tem certeza que deseja excluir o cliente "{customer.name}"? Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={() => onDelete(customer.id)}>Sim, Excluir</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card className="p-6">
              <div className="text-center mb-6">
                <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-gray-200">
                    <AvatarImage src={customer.pictureUrl} alt={customer.name} />
                    <AvatarFallback className="text-3xl">{customer.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{customer.name}</h2>
                <Badge variant="outline" className={`inline-flex items-center space-x-2 ${statusInfo.color}`}>{statusInfo.icon}<span>{statusInfo.label}</span></Badge>
              </div>
              <div className="space-y-4 text-sm">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Mail className="h-5 w-5 text-blue-500" />
                    <div><p className="text-gray-500">Email</p><p className="font-medium text-gray-800">{customer.email}</p></div>
                    {/* INÍCIO DA CORREÇÃO */}
                    {customer.emailVerified && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Email verificado</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                    {/* FIM DA CORREÇÃO */}
                </div>
                {customer.whatsapp && <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"><Phone className="h-5 w-5 text-green-500" /><div><p className="text-gray-500">WhatsApp</p><p className="font-medium text-gray-800">{customer.whatsapp}</p></div></div>}
                {customer.googleId && <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"><Globe className="h-5 w-5 text-purple-500" /><div><p className="text-gray-500">Login</p><p className="font-medium text-gray-800">Vinculado ao Google</p></div></div>}
              </div>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4"><CardHeader className="p-0 pb-2"><CardTitle className="text-sm font-normal text-gray-500">Total de Pedidos</CardTitle></CardHeader><CardContent className="p-0"><p className="text-2xl font-bold text-gray-800">{customer.totalOrders}</p></CardContent></Card>
                <Card className="p-4"><CardHeader className="p-0 pb-2"><CardTitle className="text-sm font-normal text-gray-500">Total Gasto</CardTitle></CardHeader><CardContent className="p-0"><p className="text-2xl font-bold text-gray-800">{formatCurrency(customer.totalSpent)}</p></CardContent></Card>
                <Card className="p-4"><CardHeader className="p-0 pb-2"><CardTitle className="text-sm font-normal text-gray-500">Ticket Médio</CardTitle></CardHeader><CardContent className="p-0"><p className="text-2xl font-bold text-gray-800">{formatCurrency(customer.totalOrders > 0 ? customer.totalSpent / customer.totalOrders : 0)}</p></CardContent></Card>
            </div>
            
            <Card>
                <CardHeader><CardTitle>Informações da Conta</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div><p className="text-sm text-gray-500 mb-1">CPF</p><div className="flex items-center space-x-2"><p className="text-sm font-medium text-gray-800">{customer.cpf || "Não informado"}</p></div></div>
                      <div><p className="text-sm text-gray-500 mb-1">Localidade (do Google)</p><div className="flex items-center space-x-2"><p className="text-sm font-medium text-gray-800">{customer.locale || "Não informado"}</p></div></div>
                      <div><p className="text-sm text-gray-500 mb-1">Último Acesso</p><div className="flex items-center space-x-2"><Calendar className="h-4 w-4 text-gray-400" /><span className="text-sm font-medium text-gray-800">{formatDate(customer.lastLogin)}</span></div></div>
                      <div><p className="text-sm text-gray-500 mb-1">Data de Cadastro</p><div className="flex items-center space-x-2"><Calendar className="h-4 w-4 text-gray-400" /><span className="text-sm font-medium text-gray-800">{formatDate(customer.createdAt)}</span></div></div>
                </CardContent>
            </Card>

            {customer.addresses && customer.addresses.length > 0 && (
                <Card>
                    <CardHeader><CardTitle>Endereços Salvos</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                        {customer.addresses.map(addr => (
                            <div key={addr.id} className="text-sm p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-start">
                                    <MapPin className="w-4 h-4 text-orange-500 mr-3 mt-1 flex-shrink-0" />
                                    <div className="text-gray-700">
                                        <p className="font-semibold">{addr.street}, {addr.number}</p>
                                        <p>{addr.neighborhood}, {addr.city} - {addr.zipCode}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}
          </div>
        </div>
    </div>
  );
};


// Componente do Dialog de Edição
const EditCustomerDialog = ({ customer, open, onOpenChange, onSave }) => {
    const [formData, setFormData] = useState<Customer | null>(customer);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setFormData(customer);
    }, [customer]);

    if (!formData) return null;

    const handleCustomerSave = async () => {
        setIsLoading(true);
        const updatePayload = {
            name: formData.name,
            email: formData.email,
            whatsapp: formData.whatsapp,
            cpf: formData.cpf,
        };
        try {
            await api.admin.updateCustomer(formData.id, updatePayload);
            toast({ title: "Sucesso", description: "Dados do cliente atualizados." });
            onSave();
        } catch (error) {
            toast({ title: "Erro", description: `Não foi possível atualizar o cliente: ${error.message}`, variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader><DialogTitle>Editar Cliente: {customer.name}</DialogTitle></DialogHeader>
                <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div><Label>Nome</Label><Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} /></div>
                        <div><Label>Email</Label><Input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} /></div>
                        <div><Label>WhatsApp</Label><Input value={formData.whatsapp || ''} onChange={e => setFormData({ ...formData, whatsapp: e.target.value })} /></div>
                        <div><Label>CPF</Label><Input value={formData.cpf || ''} onChange={e => setFormData({ ...formData, cpf: e.target.value })} /></div>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild><Button variant="outline" disabled={isLoading}>Fechar</Button></DialogClose>
                    <Button onClick={handleCustomerSave} disabled={isLoading} className="bg-red-600 hover:bg-red-700">Salvar Alterações</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};


// Componente Principal da Página
export const CustomerManagement = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    const fetchCustomers = async (): Promise<Customer[] | undefined> => {
        setIsLoading(true);
        try {
            const data = await api.admin.getAllCustomers();
            setCustomers(data || []);
            return data;
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
            setSelectedCustomer(null);
            fetchCustomers();
        } catch (error) {
            toast({ title: "Erro", description: `Não foi possível excluir o cliente: ${error.message}`, variant: "destructive" });
        }
    };

    const handleEditCustomer = () => {
        setIsEditDialogOpen(true);
    };
    
    const handleSaveAndCloseDialog = () => {
        setIsEditDialogOpen(false);
        fetchCustomers().then((updatedCustomers) => {
            if (selectedCustomer) {
                const freshCustomer = (updatedCustomers || []).find(c => c.id === selectedCustomer.id);
                setSelectedCustomer(freshCustomer || null);
            }
        });
    };

    if (selectedCustomer) {
        return (
            <AdminLayout>
                <CustomerDetailPage 
                    customer={selectedCustomer}
                    onBack={() => setSelectedCustomer(null)}
                    onEdit={handleEditCustomer}
                    onDelete={handleDeleteCustomer}
                />
                {isEditDialogOpen && (
                    <EditCustomerDialog
                        customer={selectedCustomer}
                        open={isEditDialogOpen}
                        onOpenChange={setIsEditDialogOpen}
                        onSave={handleSaveAndCloseDialog}
                    />
                )}
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <CustomerListPage
                customers={customers}
                onCustomerSelect={setSelectedCustomer}
                isLoading={isLoading}
            />
        </AdminLayout>
    );
};