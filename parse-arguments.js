const program = require('commander');
const path = require('path');

module.exports = function parseArguments(args) {
    program
        .version('0.0.2')
        .option('-s --start [start]', 'Starting key', 'AAAAAA')
        .option('-o --outDir [outDir]', 'Output directiry', __dirname)
        .option('-t --accessToken [accessToken]', 'Access token')
        .parse(args);

    if(!program.accessToken) {
        console.error('No accessToken provided');
        process.exit(1);
    }

    if(program.outDir[program.outDir.length - 1] !== path.sep) {
        program.outDir = `${program.outDir}${path.sep}`
    }

    return {
        start: program.start,
        accessToken: program.accessToken,
        outDir: program.outDir
    };
}