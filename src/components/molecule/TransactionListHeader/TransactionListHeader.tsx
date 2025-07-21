'use client'

import Button from '@/components/atoms/Button/Button'
import styles from './TransactionListHeader.module.scss'
import { useTransactionFilters } from '@/lib/context/TransactionsFilterContext'
import { exportTransactionsPdf } from '@/lib/exportPdf'
import { Calendar } from '@/components/atoms/Calendar/Calendar'
import { useState } from 'react'
import Icon from '@/components/atoms/Icon/Icon'

interface TransactionListHeaderProps {
  onFilterToggle: () => void
}

export default function TransactionListHeader({
  onFilterToggle,
}: TransactionListHeaderProps) {
  const {
    downloadTransactions,
    resetDownloadDates,
    selectedDownloadDates,
    setSelectedDownloadDates,
  } = useTransactionFilters()

  const [openDownloadCalendar, setDownloadCalendar] = useState(false)

  const fileLabel = selectedDownloadDates
    ? `${selectedDownloadDates.from?.toISOString().slice(0, 10)}_${selectedDownloadDates.to?.toISOString().slice(0, 10)}`
    : 'completo'

  const toggleDownloadCalendar = () => setDownloadCalendar((prev) => !prev)

  const handleDownload = () =>
    exportTransactionsPdf(downloadTransactions, fileLabel)

  return (
    <div className={styles.transactionsHeader}>
      <h2 className={styles.transactionsTitle}>Historial de transacciones</h2>
      <Button icon="filter" type="primary" onClick={onFilterToggle} />
      <Button icon="download" type="primary" onClick={toggleDownloadCalendar} />
      <div
        className={styles.downloadCalendar}
        data-isactive={openDownloadCalendar}
      >
        <div className={styles.downloadHeader}>
          <div className={styles.iconContainer}>
            <Icon iconName="calendar" />
          </div>
          <span className={styles.downloadText}>Elegí un rango de fechas</span>
        </div>

        <Calendar
          label="Select Download Dates"
          selectedDate={selectedDownloadDates}
          setSelectedDate={setSelectedDownloadDates}
          footer={
            <div className={styles.downloadFooter}>
              <Button
                type="primary"
                text="Borrar"
                onClick={resetDownloadDates}
                hasBorder
                isSmall
                disabled={!selectedDownloadDates}
              />
              <Button
                type="secondary"
                text="Descargar"
                onClick={handleDownload}
                hasBorder
                isSmall
                disabled={!selectedDownloadDates}
              />
            </div>
          }
        />
      </div>
    </div>
  )
}
