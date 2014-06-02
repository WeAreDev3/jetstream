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
        window.location = '/auth/callback?code=' + encodeURIComponent(authResult.code);
    } else if (authResult.error) {
        // "immediate_failed" means could not immediately sign in
        console.log('There was an error: ' + authResult.error);
    }
}

function renderButton() {
    gapi.signin.render('signinButton', {
        'callback': 'signinCallback'
    });
}
