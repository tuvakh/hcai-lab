import {render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { http, HttpResponse } from 'msw';
import { server } from './setup';
import Booking from "../../src/pages/Booking";


describe("Booking", () => { 
    beforeEach(() => {
        server.use(
            http.get('*/api/equipment', () => HttpResponse.json([
                { id: '1', name: 'VR Headset', category: 'VR', description: 'A VR headset' }
            ])),
            http.get('*/api/bookings', () => HttpResponse.json([]))
        )
    })

    it('shows equipment cards from API', async () => {
        render(<MemoryRouter><Booking /></MemoryRouter>)
        expect(await screen.findByText('VR Headset')).toBeInTheDocument()
    })

    it('clicking a card open the modal', async () => {
        render(<MemoryRouter><Booking /></MemoryRouter>)
        fireEvent.click(await screen.findByText('VR Headset'))
        expect(screen.getByLabelText('Name:')).toBeInTheDocument()
    })

    it('book button is diabled without a date range', async () => {
        render(<MemoryRouter><Booking /></MemoryRouter>)
        fireEvent.click(await screen.findByText('VR Headset'))
        expect(screen.getByRole('button', { name: /book equipment/i })).toBeDisabled()
    })

    it('shows nothing when API fails', async () => {
        server.use(http.get('*/api/equipment', () => HttpResponse.error()))        
        render(<MemoryRouter><Booking /></MemoryRouter>)
        await new Promise(r => setTimeout(r, 100))
        expect(screen.queryByText('VR Headset')).not.toBeInTheDocument()
    })

    it('shows no equipment when list is empty', async () => {
        server.use(http.get('*/api/equipment', () => HttpResponse.json([])))
        render(<MemoryRouter><Booking /></MemoryRouter>)
        await new Promise(r => setTimeout(r, 100))
        expect(screen.queryByRole('button', { name: /view/i })).not.toBeInTheDocument()
    })
})