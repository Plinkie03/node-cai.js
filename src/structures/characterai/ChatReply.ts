import { BaseIconURL } from "../../constants";
import { CharacterAI } from "../../core/CharacterAI";
import { CharacterAIPage } from "../../core/CharacterAIPage";

export interface IChatReply {
    replies: [
        {
            text: string
            uuid: string
            id: number
        }
    ];
    src_char: {
        participant: {
            name: string
        }
        avatar_file_name: string
    }
    is_final_chunk: boolean
    last_user_msg_id: number
    last_user_msg_uuid: string
}

export class ChatReply {
    public constructor(
        private readonly page: CharacterAIPage,
        public readonly data: IChatReply
    ) {}

    public get content() {
        return this.data.replies[0].text
    }

    public get name() {
        return this.data.src_char.participant.name
    }

    public get icon() {
        return `${BaseIconURL}/${this.data.src_char.avatar_file_name}`
    }
}