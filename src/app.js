const express = require('express');
const app = express();

app.use(express.json());

let filmes = [
    { id: 1, titulo: "Homem-Aranha", diretor: "Jon Watts", genero: "Ação", ano: 2021 },
    { id: 2, titulo: "Crepúsculo", diretor: "Catherine Hardwicke", genero: "Fantasia", ano: 2008 },
    { id: 3, titulo: "A Barraca do Beijo", diretor: "Vince Marcello", genero: "Romance", ano: 2018 }
];

// Rota inicial com instruções
app.get('/', (req, res) => {
    res.send(`
        <h1>Filmes Online</h1>
        <p>Use os endpoints:</p>
        <ul>
            <li>GET /filmes → lista todos os filmes</li>
            <li>GET /filmes/:id → busca filme por ID</li>
            <li>GET /filmes/genero/:genero → busca filmes por gênero</li>
            <li>POST /filmes → adiciona um filme (JSON: {titulo, diretor, genero, ano})</li>
            <li>PUT /filmes/:id → atualiza filme por ID</li>
            <li>DELETE /filmes/:id → remove filme por ID</li>
        </ul>
    `);
});

// Listar todos os filmes
app.get('/filmes', (req, res) => {
    res.status(200).json(filmes);
});

// Buscar filme por ID
app.get('/filmes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const filme = filmes.find(filme => filme.id === id);

    if (!filme) {
        return res.status(404).json({ erro: 'Filme não encontrado' });
    }

    res.status(200).json(filme);
});

// Buscar filmes por gênero
app.get('/filmes/genero/:genero', (req, res) => {
    const genero = req.params.genero.toLowerCase();
    const resultado = filmes.filter(filme => filme.genero.toLowerCase() === genero);

    if (resultado.length === 0) {
        return res.status(404).json({ erro: 'Nenhum filme encontrado nesse gênero' });
    }

    res.status(200).json(resultado);
});

// Adicionar novo filme
app.post('/filmes', (req, res) => {
    const { titulo, diretor, genero, ano } = req.body;

    if (!titulo || !diretor || !genero || !ano) {
        return res.status(400).json({ erro: 'Preencha todos os campos' });
    }

    const novoFilme = {
        id: filmes.length + 1,
        titulo,
        diretor,
        genero,
        ano
    };

    filmes.push(novoFilme);
    res.status(201).json({ mensagem: 'Filme adicionado com sucesso', filme: novoFilme });
});

// Atualizar filme por ID
app.put('/filmes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { titulo, diretor, genero, ano } = req.body;

    const filme = filmes.find(filme => filme.id === id);

    if (!filme) {
        return res.status(404).json({ erro: 'Filme não encontrado' });
    }

    if (!titulo || !diretor || !genero || !ano) {
        return res.status(400).json({ erro: 'Preencha todos os campos' });
    }

    filme.titulo = titulo;
    filme.diretor = diretor;
    filme.genero = genero;
    filme.ano = ano;

    res.status(200).json({ mensagem: 'Filme atualizado com sucesso', filme });
});

// Remover filme por ID
app.delete('/filmes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = filmes.findIndex(filme => filme.id === id);

    if (index === -1) {
        return res.status(404).json({ erro: 'Filme não encontrado' });
    }

    const removido = filmes.splice(index, 1);
    res.status(200).json({ mensagem: 'Filme removido com sucesso', filme: removido[0] });
});

module.exports = app;
