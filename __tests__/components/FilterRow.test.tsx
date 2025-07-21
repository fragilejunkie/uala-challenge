/**
 * @jest-environment jsdom
 */

jest.mock('@/components/atoms/Icon/Icon', () => ({
  __esModule: true,
  default: ({ iconName }: { iconName: string }) => (
    <span data-testid={`icon-${iconName}`} />
  ),
}))

jest.mock('@/components/atoms/Switch/Switch', () => ({
  __esModule: true,
  default: ({
    state,
    onChange,
  }: {
    state: boolean
    onChange: (v: boolean) => void
  }) => (
    <button data-testid="mock-switch" onClick={() => onChange(!state)}>
      {state ? 'on' : 'off'}
    </button>
  ),
}))

jest.mock('./FilterRow.module.scss', () => ({}))

import FilterRow from '@/components/molecule/FilterRow/FilterRow'
import { render, screen, fireEvent } from '@testing-library/react'

describe('<FilterRow>', () => {
  it('renders text, icon and calls onToggle with the inverted state', () => {
    const handleToggle = jest.fn()

    render(
      <FilterRow
        text="Tarjeta"
        iconName="card"
        state={false}
        onToggle={handleToggle}
      />
    )

    /* label and icon present */
    expect(screen.getByText('Tarjeta')).toBeInTheDocument()
    expect(screen.getByTestId('icon-card')).toBeInTheDocument()

    /* click switch */
    fireEvent.click(screen.getByTestId('mock-switch'))

    /* onToggle called with true */
    expect(handleToggle).toHaveBeenCalledTimes(1)
    expect(handleToggle).toHaveBeenCalledWith(true)
  })
})
