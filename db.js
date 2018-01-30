var sqlite3 = require('sqlite3').verbose();
var fs = require('fs');
var md5 = require('md5');

// Setup database:
var dbFile = './database.db';
var dbExists = fs.existsSync(dbFile);

// If the database doesn't exist, create a new file:
if (!dbExists) {
    fs.openSync(dbFile, 'w');
}

// Initialize the database:
var db = new sqlite3.Database(dbFile);


// Optional installation for newly created databases:

db.run('CREATE TABLE IF NOT EXISTS `CAD_USUARIO`  (' +
    '`id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,' +
    '`email` TEXT,' +
    '`nome` TEXT,' +
    '`senha` TEXT)');

db.run('CREATE TABLE IF NOT EXISTS `CAD_DEVICES`  (' +
    '`id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,' +
    '`id_usuario` TEXT,' +
    '`deviceid` TEXT)');


db.run('CREATE TABLE IF NOT EXISTS `CAD_DATA` (' +
    'id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,' +
    'id_usuario INTEGER,' +
    'PAR_PRZMED INTEGER,' +
    'PAR_LIMFAT REAL,' +
    'PAR_BTN_COMPRADO_ACTIVE INTEGER,' +
    'PAR_DESCMAX REAL,' +
    'PAR_DESCMIN REAL,' +
    'PAR_URLUPDATE TEXT,' +
    'PAR_MIN_MAX_ACTIVE INTEGER,' +
    'PAR_DTAATZ TEXT,' +
    'PAR_DESCONTO_VISIBLE INTEGER,' +
    'PAR_BTN_COMPRADO_ENABLE INTEGER,' +
    'PAR_ID INTEGER,' +
    'PAR_EDTVLRUNIT INTEGER,' +
    'PAR_WSURLSERVER TEXT,' +
    'PAR_COMIS INTEGER)');


// Insert some data using a statement:


db.serialize(() => {
    db.each(`SELECT *
             FROM CAD_USUARIO`, (err, row) => {
            if (err) {
                console.error(err.message);
            }
            console.log(row.id + "\t" + row.nome + "\t" + row.email + "\t" + row.senha);
        });
});

db.close();

var getDb = function () {
    db = new sqlite3.Database(dbFile);
    return db;
}

// Close the database:

