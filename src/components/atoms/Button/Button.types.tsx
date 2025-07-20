import { MouseEvent } from 'react'
import { Icons } from '../Icon/Icon.types'

type ButtonType = 'primary' | 'secondary' | 'tertiary'

export interface ButtonProps {
  type: ButtonType
  text?: string
  icon?: Icons
  className?: string
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void
  disabled?: boolean
  hasBorder?: boolean
  isSmall?: boolean
  noPadding?: boolean
}
