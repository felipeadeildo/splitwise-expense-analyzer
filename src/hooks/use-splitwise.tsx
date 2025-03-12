import { useContext } from 'react';
import SplitwiseContext from '@/contexts/splitwise-context';

export function useSplitwise() {
    const context = useContext(SplitwiseContext);

    if (context === undefined) {
        throw new Error('useSplitwise must be used within a SplitwiseProvider');
    }

    return context;
}