module.exports = {

    obterUsuario: (email, senha, deviceid) => {

        return new Promise((resolve, reject) => {
            db = getDb();
            var sql = 'SELECT * FROM CAD_USUARIO  ' +
                'INNER JOIN CAD_DEVICES  ON CAD_USUARIO.id = CAD_DEVICES.id_usuario ' +
                'WHERE CAD_USUARIO.emaiL = ? ' +
                'AND CAD_USUARIO.senha = ? ' +
                'AND CAD_DEVICES.deviceid = ? ';

            var s = md5(senha);

            db.get(sql, [email, s, deviceid], (err, row) => {
                if (err) {
                    reject(err);
                }
                resolve(row);
            });
            db.close();
        });

    },
    cadastrarUsuario: (email, senha, deviceid, nome) => {
        return new Promise((resolve, reject) => {
            db = getDb();

            var erro = [];
            var ok = false;

            db.run('INSERT INTO `CAD_USUARIO` ( `email`,`nome`, `senha`) ' +
                'VALUES (?, ?, ?)', [email, nome, md5(senha)], function (err) {
                    erro.push(err);
                    var lastid = this.lastID;
                    db.run('INSERT INTO `CAD_DEVICES` ( `id_usuario`,`deviceid`) ' +
                        'VALUES (?, ?)', [lastid, deviceid], function (err) {
                            erro.push(err);
                        });

                    if (erro.length > 0) {
                        reject(erro);
                    }
                    else {
                        resolve(true);
                    }

                });

            resolve(true);
        });
    },
    cadastrarDados: (
        id_usuario,
        PAR_PRZMED,
        PAR_LIMFAT,
        PAR_BTN_COMPRADO_ACTIVE,
        PAR_DESCMAX,
        PAR_DESCMIN,
        PAR_URLUPDATE,
        PAR_MIN_MAX_ACTIVE,
        PAR_DTAATZ,
        PAR_DESCONTO_VISIBLE,
        PAR_BTN_COMPRADO_ENABLE,
        PAR_ID,
        PAR_EDTVLRUNIT,
        PAR_WSURLSERVER,
        PAR_COMIS) => {

        return new Promise((resolve, reject) => {

            var db = getDb();

            var dados = {
                "PAR_PRZMED": PAR_PRZMED,
                "PAR_LIMFAT": PAR_LIMFAT,
                "PAR_BTN_COMPRADO_ACTIVE": PAR_BTN_COMPRADO_ACTIVE,
                "PAR_DESCMAX": PAR_DESCMAX,
                "PAR_DESCMIN": PAR_DESCMIN,
                "PAR_URLUPDATE": PAR_URLUPDATE,
                "PAR_MIN_MAX_ACTIVE": PAR_MIN_MAX_ACTIVE,
                "PAR_DTAATZ": PAR_DTAATZ,
                "PAR_DESCONTO_VISIBLE": PAR_DESCONTO_VISIBLE,
                "PAR_BTN_COMPRADO_ENABLE": PAR_BTN_COMPRADO_ENABLE,
                "PAR_ID": PAR_ID,
                "PAR_EDTVLRUNIT": PAR_EDTVLRUNIT,
                "PAR_WSURLSERVER": PAR_WSURLSERVER,
                "PAR_COMIS": PAR_COMIS
            };

            db.run('INSERT INTO CAD_DATA (PAR_PRZMED,' +
                'id_usuario,' +
                'PAR_LIMFAT,' +
                'PAR_BTN_COMPRADO_ACTIVE,' +
                'PAR_DESCMAX,' +
                'PAR_DESCMIN,' +
                'PAR_URLUPDATE,' +
                'PAR_MIN_MAX_ACTIVE,' +
                'PAR_DTAATZ,' +
                'PAR_DESCONTO_VISIBLE,' +
                'PAR_BTN_COMPRADO_ENABLE,' +
                'PAR_ID,' +
                'PAR_EDTVLRUNIT,' +
                'PAR_WSURLSERVER,' +
                'PAR_COMIS) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [
                    PAR_PRZMED,
                    id_usuario,
                    PAR_LIMFAT,
                    PAR_BTN_COMPRADO_ACTIVE,
                    PAR_DESCMAX,
                    PAR_DESCMIN,
                    PAR_URLUPDATE,
                    PAR_MIN_MAX_ACTIVE,
                    PAR_DTAATZ,
                    PAR_DESCONTO_VISIBLE,
                    PAR_BTN_COMPRADO_ENABLE,
                    PAR_ID,
                    PAR_EDTVLRUNIT,
                    PAR_WSURLSERVER,
                    PAR_COMIS
                ], (err) => {
                    reject(err);
                });

            resolve(this.lastID);

        })

    },
    obterUsuarios: () => {
        return new Promise((resolve, reject) => {
            var db = getDb();
            db.all('select cad_devices * from cad_usuario inner join cad_devices on cad_usuario.id = cad_devices.id_usuario', (err, rows) => {
                if (err) {
                    reject(err);
                }
                resolve(rows);
            });
            // db.close()
        });
    },
    obterDados: (idusuario) => {
        return new Promise((resolve, reject) => {
            try {
                db = getDb();
                var t = {};
                db.get('select * from CAD_DATA where id_usuario = ' + idusuario + ' order by id desc limit 1 ', (err, rows) => {
                    var obj = [];
                    if (err) {
                        reject(err);
                    }
                    else {
                        var t = Object.assign({},rows);
                        db.all('select * from CAD_DEVICES where id_usuario = ' + idusuario + '', (errd, rowsd) => {
                            var g = [];
                            rowsd.forEach((row) => {
                                g.push({"device":row.id});
                            })
                            t.DEVICES = g;
                            resolve(t);
                        })
                    }
                });
            }
            catch (e) {
                reject(e);
            }

        });
    }
}