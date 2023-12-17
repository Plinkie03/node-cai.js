## node-cai.js
### Inspired on [node_characterai](https://github.com/realcoloride/node_characterai) from [realcoloride](https://github.com/realcoloride).

#### Example
```ts
import { CharacterAI } from "node-cai.js"
const cai = new CharacterAI({
    token: "your access token"
})

async function main() {
    await cai.init()

    const chat = await cai.call("createOrContinueChat", "CXZ3YpSOdhcsq_KP7RRArDbme249ReF25rHVRoWfazw") // Character ID

    console.log(
        await chat.sendMessage({
            content: "Hello!"
        })
    )
}

main()
```

This project is built with TypeScript