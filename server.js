const express = require("express");
var bodyParser = require('body-parser')
const expresssSessao = require("express-session")
const app = express();

const PORTA = process.env.PORT || 5000;
var jsonParser = bodyParser.json()
const {body, validationResult} = require('express-validator');

app.use(expresssSessao({
    resave: false,
    saveUninitialized: false,
    name: "sessaoID", // Nome do Utilizador
    secret: "7986292486187982",
    cookie: {
      maxAge: 60000000, 
      sameSite: true,
      httpOnly: true
    }
  }))


// Utilizado para validar o registo
regrasValidacaoRegisto = [
    body('u_nome', 'Nome não pode ser vazio').notEmpty(),
    body('u_senha', 'Senha não pode ser vazia').notEmpty()
];
resultadoValidacao = (req, res, next) => {
    const erros = validationResult(req);
    if (!erros.isEmpty()) return res.json({ resultado: erros.array()[0] });
    next();
};

var Utilizadores = []
function utilizador(n, s) {
     this.nome = n;
     this.senha = s;
     this.Notas = [];
}

var user = new utilizador("teste", "teste"); // cria um Utilizador de testes
Utilizadores.push(user);

function obtemNotasUser(nomeUser) {
    for (k in Utilizadores){
        if (Utilizadores[k].nome == nomeUser) {
            return Utilizadores[k].Notas;
        }
    }
}

app.use(express.static("public"));

app.get("/notas", (req, res) => {
    if (req.session.sessaoID) {
        res.send(obtemNotasUser(req.session.sessaoID))
    }
});

app.get("/versessao", jsonParser, (req, res) => {
    if (req.session.sessaoID) {
        res.json({valido: 1})
    } else {
        res.json({valido: 0})
    }
});

app.post("/login", jsonParser, (req, res) => {
    
    for (k in Utilizadores){
        if (Utilizadores[k].nome == req.body.u_nome && Utilizadores[k].senha == req.body.u_senha) {
            req.session.sessaoID = req.body.u_nome;
            res.json({valido: 1})
            return;
        }
    }
    res.json({valido: 0})
});

app.post("/novo_user", jsonParser, regrasValidacaoRegisto, resultadoValidacao, (req, res) => {
    
    for (k in Utilizadores){
        if (Utilizadores[k].nome == req.body.u_nome) {
            res.json({resultado: "USER_EXISTE"})
            return;
        } 
    }
    var user = new utilizador(req.body.u_nome, req.body.u_senha); // cria um Utilizador
    Utilizadores.push(user);
    req.session.sessaoID = req.body.u_nome;
    res.json({resultado: "USER_CRIADO"})
});

app.get("/sair", jsonParser, (req, res) => { // Sair da conta
    if (req.session.sessaoID) {
        req.session.destroy();
        res.json({valido: 1});
    }
});

app.post("/removenota", jsonParser, (req, res) => { // REMOVE NOTAS
    if (req.session.sessaoID) {
       
        obtemNotasUser(req.session.sessaoID).splice(req.body.notaId, 1)

        // Volta a organizar as notas para ajustar o ID
        for (i = 0; i < obtemNotasUser(req.session.sessaoID).length; i++) {
            obtemNotasUser(req.session.sessaoID)[i].idNota = i.toString();
        }
        res.send(obtemNotasUser(req.session.sessaoID))
    }
});

app.post("/novanota", jsonParser, (req, res) => {
    if (req.session.sessaoID) {
        obtemNotasUser(req.session.sessaoID).push({Texto: req.body.texto, idNota: "0"}) // Insere nota
 
        // adiciona Ids ás notas
        for (i = 0; i < obtemNotasUser(req.session.sessaoID).length; i++) {
            obtemNotasUser(req.session.sessaoID)[i].idNota = i.toString();
        }
        res.send(obtemNotasUser(req.session.sessaoID))
       
    }
});


app.listen(PORTA);
console.log("Server Ligado");
