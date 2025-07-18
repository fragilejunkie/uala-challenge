'use client'

import styles from './Tag.module.scss'
import Icon from '../Icon/Icon'
import { MouseEvent } from 'react'

interface TagProps {
  text: string
  selected: boolean
  value: string
  onSelect: (value: string) => void
}

export default function Tag({ text, value, selected, onSelect }: TagProps) {
  function handleClick(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    onSelect(value)
  }
  return (
    <button
      type="button"
      className={styles.tag}
      data-isselected={selected}
      onClick={handleClick}
    >
      <span className={styles.tagText}>{text}</span>
      <div className={styles.tagIndicator}>
        <Icon iconName="close" />
      </div>
    </button>
  )
}
