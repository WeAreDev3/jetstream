function signinCallback(authResult) {
    console.log(authResult);
    if (authResult.code) {
        console.log('Succeeded!');
        var request = new XMLHttpRequest();
        request.open('POST', '/auth/google/callback', true);
        request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        request.send(JSON.stringify({
            id_token: authResult.id_token
        }));
    } else if (authResult.error) {
        console.log('There was an error: ' + authResult.error);
    }
}