'use client'

import Button from '@/components/atoms/Button/Button'
import Image from 'next/image'
import styles from './Header.module.scss'

export default function Header() {
  return (
    <header className={styles.header}>
      <Button icon="menu" type="primary" className={styles.menuButton} />
      <Image src="./logo-uala.svg" alt="Logo Ualá" width="61" height="24" />
      <Image
        src="./header-slant.svg"
        alt=""
        width="32"
        height="32"
        className={styles.headerSlant}
      />
    </header>
  )
}
