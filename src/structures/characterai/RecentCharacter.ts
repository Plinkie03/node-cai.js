import { BaseIconURL, Endpoints } from "../../constants"
import { CharacterAIPage } from "../../core/CharacterAIPage"
import { IRequest } from "../Request"

export interface IRecentCharacter {
    external_id: string
    title: string
    greeting: string
    description: string
    avatar_file_name: string
    visibility: "PUBLIC" | "PRIVATe"
    copyable: boolean
    participant__name: string
    user__username: string
    img_gen_enabled: boolean
    default_voice_id: null | number
    max_last_interaction: string
}

export class RecentCharacter {
    public constructor(
        private readonly page: CharacterAIPage,
        public readonly data: IRecentCharacter
    ) {}

    public get name() {
        return this.data.participant__name
    }

    public get avatar() {
        return `${BaseIconURL}/${this.data.avatar_file_name}`
    }

    public get description() {
        return this.data.description
    }

    public get voiceId() {
        return this.data.default_voice_id
    }

    public get greeting() {
        return this.data.greeting
    }

    public get canGenerateImages() {
        return this.data.img_gen_enabled
    }

    public get lastInteractionAt() {
        return new Date(this.data.max_last_interaction)
    }

    public get copyable() {
        return this.data.copyable
    }

    public get characterId() {
        return this.data.external_id
    }

    public fetch() {
        return this.page.getCharacterInfo(this.characterId)
    }
}

export class RecentCharacterList extends Array<RecentCharacter> {
    constructor(
        private readonly page: CharacterAIPage,
        data: IRequest[typeof Endpoints.RecentCharacters][1]
    ) {
        super(...data.characters.map(x => new RecentCharacter(page, x)))
    }
}