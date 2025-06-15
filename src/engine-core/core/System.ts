export interface SystemType {
    name: string;
    label?: string;
    enabled?: boolean;
    description?: string;
    once?: boolean;
    priority?: number;
    onUpdate?(deltaTime: number): void;
    disableOnError?: boolean; // Optional property to disable on error
}

export class SystemManager {
    name: string;
    label?: string;
    enabled = true;
    description?: string;
    once = false;
    priority = 0;
    onUpdate?: (deltaTime: number) => void;
    error = false;
    disableOnError = false; // Optional property to disable on error
    constructor(props: SystemType) {
        this.name = props.name;
        this.label = props.label;
        this.enabled = props.enabled ?? true;
        this.description = props.description;
        this.once = props.once ?? false;
        this.priority = props.priority ?? 0;
        this.onUpdate = props.onUpdate;
        this.disableOnError = props.disableOnError ?? false;
        this.error = false;
    }

    update(deltaTime: number): void {
        if (!this.enabled) return;
        if (this.onUpdate) {
            try {
                this.onUpdate(deltaTime);
            } catch (error) {
                console.error(`Error in system ${this.name}:`, error);
                this.error = true; // Mark system as errored
                if (this.disableOnError) {
                    this.enabled = false; // Disable the system on error
                }
                return;
            }
        }

        if (this.once) {
            this.enabled = false; // Disable after first update
        }
    }
    disable(): void {
        this.enabled = false;
    }
    enable(): void {
        this.enabled = true;
    }
}
