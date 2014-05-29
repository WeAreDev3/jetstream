function parseDate (date) {
    var Months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    return Months[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
}

function parseTime (date) {
    var ampm = "AM";
    var hour = date.getHours();
    var minutes = date.getMinutes();

    if (hour > 11) {
        ampm = "PM";
        if (hour > 12) {
            hour = hour - 12;
        };
    };

    if (minutes < 10) {
        minutes = "0" + minutes;
    };

    return hour + ":" + minutes + " " + ampm;
}