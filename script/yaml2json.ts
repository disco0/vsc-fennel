#!ts-node-script

//#region Imports

import fs   = require('fs')
import path = require('path')

import chokidar = require('chokidar');
import c        = require('chalk');
import jy       = require('js-yaml');
import LoadOptions = jy.LoadOptions
type LoadWarning = Exclude<LoadOptions['onWarning'], undefined>;

//#endregion Imports

//#region Config

const syntaxesDir = path.resolve(__dirname, '../syntaxes/')
const yamlSource  = path.resolve(syntaxesDir, 'fennel.tmLanguage.yaml')
const jsonTarget  = path.resolve(syntaxesDir, 'fennel.tmLanguage.json')

const projectDir = path.resolve(__dirname, '../')
const repoRelative = (toPath: string) => path.relative(projectDir, toPath)

// Used to validate schema (@TODO: actually nvm figure out how to load this as a schema)
const tmLanguageSchemaURL = 'https://raw.githubusercontent.com/martinring/tmlanguage/master/tmlanguage.json'

//#endregion Config

const onWarning: LoadWarning = ({name, message, stack = ''}) =>
{
    console.error([
        c.red.bold`YAML Load Error: ${name}`,
        c.red`    ${message}`
    ].join('\n'))
}

function convert(yamlFilePath: string)
{
    const yamlContent = fs.readFileSync(yamlFilePath, 'utf8')
    return jy.load(yamlContent, {
        filename: yamlFilePath,
        onWarning
    })
}

function init()
{
    if(!(fs.existsSync(yamlSource)))
    {
        console.error(c.red`Incorrect yaml grammar path: ${c.underline.red`${yamlSource}`}`)
        return;
    }

    const watcher = chokidar.watch(yamlSource, {
        disableGlobbing: true,
        persistent: true
    });

    watcher.on('change', (path: string, stats?: fs.Stats)  =>
    {
        console.log(c.ansi256(32)`Changed: ${c.underline`${repoRelative(path)}`}`)

        const result = convert(path)
        if(!result)
        {
            console.warn(c.yellow.italic`No result.`)
        }
        else
        {
            const newJsonTargetSrc = JSON.stringify(result, null, 4)
            fs.writeFileSync(jsonTarget, newJsonTargetSrc)

            console.log(c.green`Updated ${c.underline.green`${repoRelative(jsonTarget)}`}.`)
        }
    })
}

if (require.main === module)
{
    init()
}