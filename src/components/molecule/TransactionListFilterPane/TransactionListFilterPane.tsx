'use client'

import Button from '@/components/atoms/Button/Button'
import styles from './TransactionListFilterPane.module.scss'
import FilterRow from '../FilterRow/FilterRow'
import Tag from '@/components/atoms/Tag/Tag'
import { useMemo, useState } from 'react'
import { useTransactionFilters } from '@/lib/context/TransactionsFilterContext'
import { CardType, Metadata, PaymentMethodType } from '@/types/transaction'
import { Calendar } from '@/components/atoms/Calendar/Calendar'
import RangeSlider from '@/components/atoms/RangeSlider/RangeSlider'

interface TransactionListFilterPaneProps {
  onToggle: () => void
  isActive: boolean
  metadata: Metadata
}

type RowKey = 'amount' | 'date' | 'method' | 'card' | 'installments'

export default function TransactionListFilterPane({
  onToggle,
  isActive,
  metadata,
}: TransactionListFilterPaneProps) {
  const [openRows, setOpenRows] = useState({
    amount: false,
    date: false,
    method: false,
    card: false,
    installments: false,
  })

  const {
    selectedCards,
    toggleCard,
    resetCards,
    selectedMethods,
    resetMethods,
    toggleMethod,
    selectedInstallments,
    resetInstallments,
    toggleInstallment,
    installmentOptions,
    selectedDates,
    setDates,
    resetDates,
    amountRange,
    setAmountRange,
    resetAmountRange,
  } = useTransactionFilters()

  const cardTagOptions = useMemo(() => {
    const base = metadata.cards.map(({ value, label }) => ({
      value,
      label,
    }))
    return [{ value: 'all', label: 'Todas' }, ...base]
  }, [metadata.cards])

  const methodTagOptions = useMemo(() => {
    const base = metadata.paymentMethods.map(({ value, label }) => ({
      value,
      label,
    }))
    return [{ value: 'all', label: 'Todos' }, ...base]
  }, [metadata.paymentMethods])

  const installmentTagOptions = useMemo(() => {
    const sorted = [...installmentOptions].sort((a, b) => a - b)

    const tags = sorted.map((n) => ({
      value: n,
      label: `${n} cuota${n > 1 ? 's' : ''}`,
    }))

    return [{ value: 'all', label: 'Todas' }, ...tags]
  }, [installmentOptions])

  const hasFilters =
    selectedCards.length > 0 ||
    selectedMethods.length > 0 ||
    selectedInstallments.length > 0 ||
    selectedDates !== undefined ||
    amountRange[0] !== 0 ||
    amountRange[1] !== 2000

  const resetMap: Record<RowKey, () => void> = {
    amount: resetAmountRange,
    date: resetDates,
    method: resetMethods,
    card: resetCards,
    installments: resetInstallments,
  }

  function toggleRow(rowKey: keyof typeof openRows) {
    setOpenRows((prev) => {
      const isClosing = prev[rowKey]
      const next = { ...prev, [rowKey]: !isClosing }
      if (isClosing) {
        setTimeout(() => resetMap[rowKey](), 305)
      }
      return next
    })
  }

  function resetRows() {
    setOpenRows({
      amount: false,
      date: false,
      method: false,
      card: false,
      installments: false,
    })
  }

  function resetState() {
    resetRows()
    resetInstallments()
    resetCards()
    resetMethods()
    resetDates()
    resetAmountRange()
  }

  function handleToggle() {
    onToggle()
    if (!hasFilters) resetRows()
  }

  return (
    <div
      className={`${styles.transactionListFilterPane} ${isActive && styles.transactionListFilterPaneActive}`}
    >
      <Button
        type="tertiary"
        icon="back"
        text="Filtros"
        className={styles.backButton}
        onClick={handleToggle}
      />
      <section className={styles.transactionFilterPaneList}>
        <div className={styles.transactionFilterPaneListHeader}>
          <h3 className={styles.transactionFilterPaneListHeaderTitle}>
            Todos los filtros
          </h3>
          <Button
            type="primary"
            text="Limpiar"
            disabled={!hasFilters}
            onClick={resetState}
            className={styles.clearButton}
            noPadding
          />
        </div>
        <FilterRow
          text="Fecha"
          iconName="calendar"
          state={openRows.date}
          onToggle={() => toggleRow('date')}
        />
        <div
          className={styles.filterContainer}
          data-isactive={openRows.date}
          data-ispicker
        >
          <Calendar
            selectedDate={selectedDates}
            setSelectedDate={setDates}
            footer={
              <div className={styles.CalendarFooter}>
                <Button
                  type="primary"
                  text="Borrar"
                  onClick={resetDates}
                  hasBorder
                  isSmall
                  disabled={!selectedDates}
                />
              </div>
            }
          />
        </div>
        <FilterRow
          text="Tarjeta"
          iconName="card"
          state={openRows.card}
          onToggle={() => toggleRow('card')}
        />
        <div className={styles.filterContainer} data-isactive={openRows.card}>
          <ul className={styles.cardContainer}>
            {cardTagOptions.map((opt) => {
              const isAllTag = opt.value === 'all'

              const selected = isAllTag
                ? selectedCards.length === 0 // “Todas” is active when array empty
                : selectedCards.includes(opt.value as CardType) // card tag active when included

              const handleSelect = () => {
                if (isAllTag) {
                  resetCards() // clear selection
                } else {
                  toggleCard(opt.value as CardType) // add/remove this card
                }
              }

              return (
                <li key={opt.value}>
                  <Tag
                    text={opt.label}
                    value={opt.value}
                    selected={selected}
                    onSelect={handleSelect}
                  />
                </li>
              )
            })}
          </ul>
        </div>
        <FilterRow
          text="Cuotas"
          iconName="installments"
          state={openRows.installments}
          onToggle={() => toggleRow('installments')}
        />
        <div
          className={styles.filterContainer}
          data-isactive={openRows.installments}
        >
          <ul className={styles.installmentContainer}>
            {installmentTagOptions.map((opt) => {
              const isAllTag = opt.value === 'all'

              const selected = isAllTag
                ? selectedInstallments.length === 0
                : selectedInstallments.includes(opt.value as number)

              const handleSelect = () => {
                if (isAllTag) {
                  resetInstallments()
                } else {
                  toggleInstallment(opt.value as number)
                }
              }

              return (
                <li key={opt.value}>
                  <Tag
                    text={opt.label}
                    value={String(opt.value)}
                    selected={selected}
                    onSelect={handleSelect}
                  />
                </li>
              )
            })}
          </ul>
        </div>
        <FilterRow
          text="Monto"
          iconName="amount"
          state={openRows.amount}
          onToggle={() => toggleRow('amount')}
        />
        <div
          className={styles.filterContainer}
          data-isactive={openRows.amount}
          data-isrange
        >
          <RangeSlider
            value={amountRange} // controlled
            onValueChange={setAmountRange} // thumbs → context
          />
        </div>
        <FilterRow
          text="Métodos de cobro"
          iconName="method"
          state={openRows.method}
          onToggle={() => toggleRow('method')}
        />
        <div className={styles.filterContainer} data-isactive={openRows.method}>
          <ul className={styles.methodContainer}>
            {methodTagOptions.map((opt) => {
              const isAllTag = opt.value === 'all'

              const selected = isAllTag
                ? selectedMethods.length === 0 // “Todas” is active when array empty
                : selectedMethods.includes(opt.value as PaymentMethodType) // card tag active when included

              const handleSelect = () => {
                if (isAllTag) {
                  resetMethods() // clear selection
                } else {
                  toggleMethod(opt.value as PaymentMethodType) // add/remove this card
                }
              }

              return (
                <li key={opt.value}>
                  <Tag
                    text={opt.label}
                    value={opt.value}
                    selected={selected}
                    onSelect={handleSelect}
                  />
                </li>
              )
            })}
          </ul>
        </div>
      </section>
      <Button
        type="secondary"
        text="Aplicar Filtros"
        className={styles.transactionFilterPaneApplyButton}
        onClick={onToggle}
        disabled={!hasFilters}
      />
    </div>
  )
}
