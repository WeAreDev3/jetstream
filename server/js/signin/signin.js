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
            code: authResult.code
        }));
    } else if (authResult.error) {
        console.log('There was an error: ' + authResult.error);
    }
}

function renderButton() {
    gapi.signin.render('signinButton', {
        'callback': 'signinCallback'
    });
}
