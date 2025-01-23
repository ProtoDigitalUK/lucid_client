import { defineConfig } from "tsup";
import tsupConfig from "@repo/config/tsupconfig-base.json" with {
    type: "json",
};

export default defineConfig(tsupConfig);
