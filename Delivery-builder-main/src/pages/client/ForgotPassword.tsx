import { useState } from 'react';
import { api } from '@/services/apiService';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');
        try {
            const response = await api.customer.forgotPassword(email);
            setMessage(response.message);
        } catch (error) {
            setMessage('Ocorreu um erro. Tente novamente mais tarde.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Layout>
            <div className="container mx-auto flex justify-center items-center py-20">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle>Redefinir Senha</CardTitle>
                        <CardDescription>
                            Digite seu e-mail para receber um link de redefinição de senha.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {message ? (
                            <p className="text-center text-green-700 bg-green-100 p-3 rounded-md">{message}</p>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <Label htmlFor="email">E-mail</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        placeholder="seu.email@exemplo.com"
                                    />
                                </div>
                                <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={isLoading}>
                                    {isLoading ? 'Enviando...' : 'Enviar Link de Redefinição'}
                                </Button>
                            </form>
                        )}
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
};