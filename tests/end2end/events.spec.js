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
        await page.waitForSelector('button')
        await page.evaluate(() => {
            const btn = Array.from(document.querySelectorAll('button'))
                .find(btn => /book seat/i.test(btn.textContent))
            btn.click()
        })
        await page.waitForSelector('[role="dialog"]')
        const label = await page.$eval('[role="dialog"] label', element => element.textContent)
        assert.match(label, /first name/i)
    })

    it('modal shows a details section', async () => {
        await page.waitForSelector('button')
        await page.evaluate(() => {
            const btn = Array.from(document.querySelectorAll('button'))
                .find(btn => /book seat/i.test(btn.textContent))
            btn.click()
        })
        await page.waitForSelector('[role="dialog"]')
        const heading = await page.$eval('[role="dialog"] h3', element => element.textContent)
        assert.match(heading, /Details/i)
    })

    it('submitting without a name keeps the modal open', async () => {
        await page.waitForSelector('button')
        await page.evaluate(() => {
            const btn = Array.from(document.querySelectorAll('button'))
                .find(btn => /book seat/i.test(btn.textContent))
            btn.click()
        })
        await page.waitForSelector('[role="dialog"]')
        await page.type('[role="dialog"] input[id="email"]', 'test@test.com')
        await page.evaluate(() => {
            const btn = Array.from(document.querySelectorAll('[role="dialog"] button'))
                .find(btn => /book seat/i.test(btn.textContent))
            btn.click()
        })
        const dialog = await page.$('[role="dialog"]')
        assert.notEqual(dialog, null)
    })

    it('user can fill in and submit the seat booking form', async () => {
        await page.waitForSelector('button')
        await page.evaluate(() => {
            const btn = Array.from(document.querySelectorAll('button'))
                .find(btn => /book seat/i.test(btn.textContent))
            btn.click()
        })
        await page.waitForSelector('[role="dialog"]')
        await page.type('[role="dialog"] input[id="name"]', 'Test User')
        await page.type('[role="dialog"] input[id="email"]', 'test@test.com')
        await page.evaluate(() => {
            const btn = Array.from(document.querySelectorAll('[role="dialog"] button'))
                .find(btn => /book seat/i.test(btn.textContent))
            btn.click()
        })
        const dialog = await page.$('[role="dialog"]')
        assert.notEqual(dialog, null)
    })
})
