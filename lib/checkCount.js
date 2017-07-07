exports.PRCount = function (response) {
    return response.data.filter(function(data){
        if (!(data.pull_request)) return data
    });
};
