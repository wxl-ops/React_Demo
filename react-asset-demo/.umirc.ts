import { defineConfig } from "umi";

export default defineConfig({
  plugins: ["@umijs/plugins/dist/react-query"],
  reactQuery: {},
  routes: [
    // { path: "/", component: "index" },
    { path: "/", component: "index", name: "home" },
    // { path: "/docs", component: "docs" },
    { path: "/docs", component: "docs", name: "docs" },
    // { path: "/products", component: "products" },
    { path: "/products", component: "products", name: "products" },
  ],
  npmClient: "pnpm",
});
