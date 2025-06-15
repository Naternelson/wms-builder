import { System } from "../core/System";

export class TickScheduler {
    private systems: System [] = [];
    private lastTime: number = performance.now();

    register(system: System): void {
        this.systems.push(system);
    }

    async tick(): Promise<void> {
        const now = performance.now();
        const deltaTime = (now - this.lastTime)
        this.lastTime = now;
        
        for (const system of this.systems) {
            system.update(deltaTime);
        }
    }
}