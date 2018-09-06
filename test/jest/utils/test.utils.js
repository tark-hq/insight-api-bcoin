const omitDeep = require('omit-deep');

function ignoring(obj, fieldNames) {
    return omitDeep(obj, fieldNames);
}

module.exports = {
    ignoring: ignoring
};