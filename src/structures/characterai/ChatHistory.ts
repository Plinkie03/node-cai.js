import { Endpoints } from "../../constants";
import { CharacterAIPage } from "../../core/CharacterAIPage";
import { Chat } from "./Chat";
import { ChatMessage } from "./ChatMessage";
import { IRequest } from "../Request";

export class ChatHistory {
    public constructor(
        private readonly page: CharacterAIPage,
        private readonly chat: Chat,
        private readonly data: IRequest[typeof Endpoints.MessageHistory][1]
    ) {}

    public get messages() {
        return this.data.messages.map(x => new ChatMessage(this.page, this.chat, x))
    }

    public get hasMore() {
        return this.data.has_more
    }

    public get nextPage() {
        return this.data.next_page
    }

    public deleteAll() {
        return this.deleteMessages(this.messages.filter(x => x.isHuman))
    }
    
    public deleteMessages(messages: (ChatMessage | string)[]) {
        return this.chat.deleteMessages(messages.map(x => x instanceof ChatMessage ? x.uuid : x))
    }
}