import { defineConfig } from "tsup";
import tsupConfig from "@repo/config/tsupconfig-base.json" with {
    type: "json",
};

export default defineConfig({
    ...tsupConfig,
    entry: ["src/index.ts", "src/handlers.ts", "src/types/index.ts"],
});
