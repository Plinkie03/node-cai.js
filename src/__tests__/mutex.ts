import { setTimeout } from "timers/promises"
import { Mutex } from "../structures/Mutex"

let i = 0
async function modify(x: number) {
    await setTimeout(1000)
    i = x
    console.log(`Set to ${x}`)
}

const mutex = new Mutex()
async function main() {
    for (let i = 0;i < 5;i++) {
        await mutex.lock(modify.bind(null, i))
    }
}

main()