export default class ComponentRegistry {
    private schemas = new Map<string, any>();
    private stores = new Map<string, Map<number, any>>();

    registerComponent(name: string, schema: any): void {
        if (this.schemas.has(name)) {
            throw new Error(`Component ${name} is already registered.`);
        }
        this.schemas.set(name, schema);
        this.stores.set(name, new Map());
    }
    getSchema(name: string): any {
        return this.schemas.get(name);
    }

    getStore(name: string): Map<number, any> {
        const store = this.stores.get(name);
        if (!store) throw new Error(`Component "${name}" not found.`);
        return store;
    }
    getAllComponentNames() {
        return [...this.schemas.keys()];
    }
    getComponentForEntity(name: string, entityId: number) {
        return this.getStore(name).get(entityId);
    }
    setComponentForEntity(name: string, entityId: number, data: any) {
        this.getStore(name).set(entityId, data);
    }
    removeComponentForEntity(name: string, entityId: number) {
        this.getStore(name).delete(entityId);
    }
    getAllEntitiesWithComponent(name: string): IterableIterator<[number, any]> {
        return this.getStore(name).entries();
    }
}
