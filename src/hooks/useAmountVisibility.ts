import { useContext } from 'react'
import { AmountVisibilityContext } from '../contexts/AmountVisibilityProvider'

export function useAmountVisibility() {
  const ctx = useContext(AmountVisibilityContext)
  if (!ctx) throw new Error('useAmountVisibility must be used within <AmountVisibilityProvider>')
  return ctx
}
