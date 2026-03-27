import express from 'express'
import cors from 'cors'
import fs from 'fs'

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())


app.listen(PORT, (error) => {
  console.log('Servidor rodando na porta 3000')
  console.log(error)
})

function lerFilmes() {
  const dados = fs.readFileSync('filmes.json')
  return JSON.parse(dados)
}

function salvarFilmes(filmes) {
  fs.writeFileSync('filmes.json', JSON.stringify(filmes, null, 2))
}

app.post('/catalogo', (req, res) => {
  const filmes = lerFilmes()
  const filme = req.body

  filmes.push(filme)

  salvarFilmes(filmes)
  res.json(filmes)
})

app.delete('/catalogo/:id', (req,res) => {
  const id = Number(req.params.id)
  const dados = fs.readFileSync('filmes.json', 'utf-8')
  let filmes = JSON.parse(dados)
  filmes = filmes.filter(item => item.id !== id)
  fs.writeFileSync('filmes.json', JSON.stringify(filmes, null, 2));
  res.json("tudo certo e deletado")
}
)

app.get('/catalogo/:id', (req,res) => {
  const id = Number(req.params.id)
  const dados = fs.readFileSync('filmes.json', 'utf-8')
  let filmes = JSON.parse(dados)
  filmes = filmes.find(item => item.id == id)
  res.json(filmes)
})

app.put('/catalogo/:id', (req,res) => {
  const id = Number(req.params.id)
  const tituloEdit = req.body.tituloEdit
  const diretorEdit = req.body.diretorEdit
  const anoEdit = req.body.anoEdit
  const urlEdit = req.body.urlEdit
  let dados = fs.readFileSync('filmes.json', 'utf-8')
  let filmes = JSON.parse(dados)
  let filme = filmes.find(item => item.id == id)
  filme.nome = tituloEdit
  filme.diretor = diretorEdit
  filme.ano = anoEdit
  filme.url = urlEdit
  fs.writeFileSync('filmes.json', JSON.stringify(filmes, null, 2));
  res.json(filmes)
})

app.get('/catalogo', (req, res) => {
  const filmes = lerFilmes()
  res.json(filmes)
})
