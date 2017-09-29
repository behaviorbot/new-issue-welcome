module.exports = robot => {
  robot.on('issues.opened', async context => {
    const response = await context.github.issues.getForRepo(context.repo({
      state: 'all',
      creator: context.payload.issue.user.login
    }))

    const countIssue = response.data.filter(data => !data.pull_request)
    if (countIssue.length === 1) {
      try {
        const config = await context.config('config.yml')
        if (config.newIssueWelcomeComment) {
          context.github.issues.createComment(context.issue({body: config.newIssueWelcomeComment}))
        }
      } catch (err) {
        if (err.code !== 404) {
          throw err
        }
      }
    }
  })
}
