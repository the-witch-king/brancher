import { LinearClient } from '@linear/sdk'

const tooManyOrNotEnoughIssues = () => {
  console.log('Unable to find the specific issue.')
  console.log(
    'Make sure the identifier you provide matches a ticket identifier'
  )
  console.log('ie: FOO-49')
  process.exit()
}

const formatBranchName = (branchName: string): string => {
  const withoutGitFlow = branchName.split('/')[1]
  const prefix = withoutGitFlow.substring(0, 3).toUpperCase()
  return `${prefix}${withoutGitFlow.substring(3)}`
}

const branch = async (apiKey: string, ticket: string): Promise<string> => {
  const client = new LinearClient({ apiKey })
  const issues = await client.issueSearch(ticket)

  if (issues.nodes.length !== 1) tooManyOrNotEnoughIssues()

  const { branchName } = issues.nodes[0]

  return formatBranchName(branchName)
}

export default branch
