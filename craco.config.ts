/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */

// craco config file documentation:
// https://github.com/gsoft-inc/craco/blob/master/packages/craco/README.md#configuration-file

const CracoEsbuildPlugin = require('craco-esbuild');

export default () => ({
  plugins: [{ plugin: CracoEsbuildPlugin }],
});
