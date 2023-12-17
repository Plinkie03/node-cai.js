import { BaseIconURL } from "../../constants"
import { CharacterAI } from "../../core/CharacterAI"
import { CharacterAIPage } from "../../core/CharacterAIPage"

export interface ICharacter {
    external_id: string
    title: string
    name: string
    visibility: "PUBLIC" | "PRIVATE"
    copyable: boolean
    greeting: string
    description: string
    identifier: string
    avatar_file_name: string
    songs: unknown[],
    img_gen_enabled: boolean
    base_img_prompt: string
    img_prompt_regex: string
    strip_img_prompt_from_msg: boolean
    default_voice_id: null
    starter_prompts: null
    comments_enabled: boolean
    user__username: string
    participant__name: string
    participant__num_interactions: number
    participant__user__username: string
    voice_id: number
    usage: string
}

export class Character {
    public constructor(
        private readonly page: CharacterAIPage,
        public readonly data: ICharacter
    ) {}
    
    public get internalId() {
        return this.data.participant__user__username
    }

    public get characterId() {
        return this.data.external_id
    }

    public get name() {
        return this.data.name
    }

    public get description() {
        return this.data.description
    }

    public get id() {
        return this.data.identifier
    }
    
    public get interactions() {
        return this.data.participant__num_interactions
    }

    public get voiceId() {
        return this.data.voice_id
    }

    public get greeting() {
        return this.data.greeting
    }

    public get avatar() {
        return `${BaseIconURL}/${this.data.avatar_file_name}`
    }

    public getHistory() {
        return this.page.getHistory(this.characterId)
    }
}