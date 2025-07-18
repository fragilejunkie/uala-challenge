'use client'

import styles from './TransactionList.module.scss'
import { useEffect, useState } from 'react'
import { TransactionListProps } from './TransactionList.types'
import { useTransactionFilters } from '@/lib/context/TransactionsFilterContext'
import TransactionListHeader from '@/components/molecule/TransactionListHeader/TransactionListHeader'
import TransactionListFilterPane from '@/components/molecule/TransactionListFilterPane/TransactionListFilterPane'
import NoResults from '@/components/atoms/NoResults/NoResults'
import TransactionRow from '@/components/atoms/TransactionRow/TransactionRow'

export default function TransactionList({ metadata }: TransactionListProps) {
  const [showFilters, setShowFilters] = useState(false)
  const { baseTransactions } = useTransactionFilters()

  function toggleFilters() {
    setShowFilters((prev) => !prev)
  }

  useEffect(() => {
    if (showFilters) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }, [showFilters])

  return (
    <>
      <div className={styles.transactions}>
        <TransactionListHeader onFilterToggle={toggleFilters} />
        <ul className={styles.transactionList}>
          {baseTransactions.length > 0 ? (
            baseTransactions.map((transaction) => (
              <TransactionRow
                transaction={transaction}
                metadata={metadata}
                key={transaction.id}
              />
            ))
          ) : (
            <NoResults />
          )}
        </ul>
      </div>
      <TransactionListFilterPane
        onToggle={toggleFilters}
        isActive={showFilters}
        metadata={metadata}
      />
    </>
  )
}
