import { CharacterAI } from "../core/CharacterAI";
import dotenv from "dotenv"
dotenv.config()

const cai = new CharacterAI({
    token: process.env.TOKEN as string,
    headless: false
})

cai.browser.init().then(async () => {
    const char = await cai.call("searchCharacters", "silvervale").then(x => x[0])
    console.log(await cai.call("getFeaturedCharacters"))
    return null
})