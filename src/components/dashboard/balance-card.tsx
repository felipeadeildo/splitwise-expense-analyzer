// src/components/dashboard/balance-card.tsx
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn, formatCurrency } from '@/lib/utils';
import { useSplitwise } from '@/hooks/use-splitwise';

interface BalanceCardProps {
  title: string;
  amount: number;
  description: string;
  colorClass?: string;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({ 
  title, 
  amount, 
  description, 
  colorClass = 'text-gray-900'
}) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium uppercase text-gray-500">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={cn("text-2xl font-bold", colorClass)}>
          {formatCurrency(amount, 'BRL')}
        </div>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  );
};

export const BalanceCardGroup: React.FC = () => {
  const { processedData } = useSplitwise();
  const { userBalance, expenseSummary } = processedData;
  
  // Determine the balance color
  const balanceColor = userBalance > 0 
    ? 'text-green-600' 
    : userBalance < 0 
      ? 'text-red-600' 
      : 'text-gray-900';
  
  // Determine the balance description
  const balanceDescription = userBalance > 0 
    ? 'Você tem dinheiro a receber' 
    : userBalance < 0 
      ? 'Você deve dinheiro' 
      : 'Tudo quitado!';
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <BalanceCard 
        title="Saldo Atual"
        amount={userBalance}
        description={balanceDescription}
        colorClass={balanceColor}
      />
      
      <BalanceCard 
        title="Total Pago"
        amount={expenseSummary.paid}
        description="Valor que você pagou"
        colorClass="text-blue-600"
      />
      
      <BalanceCard 
        title="Total Devido"
        amount={expenseSummary.owed}
        description="Sua parte nas despesas"
        colorClass="text-orange-500"
      />
    </div>
  );
};