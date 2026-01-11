import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders, userEvent } from '@/test/utils'
import { SearchBar } from './SearchBar'

describe('SearchBar', () => {
  it('should render with placeholder text', () => {
    const onChange = vi.fn()
    renderWithProviders(<SearchBar value="" onChange={onChange} placeholder="Search files..." />)

    const input = screen.getByPlaceholderText('Search files...')
    expect(input).toBeInTheDocument()
  })

  it('should display the current value', () => {
    const onChange = vi.fn()
    renderWithProviders(<SearchBar value="test query" onChange={onChange} />)

    const input = screen.getByDisplayValue('test query')
    expect(input).toBeInTheDocument()
  })

  it('should call onChange when typing', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    renderWithProviders(<SearchBar value="" onChange={onChange} />)

    const input = screen.getByPlaceholderText('Search...')
    await user.type(input, 'new search')

    expect(onChange).toHaveBeenCalled()
    // Check that onChange was called with each character
    expect(onChange).toHaveBeenCalledWith('n')
  })

  it('should show clear button when value is not empty', () => {
    const onChange = vi.fn()
    renderWithProviders(<SearchBar value="test" onChange={onChange} />)

    const clearButton = screen.getByRole('button')
    expect(clearButton).toBeInTheDocument()
  })

  it('should not show clear button when value is empty', () => {
    const onChange = vi.fn()
    renderWithProviders(<SearchBar value="" onChange={onChange} />)

    const clearButton = screen.queryByRole('button')
    expect(clearButton).not.toBeInTheDocument()
  })

  it('should clear value when clear button is clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    renderWithProviders(<SearchBar value="test query" onChange={onChange} />)

    const clearButton = screen.getByRole('button')
    await user.click(clearButton)

    expect(onChange).toHaveBeenCalledWith('')
  })

  it('should autofocus when autoFocus prop is true', () => {
    const onChange = vi.fn()
    renderWithProviders(<SearchBar value="" onChange={onChange} autoFocus />)

    const input = screen.getByPlaceholderText('Search...')
    expect(input).toHaveFocus()
  })
})
