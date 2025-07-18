'use client'

import styles from './Switch.module.scss'
import { MouseEvent } from 'react'

interface SwitchProps {
  state: boolean
  onChange: (checked: boolean) => void
}

export default function Switch({ state, onChange }: SwitchProps) {
  function handleClick(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    onChange(!state)
  }

  return (
    <button
      className={styles.switch}
      data-checked={state}
      aria-pressed={state}
      onClick={handleClick}
    >
      <span className={styles.switchIndicator}></span>
    </button>
  )
}
