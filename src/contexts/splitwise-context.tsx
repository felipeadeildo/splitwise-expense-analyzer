import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/hooks/use-auth';

interface Group {
    id: number;
    name: string;
    members: {
        id: number;
        first_name: string;
        last_name: string | null;
        balance: { currency_code: string; amount: string }[];
    }[];
    simplified_debts: {
        from: number;
        to: number;
        amount: string;
        currency_code: string;
    }[];
}

interface Expense {
    id: number;
    description: string;
    cost: string;
    date: string;
    created_at: string;
    category: { id: number; name: string };
    payment: boolean;
    users: {
        user_id: number;
        paid_share: string;
        owed_share: string;
        net_balance: string;
    }[];
    repayments: {
        from: number;
        to: number;
        amount: string;
    }[];
}

interface SplitwiseData {
    groups: Group[];
    expenses: Expense[];
    selectedGroup: Group | null;
    selectedUserId: number | null;
}

interface SplitwiseContextType {
    data: SplitwiseData;
    isLoading: boolean;
    error: string | null;
    loadMainData: () => Promise<void>;
    loadGroupExpenses: (groupId: number) => Promise<void>;
    selectGroup: (groupId: number) => void;
    selectUser: (userId: number) => void;
    processedData: {
        balanceHistory: BalanceHistoryItem[];
        categoryDistribution: CategoryTotal[];
        userDebts: UserDebt[];
        recentTransactions: Transaction[];
        expenseBreakdown: ExpenseBreakdown[];
        userBalance: number;
        expenseSummary: { paid: number; owed: number };
    };
}

interface BalanceHistoryItem {
    date: string;
    fullDate: Date;
    id: number;
    description: string;
    isPayment: boolean;
    amount: number;
    paidShare: number;
    owedShare: number;
    netAmount: number;
    runningBalance: number;
}

interface CategoryTotal {
    name: string;
    value: number;
}

interface UserDebt {
    userId: number;
    name: string;
    youOwe: number;
    theyOwe: number;
    netBalance: number;
}

interface Transaction {
    id: number;
    date: Date;
    description: string;
    isPayment: boolean;
    amount: number;
    paidShare: number;
    owedShare: number;
    netAmount: number;
    category: string;
}

interface ExpenseBreakdown {
    id: number;
    date: Date;
    description: string;
    amount: number;
    isPositive: boolean;
    category: string;
}

interface CategoryTotals {
    [key: string]: number;
}

interface UserOwed {
    [key: number]: {
        owed: number;
        owned: number;
    };
}

const SplitwiseContext = createContext<SplitwiseContextType | undefined>(undefined);

interface SplitwiseProviderProps {
    children: ReactNode;
}

