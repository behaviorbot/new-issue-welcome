module.exports = robot => {
  robot.on('issues.opened', async (event, context) => {
    // Code was pushed to the repo, what should we do with it?
    robot.log(event["payload"["comment"]]);
  });
};
