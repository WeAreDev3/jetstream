var chats = [];
var messages = [{
    id: 'banana',
    message: 'This is a banana.',
    chatId: '04a73adc-76a5-45ce-a055-199af20c19c7',
    userId: 'fc88be8b-7689-4234-a536-e831f5c1d196',
    timestamp: '2014-06-02T00:57:03.790Z'
}, {
    id: 'banana2',
    message: 'Banana pics or it didn\'t happen',
    chatId: '04a73adc-76a5-45ce-a055-199af20c19c7',
    userId: '008bb418-d470-4494-b3c2-356526ac073f',
    timestamp: '2014-06-02T00:58:03.790Z'
}, {
    id: 'banana3',
    message: 'This is NOT a banana!',
    chatId: '04a73adc-76a5-45ce-a055-199af20c19c7',
    userId: '008bb418-d470-4494-b3c2-356526ac073f',
    timestamp: '2014-06-02T00:59:03.790Z'
}, {
    id: 'banana4',
    message: 'I need some sleep, my creativity is dropping like crazy.',
    chatId: '04a73adc-76a5-45ce-a055-199af20c19c7',
    userId: 'ed38fe4b-9687-4234-a536-a831d5e1d295',
    timestamp: '2014-06-02T00:59:13.790Z'
}];

var users = {
    'fc88be8b-7689-4234-a536-e831f5c1d196': {
        username: 'janka102',
        imgUrl: 'https://lh3.googleusercontent.com/-A9bEPpVwRzY/UiPGt61HMDI/AAAAAAAAJQE/SnNx46TnUbg/w502-h500-no/profile.png',
        displayName: 'Jesse Smick'
    },
    '008bb418-d470-4494-b3c2-356526ac073f': {
        username: 'thealtus',
        imgUrl: 'https://lh3.googleusercontent.com/-n9OC789xcYQ/U1Pv8cNP-sI/AAAAAAAACAc/cu9TxfxW7-Y/s832-no/56831a81-0d02-450f-96f8-7bc18ab675e1',
        displayName: 'Tal Ben-Ari'
    },
    'ed38fe4b-9687-4234-a536-a831d5e1d295': {
        username: 'mkeedlinger',
        imgUrl: 'https://lh6.googleusercontent.com/-4TOn51mYCwQ/U3LaEB0RG3I/AAAAAAAADKs/hAFmjnjqL_k/s851-no/8f094c10-ea25-4f5c-bf14-988b29ed7647',
        displayName: 'Michael Edlinger'
    }
};

var currentUser = {
    'id': '008bb418-d470-4494-b3c2-356526ac073f',
    'username': 'thealtus',
    'displayName': 'Tal Ben-Ari'
};