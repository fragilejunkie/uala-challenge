'use client'

import Switch from '@/components/atoms/Switch/Switch'
import styles from './FilterRow.module.scss'
import Icon from '@/components/atoms/Icon/Icon'
import { Icons } from '@/components/atoms/Icon/Icon.types'

interface FilterRowProps {
  text: string
  iconName: Icons
  state: boolean
  onToggle: (state: boolean) => void
}

export default function FilterRow({
  text,
  iconName,
  state,
  onToggle,
}: FilterRowProps) {
  return (
    <div className={styles.filterRow}>
      <div className={styles.iconContainer}>
        <Icon iconName={iconName} />
      </div>
      <span className={styles.filterText}>{text}</span>
      <Switch state={state} onChange={onToggle} />
    </div>
  )
}
