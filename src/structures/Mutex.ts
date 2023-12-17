export type ITask = (...args: any[]) => any | Promise<any>

/**
 * Locks async operations to be run in order, 1 by 1.
 */
export class Mutex {
    private readonly queue = new Array<ITask>()
    private locked = false

    public async lock<T extends ITask>(task: T) {
        return new Promise<T extends (...args: any[]) => infer P ? Awaited<P> : never>(async (r, j) => {
            if (this.locked) {
                return this.queue.push(task)
            }

            this.locked = true
            
            try {
                r(await task())
            } catch (error: any) {
                j(error)
            }

            this.unlock()
            return
        })
    }

    private unlock() {
        this.locked = false
        const next = this.queue.shift()
        if (next)
            this.lock(next)
    }
}