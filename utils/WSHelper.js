module.exports = function (path) {
    return function(callback) {
        return function(IO, app) {
            const io = new IO(`/ws${path}`);
            io.attach(app);
            callback(io);
        };
    };
};