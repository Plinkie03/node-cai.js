export const ApiURL = "https://beta.character.ai"
export const NeoApiURL = "https://neo.character.ai"

export const Endpoints = {
    Authentication: `${ApiURL}/dj-rest-auth/auth0/`,
    SendMessage: `${ApiURL}/chat/streaming/`,
    CharacterHistoryV2: `${ApiURL}/chat/character/histories_v2/`,
    CharacterCreateHistory: `${ApiURL}/chat/history/create/`,
    GetCharacterInfo: `${ApiURL}/chat/character/info/`,
    ContinueChat: `${ApiURL}/chat/history/continue/`,
    SearchCharacters: `${ApiURL}/chat/characters/search/`,
    UploadImage: `${ApiURL}/chat/upload-image/`,
    RecentCharacters: `${ApiURL}/chat/characters/recent/`,
    CreateImage: `${ApiURL}/chat/generate-image/`,
    DeleteMessages: `${ApiURL}/chat/history/msgs/delete/`,
    MessageHistory: `${ApiURL}/chat/history/msgs/user/`,
    FeaturedCharacters: `${NeoApiURL}/recommendation/v1/featured`
} as const satisfies Record<string, string>

export const BaseGenerateImageURL = `https://characterai.io/static/tti` as const
export const BaseUploadImageURL = `https://characterai.io/i/400/static/user` as const
export const BaseIconURL = `https://characterai.io/i/80/static/avatars` as const
