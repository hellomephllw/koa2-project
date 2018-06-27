const ResponseFail = require('./models/ResponseFail');
const ResponseSuccess = require('./models/ResponseSuccess');
const ResponsePager = require('./models/ResponsePager');

module.exports = {
    fail: function() {
        return new ResponseFail();
    },
    success: function() {
        return new ResponseSuccess();
    },
    pager: function() {
        return new ResponsePager();
    }
};