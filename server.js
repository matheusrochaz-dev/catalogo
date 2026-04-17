import express from 'express'
import cors from 'cors'
import Database from "better-sqlite3";

const db = new Database('filme.db');

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())

app.listen(PORT, (error) => {
  console.log('Servidor rodando na porta 3000')
  console.log(error)
})

app.post('/catalogo', (req, res) => {
  try{
  lerFilmes()

    const filme = req.body
    const banco = db.prepare(`
      insert into filmes(id, nome, diretor, ano, url, genero)
      VALUES (?, ?, ?, ?, ?, ?)
      `
    );
    banco.run(
      filme.id,
      filme.nome,
      filme.diretor,
      filme.ano,
      filme.url,
      filme.genero
    );

    res.json(filme)
  }
  catch(erro){
    console.error(erro)
    res.status(500).json({
      erro: 'Erro ao inserir filme'
    })
  }
  
})



function lerFilmes() {
  const dados = db.prepare(`SELECT * FROM filmes ORDER BY ano Desc`).all()
  return dados

}

app.get('/catalogo', (req, res) => {
  try{
    const filmes = lerFilmes()
      res.json(filmes)
  }
  catch(erro){
    console.error(erro)
    res.status(500).json({
      erro: 'Erro ao pegar os filmes'
    })
  }
  
})

app.delete('/catalogo/:id', (req,res) => {
  try{
    const id = Number(req.params.id)
    const dados = db.prepare(`DELETE FROM filmes WHERE id = ?`);
    dados.run(id)
    res.json("tudo certo e deletado")
  }
  catch(erro){
    console.error(erro)
    res.status(500).json({
      erro: 'Erro ao deletar filme'
    })
  }
  
})


app.put('/catalogo/:id', (req,res) => {
  try{
    const id = Number(req.params.id)
    const tituloEdit = req.body.tituloEdit
    const diretorEdit = req.body.diretorEdit
    const anoEdit = req.body.anoEdit
    const urlEdit = req.body.urlEdit
    const generoEdit = req.body.generoEdit
    const dados = db.prepare(`
    UPDATE filmes
    SET nome = ?, genero = ?, diretor = ?, ano = ?, url = ?
    WHERE id = ?
    `).run(tituloEdit, generoEdit, diretorEdit, anoEdit, urlEdit, id);
    const resultado = db.prepare(`SELECT * FROM filmes`).all();
    res.json(resultado)
  }
  catch(erro){
    console.error(erro)
    res.status(500).json({
      erro: 'Erro ao editar filme'
    })
  }
})


app.get('/catalogo/:nome', (req,res) => {
  try{
    const nome = req.params.nome
    let dados = db.prepare(`SELECT * FROM filmes WHERE nome LIKE ? ORDER BY ano DESC`).all(nome + '%');

    if (dados.length === 0 ) {
      return res.status(404).json({ erro: "Filme não encontrado" })
    }
    res.json(dados)
  }
  catch(erro){
    console.error(erro)
    res.status(500).json({
      erro: 'Erro ao filtrar filme'
    })
  }
  
})
