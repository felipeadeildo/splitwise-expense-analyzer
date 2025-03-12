import React from 'react';
import { useSplitwise } from '@/hooks/use-splitwise';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatCurrency } from '@/lib/utils';

export const RecentTransactions: React.FC = () => {
  const { processedData } = useSplitwise();
  const { recentTransactions } = processedData;
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Transações Recentes</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-3">
            {recentTransactions.map((transaction, index) => (
              <div 
                key={index} 
                className="p-3 rounded border-l-4 hover:bg-muted/50 transition-colors" 
                style={{ borderLeftColor: transaction.netAmount > 0 ? '#10b981' : '#ef4444' }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{transaction.description}</h3>
                    <p className="text-xs text-muted-foreground">
                      {transaction.date.toLocaleDateString()} · {transaction.category}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${
                      transaction.netAmount > 0 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {formatCurrency(transaction.netAmount, 'BRL')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {transaction.isPayment 
                        ? 'Pagamento' 
                        : `Pagou: ${formatCurrency(transaction.paidShare, 'BRL')}`
                      }
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {recentTransactions.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Nenhuma transação recente
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default RecentTransactions;