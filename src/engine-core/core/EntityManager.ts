type EntityId = number; 
export default class EntityManager {
    private nextId: EntityId = 1;
    private entities: Set<EntityId> = new Set();
    
    createEntity(): EntityId {
        const id = this.nextId++;
        this.entities.add(id);
        return id;
    }
    destroyEntity(id: EntityId): void {
        if (this.entities.has(id)) {
            this.entities.delete(id);
        } else {
            throw new Error(`Entity with id ${id} does not exist.`);
        }
    }
}