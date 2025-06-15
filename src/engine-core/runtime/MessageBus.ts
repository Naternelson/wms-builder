type Message = {
    type: string;
    payload?: any;
};

export default class MessageBus {
    private handlers: Map<string, ((payload: any) => void)[]> = new Map();
    subscribe(type: string, handler: (payload: any) => void): void {
        if (!this.handlers.has(type)) {
            this.handlers.set(type, []);
        }
        this.handlers.get(type)?.push(handler);
    }
    publish(message: Message): void {
        const handlers = this.handlers.get(message.type);
        if (handlers) {
            for (const handler of handlers) {
                handler(message.payload);
            }
        } else {
            console.warn(`No handlers for message type: ${message.type}`);
        }
    }
}
