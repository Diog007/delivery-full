import { useState } from 'react';
import { Link } from 'react-router-dom'; // Adicionado
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useCustomerAuth } from '@/contexts/CustomerAuthContext';
import { Separator } from './ui/separator';

// Componente para o ícone do Google
const GoogleIcon = (props) => (
  <svg viewBox="0 0 48 48" {...props} width="20" height="20">
    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.657-3.344-11.303-7.918l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C39.99,35.962,44,30.638,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
  </svg>
);


export const LoginModal = ({ open, onOpenChange }) => {
  const { login, register } = useCustomerAuth();
  const [isLogin, setIsLogin] = useState(true);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    const success = await login(email, password);
    if (success) onOpenChange(false);
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
              <div>
                {/* INÍCIO DA MODIFICAÇÃO */}
                <div className="flex justify-between items-center mb-1">
                    <Label htmlFor="password">Senha</Label>
                    <Link 
                      to="/forgot-password" 
                      onClick={() => onOpenChange(false)} 
                      className="text-xs text-red-600 hover:underline"
                    >
                        Esqueceu a senha?
                    </Link>
                </div>
                {/* FIM DA MODIFICAÇÃO */}
                <Input id="password" type="password" required />
              </div>
              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">Entrar</Button>
            </form>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">OU CONTINUE COM</span>
              </div>
            </div>
            
            <Button asChild variant="outline" className="w-full">
              <a href="http://localhost:8090/oauth2/authorization/google">
                <GoogleIcon className="mr-2" />
                Login com Google
              </a>
            </Button>
            
          </TabsContent>
          <TabsContent value="register">
            <form onSubmit={handleRegisterSubmit} className="space-y-4 pt-4">
              <div><Label htmlFor="name">Nome Completo</Label><Input id="name" required /></div>
              <div><Label htmlFor="email">Email</Label><Input id="email" type="email" required /></div>
              <div><Label htmlFor="password">Senha</Label><Input id="password" type="password" required /></div>
              <div><Label htmlFor="whatsapp">WhatsApp</Label><Input id="whatsapp" /></div>
              <div><Label htmlFor="cpf">CPF</Label><Input id="cpf" /></div>
              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">Criar Conta</Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};