import { ContinueRequestOverrides } from "puppeteer"
import { ParsedUrlQueryInput, stringify } from "querystring"
import { Endpoints } from "../constants"
import { ICharacter } from "./characterai/Character"
import { IChat } from "./characterai/Chat"
import { IChatMessage } from "./characterai/ChatMessage"
import { IChatReply } from "./characterai/ChatReply"
import { IHistory } from "./characterai/History"
import { IRecentCharacter } from "./characterai/RecentCharacter"
import { ISearch } from "./characterai/SearchCharacter"
import { IUserMessage } from "./characterai/UserMessage"
import FormData from "form-data"
import { IFeaturedCharacter } from "./characterai/FeaturedCharacter"

export interface IRequest {
    [Endpoints.Authentication]: [
        {
            access_token: string
        },
        {
            key: string
        }
    ]

    [Endpoints.SearchCharacters]: [
        null,
        ISearch
    ]

    [Endpoints.ContinueChat]: [
        {
            character_external_id: string
            history_external_id: null | string
        },
        IChat
    ]

    [Endpoints.GetCharacterInfo]: [
        {
            external_id: string
        },
        {
            character: ICharacter
        }
    ]

    [Endpoints.CharacterHistoryV2]: [
        {
            external_id: string
            number: number
        },
        IHistory
    ]

    [Endpoints.UploadImage]: [
        FormData,
        {
            status: "OK"
            value: string
        } | {
            status: "NOT_OK"
            error: string
        }
    ]

    [Endpoints.MessageHistory]: [
        null,
        {
            messages: IChatMessage[]
            next_page: number
            has_more: boolean
        }
    ]

    [Endpoints.CreateImage]: [
        {
            image_description: string
        },
        {
            image_rel_path: string
        }
    ]

    [Endpoints.CharacterCreateHistory]: [
        {
            character_external_id: string
            history_external_id: null
        },
        IChat
    ]

    [Endpoints.DeleteMessages]: [
        {
            history_id: string
            uuids_to_delete: string[]
        },
        {
            status: "OK"
        } | {
            status: "NOT_OK"
            error: string
        }
    ]

    [Endpoints.FeaturedCharacters]: [
        null,
        {
            characters: IFeaturedCharacter[]
        }
    ]

    [Endpoints.RecentCharacters]: [
        null,
        {
            characters: IRecentCharacter[] 
        }
    ]

    [Endpoints.SendMessage]: [IUserMessage, IChatReply]
}

export interface IRequestOptions<T extends typeof Endpoints[keyof typeof Endpoints]> {
    params?: string[]
    query?: ParsedUrlQueryInput
    endpoint: T
    payload: IRequest[T][0]
    method?: string
    headers?: Record<string, string>
}

export class Request<T extends typeof Endpoints[keyof typeof Endpoints]> {
    public constructor(public readonly options: IRequestOptions<T>) {}

    public get url() {
        const str = stringify(this.options.query ?? {})
        let url = `${this.options.endpoint}${str ? `?${str}` : ""}`
        this.options.params?.forEach((x, y) => url = url.replaceAll(`$${y + 1}`, x))
        return url
    }

    public get overrides(): ContinueRequestOverrides {
        return {
            headers: this.headers,
            method: this.method,
            postData: this.payload ? this.payload instanceof FormData ? this.payload.getBuffer() as any : JSON.stringify(this.payload) : undefined
        }
    }

    public get headers() {
        return this.options.headers ?? {}
    }

    public get method() {
        return this.options.method ?? "POST"
    }

    public get payload() {
        return this.options.payload
    }

    public get isStreaming() {
        return this.options.endpoint.endsWith("/streaming/")
    }

    public get contentType() {
        return this.payload instanceof FormData ? "multipart/form-data" : "application/json"
    }
}