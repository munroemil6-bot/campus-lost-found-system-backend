import { render, screen } from '@testing-library/react'
import App from './App'

// Basic smoke test for the App component.
describe('App component', () => {
  it('renders without crashing and includes the router container', () => {
    render(<App />)
    expect(screen.getByRole('navigation', { hidden: true })).toBeInTheDocument()
  })
})
