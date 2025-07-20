import {
  sumTransactions,
  uniqueInstallments,
  formatCurrency,
  splitCurrencyParts,
  formatTransactionPeriod,
  selectedDatesString,
  TransactionFilters,
  filterTransactions,
} from '@/lib/transactionUtils'
import { Transaction } from '../src/types/transaction'

const mockTransactions: Transaction[] = [
  {
    id: '1',
    amount: 100,
    card: 'visa',
    installments: 1,
    createdAt: '2023-10-26T10:00:00.000Z',
    updatedAt: '2023-10-26T10:00:00.000Z',
    paymentMethod: 'link',
  },
  {
    id: '2',
    amount: 200,
    card: 'mastercard',
    installments: 3,
    createdAt: '2023-10-27T11:00:00.000Z',
    updatedAt: '2023-10-27T11:00:00.000Z',
    paymentMethod: 'qr',
  },
  {
    id: '3',
    amount: 300,
    card: 'visa',
    installments: 1,
    createdAt: '2023-10-28T12:00:00.000Z',
    updatedAt: '2023-10-28T12:00:00.000Z',
    paymentMethod: 'mpos',
  },
]

const NOW = new Date('2023-10-28T13:00:00.000Z')

const baseFilters: TransactionFilters = {
  period: 'monthly',
  selectedCards: [],
  selectedMethods: [],
  selectedInstallments: [],
  selectedDates: undefined,
  amountRange: [0, 2000],
}

describe('transactionUtils', () => {
  describe('sumTransactions', () => {
    it('should return 0 for empty array', () => {
      expect(sumTransactions([])).toBe(0)
    })

    it('should sum all transaction amounts', () => {
      expect(sumTransactions(mockTransactions)).toBe(600)
    })
  })

  describe('uniqueInstallments', () => {
    it('should return empty array for empty input', () => {
      expect(uniqueInstallments([])).toEqual([])
    })

    it('should return unique installment values', () => {
      expect(uniqueInstallments(mockTransactions)).toEqual([1, 3])
    })
  })

  describe('formatCurrency', () => {
    it('should format ARS currency correctly', () => {
      expect(formatCurrency(1234.56)).toBe('$ 1.234,56')
    })

    it('should format USD currency correctly', () => {
      expect(formatCurrency(1234.56, 'en-US', 'USD')).toBe('$1,234.56')
    })
  })

  describe('splitCurrencyParts', () => {
    it('should split currency with decimals', () => {
      expect(splitCurrencyParts('1.234,56')).toEqual(['1.234', '56'])
    })

    it('should handle currency without decimals', () => {
      expect(splitCurrencyParts('1.234')).toEqual(['1.234', '00'])
    })

    it('should handle currency with spaces', () => {
      expect(splitCurrencyParts('1.234,56')).toEqual(['1.234', '56'])
    })
  })

  describe('formatTransactionPeriod', () => {
    const mockDate = new Date('2023-10-27T12:00:00.000Z')

    it('should format daily period', () => {
      expect(formatTransactionPeriod('daily', mockDate)).toBe('27/10/2023')
    })

    it('should format weekly period', () => {
      expect(formatTransactionPeriod('weekly', mockDate)).toBe(
        '22/10/2023 — 27/10/2023'
      )
    })

    it('should format monthly period', () => {
      expect(formatTransactionPeriod('monthly', mockDate)).toBe(
        '01/10/2023 — 27/10/2023'
      )
    })
  })

  describe('selectedDatesString', () => {
    it('should return null for undefined dates', () => {
      expect(selectedDatesString(undefined)).toBeNull()
    })

    it('should format single date', () => {
      const date = new Date('2023-10-28T00:00:00.000Z')
      expect(selectedDatesString({ from: date, to: undefined })).toBe(
        '27/10/2023'
      )
    })

    it('should format date range', () => {
      const from = new Date('2023-10-28')
      const to = new Date('2023-10-29')
      expect(selectedDatesString({ from, to })).toBe('27/10/2023 — 28/10/2023')
    })
  })

  describe('filterTransactions', () => {
    it('filters by period only (daily)', () => {
      const filters: TransactionFilters = { ...baseFilters, period: 'daily' }
      const result = filterTransactions(mockTransactions, filters, NOW)
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('3') // only Oct 28 matches "daily"
    })

    it('filters by card type', () => {
      const filters: TransactionFilters = {
        ...baseFilters,
        selectedCards: ['visa'],
      }
      const result = filterTransactions(mockTransactions, filters, NOW)
      expect(result).toHaveLength(2)
      expect(result.map((t) => t.id).sort()).toEqual(['1', '3'])
    })

    it('filters by payment method', () => {
      const filters: TransactionFilters = {
        ...baseFilters,
        selectedMethods: ['link'],
      }
      const result = filterTransactions(mockTransactions, filters, NOW)
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('1')
    })

    it('filters by installments', () => {
      const filters: TransactionFilters = {
        ...baseFilters,
        selectedInstallments: [3],
      }
      const result = filterTransactions(mockTransactions, filters, NOW)
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('2')
    })

    it('filters by date range (overrides period)', () => {
      const filters: TransactionFilters = {
        ...baseFilters,
        selectedDates: {
          from: new Date('2023-10-27T00:00:00Z'),
          to: new Date('2023-10-27T00:00:00Z'),
        },
      }
      const result = filterTransactions(mockTransactions, filters, NOW)
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('1')
    })

    it('filters by amount range', () => {
      const filters: TransactionFilters = {
        ...baseFilters,
        amountRange: [150, 250],
      }
      const result = filterTransactions(mockTransactions, filters, NOW)
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('2')
    })

    it('combines multiple filters', () => {
      const filters: TransactionFilters = {
        ...baseFilters,
        period: 'monthly', // still October because NOW
        selectedCards: ['visa'],
        selectedMethods: ['link'],
        selectedInstallments: [1],
        amountRange: [0, 150],
      }
      const result = filterTransactions(mockTransactions, filters, NOW)
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('1')
    })

    it('returns all transactions when no filters are active', () => {
      const result = filterTransactions(mockTransactions, baseFilters, NOW)
      expect(result).toHaveLength(3) // all in October
    })
  })
})
