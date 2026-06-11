import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Navbar from '../components/Navbar'

describe('Navbar component', () => {
  it('renders the navigation element with links', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    )

    expect(screen.getByRole('navigation')).toBeInTheDocument()
    expect(screen.getByText(/home/i)).toBeInTheDocument()
    expect(screen.getByText(/report lost/i)).toBeInTheDocument()
    expect(screen.getByText(/report found/i)).toBeInTheDocument()
  })
})
