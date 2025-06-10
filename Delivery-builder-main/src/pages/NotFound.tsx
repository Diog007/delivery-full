import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Pizza } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
            <Pizza className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Página não encontrada
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            Ops! A página que você está procurando não existe. Que tal escolher
            uma pizza deliciosa?
          </p>
          <div className="space-y-2">
            <Button
              onClick={() => navigate("/")}
              className="w-full bg-red-600 hover:bg-red-700"
              size="lg"
            >
              <Home className="mr-2 h-4 w-4" />
              Voltar ao Cardápio
            </Button>
            <Button
              onClick={() => navigate("/tracking")}
              variant="outline"
              className="w-full"
              size="lg"
            >
              Acompanhar Pedido
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
