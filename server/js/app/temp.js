var chats = [{
    users: ['superspecialninja', 'yetanotherid', 'moreuuidsplease'],
    name: 'Dev3',
    id: 'potato',
    timestamp: '2014-06-02T00:57:03.790Z'
}, {
    users: ['superspecialninja', 'moreuuidsplease'],
    name: '',
    id: 'potato2',
    timestamp: '2014-06-02T00:57:03.790Z'
}];
var messages = [{
    id: 'banana',
    message: 'This is a banana.',
    chatId: 'potato',
    userId: 'yetanotherid',
    timestamp: '2014-06-02T00:57:03.790Z'
}, {
    id: 'banana2',
    message: 'Banana pics or it didn\'t happen',
    chatId: 'potato',
    userId: 'superspecialninja',
    timestamp: '2014-06-03T00:57:03.790Z'
}, {
    id: 'banana3',
    message: 'This is NOT a banana!',
    chatId: 'potato2',
    userId: 'superspecialninja',
    timestamp: '2014-06-02T00:57:03.790Z'
}, {
    id: 'banana4',
    message: 'I need some sleep, my creativity is dropping like crazy.',
    chatId: 'potato2',
    userId: 'moreuuidsplease',
    timestamp: '2014-06-03T00:57:03.790Z'
}];
var users = {
    'yetanotherid': {
        username: 'janka102',
        imgUrl: 'https://lh3.googleusercontent.com/-A9bEPpVwRzY/UiPGt61HMDI/AAAAAAAAJQE/SnNx46TnUbg/w502-h500-no/profile.png',
        displayName: 'Jesse Smick'
    },
    'superspecialninja': {
        username: 'thealtus',
        imgUrl: 'https://lh3.googleusercontent.com/-n9OC789xcYQ/U1Pv8cNP-sI/AAAAAAAACAc/cu9TxfxW7-Y/s832-no/56831a81-0d02-450f-96f8-7bc18ab675e1',
        displayName: 'Tal Ben-Ari'
    },
    'moreuuidsplease': {
        username: 'mkeedlinger',
        imgUrl: 'https://lh6.googleusercontent.com/-4TOn51mYCwQ/U3LaEB0RG3I/AAAAAAAADKs/hAFmjnjqL_k/s851-no/8f094c10-ea25-4f5c-bf14-988b29ed7647',
        displayName: 'Michael Edlinger'
    }
};

var currentUser = {
    'id': 'thealtus',
    'displayName': 'Tal Ben-Ari'
};