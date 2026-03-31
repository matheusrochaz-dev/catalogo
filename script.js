const titulo = document.querySelector("#titulo")
const diretor = document.querySelector("#diretor")
const ano = document.querySelector("#ano")
const url = document.querySelector("#url")
const lista = document.querySelector('#lista')

let btn_adicionar = document.querySelector('#adicionar')
const btn_limpar = document.querySelector('#limpar')
const form = document.querySelector('form');


btn_adicionar.addEventListener('click', async (event) => {
  if(btn_adicionar.textContent == "Salvar"){
    editar()
  }
  else{
  event.preventDefault()
  if(form.checkValidity()){
    const filme = {
      id: Date.now(),
      nome: titulo.value,
      diretor: diretor.value,
      ano: ano.value,
      url: url.value
    }
    const resposta = await fetch('http://localhost:3000/catalogo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(filme)
    })
    alert('Filme enviado!')
    atualizar()
  }
  else{
    alert("preencha corretamente os dados")
  }
}
})

async function atualizar(){
  const resposta = await fetch('http://localhost:3000/catalogo')
  const dados = await resposta.json()
  if (dados.length === 0) {
    lista.innerHTML = "<p>Nenhum filme cadastrado</p>"
  }
  else{
    lista.innerHTML = ""
  dados.forEach(filme => {
    lista.innerHTML += `
      <div class = "catalogoTotal">
        <div class="cata_format">
          <img src="${filme.url}">
          
          <div>
            <h2>${filme.nome}</h2>
            <p><strong>Diretor:</strong> ${filme.diretor}</p>
            <p><strong>Ano:</strong> ${filme.ano}</p>
          </div>
        </div>
        <div class="botoes">
          <button class= "excluir" data-id="${filme.id}">Excluir</button>
          <button class= "editar" type="button" data-id="${filme.id}">Editar</button>
        </div>
      </div>  
  `
  });
  }
  
  editar()
  excluir()
}

function excluir(){
  const excluirBotoes = document.querySelectorAll('.excluir')
  excluirBotoes.forEach(botao => {
    botao.addEventListener('click', async () => {
      const id = botao.dataset.id;
      const resposta =  await fetch(`http://localhost:3000/catalogo/${id}`, {
      method: 'DELETE' });
      const dados = await resposta.json();

      alert(dados);  
      atualizar();
  })
})
}

function editar(){
  const editarbtn = document.querySelectorAll('.editar')
  editarbtn.forEach(botao => {
    botao.addEventListener('click', async () =>{
      const id = botao.dataset.id;
      const resposta =  await fetch(`http://localhost:3000/catalogo/${id}`)
      const dados = await resposta.json();
      titulo.value = dados.nome
      diretor.value = dados.diretor
      ano.value = dados.ano
      url.value =  dados.url
      titulo.focus()
      btn_adicionar.textContent = "Salvar"
      if(form.checkValidity()){
        btn_adicionar.addEventListener('click', async () => {
          const respostaPut = await fetch(`http://localhost:3000/catalogo/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              tituloEdit: titulo.value,
              diretorEdit: diretor.value,
              anoEdit: ano.value,
              urlEdit: url.value
            })
          })
          alert("Editado")
        })
        }
        else{
          alert("preencha todos os dados")
        }
    })
  })
}

atualizar()