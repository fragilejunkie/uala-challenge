export type Icons = 'back' | 'close' | 'calendar' | 'installments' | 'download' | 'filter' | 'method' | 'menu' | 'amount' | 'metricas' | 'store' | 'card'

export interface IconProps {
    iconName: Icons;
    className?: string;
}