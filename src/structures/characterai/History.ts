import { CharacterAI } from "../../core/CharacterAI"
import { CharacterAIPage } from "../../core/CharacterAIPage"

export interface ICharacterHistoryLog {
    external_id: string
    last_interaction: string
    created: string
    msgs: unknown[]
}

export interface IHistory {
    histories: ICharacterHistoryLog[]
}

export class History {
    public constructor(
        private readonly page: CharacterAIPage,
        public readonly data: ICharacterHistoryLog
    ) {}

    public get historyId() {
        return this.data.external_id
    }
}