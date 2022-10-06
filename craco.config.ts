/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */

// craco config file documentation:
// https://github.com/gsoft-inc/craco/blob/master/packages/craco/README.md#configuration-file

const CracoEsbuildPlugin = require('craco-esbuild');
const path = require('path');

export default () => ({
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [{ plugin: CracoEsbuildPlugin, options: { skipEsbuildJest: true } }],
});
