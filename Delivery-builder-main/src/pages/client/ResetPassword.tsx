import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '@/services/apiService';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!token) {
            setError('Token de redefinição inválido ou ausente. Por favor, solicite um novo link.');
        }
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('As senhas não coincidem.');
            return;
        }
        if (!token) return;

        setIsLoading(true);
        setError('');
        setMessage('');

        try {
            const response = await api.customer.resetPassword(token, password);
            setMessage(response.message + " Você será redirecionado para o login em 5 segundos.");
            setTimeout(() => navigate('/'), 5000);
        } catch (err) {
            setError(err.message || 'Ocorreu um erro ao redefinir a senha.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Layout>
            <div className="container mx-auto flex justify-center items-center py-20">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle>Crie sua Nova Senha</CardTitle>
                        <CardDescription>
                            Digite e confirme sua nova senha abaixo.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {message && <p className="text-center text-green-700 bg-green-100 p-3 rounded-md mb-4">{message}</p>}
                        {error && <p className="text-center text-red-700 bg-red-100 p-3 rounded-md mb-4">{error}</p>}

                        {!message && !token && (
                            <Button onClick={() => navigate('/forgot-password')} className="w-full">
                                Solicitar Novo Link
                            </Button>
                        )}
                        
                        {!message && token && (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <Label htmlFor="password">Nova Senha</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={isLoading}>
                                    {isLoading ? 'Redefinindo...' : 'Redefinir Senha'}
                                </Button>
                            </form>
                        )}
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
};