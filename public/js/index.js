
$(document).ready(async function() {
    fetch("/versessao").then(async (resposta) => {  
        dados = await resposta.json()
        if (dados.valido == 1) { // Existe uma sessão
            document.getElementById("sec_login").style.display = "none";
            document.getElementById("sec_notas").style.display = "block";
            obtemNotas();
        } else { // User não tem sessão aberta
            document.getElementById("sec_login").style.display = "block";
            document.getElementById("sec_notas").style.display = "none";
        }
    });
});

async function obtemNotas(){
    fetch("/notas").then(async (resposta) => {
        dados = await resposta.json()
        for (k in dados){
            div = document.getElementById("listasNotas");
            nota = document.createElement("p");
            nota.innerHTML = dados[k]["Texto"];
            nota.id = dados[k]["idNota"];
            nota.classList.add("apagaNota");
            div.appendChild(nota)
        }
    });
}

$(document).on("click","#registar", function() {
    $("#sec_login").fadeOut(100, function() { 
        $("#sec_registar").fadeIn(350)
   });
});

$(document).on("click","#adicionaNota", function() {
    let textoNota = document.getElementById("input_nota").value;
    document.getElementById("input_nota").value = ""
    fetch("/novanota", {
        headers: { "Content-Type": "application/json", },
        method: "POST",
        body: JSON.stringify({
          texto: textoNota,
        }),
    }).then(async (resposta) => {
        document.getElementById("listasNotas").innerHTML = "";
        dados = await resposta.json()
        
        for (k in dados){
            div = document.getElementById("listasNotas");
            nota = document.createElement("p");
            nota.innerHTML = dados[k]["Texto"];
            nota.id = dados[k]["idNota"];
            nota.classList.add("apagaNota");
            div.appendChild(nota)
        }
    });
});


$(document).on("click","#loginbnt", function() {
    let nome = document.getElementById("input_usernome").value;
    let senha = document.getElementById("input_usersenha").value;

    fetch("/login", {
        headers: { "Content-Type": "application/json", },
        method: "POST",
        body: JSON.stringify({
          u_nome: nome,
          u_senha: senha,
        }),
    }).then(async (resposta) => {
        dados = await resposta.json()

        if (dados.valido == 1){
            $("#sec_login").fadeOut(100, function() { 
                $("#sec_notas").fadeIn(350)
                document.getElementById("input_usernome").value = "";
                document.getElementById("input_usersenha").value = "";
                document.getElementById("msgErro_login").innerHTML = "";
                obtemNotas();
           });
        } else {
            document.getElementById("msgErro_login").innerHTML = "Credenciais errados.";
        }
    });
});

$(document).on("click","#regbnt", function() {
    let nome = document.getElementById("input_usernome_reg").value;
    let senha = document.getElementById("input_usersenha_reg").value;

    fetch("/novo_user", {
        headers: { "Content-Type": "application/json", },
        method: "POST",
        body: JSON.stringify({
          u_nome: nome,
          u_senha: senha,
        }),
    }).then(async (resposta) => {
        dados = await resposta.json()
        if (dados.resultado == "USER_CRIADO"){
            $("#sec_registar").fadeOut(100, function() { 
                $("#sec_notas").fadeIn(350)
                document.getElementById("input_usernome_reg").value = ""
                document.getElementById("input_usersenha_reg").value = ""
                document.getElementById("msgErro_reg").innerHTML = "";
                obtemNotas();
           });
        } else if (dados.resultado == "USER_EXISTE") {
            document.getElementById("msgErro_reg").innerHTML = "Esse nome de utilizador já existe.";
        } else {
            document.getElementById("msgErro_reg").innerHTML = dados.resultado.msg;
        }

    });
});


$(document).on("click",".apagaNota", function() { // Apaga notas ao clicar no texto
    let id = $(this).attr('id')
    document.getElementById(id).remove();

    fetch("/removenota", {
        headers: { "Content-Type": "application/json", },
        method: "POST",
        body: JSON.stringify({
          notaId: id,
        }),
    }).then(async (resposta) => {
        document.getElementById("listasNotas").innerHTML = "";
        dados = await resposta.json()
        
        for (k in dados){
            div = document.getElementById("listasNotas");
            nota = document.createElement("p");
            nota.innerHTML = dados[k]["Texto"];
            nota.id = dados[k]["idNota"];
            nota.classList.add("apagaNota");
            div.appendChild(nota)
        }
    });
});

$(document).on("click","#sair", function() {
    fetch("/sair").then(async (resposta) => {
        dados = await resposta.json()
        if (dados.valido == 1){
            $("#sec_notas").fadeOut(100, function() { 
                $("#sec_login").fadeIn(350)
                $("#listasNotas").html("");
            });
        }
    });
});
