const yaml = require('js-yaml');
const checkCount = require('./lib/checkCount');

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

        if ((checkCount.PRCount(response)).length === 1) {
            let config;
            try {
                const options = context.repo({path: '.github/config.yml'});
                const res = await context.github.repos.getContent(options);
                config = yaml.safeLoad(Buffer.from(res.data.content, 'base64').toString()) || {};
            } catch (err) {
                if (err.code !== 404) throw err;
            }
            context.github.issues.createComment(context.issue({body: config.firstIssueWelcomeComment}));
        }
    });
};
