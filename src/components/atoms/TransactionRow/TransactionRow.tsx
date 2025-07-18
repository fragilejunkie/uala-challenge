import { useMemo } from 'react'
import styles from './TransactionRow.module.scss'
import { TransactionRowProps } from './TransactionRow.types'
import Icon from '../Icon/Icon'

export default function TransactionRow({
  transaction,
  metadata,
}: TransactionRowProps) {
  const paymentLabelMap = useMemo(
    () =>
      Object.fromEntries(
        metadata.paymentMethods.map(({ value, label }) => [value, label])
      ),
    [metadata.paymentMethods]
  )

  const cardsLabelMap = useMemo(
    () =>
      Object.fromEntries(
        metadata.cards.map(({ value, label }) => [value, label])
      ),
    [metadata.cards]
  )

  return (
    <li key={transaction.id} className={styles.transactionRow}>
      <div className={styles.transactionRowType}>
        <Icon iconName="store" className={styles.transactionRowIcon} />
      </div>
      <div className={styles.transactionRowDetail}>
        <div className={styles.transactionDetailRow}>
          <span>
            {paymentLabelMap[transaction.paymentMethod] ??
              transaction.paymentMethod}
          </span>
          <span className={styles.transactionDetailRowAmount}>
            +${transaction.amount}
          </span>
        </div>
        <div className={styles.transactionDetailRow}>
          <span>{cardsLabelMap[transaction.card] ?? transaction.card}</span>
          <span>
            {new Date(transaction.updatedAt).toLocaleDateString('es-AR')}
          </span>
        </div>
      </div>
    </li>
  )
}
