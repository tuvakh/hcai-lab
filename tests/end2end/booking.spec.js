import { test, expect } from '@playwright/test'

test.describe('Booking', () => {
    test('shows equipment cards on page load', async ({ page }) => {
        await page.goto('/booking')
        await expect(page.getByRole('heading', { name: 'Book Equipment' })).toBeVisible()
    })

    test('clicking an equipment card opens the modal', async ({ page }) => {
        await page.goto('/booking')
        await page.getByRole('button', { name: /view/i }).first().click()
        await expect(page.getByLabel('Name: ')).toBeVisible()
    })

    test('book button is disabled without a date range', async ({ page }) => {
        await page.goto('/booking')
        await page.getByRole('button', { name: /view/i }).first().click()
        await expect(page.getByRole('button', { name: /book equipment/i })).toBeDisabled()
    })

    test('full booking and unbooking flow', async ({ page }) => {
        await page.goto('/booking')
        await page.getByRole('button', { name: /view/i }).first().click()
        await page.getByPlaceholder('Your name').fill('Test User')
        await page.getByPlaceholder('Your email').fill('test@test.com')
        await page.getByRole('dialog').getByRole('button', { name: 'May 30, 2026' }).click()
        await page.getByRole('dialog').getByRole('button', { name: 'May 31, 2026' }).click()
        await expect(page.getByRole('button', { name: /book equipment/i })).toBeEnabled()
        await page.getByRole('button', { name: /book equipment/i }).click()
        await expect(page.getByRole('dialog')).not.toBeVisible()
        await expect(page.getByRole('heading', { name: 'My Bookings' })).toBeVisible()
        const initialCount = await page.getByRole('button', { name: /unbook/i }).count()
        await page.getByRole('button', { name: /unbook/i }).last().click()
        await expect(page.getByRole('button', { name: /unbook/i })).toHaveCount(initialCount - 1)
    })
})
