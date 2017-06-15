//probot run -P test-bot.2017-06-13.private-key.pem  ./index.js
module.exports = robot => {
  robot.on('issues', async (event, context) => {
    //robot.log(typeof event);
    //const template = "Congrats on opening a PR ";
    //const fin_temp = JSON.stringify(event);
    robot.log("This is a debug message");
    robot.log.debug("So is this!");
    //robot.log(event);
    let issue = event.payload.issue || event.payload.pull_request;
    if (!event.payload.repository.owner || !issue.user.id || !event.payload.repository.name) {
        issue = (await context.github.issues.get(context.issue())).data;
    }
    const user_id = event.payload.issue.user.id;
    const repo_owner_id = event.payload.repository.owner.login;
    const repo_name = event.payload.repository.name;
    robot.log(event.payload.issue.user.id);

    //Do GitHub API check based on this user's ID
    // GET /repos/:owner/:repo/issues
    // Parameters: creator = login or user id?
    // state = all

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
        repo: repo_name
    }, function(err, res) {
        if (err) {
            console.log(err.toJSON());
        } else {
            console.log(res);
        }
    });

    if (event.payload.issue.number == 1) {
        return context.github.issues.createComment(context.issue({body: "Congrats on your first PR/Issue!"}));
    } else {
        return context.github.issues.createComment(context.issue({body: "Thanks for opening an Issue!"}));
    }
    // template = "conrgats on your first PR/Issue!"

    //robot.log(test_temp);
  });
};
