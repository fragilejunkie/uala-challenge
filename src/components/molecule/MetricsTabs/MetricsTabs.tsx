// src/components/molecules/MetricsTabs/MetricsTabs.tsx
'use client'

import { useState } from 'react'
import Button from '@/components/atoms/Button/Button'
import styles from './MetricsTabs.module.scss'
import { TransactionPeriod } from '@/types/transaction'
import { useTransactionFilters } from '@/lib/context/TransactionsFilterContext'

export default function MetricsTabs() {
  const { setPeriod } = useTransactionFilters()
  const [activePeriod, setActivePeriod] = useState<TransactionPeriod>('weekly')

  const handleClick = (period: TransactionPeriod) => () => {
    setActivePeriod(period)
    setPeriod(period)
  }

  return (
    <ul className={styles.metricsTabs}>
      <li className={styles.metricsTab}>
        <Button
          type="tertiary"
          text="Diario"
          onClick={handleClick('daily')}
          className={activePeriod === 'daily' ? styles.tabActive : undefined}
        />
      </li>
      <li className={styles.metricsTab}>
        <Button
          type="tertiary"
          text="Semanal"
          onClick={handleClick('weekly')}
          className={activePeriod === 'weekly' ? styles.tabActive : undefined}
        />
      </li>
      <li className={styles.metricsTab}>
        <Button
          type="tertiary"
          text="Mensual"
          onClick={handleClick('monthly')}
          className={activePeriod === 'monthly' ? styles.tabActive : undefined}
        />
      </li>
    </ul>
  )
}
