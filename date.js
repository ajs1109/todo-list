module.exports.getDate = getDate;
module.exports.getDay = getDay;
function getDate(){
    var todays = new Date();
var options = {
 weekday: 'long',
 day:'numeric',
 month:'long'
};
var day = todays.toLocaleDateString('en-US', options);
return day;
}

function getDay(){
    var todays = new Date();
var options = {
    weekday: 'long'
};
var day = todays.toLocaleDateString('en-US', options);
return day;
}
