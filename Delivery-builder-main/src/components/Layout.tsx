import { ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingCart, Pizza, Phone, MapPin, ChevronDown } from "lucide-react";

// --- NOVAS IMPORTAÇÕES ---
import { useCustomerAuth } from "@/contexts/CustomerAuthContext";
import { LoginModal } from "./LoginModal";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "./ui/dropdown-menu";
// --- FIM DAS NOVAS IMPORTAÇÕES ---

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { getTotalItems } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const totalItems = getTotalItems();

  // --- NOVA LÓGICA E ESTADOS ---
  const { isAuthenticated, customerName, logout } = useCustomerAuth();
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/"); // Redireciona para a home após o logout
  };
  // --- FIM DA NOVA LÓGICA ---

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* O Modal de Login é renderizado aqui mas só fica visível quando ativado */}
      <LoginModal open={isLoginModalOpen} setOpen={setLoginModalOpen} />

      <header className="bg-red-600 shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <Pizza className="h-8 w-8 text-white" />
              <h1 className="text-2xl font-bold text-white">PizzaExpress</h1>
            </Link>

            <nav className="hidden md:flex items-center space-x-6">
              <Link
                to="/"
                className={`text-white hover:text-red-200 transition-colors ${
                  location.pathname === "/" ? "border-b-2 border-white pb-1" : ""
                }`}
              >
                Cardápio
              </Link>
              <Link
                to={isAuthenticated ? "/my-orders" : "/tracking"}
                className={`text-white hover:text-red-200 transition-colors ${
                  ["/tracking", "/my-orders"].includes(location.pathname) ? "border-b-2 border-white pb-1" : ""
                }`}
              >
                Acompanhar Pedido
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              {/* --- LÓGICA CONDICIONAL DE LOGIN --- */}
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="bg-white text-red-600 hover:bg-gray-100">
                      Olá, {customerName}
                      <ChevronDown className="h-4 w-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link to="/my-orders">Meus Pedidos</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button variant="outline" className="bg-white text-red-600 hover:bg-gray-100" onClick={() => setLoginModalOpen(true)}>
                  Entrar / Criar Conta
                </Button>
              )}
              {/* --- FIM DA LÓGICA CONDICIONAL --- */}

              <Link to="/cart">
                <Button
                  variant="outline"
                  className="bg-white text-red-600 hover:bg-gray-100 relative"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Carrinho
                  {totalItems > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-red-500 text-white">
                      {totalItems}
                    </Badge>
                  )}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="container mx-auto px-4">
            {/* O conteúdo do footer permanece o mesmo */}
            <div className="grid md:grid-cols-3 gap-8">
                <div>
                    <div className="flex items-center space-x-2 mb-4"><Pizza className="h-6 w-6" /><h3 className="text-lg font-semibold">PizzaExpress</h3></div>
                    <p className="text-gray-300">As melhores pizzas da cidade, com ingredientes frescos e entrega rápida.</p>
                </div>
                <div>
                    <h4 className="text-lg font-semibold mb-4">Contato</h4>
                    <div className="space-y-2">
                        <div className="flex items-center space-x-2"><Phone className="h-4 w-4" /><span>(11) 99999-9999</span></div>
                        <div className="flex items-center space-x-2"><MapPin className="h-4 w-4" /><span>Rua das Pizzas, 123 - Centro</span></div>
                    </div>
                </div>
                <div>
                    <h4 className="text-lg font-semibold mb-4">Horário de Funcionamento</h4>
                    <div className="space-y-1 text-sm text-gray-300">
                        <p>Segunda a Quinta: 18h às 23h</p>
                        <p>Sexta e Sábado: 18h às 00h</p>
                        <p>Domingo: 18h às 22h</p>
                    </div>
                </div>
            </div>
            <div className="border-t border-gray-700 mt-8 pt-4 text-center text-gray-400">
                <p>&copy; 2024 PizzaExpress. Todos os direitos reservados.</p>
            </div>
        </div>
      </footer>
    </div>
  );
};