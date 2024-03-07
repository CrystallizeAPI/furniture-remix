/**
 * @type {import('@remix-run/dev').AppConfig}
 * {import}
 */

module.exports = {
    ignoredRouteFiles: ['.*'],
    appDirectory: 'src',
    dev: {
        port: 8002,
    },
    serverModuleFormat: 'cjs',
};
