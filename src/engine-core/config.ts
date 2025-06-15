export type EngineConfigType = {
    tickInterval: number; // Interval in milliseconds for the engine tick
    tickTimeout: number; // Optional timeout for the tick, if not provided it will use the default tickInterval
};

export const EngineConfig: EngineConfigType = {
    tickInterval: 200,
    tickTimeout: 30000 // If a Tick takes longer than this, the engine will stop
};