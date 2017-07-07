const checkCount = require('./lib/checkCount');

module.exports = robot => {
    robot.on('issues.opened', async context => {
        const userLogin = context.payload.issue.user.login;
        const repoOwnerLogin = context.payload.repository.owner.login;
        const repoName = context.payload.repository.name;

        const github = await robot.auth(context.payload.installation.id);
        const response = await github.issues.getForRepo(context.repo({
            owner: repoOwnerLogin,
            repo: repoName,
            state: 'all',
            creator: userLogin
        }));

        if ((checkCount.PRCount(response)).length === 1) {
            let template;
            try {
                const options = context.repo({path: '.github/new-issue-welcome.md'});
                const res = await context.github.repos.getContent(options);
                template = Buffer.from(res.data.content, 'base64').toString();
            } catch (err) {
                if (err.code === 404) template = 'Thanks for opening your first issue!';
                else throw err;
            }
            context.github.issues.createComment(context.issue({body: template}));
        }
    });
};
