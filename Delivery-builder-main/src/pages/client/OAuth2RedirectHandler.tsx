import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export const OAuth2RedirectHandler = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get('token');
        const name = searchParams.get('name');

        if (token && name) {
            // Salva o token e o nome no localStorage para autenticar o usuário
            localStorage.setItem('customerAuthToken', token);
            localStorage.setItem('customerName', name);

            // Redireciona para a página inicial.
            // A página será recarregada, e o CustomerAuthContext lerá
            // os novos dados do localStorage, efetivando o login no frontend.
            window.location.href = '/'; 
        } else {
            // Se o login falhar por algum motivo, redireciona de volta à página inicial com um erro
            navigate('/?error=LoginFailed');
        }
    }, [searchParams, navigate]);

    // Renderiza uma tela de carregamento amigável enquanto o processo ocorre
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="text-center p-8">
                 <svg className="animate-spin h-10 w-10 text-red-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-lg font-semibold text-gray-800">Autenticando com o Google...</p>
                <p className="text-gray-600">Você será redirecionado em breve.</p>
            </div>
        </div>
    );
};