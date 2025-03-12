import React from 'react';
import { useSplitwise } from '@/hooks/use-splitwise';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Area, Bar, CartesianGrid, Cell, ComposedChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatCurrency } from '@/lib/utils';

interface CustomTooltipProps {
    active?: boolean;
    payload?: any[];
    label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-white p-3 border rounded shadow">
                <p className="font-bold">{data.date}</p>
                <p className="text-sm">{data.description}</p>
                <p className="text-sm">
                    {data.isPayment ? 'Pagamento' : 'Despesa'}: {formatCurrency(data.amount, 'BRL')}
                </p>
                {!data.isPayment && (
                    <>
                        <p className="text-sm">Você pagou: {formatCurrency(data.paidShare, 'BRL')}</p>
                        <p className="text-sm">Você devia: {formatCurrency(data.owedShare, 'BRL')}</p>
                    </>
                )}
                <p className="font-medium mt-1">
                    Líquido: <span className={data.netAmount > 0 ? 'text-green-600' : data.netAmount < 0 ? 'text-red-600' : ''}>
                        {formatCurrency(data.netAmount, 'BRL')}
                    </span>
                </p>
                <p className="font-medium">
                    Saldo: {formatCurrency(data.runningBalance, 'BRL')}
                </p>
            </div>
        );
    }
    return null;
};

export const ExpenseTimeline: React.FC = () => {
    const { processedData, data } = useSplitwise();
    const { balanceHistory } = processedData;
    const { selectedGroup } = data;

    return (
        <Card className="col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium">Histórico de Saldo</CardTitle>
                <div className="text-right">
                    <p className="text-sm text-gray-500">Grupo Atual</p>
                    <p className="font-medium">{selectedGroup?.name || 'Nenhum grupo selecionado'}</p>
                </div>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={balanceHistory}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis
                                dataKey="date"
                                tick={{ fill: '#64748b' }}
                                axisLine={{ stroke: '#cbd5e1' }}
                                tickLine={{ stroke: '#cbd5e1' }}
                            />
                            <YAxis
                                tick={{ fill: '#64748b' }}
                                axisLine={{ stroke: '#cbd5e1' }}
                                tickLine={{ stroke: '#cbd5e1' }}
                                tickFormatter={(value) => formatCurrency(value, 'BRL', { notation: 'compact' })}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Area
                                type="monotone"
                                dataKey="runningBalance"
                                name="Saldo"
                                fill="rgba(59, 130, 246, 0.2)"
                                stroke="#3b82f6"
                                dot={false}
                            />
                            <Bar
                                dataKey="netAmount"
                                name="Transação"
                                barSize={10}
                            >
                                {balanceHistory.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.netAmount >= 0 ? '#10b981' : '#ef4444'} />
                                ))}
                            </Bar>
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};

export default ExpenseTimeline;