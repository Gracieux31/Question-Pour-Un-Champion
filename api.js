const express = require('express');
let app = express();
let port = 8080;


app.get('/', function (req, res) {
    res.send('Hello world !')
})

app.listen(port, () => {
    console.log('le serveur fonctionne')
})

const mongoose = require('mongoose');

const schema = mongoose.schema({
    titre: String,
    auteur: String,
    // genre: string
})
module.exports = mongoose.model('livre', schema)
//const mongoose = require('mongoose')
const livres = require('livres')

mongoose.connect('mongodb://localhost:27017/livres', {
    useNewUrlParser: true
});

app.post('/', async (req, res) => {})

const body = require('body-parser')

app.use(body())

app.post('/', async (req, res) => {
    const titre = req.body.titre;
    const auteur = req.body.auteur
    const genre = req.body.genre

    if (!genre || !auteur || !titre) {
        res.send('il manque un argument')
    }
    const nouveau_livre = new Livres({
        titre: titre,
        auteur: auteur,
        genre: genre
    })

    await nouveau_livre.save()
    res.json(nouveau_livre)
    return

})