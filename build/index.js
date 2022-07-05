#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const readline_1 = __importDefault(require("readline"));
const os_1 = require("os");
const dotenv_1 = __importDefault(require("dotenv"));
const commander_1 = require("commander");
const make_branch_1 = __importDefault(require("./make-branch"));
const child_process_1 = require("child_process");
const notConfiguredWarning = () => {
    console.log('Brancher has not been configured');
    console.log('Please run `brancher init` first, and have your Linear API key handy');
    process.exit();
};
const getApiKey = (config) => {
    if ('api_key' in config) {
        return config.api_key;
    }
    if ('API_KEY' in config) {
        return config.API_KEY;
    }
    return '';
};
const CONFIG_FILE_PATH = `${(0, os_1.homedir)()}/.linear-brancher`;
const program = new commander_1.Command();
program
    .name('brancher')
    .description('CLI tool to help make branches from Linear tickets')
    .version('0.0.1');
program
    .command('init')
    .description('Configure brancher')
    .action(() => {
    const rl = readline_1.default.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Please enter your Linear API key: ', (apiKey) => {
        (0, fs_1.writeFileSync)(CONFIG_FILE_PATH, `API_KEY=${apiKey}`);
        process.exit(0);
    });
});
program
    .argument('<<ticket prefix>>', 'ex: FOO-123')
    .description('Will make a new branch for you based on the linear ticket. ie: FOO-123')
    .action((ticket) => {
    if (!(0, fs_1.existsSync)(CONFIG_FILE_PATH))
        notConfiguredWarning();
    const config = dotenv_1.default.parse((0, fs_1.readFileSync)(CONFIG_FILE_PATH));
    const apiKey = getApiKey(config);
    if (!apiKey)
        notConfiguredWarning();
    (0, make_branch_1.default)(apiKey, ticket).then((branchName) => {
        (0, child_process_1.exec)(`git checkout -b ${branchName}`, (err, _stdout, _stderr) => {
            if (err) {
                console.log(err);
                process.exit();
            }
            console.log(`Success - you are now on branch '${branchName}'`);
        });
    });
});
program.parse();
