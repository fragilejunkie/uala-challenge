/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Calendar } from '@/components/atoms/Calendar/Calendar'
import { DateRange } from 'react-day-picker'

/* ------------------------------------------------------------------ */
/* Mock react‑day‑picker                                              */
/* When the div is clicked, it calls props.onSelect(newRange)         */
/* ------------------------------------------------------------------ */
const newRange: DateRange = {
  from: new Date('2023-11-01'),
  to: new Date('2023-11-03'),
}

jest.mock('react-day-picker', () => ({
  __esModule: true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  DayPicker: (props: any) => (
    <div
      data-testid="mock-day-picker"
      onClick={() => props.onSelect?.(newRange)}
    >
      {props.footer}
    </div>
  ),
}))

/* ------------------------------------------------------------------ */
/* Test                                                                */
/* ------------------------------------------------------------------ */
describe('<Calendar>', () => {
  it('calls setSelectedDate when a new range is selected', async () => {
    const user = userEvent.setup()
    const initialRange: DateRange = {
      from: new Date('2023-10-01'),
      to: new Date('2023-10-05'),
    }

    const handleSelect = jest.fn()

    render(
      <Calendar
        selectedDate={initialRange}
        setSelectedDate={handleSelect}
        footer="pie"
      />
    )

    /* DayPicker stub renders with footer */
    const dp = screen.getByTestId('mock-day-picker')
    expect(dp).toHaveTextContent('pie')

    /* Click => stub triggers onSelect(newRange) */
    await user.click(dp)

    /* Handler called with the new range */
    expect(handleSelect).toHaveBeenCalledTimes(1)
    expect(handleSelect).toHaveBeenCalledWith(newRange)
  })
})
