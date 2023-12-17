import { BaseGenerateImageURL } from "../../constants"
import { Character } from "./Character"
import { Chat, IMessageOptions } from "./Chat"

export interface IUserMessage {
    history_external_id: string
    character_external_id: string
    text: string
    tgt: string
    ranking_method: string
    staging: boolean
    model_server_address: null,
    model_server_address_exp_chars: null
    override_prefix: null
    rooms_prefix_method: string
    override_rank: null
    rank_candidates: null
    filter_candidates: null
    unsanitized_characters: null
    prefix_limit: null
    prefix_token_limit: null
    stream_params: null
    traffic_source: null
    model_properties_version_keys: string
    enable_tti: null
    initial_timeout: null
    insert_beginning: null
    stream_every_n_steps: number
    is_proactive: boolean
    image_rel_path: string
    image_description: string
    image_description_type: string
    image_origin_type: string
    voice_enabled: boolean
    parent_msg_uuid: null
    seen_msg_uuids: unknown[]
    retry_last_user_msg_uuid: null
    num_candidates: number
    give_room_introductions: boolean
    mock_response: boolean
}

export class UserMessage {
    public readonly data: IUserMessage

    public constructor(
        options: IMessageOptions
    ) {
        this.data = {
            history_external_id: options.historyId,
            character_external_id: options.externalId,
            text: options.content,
            tgt: options.internalId,
            ranking_method: "random",
            staging: false,
            model_server_address: null,
            model_server_address_exp_chars: null,
            override_prefix: null,
            rooms_prefix_method: "",
            override_rank: null,
            rank_candidates: null,
            filter_candidates: null,
            unsanitized_characters: null,
            prefix_limit: null,
            prefix_token_limit: null,
            stream_params: null,
            traffic_source: null,
            model_properties_version_keys: "",
            enable_tti: null,
            initial_timeout: null,
            insert_beginning: null,
            stream_every_n_steps: 16,
            is_proactive: false,
            image_rel_path: options.image ?? "",
            image_description: "",
            image_description_type: "",
            image_origin_type: options.image ? options.image.includes(BaseGenerateImageURL) ? "GENERATED" : "UPLOADED" : "",
            voice_enabled: false,
            parent_msg_uuid: null,
            seen_msg_uuids: [],
            retry_last_user_msg_uuid: null,
            num_candidates: 1,
            give_room_introductions: true,
            mock_response: false
        }
    }

    public toJSON() {
        return this.data
    }
}