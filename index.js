const express = require("express")
const app = express()
app.use(express.json());

app.listen(3000)

app.locals.pets = [
    { id: 'a1', name: 'Jessica', type: 'dog' },
    { id: 'b2', name: 'Marcus Aurelius', type: 'parakeet' },
    { id: 'c3', name: 'Craisins', type: 'cat' }
]

app.get('/', (req, res) => {
    const pets = app.locals.pets;
    res.json({ pets });
})

app.get('/pets/:id', (request, response) => {
    const { id } = request.params;
    const pet = app.locals.pets.find(pet => {
        return pet.id === id
    })
    if (!pet) {
        return response.sendStatus(404)
    }
    response.status(200).json(pet)
})

app.post('/pets/change', (request, response) => {
    const id = Date.now();
    const pet = request.body;

    for (let requiredParameter of ['name', 'type']) {
        if (!pet[requiredParameter]) {
            response
                .status(422)
                .send({ error: `Expected format: { name: <String>, type: <String> }. You're missing a "${requiredParameter}" property.` });
        }
    }

    const { name, type } = pet;
    app.locals.pets.push({ name, type, id });
    response.status(201).json({ name, type, id });
});