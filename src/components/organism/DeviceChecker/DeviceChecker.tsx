'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useScrollLock } from '@/lib/hooks/useScrollLock'
import styles from './DeviceChecker.module.scss'

export default function DeviceChecker() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 1024)
    }

    checkMobile() // Initial check
    window.addEventListener('resize', checkMobile)

    return () => {
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  useScrollLock(isMobile === false)

  if (isMobile === null) {
    return null
  }

  return (
    <>
      {!isMobile && (
        <div className={styles.deviceCheckerContainer}>
          <Image
            src="/logo-uala.png"
            alt="Logo Ualá"
            width={455 / 3}
            height={105 / 3}
          />
          <h2>Esta experiencia está solo disponible en mobile</h2>
        </div>
      )}
    </>
  )
}
