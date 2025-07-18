'use client'

import { formatCurrency, splitCurrencyParts } from '@/lib/transactionUtils'
import styles from './MetricsContainer.module.scss'
import Button from '@/components/atoms/Button/Button'
import MetricsTabs from '@/components/molecule/MetricsTabs/MetricsTabs'
import { useTransactionFilters } from '@/lib/context/TransactionsFilterContext'
import MetricsCustomTitle from '@/components/atoms/MetricsCustomTitle/MetricsCustomTitle'

export default function MetricsContainer() {
  const { total, selectedDates } = useTransactionFilters()
  const formattedCurrency = formatCurrency(total)
  const [integerPart, decimalPart] = splitCurrencyParts(formattedCurrency)

  return (
    <div className={styles.metrics}>
      <h2 className={styles.metricsTitle}>Tus cobros</h2>
      {selectedDates ? (
        <MetricsCustomTitle selectedDates={selectedDates} />
      ) : (
        <MetricsTabs />
      )}
      <div className={styles.metricsAmount}>
        <h3 className={styles.metricsAmountLargeText}>+{integerPart}</h3>
        <span className={styles.metricsAmountSmallText}>,{decimalPart}</span>
      </div>
      <Button type="primary" icon="metricas" text="Ver Métricas" />
    </div>
  )
}
