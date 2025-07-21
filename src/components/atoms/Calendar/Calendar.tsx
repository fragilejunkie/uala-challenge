import { DateRange, DayPicker } from 'react-day-picker'
import styles from './Calendar.module.scss'
import { ReactNode } from 'react'
import { es } from 'react-day-picker/locale'

export interface CalendarProps {
  selectedDate: DateRange | undefined
  setSelectedDate: (range: DateRange | undefined) => void
  footer: ReactNode | string
  label: string
}

export function Calendar({
  selectedDate,
  setSelectedDate,
  label,
  footer,
}: CalendarProps) {
  return (
    <DayPicker
      aria-label={label}
      animate
      mode="range"
      selected={selectedDate}
      onSelect={setSelectedDate}
      classNames={styles}
      navLayout="around"
      startMonth={new Date(2024, 12)}
      disabled={{ after: new Date() }}
      locale={es}
      footer={<div className={styles.calendarFooter}>{footer}</div>}
    />
  )
}
