import Icon from '../Icon/Icon'
import styles from './Button.module.scss'
import { ButtonProps } from './Button.types'

export default function Button({
  type,
  text,
  icon,
  className,
  onClick,
  disabled,
  hasBorder,
  isSmall,
  noPadding,
}: ButtonProps) {
  return (
    <button
      className={`${styles.button} ${styles[type]} ${className ?? ''} ${hasBorder && styles.border} ${isSmall && styles.small} ${noPadding && styles.noPadding}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && (
        <div className={styles.iconContainer}>
          <Icon iconName={icon} />
        </div>
      )}
      {text && <span className={styles.buttonText}>{text}</span>}
    </button>
  )
}
