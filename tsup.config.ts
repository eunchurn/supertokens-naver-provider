import { defineConfig } from "tsup";

export default defineConfig((options) => ({
  entry: ["src/index.ts"],
  splitting: false,
  sourcemap: false,
  clean: true,
  treeshake: true,
  shims: true,
  dts: true,
  format: ["esm", "cjs"],
  minify: options.watch ? undefined : "terser",
  terserOptions: {
    compress: !options.watch,
  },
  tsconfig: options.watch ? "tsconfig.json" : "tsconfig.build.json",
}));
