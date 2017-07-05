exports.PRCount = function (response) {
    let countIssues = 0;
    // Check for issues that are not also PRs
    for (let i = 0; i < response.data.length; i++) {
        if (!((response.data[i]).pull_request)) countIssues += 1;
        // Exit loop if more than one Issue
        if (countIssues > 1) return false;
    }
    return true;
};
