import { DateRange } from 'react-day-picker'
import styles from './MetricsCustomTitle.module.scss'

interface MetricsCustomTitleProps {
  selectedDates: DateRange | undefined
}

export default function MetricsCustomTitle({
  selectedDates,
}: MetricsCustomTitleProps) {
  return (
    <span className={styles.metricsCustomTitle}>
      Total del{' '}
      {selectedDates?.from &&
        selectedDates.from.toLocaleDateString('es-AR', {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
        })}
      {selectedDates?.from &&
        selectedDates?.to &&
        selectedDates.from.getTime() !== selectedDates.to.getTime() && (
          <>
            {' '}
            al{' '}
            {selectedDates.to.toLocaleDateString('es-AR', {
              year: 'numeric',
              month: 'numeric',
              day: 'numeric',
            })}
          </>
        )}
    </span>
  )
}
