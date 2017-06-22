// probot run -a 3012 -P private-key.pem  ./index.js

module.exports = robot => {
  robot.on('issues', async context => {

    if (!context.payload.repository.owner || !context.payload.issue.user.id || !context.payload.repository.name) {
        issue = (await context.github.issues.get(context.issue())).data;
    }
    const user_login = context.payload.issue.user.login;
    const repo_owner_id = context.payload.repository.owner.login;
    const repo_name = context.payload.repository.name;

    const options = context.repo({path: '.github/new_issue_welcome.md'});
    const response = await context.github.repos.getContent(options);
    const template = new Buffer(response.data.content, 'base64').toString();

    robot.log("This is a debug test message", template);
    
    var GitHubApi = require("github");
    
    var github = new GitHubApi({
        debug: true,
    });
    
    github.authenticate({
        type: "oauth",
        key: process.env.CLIENT_ID,
        secret: process.env.CLIENT_SECRET
    });
    
    github.issues.getForRepo({
        owner: repo_owner_id,
        repo: repo_name,
        state: "all",
        creator: user_login
    }, function(error, response) {
        if (error) {
            console.log(error.toJSON());
        } else {
            robot.log(template);
            //check length of response to make sure its only one issue/pr
            //if (response.data.length === 1) {
                //context.github.issues.createComment(context.issue({body: template}));
            //}
        }
    });
  });
};
