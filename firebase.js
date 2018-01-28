var admin = require("firebase-admin");

var serviceAccount = require("./autenticacao-b4938-firebase-adminsdk-z2unw-0c0876e772.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://autenticacao-b4938.firebaseio.com"
});

var db = admin.database();

module.exports = {

    get : (callback) => {
        var ref = db.ref('/').on('value',(snap) => {
            callback(snap.val());
        })
    }

}