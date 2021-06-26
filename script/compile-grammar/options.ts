//#region Imports

import { MaybePromisedType } from 'tsdef'
import yargs from 'yargs/yargs'

import { paths, targets } from './configuration'

//#endregion Imports

export const options =
  // Fix for broken yargs types
  (<T>(poorlyTyped: T): MaybePromisedType<T> =>
    (poorlyTyped as MaybePromisedType<T>)
  )(yargs(process.argv.slice(1))
    .options({
        trace:
        {
            boolean: true,
            description: "Trace yaml parsing to stdout",
            alias: ['t']
        },
        verbose:
        {
            boolean: true,
            description: "Enable verbose output",
            alias: ['v']
        },
        ['dry-run']:
        {
            boolean:true,
            description: "Transpile source, but don't update output file.",
            // conflicts: ['input-file'],
            alias: ['d']
        },
        ['wait']:
        {
            description: "Wait for first change to transpile input.",
            boolean: true,
            alias: ['w'],
        },
        ['once']:
        {
            description: "Transpile immediately and exit.",
            boolean: true,
            conflicts: ['wait'],
            alias: ['O']
        },
        ['out-file']:
        {
            string: true,
            description: "Output file path for transpiled json grammar.",
            default: targets.output,
            requiresArg: true,
            alias: ['o']
        },
        ['input-file']:
        {
            string: true,
            description: "Path of input YAML grammar",
            default: targets.source,
            requiresArg: true,
            // conflicts: ['dry-run'],

            alias: ['i']
        }
    }).argv)


export default options