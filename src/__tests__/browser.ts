import { CharacterAI } from "../core/CharacterAI";
import dotenv from "dotenv"
dotenv.config()

const cai = new CharacterAI({
    token: process.env.TOKEN as string,
    headless: true
})

cai.browser.init().then(async () => {
    console.log(await cai.call("searchCharacters", "hello"))
    return null
})