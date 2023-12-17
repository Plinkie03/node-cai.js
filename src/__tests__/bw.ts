import puppeteer from "puppeteer"

async function main() {
    const brow = await puppeteer.launch({
        headless: false
    })

    const page = await brow.pages().then(x => x[0])
    await page.setRequestInterception(true)
    await page.waitForRequest("https://www.google.com")
}

main()