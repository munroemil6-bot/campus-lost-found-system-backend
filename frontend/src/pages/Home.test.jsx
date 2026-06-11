import { render, screen } from '@testing-library/react'
import Home from './Home'

describe('Home page', () => {
  it('renders the homepage container', () => {
    render(<Home />)
    expect(screen.getByRole('main')).toBeInTheDocument()
  })
})
