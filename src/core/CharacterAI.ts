import { CharacterAIBrowser, OnlyInstanceMethods } from "./CharacterAIBrowser";
import { CharacterAIPage } from "./CharacterAIPage";

export interface ICharacterAIOptions {
    token: string
    screen?: [w: number, h: number]
    headless?: boolean | "new"
}

export class CharacterAI {
    public readonly browser = new CharacterAIBrowser(this);

    public constructor(public readonly options: ICharacterAIOptions) {}

    /**
     * Quick shortcut for calling methods on pages.
     * @param method
     * @param params
     * @returns
     */
    public async call<T extends keyof OnlyInstanceMethods<CharacterAIPage>>(
        method: T,
        ...params: Parameters<OnlyInstanceMethods<CharacterAIPage>[T]>
    ): Promise<Awaited<ReturnType<OnlyInstanceMethods<CharacterAIPage>[T]>>> {
        return this.browser.call(method, ...params)
    }

    public async init() {
        return this.browser.init()
    }
}
