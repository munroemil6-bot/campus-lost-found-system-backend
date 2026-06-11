import { render, screen } from '@testing-library/react'
import Home from '../pages/Home'

describe('Home page content', () => {
  it('shows the main heading, description, and report button', () => {
    render(<Home />)

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Campus Lost & Found')
    expect(screen.getByText(/report lost or found items on campus/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /report an item/i })).toBeInTheDocument()
  })
})
