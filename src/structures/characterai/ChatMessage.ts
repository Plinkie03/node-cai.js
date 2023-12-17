import { BaseIconURL } from "../../constants"
import { CharacterAIPage } from "../../core/CharacterAIPage"
import { Chat } from "./Chat"

export interface IChatMessage {
    id: number
    uuid: string,
    text: string
    src: string
    tgt: string
    is_alternative: boolean
    image_rel_path: string
    image_prompt_text: string
    deleted: null
    src__name: string
    src__user__username: string
    src__is_human: false,
    src__character__avatar_file_name: string
    src_char: {
        participant: {
            name: string
        }
        avatar_file_name: string
    },
    responsible_user__username: string | null
}

export class ChatMessage {
    public constructor(
        private readonly page: CharacterAIPage,
        private readonly chat: Chat,
        public readonly data: IChatMessage
    ) {}

    public get uuid() {
        return this.data.uuid
    }

    public get image() {
        return this.data.image_rel_path
    }

    public get deleted() {
        return !!this.data.deleted
    }

    public get name() {
        return this.data.src__name
    }

    public get isHuman() {
        return this.data.src__is_human
    }
    
    public get responsibleUsername() {
        return this.data.responsible_user__username
    }

    public get avatar() {
        return `${BaseIconURL}/${this.data.src__character__avatar_file_name}`
    }
    
    public get content() {
        return this.data.text
    }

    public delete() {
        return this.chat.deleteMessages([ this.uuid ])
    }
}