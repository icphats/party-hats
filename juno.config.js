import {defineConfig} from '@junobuild/config';

/** @type {import('@junobuild/config').JunoConfig} */
export default defineConfig({
  satellite: {
    id: 'zggvx-3aaaa-aaaal-adxyq-cai',
    source: 'dist',
    "storage":{
      "headers":[
        ["Content-Security-Policy", "default-src 'self';script-src 'self' 'unsafe-eval';connect-src 'self' https://icp0.io https://*.icp0.io;img-src 'self' data:;style-src * 'unsafe-inline';style-src-elem * 'unsafe-inline';font-src *;object-src 'none';base-uri 'self';frame-ancestors 'self' https://desktop.windoge98.com https://windoge98.com ;form-action 'self';upgrade-insecure-requests;"]]
    }
  }
});
