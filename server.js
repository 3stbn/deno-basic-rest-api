import { Application, Router } from 'https://deno.land/x/oak/mod.ts'

const app = new Application()
const router = new Router()

let movies = [
    { id: 1, name: 'Parasite' },
    { id: 2, name: 'The Irishman' },
]

router
    .get('/', helloWorld)
    .get('/movies', getMovies)
    .get('/movies/:id', getMovie)
    .post('/movies', addMovie)
    .put('/movies/:id', updateMovie)
    .delete('/movies/:id', deleteMovie)

async function deleteMovie({ params, response }) {
    const id = parseInt(params.id)
    const movie = movies.find((m) => m.id === id)
    if (!movie) {
        response.status = 404
        response.body = { message: 'Movie was not found' }
        return
    }
    movies = movies.filter((m) => m.id !== id)
    response.status = 200
    response.body = { id }
}

async function updateMovie({ request, response, params }) {
    const id = parseInt(params.id)
    const movie = movies.find((m) => m.id === id)
    if (!movie) {
        response.status = 404
        response.body = { message: 'Movie was not found' }
        return
    }
    const body = await request.body()
    const { value } = body
    const updated = { id, name: value.name }
    movies = movies.map((m) => (m.id === id ? updated : m))
    response.status = 200
    response.body = updated
}

async function addMovie({ request, response }) {
    const body = await request.body()
    const { value } = body
    const movie = {
        id: movies.length + 1,
        name: value.name,
    }
    movies.push(movie)
    response.status = 200
    response.body = movie
}

function getMovie({ params, response }) {
    const id = parseInt(params.id)
    const movie = movies.find((m) => m.id === id)
    if (!movie) {
        response.status = 404
        response.body = { message: 'Movie was not found' }
        return
    }
    response.status = 200
    response.body = movie
}

function getMovies({ response }) {
    response.body = movies
}

function helloWorld({ response }) {
    response.body = 'Hello from the router'
}

app.use(router.routes())
app.use(router.allowedMethods())

console.log('Deno server is running')

await app.listen({ port: 8000 })
