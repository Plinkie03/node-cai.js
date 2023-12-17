import { BaseIconURL } from "../../constants"
import { CharacterAIPage } from "../../core/CharacterAIPage"

export interface ISearch {
    characters: ICharacterSearch[]
}

export interface ICharacterSearch {
    document_id: string
    external_id: string
    title: string
    greeting: string
    avatar_file_name: string
    visibility: "PUBLIC" | "PRIVATE",
    participant__name: string
    participant__num_interactions: number
    user__username: string
    priority: number
    search_score: number
}

export class SearchCharacter {
    public constructor(
        private readonly page: CharacterAIPage,
        public readonly data: ICharacterSearch
    ) {}

    public get name() {
        return this.data.participant__name
    }

    public get priority() {
        return this.data.priority
    }

    public get characterId() {
        return this.data.external_id
    }

    public get title() {
        return this.data.title
    }

    public get visibility() {
        return this.data.visibility
    }

    public get greeting() {
        return this.data.greeting
    }

    public get searchScore() {
        return this.data.search_score
    }

    public get interactions() {
        return this.data.participant__num_interactions
    }

    public get avatar() {
        return `${BaseIconURL}/${this.data.avatar_file_name}`
    }

    public fetch() {
        return this.page.getCharacterInfo(this.characterId)
    }
}

export class SearchCharacterList extends Array<SearchCharacter> {
    public constructor(
        private readonly page: CharacterAIPage,
        data: ISearch
    ) {
        super(...data.characters.map(x => new SearchCharacter(page, x)))
    }
}