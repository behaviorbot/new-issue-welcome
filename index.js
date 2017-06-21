// probot run -a 3012 -P private-key.pem  ./index.js

module.exports = robot => {
  robot.on('issues.opened', async context => {
    const template = "Congrats on opening your first issue/PR!";
    robot.log("This is a debug test message");

    let issue = context.payload.issue || context.payload.pull_request;
    if (!context.payload.repository.owner || !issue.user.id || !context.payload.repository.name) {
        issue = (await context.github.issues.get(context.issue())).data;
    }
    const user_login = context.payload.issue.user.login;
    const repo_owner_id = context.payload.repository.owner.login;
    const repo_name = context.payload.repository.name;
    
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
            //check length of response to make sure its only one issue/pr
            if (response.data.length === 1) {
                context.github.issues.createComment(context.issue({body: template}));
            }
        }
    });
  });
};
