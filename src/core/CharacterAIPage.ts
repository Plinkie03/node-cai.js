import { ContinueRequestOverrides, HTTPResponse, Page } from "puppeteer";
import { BaseIconURL, BaseUploadImageURL, Endpoints } from "../constants";
import { CharacterAI } from "./CharacterAI";
import { Chat, IChat, IDeleteMessageOptions, IGenerateImageOptions, IMessageOptions } from "../structures/characterai/Chat";
import { Character, ICharacter } from "../structures/characterai/Character";
import { IRequest, Request } from "../structures/Request";
import { UserMessage } from "../structures/characterai/UserMessage";
import { readFileSync, stat } from "fs";
import FormData from "form-data";
import { Image } from "../structures/Image";
import { ChatReply } from "../structures/characterai/ChatReply";
import { Mutex } from "../structures/Mutex";
import { History } from "../structures/characterai/History";
import { SearchCharacter } from "../structures/characterai/SearchCharacter";
import { FeaturedCharacter } from "../structures/characterai/FeaturedCharacter";
import { RecentCharacter } from "../structures/characterai/RecentCharacter";

export class CharacterAIPage {
    private token!: string
    private mutex = new Mutex()

    public constructor(
        private readonly ai: CharacterAI,
        public readonly id: unknown,
        public readonly page: Page
    ) {}

    public get isBusy() {
        return this.mutex["locked"]
    }

    public async init() {
        await this.page.setJavaScriptEnabled(true)
        this.page.setDefaultNavigationTimeout(0);
        
        const userAgent = "CharacterAI/1.0.0 (iPhone; iOS 14.4.2; Scale/3.00)";
        
        if (this.ai.options.headless === false) {
            if (this.ai.options.screen !== undefined) {
                await this.page.setViewport({
                    width: this.ai.options.screen[0],
                    height: this.ai.options.screen[1],
                })
            }
        }
        
        await this.page.setUserAgent(userAgent);
        await this.page.deleteCookie();
        const client = await this.page.target().createCDPSession();
        await client.send("Network.clearBrowserCookies");
        await client.send("Network.clearBrowserCache");
    }

    public async getRecentCharacters() {
        const req = await this.request({
            method: "GET",
            endpoint: Endpoints.RecentCharacters,
            payload: null
        })

        return req.characters.map(x => new RecentCharacter(this, x))
    }

    public async authenticate() {
        const res = await this.request({
            endpoint: Endpoints.Authentication,
            payload: {
                access_token: this.ai.options.token
            }
        })

        this.token = res.key
        return this.token
    }

    public async getFeaturedCharacters() {
        const req = await this.request({
            endpoint: Endpoints.FeaturedCharacters, 
            payload: null, 
            method: "GET"
        })

        return req.characters.map(x => new FeaturedCharacter(this, x))
    } 

    private async expectJSON<T = any>(res: Error | HTTPResponse | unknown) {
        if (res instanceof Error) throw res

        if (!(res instanceof HTTPResponse)) {
            if (typeof res !== "object") 
                throw new Error(`Expected JSON, received: ${res}`)
            return res as T
        }

        const headers = res.headers()
        if (headers["content-type"] !== "application/json") {
            const txt = await res.text()
            throw new Error(`Expected JSON, received: ${txt}`)
        }

        return res.json() as T
    }

