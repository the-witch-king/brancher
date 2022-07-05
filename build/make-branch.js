"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sdk_1 = require("@linear/sdk");
const validateTicketName = (ticket) => {
    if (!/[A-Za-z]{3}-[0-9]+/.test(ticket)) {
        console.log('Invalid ticket identifier provided');
        console.log('Please ensure you use the Linear identifier, in the format of `ABC-123`');
        process.exit();
    }
};
const tooManyOrNotEnoughIssues = () => {
    console.log('Unable to find the specific issue.');
    console.log('Make sure the identifier you provide matches a ticket identifier');
    console.log('ie: FOO-123');
    process.exit();
};
const formatBranchName = (branchName) => {
    const withoutGitFlow = branchName.split('/')[1];
    const prefix = withoutGitFlow.substring(0, 3).toUpperCase();
    return `${prefix}${withoutGitFlow.substring(3)}`;
};
const branch = async (apiKey, ticket) => {
    validateTicketName(ticket);
    const client = new sdk_1.LinearClient({ apiKey });
    const issues = await client.issueSearch(ticket.toUpperCase());
    if (issues.nodes.length !== 1)
        tooManyOrNotEnoughIssues();
    const { branchName } = issues.nodes[0];
    return formatBranchName(branchName);
};
exports.default = branch;
