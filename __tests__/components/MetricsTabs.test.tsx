import MetricsTabs from '@/components/molecule/MetricsTabs/MetricsTabs'
import styles from '@/components/molecule/MetricsTabs/MetricsTabs.module.scss'
import { render, screen, fireEvent } from '@testing-library/react'

const mockSetPeriod = jest.fn()

jest.mock('@/lib/context/TransactionsFilterContext', () => ({
  useTransactionFilters: () => ({
    setPeriod: mockSetPeriod,
  }),
}))

describe('MetricsTabs', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders three buttons with texts "Diario", "Semanal", and "Mensual"', () => {
    render(<MetricsTabs />)
    // Verify buttons by their text
    expect(screen.getByRole('button', { name: /diario/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /semanal/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /mensual/i })).toBeInTheDocument()
  })

  it('defaults to "Semanal" as the active tab', () => {
    render(<MetricsTabs />)
    const diarioBtn = screen.getByRole('button', { name: /diario/i })
    const semanalBtn = screen.getByRole('button', { name: /semanal/i })
    const mensualBtn = screen.getByRole('button', { name: /mensual/i })

    // The "Semanal" button should have the active class
    expect(semanalBtn).toHaveClass(styles.tabActive)
    // The other buttons should not have the active class
    expect(diarioBtn).not.toHaveClass(styles.tabActive)
    expect(mensualBtn).not.toHaveClass(styles.tabActive)
  })

  it('updates active tab and calls setPeriod when "Diario" is clicked', () => {
    render(<MetricsTabs />)
    const diarioBtn = screen.getByRole('button', { name: /diario/i })
    const semanalBtn = screen.getByRole('button', { name: /semanal/i })

    // Click on "Diario"
    fireEvent.click(diarioBtn)
    // Expect context setPeriod to have been called with 'daily'
    expect(mockSetPeriod).toHaveBeenCalledWith('daily')
    // "Diario" button should now have the active class, "Semanal" should not
    expect(diarioBtn).toHaveClass(styles.tabActive)
    expect(semanalBtn).not.toHaveClass(styles.tabActive)
  })

  it('updates active tab and calls setPeriod when "Mensual" is clicked', () => {
    render(<MetricsTabs />)
    const mensualBtn = screen.getByRole('button', { name: /mensual/i })
    const semanalBtn = screen.getByRole('button', { name: /semanal/i })

    // Click on "Mensual"
    fireEvent.click(mensualBtn)
    // Expect context setPeriod to have been called with 'monthly'
    expect(mockSetPeriod).toHaveBeenCalledWith('monthly')
    // "Mensual" button should now have the active class, "Semanal" should not
    expect(mensualBtn).toHaveClass(styles.tabActive)
    expect(semanalBtn).not.toHaveClass(styles.tabActive)
  })
})
