module.exports = robot => {
  robot.on('issues', async (event, context) => {
    //robot.log(typeof event);
    //const template = "Congrats on opening a PR ";
    //const fin_temp = JSON.stringify(event);
    let issue = event.payload.issue || event.payload.pull_request;
    if (!issue.number) {
       issue = (await context.github.issues.get(context.issue())).data;
     }
    
    //this won't really work ;(
    //Gotta figure out milestones in the GitHub API
    if (event.payload.issue.number == 1) {
        return context.github.issues.createComment(context.issue({body: "Congrats on your first PR/Issue!"}));
    } else {
        return context.github.issues.createComment(context.issue({body: "Thanks for opening an Issue!"}));
    }
    // template = "conrgats on your first PR/Issue!"

    //robot.log(test_temp);
  });
};
