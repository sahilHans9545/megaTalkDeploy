import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // resolve: {
  //   alias:
  // [
  //   {
  //     find: "components",
  //     replacement: path.resolve(__dirname, "src/components"),
  //   },
  //   {
  //     find: "pages",
  //     replacement: path.resolve(__dirname, "src/pages"),
  //   },
  //   {
  //     find: "assets",
  //     replacement: path.resolve(__dirname, "src/assets"),
  //   },
  //   {
  //     find: "store",
  //     replacement: path.resolve(__dirname, "src/store"),
  //   },
  //   {
  //     find: "ApiCalls",
  //     replacement: path.resolve(__dirname, "src/ApiCalls"),
  //   },
  //   {
  //     find: "config",
  //     replacement: path.resolve(__dirname, "src/config"),
  //   },
  //   {
  //     find: "utils",
  //     replacement: path.resolve(__dirname, "src/utils"),
  //   },
  // ],

  // {
  //   "@components": path.resolve(__dirname, "src/components"),
  //   "@pages": path.resolve(__dirname, "src/pages"),
  //   "@assets": path.resolve(__dirname, "src/assets"),
  //   "@store": path.resolve(__dirname, "src/store"),
  //   "@ApiCalls": path.resolve(__dirname, "src/ApiCalls"),
  //   "@config": path.resolve(__dirname, "src/config"),
  //   "@utils": path.resolve(__dirname, "src/utils"),
  // },
  // },
});
