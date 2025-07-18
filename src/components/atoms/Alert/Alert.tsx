import styles from './Alert.module.scss'
import { AlertProps } from './Alert.types'

export default function Alert({ type, message }: AlertProps) {
  return (
    <div className={`${styles.alert} ${styles[type]}`}>
      <p>{message}</p>
    </div>
  )
}
