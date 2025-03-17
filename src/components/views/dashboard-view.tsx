import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { useSplitwise } from '@/hooks/use-splitwise'
import {
  BarChart,
  LayoutDashboard,
  LogOut,
  TriangleAlert,
  Users,
} from 'lucide-react'
import { useState } from 'react'

// Importar componentes do dashboard
import { BalanceCardGroup } from '@/components/dashboard/balance-card'
import CategoryDistribution from '@/components/dashboard/category-distribution'
import ExpenseBreakdown from '@/components/dashboard/expense-breakdown'
import ExpenseTimeline from '@/components/dashboard/expense-timeline'
import GroupSelector from '@/components/dashboard/group-selector'
import RecentTransactions from '@/components/dashboard/recent-transactions'
import UserDebts from '@/components/dashboard/user-debts'

// Definir tipos de visualização disponíveis
type ViewType = 'overview' | 'details' | 'users'

const DashboardView = () => {
  const { logout, user } = useAuth()
  const { isLoading, error } = useSplitwise()
  const [currentView, setCurrentView] = useState<ViewType>('overview')

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="hidden md:flex w-64 flex-col bg-white border-r">
        <div className="flex flex-col flex-grow">
          <div className="flex items-center h-16 px-4 border-b">
            <h1 className="text-lg font-bold text-blue-600">
              Splitwise Analyzer
            </h1>
          </div>

          <div className="flex-grow px-4 py-6 space-y-6">
            <nav className="space-y-1">
              <Button
                variant={currentView === 'overview' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setCurrentView('overview')}
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Visão Geral
              </Button>

              <Button
                variant={currentView === 'details' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setCurrentView('details')}
              >
                <BarChart className="mr-2 h-4 w-4" />
                Análise Detalhada
              </Button>

              <Button
                variant={currentView === 'users' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setCurrentView('users')}
              >
                <Users className="mr-2 h-4 w-4" />
                Usuários
              </Button>
            </nav>
          </div>

          <div className="px-4 py-6 border-t">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-medium">
                  {user?.firstName?.charAt(0) || '?'}
                </span>
              </div>
              <div className="ml-3">
                <p className="font-medium">
                  {user?.firstName} {user?.lastName || ''}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full justify-start text-red-600 hover:text-red-600 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile header */}
      <div className="fixed md:hidden w-full flex items-center justify-between h-16 px-4 border-b bg-white z-10">
        <h1 className="text-lg font-bold text-blue-600">Splitwise Analyzer</h1>
        <div className="flex space-x-2">
          <Button size="sm" variant="ghost" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile bottom navbar */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t flex justify-around py-2 z-10">
        <Button
          variant="ghost"
          size="sm"
          className={currentView === 'overview' ? 'text-blue-600' : ''}
          onClick={() => setCurrentView('overview')}
        >
          <LayoutDashboard className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={currentView === 'details' ? 'text-blue-600' : ''}
          onClick={() => setCurrentView('details')}
        >
          <BarChart className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={currentView === 'users' ? 'text-blue-600' : ''}
          onClick={() => setCurrentView('users')}
        >
          <Users className="h-5 w-5" />
        </Button>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto pt-0 md:pt-0 pb-16 md:pb-0">
        <main className="p-4 md:p-6 mt-16 md:mt-0">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-3 md:mb-0">
              {currentView === 'overview' && 'Visão Geral'}
              {currentView === 'details' && 'Análise Detalhada'}
              {currentView === 'users' && 'Usuários e Dívidas'}
            </h1>
            <div className="w-full md:w-64">
              <GroupSelector />
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <TriangleAlert className="h-4 w-4" />
              <AlertTitle>Erro</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-500">Carregando dados...</p>
              </div>
            </div>
          ) : (
            <>
              {currentView === 'overview' && (
                <div className="space-y-6">
                  <BalanceCardGroup />

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <ExpenseTimeline />
                    <CategoryDistribution />
                  </div>

                  <RecentTransactions />
                </div>
              )}

              {currentView === 'details' && (
                <div className="space-y-6">
                  <ExpenseBreakdown />

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <CategoryDistribution />
                    <ExpenseTimeline />
                  </div>
                </div>
              )}

              {currentView === 'users' && (
                <div className="space-y-6">
                  <UserDebts />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <RecentTransactions />
                    <CategoryDistribution />
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}

export default DashboardView
