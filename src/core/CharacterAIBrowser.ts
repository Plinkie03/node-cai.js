import puppeteer, { Browser, Page, PuppeteerLaunchOptions } from "puppeteer";
import { CharacterAIPage } from "./CharacterAIPage";
import { CharacterAI } from "./CharacterAI";

export type OnlyInstanceMethods<T> = {
    [P in keyof T as T[P] extends (...args: any[]) => any ? P : never]: T[P]
}

export class CharacterAIBrowser {
    private readonly pages = new Map<unknown, CharacterAIPage>()
    private browser!: Browser
    private increment = 0

    public constructor(
        private readonly ai: CharacterAI
    ) {}

    public getNewId() {
        return ++this.increment
    }

    public get options(): PuppeteerLaunchOptions {
        return {
            args: [
                "--fast-start",
                "--disable-extensions",
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--no-gpu",
                "--disable-background-timer-throttling",
                "--disable-renderer-backgrounding",
                "--override-plugin-power-saver-for-testing=never",
                "--disable-extensions-http-throttling",
                "--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.3"
            ],
            headless: this.ai.options.headless
        }
    }

    public async init() {
        this.browser = await puppeteer.launch(this.options)
        // Gracefully clean browser
        process.once("exit", this.browser.close.bind(this.browser))
    }

    public async createPage(id: unknown) {
        const isFirstPage = id === 1 && this.options.headless === false
        const page = new CharacterAIPage(this.ai, id, isFirstPage ? await this.browser.pages().then(x => x[0]) : await this.browser.newPage())
        await page.init()
        this.pages.set(page.id, page)
        await page.authenticate()
        return page
    }

    public async getAvailablePage() {
        for (const [ , page ] of this.pages) {
            if (!page.isBusy) return page
        }
        
        return this.createPage(this.getNewId())
    }

    /**
     * Quick shortcut for calling methods on pages.
     * @param method 
     * @param params 
     * @returns 
     */
    public async call<T extends keyof OnlyInstanceMethods<CharacterAIPage>>(method: T, ...params: Parameters<OnlyInstanceMethods<CharacterAIPage>[T]>): Promise<Awaited<ReturnType<OnlyInstanceMethods<CharacterAIPage>[T]>>> {
        // @ts-ignore This lil bro does not like my typings
        return this.getAvailablePage().then(page => page[method](...params))
    }
}
