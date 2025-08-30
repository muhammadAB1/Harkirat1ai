import { Message } from "./types.js";

const EVICTION_TIME = 5 * 60 * 1000
const EVICTION_CLOCK_TIME = 1 * 60 * 1000

export class inMemoryStore {
    private static instance: inMemoryStore;

    private store: Record<string, {
        messages: Message[],
        evictionTime: number
    }>;

    private clock: NodeJS.Timeout;

    private constructor() {
        this.store = {};
        this.clock = setInterval(() => {
            Object.entries(this.store).forEach(([key, { evictionTime }]) => {
                if (evictionTime > Date.now()) {
                    delete this.store[key]
                }
            })
        }, EVICTION_CLOCK_TIME)
    }

    public destroy() {
        clearInterval(this.clock)
    }

    static getInstance() {
        if (!inMemoryStore.instance) {
            inMemoryStore.instance = new inMemoryStore()
        }
        return inMemoryStore.instance
    }

    get(conversationId: string): Message[]{
        return this.store[conversationId]?.messages ?? []
    }

    add(converstaionId: string, message: Message) {
        if (!this.store[converstaionId]) {
            this.store[converstaionId] = {
                messages: [],
                evictionTime: Date.now() + EVICTION_TIME
            }
        }

        this.store[converstaionId].messages.push(message)
    }
}