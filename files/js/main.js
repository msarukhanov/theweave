require.config({
    paths: {
        'angular': '/lib/angular.min',
        'ngRoute': '/lib/angular-route.min'
    },
    shim: {
        'angular': {
            exports: 'angular'
        },
        'ngRoute': {
            deps: ['angular']
        }
    },
    deps: [
        './app'
    ]
});
