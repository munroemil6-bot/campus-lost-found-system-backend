import { render, screen } from '@testing-library/react'
import Navbar from './Navbar'

describe('Navbar component', () => {
  it('renders the navigation element', () => {
    render(<Navbar />)
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })
})
