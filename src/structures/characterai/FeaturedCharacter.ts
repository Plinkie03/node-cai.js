import { BaseIconURL, Endpoints } from "../../constants"
import { CharacterAIPage } from "../../core/CharacterAIPage"
import { IRequest } from "../Request"

export interface IFeaturedCharacter {
    external_id: string
    name: string
    participant__name: string
    participant__num_interactions: number
    title: string
    greeting: string
    visibility: string
    avatar_file_name: string
    img_gen_enabled: boolean
    user__username: string
    translations: {
        name: Record<string, string>
        title: Record<string, string>
        greeting: Record<string, string>
    }
}

export class FeaturedCharacter {
    public constructor(
        private readonly page: CharacterAIPage,
        public readonly data: IFeaturedCharacter
    ) {}

    public get internalId() {
        return this.data.participant__name
    }

    public get characterId() {
        return this.data.external_id
    }

    public get name() {
        return this.data.name
    }
    
    public get interactions() {
        return this.data.participant__num_interactions
    }

    public get greeting() {
        return this.data.greeting
    }

    public get translations() {
        return this.data.translations
    }

    public get avatar() {
        return `${BaseIconURL}/${this.data.avatar_file_name}`
    }
}

export class FeaturedCharacterList extends Array<FeaturedCharacter> {
    public constructor(
        private readonly page: CharacterAIPage,
        data: IRequest[typeof Endpoints.FeaturedCharacters][1]
    ) {
        super(...data.characters.map(x => new FeaturedCharacter(page, x)))
    }
}