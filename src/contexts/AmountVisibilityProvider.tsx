import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

/**
 * Persisted "Penyamaran nominal" setting (mirrors mobile's global toggle).
 * `'0'` = masked, anything else (including absent) = visible.
 */
export const AMOUNT_VISIBILITY_STORAGE_KEY = 'affluena.amounts_visible'

interface AmountVisibilityContextValue {
  /** true = nominal terlihat; false = balances/summaries render `Rp ••••••`. */
  amountsVisible: boolean
  setAmountsVisible: (visible: boolean) => void
  toggleAmountsVisible: () => void
}

export const AmountVisibilityContext = createContext<AmountVisibilityContextValue | null>(null)

function readStoredVisibility(): boolean {
  try {
    return window.localStorage.getItem(AMOUNT_VISIBILITY_STORAGE_KEY) !== '0'
  } catch {
    return true
  }
}

export function AmountVisibilityProvider({ children }: { children: ReactNode }) {
  const [amountsVisible, setAmountsVisible] = useState<boolean>(readStoredVisibility)

  useEffect(() => {
    try {
      window.localStorage.setItem(AMOUNT_VISIBILITY_STORAGE_KEY, amountsVisible ? '1' : '0')
    } catch {
      // Private-mode/quota failures just lose persistence, never crash the UI.
    }
  }, [amountsVisible])

  const toggleAmountsVisible = useCallback(() => {
    setAmountsVisible((prev) => !prev)
  }, [])

  const value = useMemo<AmountVisibilityContextValue>(
    () => ({ amountsVisible, setAmountsVisible, toggleAmountsVisible }),
    [amountsVisible, toggleAmountsVisible]
  )

  return <AmountVisibilityContext.Provider value={value}>{children}</AmountVisibilityContext.Provider>
}
