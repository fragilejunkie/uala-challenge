import Image from 'next/image'
import { Icons, IconProps } from './Icon.types'

const validIcons: Icons[] = [
  'back',
  'close',
  'calendar',
  'installments',
  'download',
  'filter',
  'method',
  'menu',
  'amount',
  'metricas',
  'store',
  'card',
]

export default function Icon({ iconName, className }: IconProps) {
  const src = `/${iconName}-icon.svg`
  const alt = `${iconName} icon`

  if (!validIcons.includes(iconName)) {
    throw new Error(
      `Invalid iconName: ${iconName}; please check the Icon type for available icons`
    )
  }
  return (
    <Image src={src} alt={alt} width={0} height={0} className={className} />
  )
}
