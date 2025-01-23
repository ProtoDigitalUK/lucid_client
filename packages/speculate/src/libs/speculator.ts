import type { SpeculatorConfig } from "../types.js";

class Speculator<T> {
    constructor(private config: SpeculatorConfig<T>) { }
}

export default Speculator;
