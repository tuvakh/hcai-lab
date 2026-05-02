import { render, screen, fireEvent } from '@testing-library/react';
import EventCard from '../../src/components/EventCard';

describe("EventCard", () => {
    describe("rendering", () => {
        it("renders the title", () => {
            render(<EventCard title="AI Workshop" date="2025-05-15T14:00:00" place="Trondheim" description="A talk about AI" />)
            expect(screen.getByText("AI Workshop")).toBeInTheDocument()
        })
        it("renders the place", () => {
            render(<EventCard title="AI Workshop" date="2025-05-15T14:00:00" place="Trondheim" description="A talk about AI" />)
            expect(screen.getByText("Trondheim")).toBeInTheDocument()
        })
        it("renders the description", () => {
            render(<EventCard title="AI Workshop" date="2025-05-15T14:00:00" place="Trondheim" description="A talk about AI" />)
            expect(screen.getByText("A talk about AI")).toBeInTheDocument()
        })
    })

    describe("modal behavior", () => {
        it("clicking the card opens the modal", () => {
            render(<EventCard title="AI Workshop" date="2025-05-15T14:00:00" place="Trondheim" description="A talk about AI" />)
            fireEvent.click(screen.getByText("AI Workshop"))
            expect(screen.getByText("Details")).toBeInTheDocument()
        })
        it("closing the modal hides it", () => {
            render(<EventCard title="AI Workshop" date="2025-05-15T14:00:00" place="Trondheim" description="A talk about AI" />)
            fireEvent.click(screen.getByText("AI Workshop"))
            expect(screen.getByText("Details")).toBeInTheDocument()
            fireEvent.click(screen.getByRole('button', { name: /close/i }))
            expect(screen.queryByText("Details")).not.toBeInTheDocument()
        })
    })

    describe("date formatting", () => {
        it("valid ISO date formats", () => {
            render(<EventCard title="AI Workshop" date="2025-05-15T14:00:00" place="Trondheim" description="A talk about AI" />)
            expect(screen.getByText(/15\. mai/)).toBeInTheDocument()
        })
        it("invalid date doesn't crash", () => {
            render(<EventCard title="AI Workshop" date="not a date" place="Trondheim" description="A talk about AI" />)
            expect(screen.getByText("AI Workshop")).toBeInTheDocument()
        })
    })

    describe("edge cases", () => {
        it("renders with seats boundry", () => {
            render(<EventCard title="AI Workshop" date="2025-05-15T14:00:00" place="Trondheim" description="A talk about AI" />)
            fireEvent.click(screen.getByText("AI Workshop"))
            fireEvent.click(screen.getByLabelText("How many seats do you want?"))
            expect(screen.getByLabelText("How many seats do you want?")).toHaveAttribute('min', '1')
        })
        it("submit button is present in modal", () => {
            render(<EventCard title="AI Workshop" date="not a date" place="Trondheim" description="A talk about AI" />)
            fireEvent.click(screen.getByText("AI Workshop"))
            expect(screen.getAllByRole('button', { name: /book seat/i }).length).toBeGreaterThan(1)
        })
    })
  
})
