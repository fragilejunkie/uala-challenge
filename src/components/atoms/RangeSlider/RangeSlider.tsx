'use client'

import * as Slider from '@radix-ui/react-slider'
import styles from './RangeSlider.module.scss'
import { useEffect, useState } from 'react'

export interface RangeSliderProps {
  value: [number, number]
  onValueChange: (range: [number, number]) => void
}

export default function RangeSlider({
  value,
  onValueChange,
}: RangeSliderProps) {
  const [inputValues, setInputValues] = useState<[string, string]>([
    String(value[0]),
    String(value[1]),
  ])

  useEffect(() => {
    setInputValues([String(value[0]), String(value[1])])
  }, [value])

  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement>,
    idx: 0 | 1
  ) {
    const txt = e.target.value
    setInputValues((prev) => {
      const copy: [string, string] = [...prev]
      copy[idx] = txt
      return copy
    })
  }

  function commitInput(idx: 0 | 1) {
    const num = Number(inputValues[idx])
    if (Number.isFinite(num)) {
      const clamped = Math.max(0, Math.min(2000, num))
      const next: [number, number] = [...value]
      next[idx] = clamped
      if (next[0] > next[1]) next[idx === 0 ? 1 : 0] = clamped
      onValueChange(next)
    } else {
      setInputValues([String(value[0]), String(value[1])])
    }
  }

  return (
    <form className={styles.sliderForm}>
      <Slider.Root
        className={styles.Root}
        value={value}
        min={0}
        max={2000}
        step={1}
        minStepsBetweenThumbs={1}
        onValueChange={onValueChange}
      >
        <Slider.Track className={styles.Track}>
          <Slider.Range className={styles.Range} />
        </Slider.Track>
        <Slider.Thumb className={styles.Thumb} aria-label="Rango mínimo" />
        <Slider.Thumb className={styles.Thumb} aria-label="Rango máximo" />
      </Slider.Root>

      <div className={styles.sliderLegends}>
        <div className={styles.sliderLegend}>
          <span>Monto Mínimo</span>
          <div className={styles.sliderInput}>
            <span>$</span>
            <input
              type="number"
              value={inputValues[0]}
              onChange={(e) => handleInputChange(e, 0)}
              onBlur={() => commitInput(0)}
              onKeyDown={(e) => e.key === 'Enter' && commitInput(0)}
            />
          </div>
        </div>

        <div className={styles.sliderLegend}>
          <span>Monto Máximo</span>
          <div className={styles.sliderInput}>
            <span>$</span>
            <input
              type="number"
              value={inputValues[1]}
              onChange={(e) => handleInputChange(e, 1)}
              onBlur={() => commitInput(1)}
              onKeyDown={(e) => e.key === 'Enter' && commitInput(1)}
            />
          </div>
        </div>
      </div>
    </form>
  )
}
