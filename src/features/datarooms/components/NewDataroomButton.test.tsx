import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders, userEvent } from '@/test/utils'
import { NewDataroomButton } from './NewDataroomButton'

describe('NewDataroomButton', () => {
  it('should render with "New" text', () => {
    const onClick = vi.fn()
    renderWithProviders(<NewDataroomButton onClick={onClick} />)

    const button = screen.getByRole('button', { name: /new/i })
    expect(button).toBeInTheDocument()
  })

  it('should call onClick when clicked', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    renderWithProviders(<NewDataroomButton onClick={onClick} />)

    const button = screen.getByRole('button', { name: /new/i })
    await user.click(button)

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('should have Plus icon', () => {
    const onClick = vi.fn()
    const { container } = renderWithProviders(<NewDataroomButton onClick={onClick} />)

    const icon = container.querySelector('svg')
    expect(icon).toBeInTheDocument()
  })
})
