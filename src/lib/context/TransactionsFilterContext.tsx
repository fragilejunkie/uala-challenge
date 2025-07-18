'use client'

import { createContext, useContext, useState, useMemo, ReactNode } from 'react'
import {
  TransactionPeriod,
  Transaction,
  CardType,
  PaymentMethodType,
} from '@/types/transaction'
import {
  filterTransactions,
  sumTransactions,
  uniqueInstallments,
} from '@/lib/transactionUtils'
import { DateRange } from 'react-day-picker'

/* ------------------------------------------------------------------ */
/* 1. Context shape                                                    */
/* ------------------------------------------------------------------ */

type CardSelection = CardType[]
type MethodSelection = PaymentMethodType[]

interface TransactionFilterContextValue {
  period: TransactionPeriod
  setPeriod: (period: TransactionPeriod) => void
  baseTransactions: Transaction[]
  visibleTransactions: Transaction[]
  total: number
  selectedCards: CardSelection
  toggleCard: (card: CardType) => void
  resetCards: () => void
  selectedMethods: MethodSelection
  toggleMethod: (method: PaymentMethodType) => void
  resetMethods: () => void
  installmentOptions: number[]
  selectedInstallments: number[]
  toggleInstallment: (installment: number) => void
  resetInstallments: () => void
  selectedDates: DateRange | undefined
  setDates: (range: DateRange | undefined) => void
  resetDates: () => void
  amountRange: [number, number]
  setAmountRange: (range: [number, number]) => void
  resetAmountRange: () => void
}

/* ------------------------------------------------------------------ */
/* 2. Create context with sensible default (only used outside provider)*/
/* ------------------------------------------------------------------ */
const TransactionFilterContext = createContext<
  TransactionFilterContextValue | undefined
>(undefined)

/* ------------------------------------------------------------------ */
/* 3. Provider                                                         */
/* ------------------------------------------------------------------ */

interface ProviderProps {
  transactions: Transaction[]
  children: ReactNode
}

export function TransactionFilterProvider({
  transactions,
  children,
}: ProviderProps) {
  const defaultAmountRange: [number, number] = [0, 2000]

  const [period, setPeriod] = useState<TransactionPeriod>('weekly') // default to 'daily'
  const [selectedCards, setSelectedCards] = useState<CardSelection>([])
  const [selectedMethods, setSelectedMethods] = useState<MethodSelection>([])
  const [selectedInstallments, setSelectedInstallments] = useState<number[]>([])
  const [selectedDates, setSelectedDates] = useState<DateRange | undefined>(
    undefined
  )
  const [amountRange, setAmountRange] =
    useState<[number, number]>(defaultAmountRange)

  const installmentOptions = uniqueInstallments(transactions)

  function toggleCard(card: CardType) {
    setSelectedCards(
      (prev) =>
        prev.includes(card)
          ? prev.filter((c) => c !== card) // remove
          : [...prev, card] // add
    )
  }

  function resetCards() {
    setSelectedCards([]) // back to "Todas"
  }

  function toggleMethod(method: PaymentMethodType) {
    setSelectedMethods(
      (prev) =>
        prev.includes(method)
          ? prev.filter((m) => m !== method) // remove
          : [...prev, method] // add
    )
  }

  function resetMethods() {
    setSelectedMethods([]) // back to "Todas"
  }

  function toggleInstallment(installment: number) {
    setSelectedInstallments(
      (prev) =>
        prev.includes(installment)
          ? prev.filter((i) => i !== installment) // remove
          : [...prev, installment] // add
    )
  }

  function resetInstallments() {
    setSelectedInstallments([])
  }

  function resetDates() {
    setSelectedDates(undefined)
  }

  function resetAmountRange() {
    setAmountRange(defaultAmountRange)
  }

  const baseTransactions = useMemo(
    () =>
      transactions
        .filter((transaction) => {
          /* 1. past‑only guard */
          const updatedAt = new Date(transaction.updatedAt)
          if (updatedAt > new Date()) return false

          /* 2. card filter */
          if (selectedCards.length && !selectedCards.includes(transaction.card))
            return false

          /* 3. method filter */
          if (
            selectedMethods.length &&
            !selectedMethods.includes(transaction.paymentMethod)
          )
            return false

          /* 4. installments filter */
          if (
            selectedInstallments.length &&
            !selectedInstallments.includes(transaction.installments)
          )
            return false

          /* 5. amount‑range filter */
          const [minAmount, maxAmount] = amountRange // ← new
          if (transaction.amount < minAmount || transaction.amount > maxAmount)
            return false

          /* 6. date‑range filter */
          if (selectedDates && selectedDates.from) {
            const rangeStart = new Date(selectedDates.from)
            rangeStart.setHours(0, 0, 0, 0)

            const rangeEnd = selectedDates.to
              ? new Date(selectedDates.to)
              : new Date()
            rangeEnd.setHours(23, 59, 59, 999)

            if (updatedAt < rangeStart || updatedAt > rangeEnd) return false
          }

          return true
        })
        .sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        ),
    [
      transactions,
      selectedCards,
      selectedMethods,
      selectedInstallments,
      amountRange, // ← dependency added
      selectedDates,
    ]
  )

  const visibleTransactions = useMemo(
    () =>
      filterTransactions(baseTransactions, {
        period,
        selectedCards,
        selectedMethods,
        selectedInstallments,
        amountRange,
        selectedDates, // ← pass through
      }),
    [
      baseTransactions,
      period,
      selectedCards,
      selectedMethods,
      selectedInstallments,
      amountRange,
      selectedDates, // ← dependency
    ]
  )

  const total = useMemo(
    () => sumTransactions(visibleTransactions),
    [visibleTransactions]
  )

  const value: TransactionFilterContextValue = {
    period,
    setPeriod,
    selectedCards,
    toggleCard,
    resetCards,
    selectedMethods,
    toggleMethod,
    resetMethods,
    visibleTransactions,
    baseTransactions,
    total,
    selectedInstallments,
    toggleInstallment,
    resetInstallments,
    installmentOptions,
    selectedDates,
    setDates: setSelectedDates,
    resetDates,
    amountRange,
    setAmountRange,
    resetAmountRange,
  }

  return (
    <TransactionFilterContext.Provider value={value}>
      {children}
    </TransactionFilterContext.Provider>
  )
}

/* ------------------------------------------------------------------ */
/* 4. Hook for easy consumption                                        */
/* ------------------------------------------------------------------ */
export function useTransactionFilters() {
  const context = useContext(TransactionFilterContext)
  if (!context) {
    throw new Error(
      'useTransactionFilters must be used within a TransactionFilterProvider'
    )
  }
  return context
}
