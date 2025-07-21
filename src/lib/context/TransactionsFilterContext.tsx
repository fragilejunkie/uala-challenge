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
  downloadTransactions: Transaction[]
  selectedDownloadDates: DateRange | undefined
  setSelectedDownloadDates: (range: DateRange | undefined) => void
  resetDownloadDates: () => void
}

const TransactionFilterContext = createContext<
  TransactionFilterContextValue | undefined
>(undefined)

interface ProviderProps {
  transactions: Transaction[]
  children: ReactNode
}

export function TransactionFilterProvider({
  transactions,
  children,
}: ProviderProps) {
  const defaultAmountRange: [number, number] = [0, 2000]

  const [period, setPeriod] = useState<TransactionPeriod>('weekly')
  const [selectedCards, setSelectedCards] = useState<CardSelection>([])
  const [selectedMethods, setSelectedMethods] = useState<MethodSelection>([])
  const [selectedInstallments, setSelectedInstallments] = useState<number[]>([])
  const [selectedDates, setSelectedDates] = useState<DateRange | undefined>(
    undefined
  )
  const [selectedDownloadDates, setSelectedDownloadDates] = useState<
    DateRange | undefined
  >(undefined)

  const [amountRange, setAmountRange] =
    useState<[number, number]>(defaultAmountRange)

  const installmentOptions = uniqueInstallments(transactions)

  function toggleCard(card: CardType) {
    setSelectedCards((prev) =>
      prev.includes(card) ? prev.filter((c) => c !== card) : [...prev, card]
    )
  }

  function resetCards() {
    setSelectedCards([])
  }

  function toggleMethod(method: PaymentMethodType) {
    setSelectedMethods((prev) =>
      prev.includes(method)
        ? prev.filter((m) => m !== method)
        : [...prev, method]
    )
  }

  function resetMethods() {
    setSelectedMethods([])
  }

  function toggleInstallment(installment: number) {
    setSelectedInstallments((prev) =>
      prev.includes(installment)
        ? prev.filter((i) => i !== installment)
        : [...prev, installment]
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

  function resetDownloadDates() {
    setSelectedDownloadDates(undefined)
  }

  const baseTransactions = useMemo(
    () =>
      transactions
        .filter((transaction) => {
          const updatedAt = new Date(transaction.updatedAt)
          if (updatedAt > new Date()) return false

          if (selectedCards.length && !selectedCards.includes(transaction.card))
            return false

          if (
            selectedMethods.length &&
            !selectedMethods.includes(transaction.paymentMethod)
          )
            return false

          if (
            selectedInstallments.length &&
            !selectedInstallments.includes(transaction.installments)
          )
            return false

          const [minAmount, maxAmount] = amountRange
          if (transaction.amount < minAmount || transaction.amount > maxAmount)
            return false

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
      amountRange,
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
        selectedDates,
      }),
    [
      baseTransactions,
      period,
      selectedCards,
      selectedMethods,
      selectedInstallments,
      amountRange,
      selectedDates,
    ]
  )

  const downloadTransactions = useMemo(() => {
    return transactions
      .filter((transaction) => {
        const updatedAt = new Date(transaction.updatedAt)

        if (selectedDownloadDates && selectedDownloadDates.from) {
          const rangeStart = new Date(selectedDownloadDates.from)
          rangeStart.setHours(0, 0, 0, 0)

          const rangeEnd = selectedDownloadDates.to
            ? new Date(selectedDownloadDates.to)
            : new Date()
          rangeEnd.setHours(23, 59, 59, 999)

          if (updatedAt < rangeStart || updatedAt > rangeEnd) return false
        }

        return true
      })
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )
  }, [transactions, selectedDownloadDates])

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
    downloadTransactions,
    setSelectedDownloadDates,
    selectedDownloadDates,
    resetDownloadDates,
  }

  return (
    <TransactionFilterContext.Provider value={value}>
      {children}
    </TransactionFilterContext.Provider>
  )
}

export function useTransactionFilters() {
  const context = useContext(TransactionFilterContext)
  if (!context) {
    throw new Error(
      'useTransactionFilters must be used within a TransactionFilterProvider'
    )
  }
  return context
}