export const SplitwiseProvider: React.FC<SplitwiseProviderProps> = ({ children }) => {
    const { cookie, isAuthenticated, user } = useAuth();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<SplitwiseData>({
        groups: [],
        expenses: [],
        selectedGroup: null,
        selectedUserId: user?.id || null
    });

    const [processedData, setProcessedData] = useState<{
        balanceHistory: BalanceHistoryItem[];
        categoryDistribution: CategoryTotal[];
        userDebts: UserDebt[];
        recentTransactions: Transaction[];
        expenseBreakdown: ExpenseBreakdown[];
        userBalance: number;
        expenseSummary: { paid: number; owed: number };
    }>({
        balanceHistory: [],
        categoryDistribution: [],
        userDebts: [],
        recentTransactions: [],
        expenseBreakdown: [],
        userBalance: 0,
        expenseSummary: { paid: 0, owed: 0 }
    });

    // Load main data on authentication
    useEffect(() => {
        if (isAuthenticated) {
            loadMainData();
        }
    }, [isAuthenticated]);

    // Process data when expenses or selected user changes
    useEffect(() => {
        if (data.expenses.length > 0 && data.selectedUserId) {
            processUserData();
        }
    }, [data.expenses, data.selectedUserId]);

    const loadMainData = async (): Promise<void> => {
        if (!isAuthenticated || !cookie) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('https://secure.splitwise.com/api/v3.0/get_main_data?no_expenses=1&limit=3', {
                headers: {
                    'Cookie': cookie,
                    'Credentials': 'include'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to load data from Splitwise');
            }

            const mainData = await response.json();

            setData(prev => ({
                ...prev,
                groups: mainData.groups,
                selectedGroup: mainData.groups.length > 0 ? mainData.groups[1] : null, // Skip the non-group (index 0)
                selectedUserId: user?.id || null
            }));

            // If we have a selected group, load its expenses
            if (mainData.groups.length > 0) {
                await loadGroupExpenses(mainData.groups[1].id);
            }
        } catch (e) {
            setError(e instanceof Error ? e.message : 'An unknown error occurred');
            console.error('Error loading main data:', e);
        } finally {
            setIsLoading(false);
        }
    };

    const loadGroupExpenses = async (groupId: number): Promise<void> => {
        if (!isAuthenticated || !cookie) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`https://secure.splitwise.com/api/v3.0/get_expenses?visible=true&group_id=${groupId}&limit=25`, {
                headers: {
                    'Cookie': cookie,
                    'Credentials': 'include'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to load expenses');
            }

            const expensesData = await response.json();

            setData(prev => ({
                ...prev,
                expenses: expensesData
            }));
        } catch (e) {
            setError(e instanceof Error ? e.message : 'An unknown error occurred');
            console.error('Error loading expenses:', e);
        } finally {
            setIsLoading(false);
        }
    };

    const selectGroup = (groupId: number) => {
        const selectedGroup = data.groups.find(group => group.id === groupId);
        if (selectedGroup) {
            setData(prev => ({
                ...prev,
                selectedGroup
            }));
            loadGroupExpenses(groupId);
        }
    };

    const selectUser = (userId: number) => {
        setData(prev => ({
            ...prev,
            selectedUserId: userId
        }));
    };

    const processUserData = () => {
        const userId = data.selectedUserId;
        if (!userId) return;

        // Sort expenses by date
        const sortedExpenses = [...data.expenses].sort((a, b) =>
            new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        // Initialize data structures
        let runningBalance = 0;
        let totalPaid = 0;
        let totalOwed = 0;
        const history: BalanceHistoryItem[] = [];
        const categoryTotals: CategoryTotals = {};
        const userOwed: UserOwed = {};
        const transactions: Transaction[] = [];
        const breakdown: ExpenseBreakdown[] = [];

        // Process each expense
        sortedExpenses.forEach(expense => {
            const date = new Date(expense.date);
            const formattedDate = `${date.getMonth() + 1}/${date.getDate()}`;

            // Find the user's involvement in this expense
            const userInvolvement = expense.users.find(u => u.user_id === userId);

            if (userInvolvement) {
                // Add to running totals
                const paidAmount = parseFloat(userInvolvement.paid_share) || 0;
                const owedAmount = parseFloat(userInvolvement.owed_share) || 0;
                const netAmount = parseFloat(userInvolvement.net_balance) || 0;

                totalPaid += paidAmount;
                totalOwed += owedAmount;
                runningBalance += netAmount;

                // Add to balance history
                history.push({
                    date: formattedDate,
                    fullDate: date,
                    id: expense.id,
                    description: expense.description,
                    isPayment: expense.payment,
                    amount: parseFloat(expense.cost),
                    paidShare: paidAmount,
                    owedShare: owedAmount,
                    netAmount: netAmount,
                    runningBalance: runningBalance
                });

                // Track expenses by category
                const category = expense.category ? expense.category.name : 'Uncategorized';
                if (!expense.payment) {
                    if (!categoryTotals[category]) {
                        categoryTotals[category] = 0;
                    }
                    categoryTotals[category] += owedAmount;
                }

                // Track money owed to/by other users
                expense.repayments.forEach(repayment => {
                    const fromUserId = repayment.from;
                    const toUserId = repayment.to;
                    const amount = parseFloat(repayment.amount);

                    if (fromUserId === userId) {
                        // Current user owes money to someone
                        if (!userOwed[toUserId]) {
                            userOwed[toUserId] = { owed: 0, owned: 0 };
                        }
                        userOwed[toUserId].owed += amount;
                    } else if (toUserId === userId) {
                        // Someone owes money to current user
                        if (!userOwed[fromUserId]) {
                            userOwed[fromUserId] = { owed: 0, owned: 0 };
                        }
                        userOwed[fromUserId].owned += amount;
                    }
                });

                // Add to recent transactions
                transactions.push({
                    id: expense.id,
                    date: date,
                    description: expense.description,
                    isPayment: expense.payment,
                    amount: parseFloat(expense.cost),
                    paidShare: paidAmount,
                    owedShare: owedAmount,
                    netAmount: netAmount,
                    category: category
                });

                // Add to payment breakdown if significant
                if (Math.abs(netAmount) > 0.01) {
                    breakdown.push({
                        id: expense.id,
                        date: date,
                        description: expense.description,
                        amount: Math.abs(netAmount),
                        isPositive: netAmount > 0,
                        category: category
                    });
                }
            }
        });

        // Convert category data to array for chart
        const categoryData = Object.keys(categoryTotals).map(category => ({
            name: category,
            value: categoryTotals[category]
        })).filter(item => item.value > 0).sort((a, b) => b.value - a.value);

        // Convert user owed data to array
        const userDebtsData = Object.keys(userOwed).map(uid => {
            const numUid = parseInt(uid);
            const userOwedData = userOwed[numUid]; // Get the data with proper numeric index
            // Find user name
            let userName = `User ${uid}`;
            if (data.selectedGroup) {
                const member = data.selectedGroup.members.find(m => m.id === numUid);
                if (member) {
                    userName = member.first_name + (member.last_name ? ` ${member.last_name}` : '');
                }
            }

            return {
                userId: numUid,
                name: userName,
                youOwe: userOwedData.owed,
                theyOwe: userOwedData.owned,
                netBalance: userOwedData.owned - userOwedData.owed
            };
        }).sort((a, b) => Math.abs(b.netBalance) - Math.abs(a.netBalance));

        // Sort and limit recent transactions
        const sortedTransactions = [...transactions].sort((a, b) =>
            b.date.getTime() - a.date.getTime()
        ).slice(0, 10);

        // Sort payment breakdown by amount
        const sortedBreakdown = [...breakdown].sort((a, b) => b.amount - a.amount);

        // Update state with processed data
        setProcessedData({
            balanceHistory: history,
            categoryDistribution: categoryData,
            userDebts: userDebtsData,
            recentTransactions: sortedTransactions,
            expenseBreakdown: sortedBreakdown,
            userBalance: runningBalance,
            expenseSummary: { paid: totalPaid, owed: totalOwed }
        });
    };

    return (
        <SplitwiseContext.Provider
            value={{
                data,
                isLoading,
                error,
                loadMainData,
                loadGroupExpenses,
                selectGroup,
                selectUser,
                processedData
            }}
        >
            {children}
        </SplitwiseContext.Provider>
    );
};

export default SplitwiseContext;