const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();
const fb = require('./firebase');
const db = require('./db');
const aut = require('./autorize');

app.use(bodyParser.json({
    limit: '5mb'
}));

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use('/fb', router.get('/get', (req, res) => {
    fb.get((o) => {
        res.send(o);
    })
}))

const validaToken = (token) => {
    return new Promise((resolve,reject)=>{
        if (token.length <= 0) {
            res.status(401).send('Não Autorizado');
            reject('Token Inválido')
        }else{
            const data = aut.decodeToken(token).then((d) => {
                if (d.id <= 0) {
                    reject('Não autorizado');
                 }
                 else{
                     resolve(d);
                 }
            });
        }
    })
   
}

app.use('/autenticacao', router.post('/', (req, res) => {

    let email = req.body.email;
    let senha = req.body.senha;
    let deviceid = req.body.deviceid;

    db.obterUsuario(email, senha, deviceid).then((d) => {

        if (!d) {
            res.status(401).send("Usuário não encontrado!")
        }

        var token = aut.generateToken(d).then((d) => {
            console.log(d);
            res.status(200).send(d);

        }).catch((s) => {
            res.status(200).send(s);
        });

        console.log(token)

    }).catch((e) => {
        res.status(500).send(e);
    })

}));

app.use('/cadastrar', router.post('/usuario', (req, res) => {

    const token = req.body.token || req.query.token || req.headers['x-access-token'];

    validaToken(token).then((d) => {
        var nome = req.body.nome;
            var email = req.body.email;
            var senha = req.body.senha;
            var device = req.body.deviceid;

            db.cadastrarUsuario(email, senha, device, nome).then((d) => {
                res.status(200).send(d)
            }).catch((e) => {
                res.status(401).send(e);
            })
    }).catch((erro) => {
        res.status(401).send('Não autorizado!')
    })

}));

app.use('/obter/usuarios', router.get('/', (req, res) => {

    const token = req.body.token || req.query.token || req.headers['x-access-token'];

    validaToken(token).then((d) => {
        db.obterUsuarios().then((d) => {
            res.status(200).send(d);
        }).catch((e) => {
            res.status(500).send(e);
        });
    }).catch((erro) => {
        res.status(500).send(erro);
    })

}));


app.use('/obter',router.get('/dados', (req,res) => {
    const token = req.body.token || req.query.token || req.headers['x-access-token'];

    validaToken(token).then((d) => {
        var _db = db.obterDados(d.id).then((a) => {
            res.status(200).send(a);
        })
    })
}));


app.use('/cadastrar', router.post('/dados', (req, res) => {
    
    const token = req.body.token || req.query.token || req.headers['x-access-token'];

    var d = req.body;

    validaToken(token).then((r) => {
        db.cadastrarDados(
            r.id,
            d.PAR_PRZMED,
            d.PAR_LIMFAT,
            d.PAR_BTN_COMPRADO_ACTIVE,
            d.PAR_DESCMAX,
            d.PAR_DESCMIN,
            d.PAR_URLUPDATE,
            d.PAR_MIN_MAX_ACTIVE,
            d.PAR_DTAATZ,
            d.PAR_DESCONTO_VISIBLE,
            d.PAR_BTN_COMPRADO_ENABLE,
            d.PAR_ID,
            d.PAR_EDTVLRUNIT,
            d.PAR_WSURLSERVER,
            d.PAR_COMIS
        ).then((d) => {
            res.status(200).send('Cadastrado');
        }).catch((e) => {
            res.status(401).send(e);
        })
    } ).catch((e) => {
        res.status(401).send('Não Autorizado!');
    })

}));




module.exports = app;