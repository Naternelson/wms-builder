import EntityManager from "./EntityManager";
import MessageBus from "../runtime/MessageBus";
import { Plugin, PluginManager } from "./PluginManager";
import { TickScheduler } from "../runtime/TickScheduler";
import { System } from "./System";
import ComponentRegistry from "./ComponentRegistry";
import { EngineConfig, EngineConfigType } from "../config";

export interface EngineContext {
    entityManager: EntityManager;
    scheduler: TickScheduler;
    messageBus: MessageBus;
    components: ComponentRegistry
    registerSystem: (system: System) => void; // Optional method for registering systems
    registerComponent: (name: string, schema: any) => void; // Optional method for registering components
}

export enum EngineState {
    UNINITIAL,
    INITIALIZING,
    INITIALIZED,
    RUNNING,
    PAUSED,
    STOPPED,
    ERROR 
}

export default class EngineCore {
    context: EngineContext;
    plugins = new PluginManager();
    private _config: EngineConfigType; // Configuration for the engine
    get config(): EngineConfigType {
        return this._config;
    }
    private tickTimeout: NodeJS.Timeout | null = null;
    private _state: EngineState; // Engine state: uninitialized, running, paused, stopped
    get state(): EngineState {
        return this._state;
    }
    constructor(config: EngineConfigType = EngineConfig) {
        this._config = config; // Initialize engine configuration
        this._state = EngineState.UNINITIAL; // Initial state of the engine
        const entityManager = new EntityManager();
        const scheduler = new TickScheduler();
        const messageBus = new MessageBus();
        const components = new ComponentRegistry();
        this.context = {
            entityManager,
            scheduler,
            messageBus,
            components,
            registerSystem: (system: System) => {
                scheduler.register(system);
            },
            registerComponent: (name: string, schema: any) => {
                components.registerComponent(name, schema);
            },
        };
    }

    registerPlugin(plugin: Plugin): void {
        this.plugins.register(plugin);
    }
    start() {
        const readyStates = [EngineState.UNINITIAL, EngineState.INITIALIZING, EngineState.INITIALIZED];
        if (!readyStates.includes(this.state)) {
            throw new Error(
                `Engine is not in a state to start. Current state: ${this.state}`
            );
        }
        try {
            if (this.state === EngineState.UNINITIAL) {
                this.reset(); // Reset the engine if it was uninitialized
                this.initialize(); // Initialize the engine
            }
        } catch (error) {
            console.error("Error during engine initialization:", error);
            this._state = EngineState.ERROR; // Reset state on error
            throw error; // Re-throw the error after logging
        }
        try {
            this._state = EngineState.RUNNING; // Change state to running
            this.loop();
        } catch (error) {
            console.error("Error during engine loop:", error);
            this._state = EngineState.ERROR; // Reset state on error
            throw error; // Re-throw the error after logging
        }
    }
    reset(): void {
        if (this.tickTimeout) {
            clearTimeout(this.tickTimeout);
            this.tickTimeout = null;
        }
        this._state = EngineState.UNINITIAL; // Reset state to uninitialized
        this.context.entityManager = new EntityManager();
        this.context.scheduler = new TickScheduler();
        this.context.messageBus = new MessageBus();
        this.context.components = new ComponentRegistry();
        this.plugins = new PluginManager(); // Reset plugins
    }
    pause(): void {
        const readyStates = [EngineState.RUNNING, EngineState.INITIALIZED];
        if (!readyStates.includes(this.state)) {
            throw new Error(
                `Engine is not in a state to pause. Current state: ${this.state}`
            );
        }
        if (this.state === EngineState.RUNNING) {
            this._state = EngineState.PAUSED; // Change state to paused
            if (this.tickTimeout) {
                clearTimeout(this.tickTimeout);
                this.tickTimeout = null; // Clear the timeout
            }
        }
    }
    private initialize(): void {
        this._state = EngineState.INITIALIZING; // Change state to intializing
        this.plugins.setupAll(this.context);
        this._state = EngineState.INITIALIZED; // Change state to initialized
    }
    private loop(): void {
        const startTime = performance.now();
        this.context.scheduler.tick();
        const elapsedTime = performance.now() - startTime;
        const waitTime = Math.max(0, this._config.tickInterval - elapsedTime);
        if (waitTime > 0) {
            this.tickTimeout = setTimeout(() => this.loop(), waitTime);
        } else {
            // If the tick took longer than the interval, we just call the loop again immediately
            this.loop();
        }
    }
}
