import { render } from '@testing-library/react'
import App from '../App'

// Basic smoke test for the App component.
describe('App component', () => {
  it('renders without crashing', () => {
    const { container } = render(<App />)
    expect(container).toBeInTheDocument()
  })
})
