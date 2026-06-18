import { useMutation } from '@tanstack/react-query'
import { getExportCSV } from '../api/export'

export function useExportCSV() {
  return useMutation({
    mutationFn: ({ from, to }: { from?: string; to?: string }) => getExportCSV(from, to),
  })
}
