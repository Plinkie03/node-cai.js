import { Endpoints } from "../../constants";
import { CharacterAIPage } from "../../core/CharacterAIPage";
import { Chat } from "./Chat";
import { ChatMessage } from "./ChatMessage";
import { IRequest } from "../Request";

export class ChatHistory extends Array<ChatMessage> {
    public constructor(
        private readonly page: CharacterAIPage,
        private readonly chat: Chat,
        private readonly data: IRequest[typeof Endpoints.MessageHistory][1]
    ) {
        super(...data.messages.map(x => new ChatMessage(page, chat, x)))
    }

    public get hasMore() {
        return this.data.has_more
    }

    public get nextPage() {
        return this.data.next_page
    }

    public deleteAll() {
        return this.deleteMessages(this.filter(x => x.isHuman))
    }
    
    public deleteMessages(messages: (ChatMessage | string)[]) {
        return this.chat.deleteMessages(messages.map(x => x instanceof ChatMessage ? x.uuid : x))
    }
}