
var serverlessSDK = require('./serverless_sdk/index.js');
serverlessSDK = new serverlessSDK({
  orgId: 'adriannaestelleguevarra',
  applicationName: 'music-api-app',
  appUid: 'qvdr8XQN2DSBqCMGbM',
  orgUid: '9a4bcc85-3da5-456d-8b1d-2c3e95ccfec2',
  deploymentUid: 'aa1dee17-0184-43e8-a6cf-85de169ce427',
  serviceName: 'music-api',
  shouldLogMeta: true,
  shouldCompressLogs: true,
  disableAwsSpans: false,
  disableHttpSpans: false,
  stageName: 'dev',
  serverlessPlatformStage: 'prod',
  devModeEnabled: false,
  accessKey: null,
  pluginVersion: '4.5.1',
  disableFrameworksInstrumentation: false
});

const handlerWrapperArgs = { functionName: 'music-api-dev-music-api', timeout: 6 };

try {
  const userHandler = require('.//handler.js');
  module.exports.handler = serverlessSDK.handler(userHandler.musicapi, handlerWrapperArgs);
} catch (error) {
  module.exports.handler = serverlessSDK.handler(() => { throw error }, handlerWrapperArgs);
}