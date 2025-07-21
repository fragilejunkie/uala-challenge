import Button from '@/components/atoms/Button/Button'
import { render, screen, fireEvent } from '@testing-library/react'

/**
 * @jest-environment jsdom
 */

// Mock Icon to avoid SVG rendering
jest.mock('@/components/atoms/Icon/Icon', () => ({
  __esModule: true,
  default: ({ iconName }: { iconName: string }) => (
    <span data-testid="icon">{iconName}</span>
  ),
}))

describe('Button', () => {
  it('renders a button with text', () => {
    render(<Button type="primary" text="Click me" />)
    const btn = screen.getByRole('button')
    expect(btn).toBeInTheDocument()
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('renders an icon when icon prop is provided', () => {
    render(<Button type="primary" icon="metricas" />)
    expect(screen.getByTestId('icon')).toHaveTextContent('metricas')
  })

  it('renders both icon and text', () => {
    render(<Button type="primary" icon="metricas" text="Metrics" />)
    expect(screen.getByTestId('icon')).toBeInTheDocument()
    expect(screen.getByText('Metrics')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<Button type="primary" text="Custom" className="custom-class" />)
    const btn = screen.getByRole('button')
    expect(btn.className).toMatch(/custom-class/)
  })

  it('applies border, small, and noPadding classes', () => {
    render(<Button type="primary" text="Styled" hasBorder isSmall noPadding />)
    const btn = screen.getByRole('button')
    expect(btn.className).toMatch(/border/)
    expect(btn.className).toMatch(/small/)
    expect(btn.className).toMatch(/noPadding/)
  })

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn()
    render(<Button type="primary" text="Click" onClick={handleClick} />)
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('sets disabled attribute', () => {
    render(<Button type="primary" text="Disabled" disabled />)
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
