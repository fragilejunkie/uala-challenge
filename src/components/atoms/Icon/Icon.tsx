import Image from 'next/image'
import { IconProps } from './Icon.types'

export default function Icon({ iconName, className }: IconProps) {
  const src = `/${iconName}-icon.svg`
  const alt = `${iconName} icon`
  return (
    <Image src={src} alt={alt} width={0} height={0} className={className} />
  )
}
