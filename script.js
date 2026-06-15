const socket = new WebSocket('ws://192.168.0.8:8080');
let meuNome = "";
let noticiaAtiva = "";

function entrar() {
    const input = document.getElementById('input-nome');
    if(input.value.trim() !== "") {
        meuNome = input.value;
        document.getElementById('modal-login').style.display = 'none';
        
        const lista = document.getElementById('view-lista');
        lista.style.filter = 'none';
        lista.style.pointerEvents = 'auto';
        lista.style.display = 'block';
        
        if (meuNome.toLowerCase() === 'admin') {
            document.getElementById('admin-panel').style.display = 'block';
        }
    }
}

function abrirNoticia(titulo, conteudo) {
    noticiaAtiva = titulo;
    document.getElementById('view-lista').style.display = 'none';
    document.getElementById('view-noticia').style.display = 'block';
    document.getElementById('titulo-aberto').innerText = titulo;
    document.getElementById('conteudo-aberto').innerText = conteudo;
    document.getElementById('chat').innerHTML = ""; 
}

function voltar() {
    document.getElementById('view-lista').style.display = 'block';
    document.getElementById('view-noticia').style.display = 'none';
    noticiaAtiva = "";
}

function enviarMensagem() {
    const input = document.getElementById('input-chat');
    if(input.value.trim() !== "") {
        const payload = { 
            autor: meuNome, 
            mensagem: input.value, 
            noticiaRelacionada: noticiaAtiva 
        };
        socket.send(JSON.stringify(payload));
        input.value = '';
    }
}

function publicarNoticiaAdmin() {
    const titulo = document.getElementById('new-titulo').value;
    const conteudo = document.getElementById('new-conteudo').value;
    if(titulo && conteudo) {
        socket.send(JSON.stringify({ titulo, conteudo }));
        document.getElementById('new-titulo').value = '';
        document.getElementById('new-conteudo').value = '';
    }
}

socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    
    if (data.titulo) {
        const lista = document.getElementById('lista-noticias');
        const div = document.createElement('div');
        div.style.cursor = 'pointer';
        div.style.padding = '15px';
        div.style.borderBottom = '1px solid #ddd';
        div.innerHTML = `<h3>${data.titulo}</h3>`;
        div.onclick = () => abrirNoticia(data.titulo, data.conteudo);
        lista.appendChild(div);
    } 
    else if (data.autor) {

        if (data.noticiaRelacionada && data.noticiaRelacionada.trim() === noticiaAtiva.trim()) {
            const chat = document.getElementById('chat');
            chat.innerHTML += `<p><b>${data.autor}:</b> ${data.mensagem}</p>`;
            chat.scrollTop = chat.scrollHeight;
        }
    }
};