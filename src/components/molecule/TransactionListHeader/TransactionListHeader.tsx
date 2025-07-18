'use client'

import Button from '@/components/atoms/Button/Button'
import styles from './TransactionListHeader.module.scss'

interface TransactionListHeaderProps {
  onFilterToggle: () => void
}

export default function TransactionListHeader({
  onFilterToggle,
}: TransactionListHeaderProps) {
  return (
    <div className={styles.transactionsHeader}>
      <h2 className={styles.transactionsTitle}>Historial de transacciones</h2>
      <Button icon="filter" type="primary" onClick={onFilterToggle} />
      <Button icon="download" type="primary" />
    </div>
  )
}
