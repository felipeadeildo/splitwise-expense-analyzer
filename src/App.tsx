import React from 'react'
import { AuthProvider } from './contexts/auth-context'
import { SplitwiseProvider } from './contexts/splitwise-context'
import { useAuth } from './hooks/use-auth'
import './index.css'

import DashboardView from './components/views/dashboard-view'
import LoginView from './components/views/login-view'

// Provider que encapsula o controle de visualização
const AppContent = () => {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Carregando...</p>
      </div>
    )
  }

  // Exibe a login view se não estiver autenticado, caso contrário mostra o dashboard
  return isAuthenticated ? (
    <SplitwiseProvider>
      <DashboardView />
    </SplitwiseProvider>
  ) : (
    <LoginView />
  )
}

// Componente App principal
const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
