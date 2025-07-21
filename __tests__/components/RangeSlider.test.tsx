import { render, screen, fireEvent } from '@testing-library/react'
import RangeSlider from '@/components/atoms/RangeSlider/RangeSlider'

// Mock Radix Slider to avoid rendering internals
jest.mock('@radix-ui/react-slider', () => ({
  __esModule: true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Root: ({ children, onValueChange, ...props }: any) => (
    <div
      data-testid="slider-root"
      onClick={() => onValueChange && onValueChange([200, 600])}
      {...props}
    >
      {children}
    </div>
  ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Track: ({ children, ...props }: any) => (
    <div data-testid="slider-track" {...props}>
      {children}
    </div>
  ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Range: (props: any) => <div data-testid="slider-range" {...props} />,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Thumb: (props: any) => <div data-testid="slider-thumb" {...props} />,
}))

describe('RangeSlider', () => {
  it('renders with initial values', () => {
    const handleChange = jest.fn()
    render(<RangeSlider value={[100, 500]} onValueChange={handleChange} />)
    expect(screen.getByDisplayValue('100')).toBeInTheDocument()
    expect(screen.getByDisplayValue('500')).toBeInTheDocument()
    expect(screen.getByText('Monto Mínimo')).toBeInTheDocument()
    expect(screen.getByText('Monto Máximo')).toBeInTheDocument()
    expect(screen.getAllByTestId('slider-thumb')).toHaveLength(2)
  })

  it('calls onValueChange when slider value changes', () => {
    const handleChange = jest.fn()
    render(<RangeSlider value={[100, 500]} onValueChange={handleChange} />)
    const sliderRoot = screen.getByTestId('slider-root')
    fireEvent.click(sliderRoot)
    expect(handleChange).toHaveBeenCalledWith([200, 600])
  })

  it('updates input values when props.value changes', () => {
    const handleChange = jest.fn()
    const { rerender } = render(
      <RangeSlider value={[100, 500]} onValueChange={handleChange} />
    )
    expect(screen.getByDisplayValue('100')).toBeInTheDocument()
    expect(screen.getByDisplayValue('500')).toBeInTheDocument()
    rerender(<RangeSlider value={[300, 700]} onValueChange={handleChange} />)
    expect(screen.getByDisplayValue('300')).toBeInTheDocument()
    expect(screen.getByDisplayValue('700')).toBeInTheDocument()
  })

  it('handles input change and commit on blur', () => {
    const handleChange = jest.fn()
    render(<RangeSlider value={[100, 500]} onValueChange={handleChange} />)
    const minInput = screen.getAllByRole('spinbutton')[0]
    fireEvent.change(minInput, { target: { value: '150' } })
    fireEvent.blur(minInput)
    expect(handleChange).toHaveBeenCalledWith([150, 500])
    const maxInput = screen.getAllByRole('spinbutton')[1]
    fireEvent.change(maxInput, { target: { value: '800' } })
    fireEvent.blur(maxInput)
    expect(handleChange).toHaveBeenCalledWith([100, 800])
  })

  it('clamps input values to [0, 2000]', () => {
    const handleChange = jest.fn()
    render(<RangeSlider value={[100, 500]} onValueChange={handleChange} />)
    const minInput = screen.getAllByRole('spinbutton')[0]
    fireEvent.change(minInput, { target: { value: '-50' } })
    fireEvent.blur(minInput)
    expect(handleChange).toHaveBeenCalledWith([0, 500])
    const maxInput = screen.getAllByRole('spinbutton')[1]
    fireEvent.change(maxInput, { target: { value: '2500' } })
    fireEvent.blur(maxInput)
    expect(handleChange).toHaveBeenCalledWith([100, 2000])
  })

  it('resets invalid input to zero and calls onValueChange', () => {
    const handleChange = jest.fn()
    const { rerender } = render(
      <RangeSlider value={[100, 500]} onValueChange={handleChange} />
    )

    const minInput = screen.getAllByRole('spinbutton')[0]
    fireEvent.change(minInput, { target: { value: 'abc' } })
    fireEvent.blur(minInput)

    // Simulate the component re-rendering with updated props
    rerender(<RangeSlider value={[0, 500]} onValueChange={handleChange} />)

    // Check that the input value is updated to "0"
    expect(minInput).toHaveValue(0)

    // Ensure onValueChange is called with the correct value
    expect(handleChange).toHaveBeenCalledTimes(1)
    expect(handleChange).toHaveBeenCalledWith([0, 500])
  })

  it('commits input on Enter key', () => {
    const handleChange = jest.fn()
    render(<RangeSlider value={[100, 500]} onValueChange={handleChange} />)
    const minInput = screen.getAllByRole('spinbutton')[0]
    fireEvent.change(minInput, { target: { value: '200' } })
    fireEvent.keyDown(minInput, { key: 'Enter' })
    expect(handleChange).toHaveBeenCalledWith([200, 500])
  })

  it('keeps range valid when min > max or max < min', () => {
    const handleChange = jest.fn()
    render(<RangeSlider value={[100, 500]} onValueChange={handleChange} />)
    const minInput = screen.getAllByRole('spinbutton')[0]
    fireEvent.change(minInput, { target: { value: '600' } })
    fireEvent.blur(minInput)
    expect(handleChange).toHaveBeenCalledWith([600, 600])
    const maxInput = screen.getAllByRole('spinbutton')[1]
    fireEvent.change(maxInput, { target: { value: '50' } })
    fireEvent.blur(maxInput)
    expect(handleChange).toHaveBeenCalledWith([50, 50])
  })
})
