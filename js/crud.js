/**********************************************************************
 * Objetivo: interação de cadastro, consulta, edição e exclusão de dados
 * Data:23/11/2024
 * Autor: Osmar e wagner
 * Versão: 1.0
 **********************************************************************/


const botaoSalvar = document.getElementById('salvar')

// Função para limpar o formulário
function limparFormulario() {
    document.getElementById('title').value = '';
    document.getElementById('sinopse').value = '';
    document.getElementById('image').value = '';
    document.getElementById('price').value = '';
    document.getElementById('salvar').innerText = 'Salvar'; // Resetar o texto do botão
    sessionStorage.removeItem('idFilme'); // Limpar o ID armazenado
}

// Função para adicionar um filme no BD
const postFilme = async function() {
    let url =  "https://app-avaliacao-brh0avd2ahegehac.brazilsouth-01.azurewebsites.net/projeto1/fecaf/novo/filme"
    
    let titulo = document.getElementById('title');
    let descricao = document.getElementById('sinopse');
    let foto = document.getElementById('image');
    let valor = document.getElementById('price');

    let filmeJSON = {
        nome: titulo.value,
        sinopse: descricao.value,
        image: foto.value,
        valor: valor.value
    };

    let response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify(filmeJSON)
    });

    if(response.status == 201){
        alert('Registro inserido com sucesso');
        getFilmes(); // Atualiza a lista de filmes
        limparFormulario(); // Limpa o formulário
    } else {
        alert('Não foi possível inserir o registro, verifique os dados enviados');
    }
}

const putFilme = async function() {
    let id = sessionStorage.getItem('idFilme');
    let url = 'https://app-avaliacao-brh0avd2ahegehac.brazilsouth-01.azurewebsites.net/projeto1/fecaf/atualizar/filme/' + id;

    let titulo = document.getElementById('title');
    let descricao = document.getElementById('sinopse');
    let foto = document.getElementById('image');
    let valor = document.getElementById('price');

    let filmeJSON = {
        nome: titulo.value,
        sinopse: descricao.value,
        image: foto.value,
        valor: valor.value
    };

    let response = await fetch(url, {
        method: 'PUT',
        mode: 'cors',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify(filmeJSON)
    });

    if(response.status == 200){
        alert('Registro atualizado com sucesso');
        getFilmes(); // Atualiza a lista de filmes
        limparFormulario(); // Limpa o formulário
    } else {
        alert('Não foi possível atualizar o registro, verifique os dados enviados');
    }
}

const deleteFilme = async function(idFilme) {
    let url = 'https://app-avaliacao-brh0avd2ahegehac.brazilsouth-01.azurewebsites.net/projeto1/fecaf/excluir/filme/' + idFilme;

    let response = await fetch(url, {
        method: 'DELETE'
    });

    if(response.status == 200){
        alert('Registro excluído com sucesso!');
        getFilmes(); // Atualiza a lista de filmes
    } else {
        alert('Não foi possível realizar a exclusão do registro.');
    }
}

const getFilmes = async function() {
    let url = 'https://app-avaliacao-brh0avd2ahegehac.brazilsouth-01.azurewebsites.net/projeto1/fecaf/listar/filmes';

    let response = await fetch(url);
    let dados = await response.json();

    let divListDados = document.getElementById('listDados');
    divListDados.innerText = ''; // Limpa a lista antes de adicionar novamente

    dados.filmes.forEach(function(filme) {
        let divDados = document.createElement('div');
        let divTitle = document.createElement('div');
        let divSinopse = document.createElement('div');
        let divPrice = document.createElement('div');
        let divOpcoes = document.createElement('div');
        let spanEditar = document.createElement('span');
        let imgEditar = document.createElement('img');
        let spanExcluir = document.createElement('span');
        let imgExcluir = document.createElement('img');
        
        divDados.setAttribute('id', 'dados');
        divDados.setAttribute('class', 'linha dados');
        imgEditar.setAttribute('src', 'icones/editar.png');
        imgEditar.setAttribute('idFilme', filme.id);
        imgExcluir.setAttribute('src', 'icones/excluir.png');
        imgExcluir.setAttribute('idFilme', filme.id);

        divTitle.innerText = filme.nome;
        divSinopse.innerText = filme.sinopse;
        divPrice.innerText = filme.valor;

        divListDados.appendChild(divDados);
        divDados.appendChild(divTitle);
        divDados.appendChild(divSinopse);
        divDados.appendChild(divPrice);
        divDados.appendChild(divOpcoes);
        divOpcoes.appendChild(spanEditar);
        spanEditar.appendChild(imgEditar);
        divOpcoes.appendChild(spanExcluir);
        spanExcluir.appendChild(imgExcluir);

        imgExcluir.addEventListener('click', function() {
            let resposta = confirm('Deseja realmente excluir esse item?');
            if(resposta) {
                let id = imgExcluir.getAttribute('idFilme');
                deleteFilme(id);
            }
        });

        imgEditar.addEventListener('click', function() {
            let id = imgEditar.getAttribute('idFilme');
            getBuscarFilme(id);
        });
    });
}

const getBuscarFilme = async function(idFilme) {
    let url = 'https://app-avaliacao-brh0avd2ahegehac.brazilsouth-01.azurewebsites.net/projeto1/fecaf/buscar/filme/' + idFilme;

    let response = await fetch(url);
    let dados = await response.json();

    if(response.status == 200) {
        document.getElementById('title').value = dados.filme[0].nome;
        document.getElementById('sinopse').value = dados.filme[0].sinopse;
        document.getElementById('image').value = dados.filme[0].image;
        document.getElementById('price').value = dados.filme[0].valor;
        document.getElementById('salvar').innerText = 'Atualizar';
        sessionStorage.setItem('idFilme', idFilme);
    } else {
        alert('Não foi possível localizar o registro.');
    }
}

botaoSalvar.addEventListener('click', function() {
    if(document.getElementById('salvar').innerText == 'Salvar') {
        postFilme();
    } else if(document.getElementById('salvar').innerText == 'Atualizar') {
        putFilme();
    }
});

// Carregar os filmes na página quando ela for carregada
window.addEventListener('load', function() {
    getFilmes();
});
