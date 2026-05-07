import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import Booking from "../../src/pages/Booking";

const mockEquipment = [{ id: '1', name: 'VR Headset', category: 'VR', description: 'A VR headset' }]

function mockFetch(equipmentData = mockEquipment, bookingsData = []) {
    vi.spyOn(global, 'fetch').mockImplementation((url) => {
        if (url.endsWith('/equipment')) return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(equipmentData) })
        if (url.includes('/bookings')) return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(bookingsData) })
        return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve([]) })    
    })
}

describe("Booking", () => {
    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('shows equipment cards from API', async () => {
        mockFetch()
        render(<MemoryRouter><Booking /></MemoryRouter>)
        expect(await screen.findByText('VR Headset')).toBeInTheDocument()
    })

    it('clicking a card opens the modal', async () => {
        mockFetch()
        render(<MemoryRouter><Booking /></MemoryRouter>)
        fireEvent.click(await screen.findByText('VR Headset'))
        expect(screen.getByLabelText('Name:')).toBeInTheDocument()
    })

    it('book button is disabled without a date range', async () => {
        mockFetch()
        render(<MemoryRouter><Booking /></MemoryRouter>)
        fireEvent.click(await screen.findByText('VR Headset'))
        expect(screen.getByRole('button', { name: /book equipment/i })).toBeDisabled()
    })

    it('shows nothing when API fails', async () => {
        vi.spyOn(global, 'fetch').mockRejectedValue(new Error('Network error'))
        render(<MemoryRouter><Booking /></MemoryRouter>)
        await waitFor(() => {
            expect(screen.queryByText('VR Headset')).not.toBeInTheDocument()
        })
    })

    it('shows no equipment when list is empty', async () => {
        mockFetch([])
        render(<MemoryRouter><Booking /></MemoryRouter>)
        await waitFor(() => {
            expect(screen.queryByRole('button', { name: /view/i })).not.toBeInTheDocument()
        })
    })
})
