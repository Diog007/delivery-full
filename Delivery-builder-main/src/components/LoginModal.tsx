import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useCustomerAuth } from '@/contexts/CustomerAuthContext';

// AQUI A MUDANÇA: de 'setOpen' para 'onOpenChange'
export const LoginModal = ({ open, onOpenChange }) => {
  const { login, register } = useCustomerAuth();
  const [isLogin, setIsLogin] = useState(true);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    const success = await login(email, password);
    if (success) onOpenChange(false);
    else alert("Email ou senha inválidos.");
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      name: e.target.name.value,
      email: e.target.email.value,
      password: e.target.password.value,
      whatsapp: e.target.whatsapp.value,
      cpf: e.target.cpf.value,
    };
    const success = await register(formData);
    if (success) onOpenChange(false);
  };

  return (
    // E AQUI: usando a nova prop 'onOpenChange'
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isLogin ? 'Entrar na sua conta' : 'Criar nova conta'}</DialogTitle>
          <DialogDescription>
            {isLogin ? 'Use seu e-mail e senha para entrar.' : 'Preencha seus dados para se registrar.'}
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="login" onValueChange={(value) => setIsLogin(value === 'login')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Entrar</TabsTrigger>
            <TabsTrigger value="register">Registrar</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <form onSubmit={handleLoginSubmit} className="space-y-4 pt-4">
              <div><Label htmlFor="email">Email</Label><Input id="email" type="email" required /></div>
              <div><Label htmlFor="password">Senha</Label><Input id="password" type="password" required /></div>
              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">Entrar</Button>
            </form>
          </TabsContent>
          <TabsContent value="register">
            <form onSubmit={handleRegisterSubmit} className="space-y-4 pt-4">
              <div><Label htmlFor="name">Nome Completo</Label><Input id="name" required /></div>
              <div><Label htmlFor="email">Email</Label><Input id="email" type="email" required /></div>
              <div><Label htmlFor="password">Senha</Label><Input id="password" type="password" required /></div>
              <div><Label htmlFor="whatsapp">WhatsApp</Label><Input id="whatsapp" required /></div>
              <div><Label htmlFor="cpf">CPF</Label><Input id="cpf" /></div>
              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">Criar Conta</Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};