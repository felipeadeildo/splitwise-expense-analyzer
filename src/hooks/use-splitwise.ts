import SplitwiseContext from '@/contexts/splitwise-context'
import { useContext } from 'react'

export function useSplitwise() {
  const context = useContext(SplitwiseContext)

  if (context === undefined) {
    throw new Error('useSplitwise must be used within a SplitwiseProvider')
  }

  return context
}
