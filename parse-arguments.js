var program = require('commander');

module.exports = function parseArguments(args) {
    program
        .version('0.0.2')
        .option('-s --start [start]', 'Starting key', 'AAAAAA')
        .option('-t --accessToken [accessToken]', 'Access token')
        .parse(args);

    if(!program.accessToken) {
        console.error('No accessToken provided');
        process.exit(1);
    }

    return {
        start: program.start,
        accessToken: program.accessToken
    };
}