#!/usr/bin/env node

import { readFileSync, existsSync, writeFileSync } from 'fs'
import readline from 'readline'
import { homedir } from 'os'
import dotenv from 'dotenv'
import { Command } from 'commander'
import branch from './make-branch'
import { exec } from 'child_process'

const notConfiguredWarning = (): void => {
  console.log('Brancher has not been configured')
  console.log(
    'Please run `brancher init` first, and have your Linear API key handy'
  )
  process.exit()
}

const getApiKey = (config: { [k: string]: string }): string => {
  if ('api_key' in config) {
    return config.api_key
  }

  if ('API_KEY' in config) {
    return config.API_KEY
  }

  return ''
}

const CONFIG_FILE_PATH = `${homedir()}/.linear-brancher`

const program = new Command()

program
  .name('brancher')
  .description('CLI tool to help make branches from Linear tickets')
  .version('0.0.1')

program
  .command('init')
  .description('Configure brancher')
  .action(() => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })
    rl.question('Please enter your Linear API key: ', (apiKey: string) => {
      writeFileSync(CONFIG_FILE_PATH, `API_KEY=${apiKey}`)
      process.exit(0)
    })
  })

program
  .argument('<<ticket prefix>>', 'ex: FOO-123')
  .description(
    'Will make a new branch for you based on the linear ticket. ie: FOO-123'
  )
  .action((ticket: string) => {
    if (!existsSync(CONFIG_FILE_PATH)) notConfiguredWarning()

    const config = dotenv.parse(readFileSync(CONFIG_FILE_PATH))

    const apiKey = getApiKey(config)

    if (!apiKey) notConfiguredWarning()

    branch(apiKey, ticket).then((branchName) => {
      exec(`git checkout -b ${branchName}`, (err, stdout, stderr) => {
        if (err) {
          console.error(err)
          process.exit(1)
        }

        if (stderr) {
          console.error(err)
          process.exit(1)
        }

        console.log(`Success - you are now on branch '${branchName}'`)
      })
    })
  })

program.parse()
