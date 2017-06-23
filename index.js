module.exports = robot => {
  robot.on('issues', async context => {
    if (!context.payload.repository.owner.login || !context.payload.issue.user.login || !context.payload.repository.name) {
        issue = (await context.github.issues.get(context.issue())).data;
    }

    const user_login = context.payload.issue.user.login;
    const repo_owner_id = context.payload.repository.owner.login;
    const repo_name = context.payload.repository.name;

    const options = context.repo({path: '.github/new-issue-welcome.md'});
    const res = await context.github.repos.getContent(options);
    const template = new Buffer(res.data.content, 'base64').toString();

    const github = await robot.auth(context.payload.installation.id);
    const response = await github.issues.getForRepo(context.repo({
        owner: repo_owner_id,
        repo: repo_name,
        state: "all",
        creator: user_login
    }));

    var count_issues = 0
    //check for issues that are also PRs
    for (i = 0; i < response.data.length; i++) {
        if (!((response.data[i]).pull_request)) {
            count_issues += 1
        }
        //exit loop if more than one PR
        if (count_issues > 1) {
            break;
        }
    }
    //check length of response to make sure its only one issue/pr
    if (count_issues === 1) {
        context.github.issues.createComment(context.issue({body: template}));
    }
  });
};
