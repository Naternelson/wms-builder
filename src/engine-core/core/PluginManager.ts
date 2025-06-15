import { EngineContext } from "./EngineCore";

export interface Plugin {
    setup(context: EngineContext): void;
    name: string;
    label?: string;
    description?: string;
    version?: string;
}

export class PluginManager {
    private plugins: Plugin[] = [];

    register(plugin: Plugin): void {
        this.plugins.push(plugin);
    }

    setupAll(context: EngineContext): void {
        for (const plugin of this.plugins) {
            plugin.setup(context);
        }
    }
}
