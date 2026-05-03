import { test, expect } from '@playwright/test';

test.describe('Events', () => {
    test('events page shows the Events heading', async ({ page }) => {
        await page.goto('/events');
        await expect(page.getByRole('heading', { name: 'Events' })).toBeVisible();
    });

    test('event cards are visible on the page', async ({ page }) => {
        await page.goto('/events');
        await expect(page.getByRole('button', { name: /book seat/i }).first()).toBeVisible();
    });

    test('clicking an event card opens the modal', async ({ page }) => {
        await page.goto('/events');
        await page
            .getByRole('button', { name: /Book seat/i })
            .first()
            .click();
        await expect(page.getByLabel('First name: ')).toBeVisible();
    });

    test('modal shows event title', async ({ page }) => {
        await page.goto('/events');
        await page
            .getByRole('button', { name: /Book seat/i })
            .first()
            .click();
        await expect(page.getByRole('dialog').getByRole('heading', { name: 'Details' })).toBeVisible();
    });

    test('user can fill in and submit the seat booking form', async ({ page }) => {
        await page.goto('/events');
        await page
            .getByRole('button', { name: /book seat/i })
            .first()
            .click();
        await page.getByRole('dialog').getByLabel('First name:').fill('Test User');
        await page.getByRole('dialog').getByLabel('Email:').fill('test@test.com');
        await page
            .getByRole('dialog')
            .getByRole('button', { name: /book seat/i })
            .click();
        await expect(page.getByRole('dialog')).toBeVisible();
    });
});
