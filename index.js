const yaml = require('js-yaml');

module.exports = robot => {
    robot.on('issues.opened', async context => {
        const userLogin = context.payload.issue.user.login;
        const repoOwnerLogin = context.payload.repository.owner.login;
        const repoName = context.payload.repository.name;

        const response = await context.github.issues.getForRepo(context.repo({
            owner: repoOwnerLogin,
            repo: repoName,
            state: 'all',
            creator: userLogin
        }));

        const countIssue = response.data.filter(data => !data.pull_request);
        if (countIssue.length === 1) {
            let config;
            try {
                const options = context.repo({path: '.github/config.yml'});
                const res = await context.github.repos.getContent(options);
                config = yaml.safeLoad(Buffer.from(res.data.content, 'base64').toString()) || {};
            } catch (err) {
                if (err.code !== 404) {
                    throw err;
                }
            }
            context.github.issues.createComment(context.issue({body: config.firstIssueWelcomeComment}));
        }
    });
};
