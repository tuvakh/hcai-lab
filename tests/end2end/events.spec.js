import { describe, it, before, after, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import puppeteer from 'puppeteer'

const BASE_URL = 'http://localhost:5173'

describe('Events', () => {
    let browser, page

    before(async () => {
        browser = await puppeteer.launch({ headless: true })
    })

    after(async () => {
        await browser.close()
    })

    beforeEach(async () => {
        page = await browser.newPage()
        await page.goto(`${BASE_URL}/events`)
    })

    afterEach(async () => {
        await page.close()
    })

    it('events page shows the Events heading', async () => {
        await page.waitForSelector('h1')
        const heading = await page.$eval('h1', element => element.textContent)
        assert.match(heading, /Events/i)
    })

    it('clicking an event card opens the modal', async () => {
        await page.waitForSelector('.eventCard__button')
        await page.evaluate(() => {
            const btn = Array.from(document.querySelectorAll('button'))
                .find(btn => /book seat/i.test(btn.textContent))
            btn.click()
        })
        await page.waitForSelector('[role="dialog"]')
        const title = await page.$eval('[role="dialog"] h2', element => element.textContent)
        assert.ok(title.length > 0)
    })

    it('modal shows a details section', async () => {
        await page.waitForSelector('.eventCard__button')
        await page.evaluate(() => {
            const btn = Array.from(document.querySelectorAll('button'))
                .find(btn => /book seat/i.test(btn.textContent))
            btn.click()
        })
        await page.waitForSelector('[role="dialog"]')
        const heading = await page.$eval('[role="dialog"] h3', element => element.textContent)
        assert.match(heading, /Details/i)
    })

    it('modal shows login prompt for unauthenticated users', async () => {
        await page.waitForSelector('.eventCard__button')
        await page.evaluate(() => {
            const btn = Array.from(document.querySelectorAll('button'))
                .find(btn => /book seat/i.test(btn.textContent))
            btn.click()
        })
        await page.waitForSelector('[role="dialog"]')
        const text = await page.$eval('[role="dialog"]', element => element.textContent)
        assert.match(text, /you need to have a user/i)
    })

    it('clicking Log in in the modal navigates to the login page', async () => {
        await page.waitForSelector('.eventCard__button')
        await page.evaluate(() => {
            const btn = Array.from(document.querySelectorAll('button'))
                .find(btn => /book seat/i.test(btn.textContent))
            btn.click()
        })
        await page.waitForSelector('[role="dialog"]')
        await page.evaluate(() => {
            const btn = Array.from(document.querySelectorAll('[role="dialog"] button'))
                .find(btn => /log in/i.test(btn.textContent))
            btn.click()
        })
        await page.waitForFunction(() => window.location.pathname === '/login')
        const url = page.url()
        assert.match(url, /\/login/)
    })
})
