import {defineConfig} from '@junobuild/config';

/** @type {import('@junobuild/config').JunoConfig} */
export default defineConfig(({ mode }) => ({
  satellite: {
    id:
      mode === "staging"
        ? "zggvx-3aaaa-aaaal-adxyq-cai"
        : "iub34-wyaaa-aaaal-ai7fa-cai",
    source: 'dist',
    "storage": {
      "iframe": "allow-any"
    }
  }
}));