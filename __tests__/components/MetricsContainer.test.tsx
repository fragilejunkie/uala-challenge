import { render, screen } from '@testing-library/react'
import MetricsContainer from '@/components/organism/MetricsContainer/MetricsContainer'

// Mock the transaction utils to return a fixed formatted currency value.
jest.mock('@/lib/transactionUtils', () => ({
  formatCurrency: (_: number) => `1234.56`,
  splitCurrencyParts: (_: string) => ['1234', '56'],
}))

// Create a mutable mock for useTransactionFilters so we can override its return per test.
const mockUseTransactionFilters = jest.fn()
jest.mock('@/lib/context/TransactionsFilterContext', () => ({
  useTransactionFilters: () => mockUseTransactionFilters(),
}))

// Mock child components
jest.mock('@/components/molecule/MetricsTabs/MetricsTabs', () => ({
  __esModule: true,
  default: () => <div data-testid="metrics-tabs">MetricsTabs</div>,
}))

jest.mock('@/components/atoms/MetricsPeriodPill/MetricsPeriodPill', () => ({
  __esModule: true,
  default: () => <div data-testid="metrics-period-pill">MetricsPeriodPill</div>,
}))

jest.mock('@/components/atoms/Button/Button', () => ({
  __esModule: true,
  default: ({ text }: { text: string }) => (
    <button data-testid="button">{text}</button>
  ),
}))

describe('MetricsContainer', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders header title, period pill, tabs and amount when no dates are selected', () => {
    mockUseTransactionFilters.mockReturnValue({
      total: 2000,
      selectedDates: false,
    })

    render(<MetricsContainer />)

    // Check for title
    expect(
      screen.getByRole('heading', { name: /tus cobros/i })
    ).toBeInTheDocument()

    // Check for MetricsPeriodPill and MetricsTabs since selectedDates is falsy
    expect(screen.getByTestId('metrics-period-pill')).toBeInTheDocument()
    expect(screen.getByTestId('metrics-tabs')).toBeInTheDocument()

    // Ensure the conditional span (with text "Total") is not rendered.
    expect(screen.queryByText('Total')).not.toBeInTheDocument()

    // Check for currency amount display using mocked currency format splitting
    expect(
      screen.getByRole('heading', { name: /^\+1234$/ })
    ).toBeInTheDocument()
    expect(screen.getByText(/^,56$/)).toBeInTheDocument()

    // Check for Button text
    expect(screen.getByTestId('button')).toHaveTextContent('Ver Métricas')
  })

  it('renders header title, period pill, custom title and amount when dates are selected', () => {
    mockUseTransactionFilters.mockReturnValue({
      total: 5000,
      selectedDates: true,
    })

    render(<MetricsContainer />)

    // Check header title and period pill
    expect(
      screen.getByRole('heading', { name: /tus cobros/i })
    ).toBeInTheDocument()
    expect(screen.getByTestId('metrics-period-pill')).toBeInTheDocument()

    // Since selectedDates is true, MetricsTabs should not be rendered and custom title "Total" should appear.
    expect(screen.queryByTestId('metrics-tabs')).not.toBeInTheDocument()
    expect(screen.getByText('Total')).toBeInTheDocument()

    // Check for currency amount display mocked consistently
    expect(
      screen.getByRole('heading', { name: /^\+1234$/ })
    ).toBeInTheDocument()
    expect(screen.getByText(/^,56$/)).toBeInTheDocument()

    // Check for Button text
    expect(screen.getByTestId('button')).toHaveTextContent('Ver Métricas')
  })
})
