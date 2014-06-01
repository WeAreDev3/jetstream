(function() {
    var po = document.createElement('script');
    po.type = 'text/javascript';
    po.async = true;
    po.src = 'https://apis.google.com/js/client:plusone.js?onload=renderButton';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(po, s);
})();

function signinCallback(authResult) {
    console.log(authResult);
    if (authResult.code) {
        console.log('Login successful!');
        var request = new XMLHttpRequest();
        request.open('POST', '/auth/google/callback', true);
        request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        request.send(JSON.stringify({
            id_token: authResult.id_token
        }));
    } else if (authResult.error) {
        console.log('There was an error: ' + authResult.error);
    }
};

function renderButton() {
    console.log('Rendering button...');
    gapi.signin.render('signinButton', {
        'scope': 'profile',
        'clientid': '1597733950-19qdccarm1fo5ojrde7cemhgrufk9ef7.apps.googleusercontent.com',
        'cookiepolicy': 'single_host_origin',
        'callback': 'signinCallback'
    });
}
