import { readFileSync } from "fs"
import { CharacterAI } from "../../core/CharacterAI"
import { CharacterAIPage } from "../../core/CharacterAIPage"
import { Character } from "./Character"
import { Endpoints } from "../../constants"
import { ChatHistory } from "./ChatHistory"

export interface IParticipant {
    user: {
        username: string
        id: number
        first_name: string
        account: null
        is_staff: boolean
    }
    is_human: boolean
    name: string
    num_interactions: number
}

export interface IChat {
    title: string
    participants: IParticipant[]
    external_id: string
    created: string
    last_interaction: string
    type: "CHAT"
    description: string
}

export interface ICharacterIdentifiable {
    internalId: string
    externalId: string
    historyId: string
}

export interface IMessageOptions extends ICharacterIdentifiable {
    content: string
    image?: string
}

export interface IDeleteMessageOptions {
    historyId: string
    uuids: string[]
}

export interface IGenerateImageOptions {
    description: string
}

export class Chat {
    public constructor(
        private readonly page: CharacterAIPage,
        public readonly character: Character,
        public readonly data: IChat
    ) {}

    public get title() {
        return this.data.title
    }

    public get description() {
        return this.data.description
    }

    public get type() {
        return this.data.type
    }

    public get createdAt() {
        return new Date(this.data.created)
    }
    
    public get historyId() {
        return this.data.external_id
    }

    public get participants() {
        return this.data.participants
    }

    public get lastInteractionAt() {
        return new Date(this.data.last_interaction)
    }

    public async sendMessage(options: Omit<IMessageOptions, "externalId" | "internalId" | "historyId">) {
        return this.page.sendMessage({
            ...options,
            externalId: this.character.characterId,
            historyId: this.historyId,
            internalId: this.character.internalId
        })
    }

    public async generateImage(description: string) {
        return this.page.generateImage({ description })
    }

    public async uploadImage(path: string) {
        return this.page.uploadImage(path)
    }

    public async getMessageHistory() {
        const req = await this.page.request({
            endpoint: Endpoints.MessageHistory, 
            payload: null, 
            method: "GET", 
            query: {
                history_external_id: this.historyId
            }
        })

        return new ChatHistory(this.page, this, req)
    }

    public async deleteMessages(uuids: string[]) {
        return this.page.deleteMessages({
            uuids,
            historyId: this.historyId
        })
    }
}