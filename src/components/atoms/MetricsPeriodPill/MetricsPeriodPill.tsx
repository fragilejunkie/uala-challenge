import styles from './MetricsPeriodPill.module.scss'
import { useTransactionFilters } from '@/lib/context/TransactionsFilterContext'
import {
  formatTransactionPeriod,
  selectedDatesString,
} from '@/lib/transactionUtils'

export default function MetricsPeriodPill() {
  const { selectedDates, period } = useTransactionFilters()
  const periodPill = formatTransactionPeriod(period)
  const selectedString = selectedDatesString(selectedDates)

  return (
    <div className={styles.metricsPeriodPill}>
      <span className={styles.metricsPeriodPillText}>
        {selectedDates ? selectedString : periodPill}
      </span>
    </div>
  )
}
