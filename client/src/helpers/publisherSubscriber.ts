type Event = {
    [key: string]: object,
}

type Subscribe<E extends Event> = <Key extends string & keyof E>(
    event: Key,
    callback: (arg: E[Key]) => void
) => () => void;

type Publish<E extends Event> = <Key extends string & keyof E>(
    event: Key,
    argument: E[Key]
) => void;

type Subscriptions<E extends Event> = <Key extends string & keyof E>(arg: E[Key]) => void;

class PublisherSubscriber<E extends Event> {
    private readonly handlers: {
        [key: string]: Map<number, Subscriptions<any>>
    };
    private count: number;

    constructor() {
        this.count = 0;
        this.handlers = {};
    }

    public publish: Publish<E> = (event, argument) => {
        this.handlers[event].forEach(h => h(argument))
    }

    public subscribe: Subscribe<E> = (event, callback) => {
        const map = this.handlers[event] ?? new Map<Number, Subscriptions<E>>();
        map.set(this.count, callback);
        this.handlers[event] = map

        const subId = this.count;
        this.count++;
        
        return () => { this.unsubscribe(event, subId) };
    }

    private unsubscribe = (event: string, subId: number) => {
        this.handlers[event].delete(subId);
    }    
};

export { PublisherSubscriber };
