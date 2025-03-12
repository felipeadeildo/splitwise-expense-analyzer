import React from 'react';
import { useSplitwise } from '@/hooks/use-splitwise';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/lib/utils';

export const UserDebts: React.FC = () => {
  const { processedData } = useSplitwise();
  const { userDebts } = processedData;
  
  return (
    <Card className="col-span-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Dinheiro que Você Deve vs. Dinheiro que Devem a Você</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuário</TableHead>
                <TableHead className="text-right">Você Deve</TableHead>
                <TableHead className="text-right">Eles Devem</TableHead>
                <TableHead className="text-right">Saldo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userDebts.map((user, index) => (
                <TableRow key={index} className={index % 2 === 0 ? 'bg-muted/50' : ''}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell className="text-right text-red-600">
                    {user.youOwe > 0 ? formatCurrency(user.youOwe, 'BRL') : '-'}
                  </TableCell>
                  <TableCell className="text-right text-green-600">
                    {user.theyOwe > 0 ? formatCurrency(user.theyOwe, 'BRL') : '-'}
                  </TableCell>
                  <TableCell className={`text-right font-medium ${
                    user.netBalance > 0 
                      ? 'text-green-600' 
                      : user.netBalance < 0 
                        ? 'text-red-600' 
                        : ''
                  }`}>
                    {formatCurrency(user.netBalance, 'BRL')}
                  </TableCell>
                </TableRow>
              ))}
              {userDebts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                    Nenhum dado de dívida disponível
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

export default UserDebts;