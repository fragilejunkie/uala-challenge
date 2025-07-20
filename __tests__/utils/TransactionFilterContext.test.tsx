/**
 * @jest-environment jsdom
 */

import { renderHook, act } from '@testing-library/react'
import { Transaction } from '@/types/transaction'
import {
  TransactionFilterProvider,
  useTransactionFilters,
} from '@/lib/context/TransactionsFilterContext'

/* ------------------------------------------------------------------ */
/* 1.  Minimal mock data                                               */
/* ------------------------------------------------------------------ */
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

/* Helper wrapper so renderHook gets the provider */
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <TransactionFilterProvider transactions={mockTransactions}>
    {children}
  </TransactionFilterProvider>
)

describe('TransactionFilterProvider', () => {
  it('computes visibleTransactions, total and reacts to toggleCard', () => {
    const { result } = renderHook(() => useTransactionFilters(), { wrapper })

    /* -------------------------------------------------------------- */
    /*  initial assertions (period = weekly, no filters)              */
    /* -------------------------------------------------------------- */
    expect(result.current.baseTransactions).toHaveLength(3)
    expect(result.current.visibleTransactions).toHaveLength(3)
    expect(result.current.total).toBe(600)

    /* -------------------------------------------------------------- */
    /*  apply card filter (visa) — should reduce visible list to 2    */
    /* -------------------------------------------------------------- */
    act(() => {
      result.current.toggleCard('visa')
    })

    expect(result.current.selectedCards).toEqual(['visa'])
    expect(result.current.visibleTransactions).toHaveLength(2)
    expect(result.current.visibleTransactions.map((t) => t.id).sort()).toEqual([
      '1',
      '3',
    ])
    expect(result.current.total).toBe(400)

    /* -------------------------------------------------------------- */
    /*  clear card filter                                             */
    /* -------------------------------------------------------------- */
    act(() => {
      result.current.resetCards()
    })

    expect(result.current.selectedCards).toEqual([])
    expect(result.current.visibleTransactions).toHaveLength(3)
    expect(result.current.total).toBe(600)
  })
})
