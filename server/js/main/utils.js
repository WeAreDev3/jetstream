function parseDate (date) {
    var Months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    return Months[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
}

function parseTime (date) {
    var hour = date.getHours();
    var minutes = date.getMinutes();

    if (minutes < 10) minutes = '0' + minutes;

    return hour > 11 ? (hour > 12 ? hour - 12 : hour) + ':' + minutes + ' PM' : hour + ':' + minutes + ' AM';
}