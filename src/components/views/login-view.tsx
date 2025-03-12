
import React, { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { TriangleAlert } from 'lucide-react';

const LoginView: React.FC = () => {
    const [cookie, setCookie] = useState('');
    const { login, isLoading, error } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!cookie.trim()) {
            return;
        }

        try {
            await login(cookie);
        } catch (err) {
            // Error is handled in the auth context
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">Splitwise Expense Analyzer</CardTitle>
                    <CardDescription className="text-center">
                        Entre com suas credenciais do Splitwise para continuar
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent>
                        <div className="space-y-4">
                            {error && (
                                <Alert variant="destructive">
                                    <TriangleAlert className="h-4 w-4" />
                                    <AlertTitle>Erro</AlertTitle>
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            <div className="space-y-2">
                                <h3 className="text-sm font-medium">Cookie de Autenticação</h3>
                                <Textarea
                                    placeholder="Cole aqui o cookie completo do Splitwise..."
                                    value={cookie}
                                    onChange={(e) => setCookie(e.target.value)}
                                    rows={5}
                                    className="font-mono text-xs"
                                />
                                <p className="text-xs text-gray-500">
                                    Para obter o cookie, faça login no Splitwise pelo navegador, abra as ferramentas de desenvolvedor
                                    (F12), vá para a aba Network, atualize a página, e copie o Cookie do cabeçalho de requisição.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full" disabled={isLoading || !cookie.trim()}>
                            {isLoading ? 'Entrando...' : 'Entrar'}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
};

export default LoginView;