    public async request<T extends typeof Endpoints[keyof typeof Endpoints]>(...args: ConstructorParameters<typeof Request<T>>) {
        return await this.mutex.lock(async () => {
            const request = new Request(...args)
            
            request.options.headers ??= {}
            request.options.headers["authorization"] = "Token " + this.token
            request.options.headers["content-type"] ??= request.contentType
            
            if (request.payload instanceof FormData) {
                request.headers["content-type"] += `; boundary=${request.payload.getBoundary()}`
            }
    
            const overrides = request.overrides
    
            if (request.isStreaming) {
                const response = await this.page.evaluate(async function(url, options) {
                    const res = await fetch(url, {
                        body: options.postData,
                        ...options
                    })
                    const lines = await res.text().then(text => text.split("\n"))
                    try {
                        return JSON.parse(lines[lines.length - 2])
                    } catch (error) {
                        return error
                    }
                }, request.url, overrides)
    
                return this.expectJSON<IRequest[T][1]>(response)
            } else {
                this.page.setRequestInterception(true)
            
                this.page.once("request", request => {
                    request.continue(overrides)
                    this.page.setRequestInterception(false)   
                })
                
                const res = (await this.page.goto(request.url))!
                return this.expectJSON<IRequest[T][1]>(res)
            }
        })
    }

    async getHistory(externalId: string) {
        const req = await this.request({
            endpoint: Endpoints.CharacterHistoryV2, 
            payload: {
                external_id: externalId,
                number: 50
            }
        })

        return req.histories.map(x => new History(this, x))
    }

    async searchCharacters(query: string) {
        const req = await this.request({
            endpoint: Endpoints.SearchCharacters, 
            payload: null, 
            method: "GET",
            query: {
                query
            }
        })
        return req.characters.map(x => new SearchCharacter(this, x))
    }

    async getCharacterInfo(externalId: string) {
        const req = await this.request({
            endpoint: Endpoints.GetCharacterInfo, 
            payload: {
                external_id: externalId
            }
        })

        return new Character(this, req.character)
    }

    async createHistory(externalId: string) {
        const req = await this.request({
            endpoint: Endpoints.CharacterCreateHistory, 
            payload: {
                character_external_id: externalId,
                history_external_id: null
            }
        })

        return new Chat(this, await this.getCharacterInfo(externalId), req)
    }

    async generateImage(options: IGenerateImageOptions) {
        const req = await this.request({
            endpoint: Endpoints.CreateImage, 
            payload: {
                image_description: options.description
            }
        })
        return req.image_rel_path
    }

    async continueChat(externalId: string, historyId: string | null) {
        const req = await this.request({
            endpoint: Endpoints.ContinueChat, 
            payload: {
                character_external_id: externalId,
                history_external_id: historyId
            }
        })

        return new Chat(this, await this.getCharacterInfo(externalId), req)
    }
    
    async sendMessage(options: IMessageOptions) {
        if (options.image) {
            const url = await this.uploadImage(options.image)
            options.image = url
        }
        
        const msg = new UserMessage(options)
        const req = await this.request({
            endpoint: Endpoints.SendMessage, 
            payload: msg.toJSON()
        })

        return new ChatReply(this, req)
    }

    async getMessageHistory(characterId: string, historyId: string) {
        const chat = await this.continueChat(characterId, historyId)
        return chat.getMessageHistory()
    }

    async deleteMessages(options: IDeleteMessageOptions) {
        const req = await this.request({
            endpoint: Endpoints.DeleteMessages, 
            payload: {
                history_id: options.historyId,
                uuids_to_delete: options.uuids
            }
        })

        return req.status === "OK"
    }

    async uploadImage(path: string) {
        const img = await Image.fetch(path)
        if (img.generated) return path

        const form = new FormData()
        
        form.append("image", img.buffer, {
            filename: img.name,
            contentType: `image/${img.type}`
        })

        const req = await this.request({
            endpoint: Endpoints.UploadImage, 
            payload: form
        })

        if (req.status !== "OK") throw new Error(`Failed to upload image: ${req.error}`)
        return `${BaseUploadImageURL}/${req.value}`
    }

    async createOrContinueChat(externalId: string) {
        const history = await this.getHistory(externalId)
        if (history.length === 0) return this.createHistory(externalId)
        return this.continueChat(externalId, history[0].historyId)
    }

    async close() {
        await this.page.close()
        this.ai.browser["pages"].delete(this)
    }
}