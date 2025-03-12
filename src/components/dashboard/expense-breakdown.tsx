import React from 'react';
import { useSplitwise } from '@/hooks/use-splitwise';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';

export const ExpenseBreakdown: React.FC = () => {
  const { processedData } = useSplitwise();
  const { expenseBreakdown } = processedData;
  
  return (
    <Card className="col-span-3">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">O que Está Afetando Seu Saldo?</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Descrição</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead className="text-center">Impacto</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenseBreakdown.slice(0, 10).map((item, index) => (
                <TableRow key={index} className={index % 2 === 0 ? 'bg-muted/50' : ''}>
                  <TableCell className="font-medium">{item.description}</TableCell>
                  <TableCell>{item.date.toLocaleDateString()}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(item.amount, 'BRL')}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge 
                      variant={item.isPositive ? 'outline' : 'destructive'}
                      className={`${
                        item.isPositive 
                          ? 'bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800' 
                          : ''
                      }`}
                    >
                      {item.isPositive ? 'Positivo' : 'Negativo'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {expenseBreakdown.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                    Nenhum dado disponível
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpenseBreakdown;