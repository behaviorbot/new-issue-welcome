const expect = require('expect')
const { Application } = require('probot')
const { GitHubAPI } = require('probot/lib/github')
const plugin = require('..')
const successPayload = require('./events/successPayload')
const successIssueRes = require('./events/successIssueRes')
const failPayload = require('./events/failPayload')
const failIssueRes = require('./events/failIssueRes')

describe('new-issue-welcome', () => {
  let app
  let github

  beforeEach(() => {
    app = new Application()
    plugin(app)

    github = new GitHubAPI()
    app.auth = () => Promise.resolve(github)
  })

  function makeResponse (msg) {
    return Promise.resolve({ data: { content: Buffer.from(msg).toString('base64') } })
  }

  describe('new-issue-welcome success', () => {
    it('posts a comment because it is a user\'s first issue opened', async () => {
      expect.spyOn(github.repos, 'getContents').andReturn(makeResponse(`newIssueWelcomeComment: >\n  woot woot`))
      expect.spyOn(github.issues, 'listForRepo').andReturn(Promise.resolve(successIssueRes))
      expect.spyOn(github.issues, 'createComment')

      await app.receive(successPayload)

      expect(github.issues.listForRepo).toHaveBeenCalledWith({
        owner: 'hiimbex',
        repo: 'testing-things',
        state: 'all',
        creator: 'hiimbex-test'
      })
      expect(github.repos.getContents).toHaveBeenCalledWith({
        owner: 'hiimbex',
        repo: 'testing-things',
        path: '.github/config.yml'
      })
      expect(github.issues.createComment).toHaveBeenCalled()
    })
  })

  describe('new-issue-welcome failure', () => {
    it('posts a comment because it is a user\'s first issue opened', async () => {
      expect.spyOn(github.repos, 'getContents').andReturn(makeResponse(`newIssueWelcomeComment: >\n  woot woot`))
      expect.spyOn(github.issues, 'listForRepo').andReturn(Promise.resolve(failIssueRes))
      expect.spyOn(github.issues, 'createComment')

      await app.receive(failPayload)

      expect(github.issues.listForRepo).toHaveBeenCalledWith({
        owner: 'hiimbex',
        repo: 'testing-things',
        state: 'all',
        creator: 'hiimbex'
      })
      expect(github.repos.getContents).toNotHaveBeenCalled()
      expect(github.issues.createComment).toNotHaveBeenCalled()
    })
  })
})
