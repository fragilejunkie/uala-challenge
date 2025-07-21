import { render, screen } from '@testing-library/react'
import Icon from '@/components/atoms/Icon/Icon'
import { Icons } from '@/components/atoms/Icon/Icon.types'

describe('<Icon />', () => {
  it('renders correctly with a valid iconName', () => {
    render(<Icon iconName="calendar" />)
    const iconElement = screen.getByRole('img', { name: /calendar/i }) // Assuming the component uses an accessible role
    expect(iconElement).toBeInTheDocument()
  })

  it('throws an error when an invalid iconName is provided', () => {
    const invalidIconName = 'invalid' as Icons
    expect(() => render(<Icon iconName={invalidIconName} />)).toThrow(
      /Invalid iconName/
    )
  })

  it('applies the provided className', () => {
    render(<Icon iconName="filter" className="custom-class" />)
    const iconElement = screen.getByRole('img', { name: /filter/i })
    expect(iconElement).toHaveClass('custom-class')
  })
})
