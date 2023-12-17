import { existsSync, readFileSync } from "fs"
import { fetch } from "undici"
import { BaseGenerateImageURL } from "../constants"

export interface ImageData {
    name: string
    type: string
    buffer: Buffer | null
    generated: boolean
}

export class Image {
    public static readonly NameRegex = /\//g

    public static async fetch(path: string): Promise<ImageData> {
        const splits = path.split(Image.NameRegex)
        const name = splits.at(-1) || splits.at(-2)!
        const type = name.split(".").at(-1)!
        const generated = path.includes(BaseGenerateImageURL)

        return {
            name,
            type,
            generated,
            buffer: generated ? null : existsSync(path) ? readFileSync(path) : Buffer.from(await fetch(path).then(x => x.arrayBuffer()))
        }
    }
}