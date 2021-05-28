const moment = require('moment');
function formatMessage(username,text){
    return {
        username,
        text,
        time: moment().format('h:m a') //hour, minutes, am or pm
    }
}

module.exports = formatMessage;