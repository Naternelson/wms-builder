export class ComponentStore<T> {
    private store = new Map<number, T>();

    set(entityId: number, component: T): void {
        this.store.set(entityId, component);
    }

    get(entityId: number): T | undefined {
        return this.store.get(entityId);
    }

    has(entityId: number): boolean {
        return this.store.has(entityId);
    }

    entries(): IterableIterator<[number, T]> {
        return this.store.entries();
    }
}
