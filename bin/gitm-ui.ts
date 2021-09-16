#!/usr/bin/env node
const { program } = require('commander')
// const fs = require('fs')
const path = require('path')
const sh = require('shelljs')
const { options, args } = require('./conf/ui')
// const { pwd } = require('./js/global')
const { createArgs } = require('./js/tools')

import { GitmarsOptionOptionsType } from '../typings'

interface GitmBuildOption {
    port: number
}

/**
 * gitm ui
 */
program.name('gitm ui').usage('<name> <path>').description('链接本地包')
if (args.length > 0) program.arguments(createArgs(args))
options.forEach((o: GitmarsOptionOptionsType) => {
    program.option(o.flags, o.description, o.defaultValue)
})
program.action((opt: GitmBuildOption) => {
    // console.log(process.cwd(), path.join(__dirname, '../ui'), path.join(process.execPath, '../../lib/node_modules/gitmars'))
    // let data = sh.exec(`ls -l ${sh.which('gitm').stdout}`, { silent: true }).stdout,
    // 	gitmDir,
    // 	arr = data.split('->').map(el => {
    // 		el = el.trim().split(' ')
    // 		if (el.length > 1) el = el.splice(el.length - 1)
    // 		return el.join()
    // 	})
    // arr[0] = arr[0].replace(/\/gitm$/, '')
    // arr[1] = arr[1].replace(/\/(bin|lib)\/gitm.js$/, '')
    // gitmDir = path.join(...arr)
    // process.chdir(gitmDir + '/app')
    // sh.exec(`pm2 start yarn --name server -- run start`)
    // process.chdir(gitmDir + '/ui')
    // sh.exec(`pm2 start yarn --name ui -- run serve`, { silent: true })
    process.chdir(path.join(__dirname, '../app'))
    // sh.exec(`cd app && yarn install`)
    // sh.exec(`pm2 start yarn --name server -- run start`)
    sh.exec('npm run server:start')
    // process.chdir(path.join(__dirname, '../ui'))
    // sh.exec(`pm2 start yarn --name ui -- run serve`)
})
program.parse(process.argv)
export {}
