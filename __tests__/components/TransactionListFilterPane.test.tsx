import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TransactionListFilterPane from '@/components/molecule/TransactionListFilterPane/TransactionListFilterPane'
import { TransactionFilterProvider } from '@/lib/context/TransactionsFilterContext'
import { Metadata } from '@/types/transaction'

// Mock external dependencies if needed
jest.mock('@radix-ui/react-slider', () => ({
  __esModule: true,

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Root: ({ children, ...props }: any) => <div {...props}>{children}</div>,

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Track: ({ children, ...props }: any) => <div {...props}>{children}</div>,

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Range: (props: any) => <div {...props} />,

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Thumb: (props: any) => <div {...props} />,
}))

const mockMetadata: Metadata = {
  cards: [
    { value: 'visa', label: 'Visa' },
    { value: 'mastercard', label: 'Mastercard' },
  ],
  paymentMethods: [
    { value: 'link', label: 'Link de pago' },
    { value: 'qr', label: 'Código QR' },
  ],
}

describe('<TransactionListFilterPane />', () => {
  it('renders correctly with initial state', () => {
    render(
      <TransactionFilterProvider transactions={[]}>
        <TransactionListFilterPane
          isActive={true}
          onToggle={jest.fn()}
          metadata={mockMetadata}
        />
      </TransactionFilterProvider>
    )

    // Check that all filter rows are rendered
    expect(screen.getByText('Fecha')).toBeInTheDocument()
    expect(screen.getByText('Tarjeta')).toBeInTheDocument()
    expect(screen.getByText('Cuotas')).toBeInTheDocument()
    expect(screen.getByText('Monto')).toBeInTheDocument()
    expect(screen.getByText('Métodos de cobro')).toBeInTheDocument()

    // Check that the "Limpiar" and "Aplicar Filtros" buttons are rendered
    expect(
      screen.getByRole('button', { name: /aplicar filtros/i })
    ).toBeDisabled()
    expect(screen.getByRole('button', { name: /limpiar/i })).toBeInTheDocument()
  })

  it('toggles filter rows open and closed via the Switch', async () => {
    render(
      <TransactionFilterProvider transactions={[]}>
        <TransactionListFilterPane
          isActive={true}
          onToggle={jest.fn()}
          metadata={mockMetadata}
        />
      </TransactionFilterProvider>
    )

    // Initially, all filter containers should be hidden
    expect(
      screen.getByText('Monto').closest('.filterRow')?.nextElementSibling
    ).toHaveAttribute('data-isactive', 'false')

    // Click the Switch inside the "Monto" filter row
    const montoSwitch = screen.getByRole('button', { name: /amount/i }) // Using the label passed as iconName
    await userEvent.click(montoSwitch)

    // Verify that the "Monto" filter container is now visible
    expect(
      screen.getByText('Monto').closest('.filterRow')?.nextElementSibling
    ).toHaveAttribute('data-isactive', 'true')

    // Click the Switch again to close the "Monto" filter row
    await userEvent.click(montoSwitch)

    // Verify that the "Monto" filter container is hidden again
    expect(
      screen.getByText('Monto').closest('.filterRow')?.nextElementSibling
    ).toHaveAttribute('data-isactive', 'false')
  })

  // TODO: Continue with the testing for the filters of the pane
})
