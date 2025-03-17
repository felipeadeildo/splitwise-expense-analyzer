import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/hooks/use-auth'
import {
    BarChart4,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Cookie,
    ExternalLink,
    HelpCircle,
    Info,
    LockKeyhole,
    Shield,
    TriangleAlert,
    Users,
    Wallet,
} from 'lucide-react'
import React, { useState } from 'react'

const LoginView: React.FC = () => {
  const [cookie, setCookie] = useState('')
  const [activeTab, setActiveTab] = useState('login')
  const [currentStep, setCurrentStep] = useState(0)
  const { login, isLoading, error } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!cookie.trim()) {
      return
    }

    try {
      await login(cookie)
    } catch {
      // Error is handled in the auth context
    }
  }

  const features = [
    {
      icon: <BarChart4 className="h-10 w-10 text-blue-500" />,
      title: 'Visualização de Despesas',
      description:
        'Gráficos e tabelas interativas para entender seus gastos por categoria e ao longo do tempo.',
    },
    {
      icon: <Wallet className="h-10 w-10 text-green-500" />,
      title: 'Análise de Saldo',
      description:
        'Acompanhe quanto você pagou, quanto deve e seu saldo líquido com outros usuários.',
    },
    {
      icon: <Calendar className="h-10 w-10 text-purple-500" />,
      title: 'Histórico de Transações',
      description:
        'Visualize suas transações recentes e a evolução do seu saldo ao longo do tempo.',
    },
    {
      icon: <Users className="h-10 w-10 text-orange-500" />,
      title: 'Detalhamento por Usuário',
      description:
        'Veja exatamente quanto cada pessoa deve a você e quanto você deve a cada um.',
    },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-4xl shadow-lg border-blue-200">
        <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg pb-6">
          <div className="flex justify-center mb-2">
            <div className="w-16 h-16 rounded-full bg-white text-blue-600 flex items-center justify-center shadow-md">
              <LockKeyhole className="h-8 w-8" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">
            Splitwise Expense Analyzer
          </CardTitle>
          <CardDescription className="text-blue-100 text-lg mt-2">
            Visualize e analise suas despesas compartilhadas
          </CardDescription>
        </CardHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center border-b">
            <TabsList className="grid grid-cols-2 w-64 mt-4 mb-4">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="info">Como Funciona</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="login" className="p-0">
            <form onSubmit={handleSubmit}>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <TriangleAlert className="h-4 w-4" />
                      <AlertTitle>Erro</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Alert className="bg-blue-50 border-blue-200">
                    <Info className="h-4 w-4 text-blue-600" />
                    <AlertTitle className="text-blue-800">
                      Acesso Seguro
                    </AlertTitle>
                    <AlertDescription className="text-blue-700">
                      Esta aplicação é uma interface para o Splitwise. Nenhum
                      dado é salvo em servidores externos - tudo fica armazenado
                      apenas no seu navegador.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-3">
                    <h3 className="text-sm font-medium flex items-center">
                      <Cookie className="mr-2 h-4 w-4 text-orange-500" />
                      Cookie de Autenticação do Splitwise
                    </h3>
                    <Textarea
                      placeholder="Cole aqui o cookie 'user_credentials' do Splitwise..."
                      value={cookie}
                      onChange={(e) => setCookie(e.target.value)}
                      rows={4}
                      className="font-mono text-xs"
                    />
                    <div className="bg-gray-50 p-4 rounded-md border text-sm">
                      <p className="font-medium mb-2 text-gray-800">
                        Como obter o cookie:
                      </p>
                      <ol className="list-decimal pl-5 space-y-1 text-gray-700">
                        <li>
                          Instale a extensão{' '}
                          <a
                            href="https://chrome.google.com/webstore/detail/cookie-editor/hlkenndednhfkekhgcdicdfddnkalmdm"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline inline-flex items-center"
                          >
                            Cookie Editor{' '}
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        </li>
                        <li>
                          Faça login no{' '}
                          <a
                            href="https://secure.splitwise.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline inline-flex items-center"
                          >
                            Splitwise <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        </li>
                        <li>Clique no ícone da extensão Cookie Editor</li>
                        <li>
                          Procure e copie o valor do cookie{' '}
                          <code className="bg-gray-200 px-1 rounded">
                            user_credentials
                          </code>
                        </li>
                      </ol>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-3">
                <Button
                  type="submit"
                  className="w-full py-6 text-lg"
                  disabled={isLoading || !cookie.trim()}
                >
                  {isLoading
                    ? 'Entrando...'
                    : 'Acessar Meus Dados do Splitwise'}
                </Button>
                <p className="text-xs text-center text-gray-500">
                  <Shield className="inline h-3 w-3 mr-1" /> Sua privacidade é
                  importante. Seus dados nunca saem do seu navegador.
                </p>
              </CardFooter>
            </form>
          </TabsContent>

          <TabsContent value="info">
            <CardContent className="py-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-4 text-center text-blue-700">
                  O que é o Splitwise Expense Analyzer?
                </h2>
                <p className="text-gray-700 text-center mx-auto max-w-2xl">
                  Uma interface visual para seus dados do Splitwise, oferecendo
                  análises e insights que facilitam o entendimento de suas
                  despesas compartilhadas.
                </p>
              </div>

              {/* Carousel for features */}
              <div className="relative overflow-hidden">
                <div className="flex justify-between absolute top-1/2 transform -translate-y-1/2 left-0 right-0 z-10">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full ml-2 bg-white"
                    onClick={() =>
                      setCurrentStep(
                        (s) => (s - 1 + features.length) % features.length
                      )
                    }
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full mr-2 bg-white"
                    onClick={() =>
                      setCurrentStep((s) => (s + 1) % features.length)
                    }
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex justify-center items-center min-h-56 py-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center">
                      {features[currentStep].icon}
                    </div>
                    <h3 className="text-lg font-medium mt-4 mb-2">
                      {features[currentStep].title}
                    </h3>
                    <p className="text-gray-600 max-w-xl">
                      {features[currentStep].description}
                    </p>
                  </div>
                </div>

                <div className="flex justify-center gap-2 mt-2">
                  {features.map((_, idx) => (
                    <button
                      key={idx}
                      className={`w-2 h-2 rounded-full ${
                        currentStep === idx ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                      onClick={() => setCurrentStep(idx)}
                    />
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mt-8">
                <div className="bg-blue-50 rounded-lg p-5 border border-blue-200">
                  <h3 className="text-md font-medium text-blue-700 mb-2 flex items-center">
                    <Shield className="mr-2 h-5 w-5" />
                    Segurança e Privacidade
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                    <li>
                      <b>Sem Backend:</b> Aplicação 100% frontend
                    </li>
                    <li>
                      <b>Armazenamento Local:</b> Dados só no seu navegador
                    </li>
                    <li>
                      <b>Cookie Temporário:</b> Removível a qualquer momento
                    </li>
                  </ul>
                </div>

                <div className="bg-orange-50 rounded-lg p-5 border border-orange-200">
                  <h3 className="text-md font-medium text-orange-700 mb-2 flex items-center">
                    <HelpCircle className="mr-2 h-5 w-5" />
                    Por Que Precisamos do Cookie?
                  </h3>
                  <p className="text-sm text-gray-700">
                    O Splitwise não oferece API pública. O cookie permite fazer
                    requisições autenticadas em seu nome, sem armazenar suas
                    credenciais.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center pb-6">
              <Button onClick={() => setActiveTab('login')} className="w-48">
                Voltar para o Login
              </Button>
            </CardFooter>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}

export default LoginView
