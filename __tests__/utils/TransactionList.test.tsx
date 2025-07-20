/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent } from '@testing-library/react'
import TransactionList from '@/components/organism/TransactionList/TransactionList'
import { TransactionFilterProvider } from '@/lib/context/TransactionsFilterContext'
import { Transaction, Metadata } from '@/types/transaction'

jest.mock(
  '@/components/molecule/TransactionListHeader/TransactionListHeader',
  () => ({
    __esModule: true,
    default: ({ onFilterToggle }: { onFilterToggle: () => void }) => (
      <button onClick={onFilterToggle} data-testid="header-toggle">
        Header
      </button>
    ),
  })
)

jest.mock(
  '@/components/molecule/TransactionListFilterPane/TransactionListFilterPane',
  () => ({
    __esModule: true,
    default: ({
      isActive,
      onToggle,
    }: {
      isActive: boolean
      onToggle: () => void
    }) =>
      isActive ? (
        <div data-testid="filter-pane">
          <button onClick={onToggle}>Close</button>
        </div>
      ) : null,
  })
)

jest.mock('@/components/atoms/NoResults/NoResults', () => ({
  __esModule: true,
  default: () => <div data-testid="no-results">No Results</div>,
}))

jest.mock('@/components/atoms/TransactionRow/TransactionRow', () => ({
  __esModule: true,
  default: ({ transaction }: { transaction: Transaction }) => (
    <li data-testid="transaction-row">{transaction.id}</li>
  ),
}))

const mockTransactions: Transaction[] = [
  {
    id: '1',
    amount: 100,
    card: 'visa',
    installments: 1,
    createdAt: '2023-10-26T10:00:00.000Z',
    updatedAt: '2023-10-26T10:00:00.000Z',
    paymentMethod: 'link',
  },
  {
    id: '2',
    amount: 200,
    card: 'mastercard',
    installments: 3,
    createdAt: '2023-10-27T11:00:00.000Z',
    updatedAt: '2023-10-27T11:00:00.000Z',
    paymentMethod: 'qr',
  },
]

const metadata: Metadata = {
  cards: [
    { value: 'visa', label: 'Visa' },
    { value: 'mastercard', label: 'Mastercard' },
    { value: 'amex', label: 'Amex' },
  ],
  paymentMethods: [
    { value: 'link', label: 'Link de pago' },
    { value: 'qr', label: 'Código QR' },
    { value: 'mpos', label: 'mPOS' },
    { value: 'pospro', label: 'POS Pro' },
  ],
}

const renderWithProvider = (transactions: Transaction[] = mockTransactions) =>
  render(
    <TransactionFilterProvider transactions={transactions}>
      <TransactionList metadata={metadata} />
    </TransactionFilterProvider>
  )

describe('TransactionList', () => {
  it('renders all transactions as TransactionRow', () => {
    renderWithProvider()
    const rows = screen.getAllByTestId('transaction-row')
    const rowTexts = rows.map((row) => row.textContent)
    expect(rowTexts).toEqual(expect.arrayContaining(['1', '2']))
    expect(rows).toHaveLength(2)
  })

  it('renders NoResults when there are no transactions', () => {
    renderWithProvider([])
    expect(screen.getByTestId('no-results')).toBeInTheDocument()
  })

  it('toggles filter pane when header button is clicked', () => {
    renderWithProvider()
    expect(screen.queryByTestId('filter-pane')).not.toBeInTheDocument()
    fireEvent.click(screen.getByTestId('header-toggle'))
    expect(screen.getByTestId('filter-pane')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Close'))
    expect(screen.queryByTestId('filter-pane')).not.toBeInTheDocument()
  })

  it('sets body overflow to hidden when filter pane is open', () => {
    renderWithProvider()
    expect(document.body.style.overflow).toBe('')
    fireEvent.click(screen.getByTestId('header-toggle'))
    expect(document.body.style.overflow).toBe('hidden')
    fireEvent.click(screen.getByText('Close'))
    expect(document.body.style.overflow).toBe('')
  })
})
