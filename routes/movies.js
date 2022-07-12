import express from "express";
import { getAllMovies, getMoviesById, deleteMoviesById, updateMoviesById, createMovies } from "./helper.js";



const router = express.Router();            // using Router in express & replacing all app.*  --> router.* .  Also replace (/movies  --> / ) as it is already mentioned in index.js when mentioning moviesRouter



// get all movies
router.get('/', async function (request, response) {
    
    // sending the local data from index.js file
    // response.send(movie);


    // sending the data from MongoDB 
    if(request.query.rating){
        request.query.rating = +request.query.rating;
    }
    const result = await getAllMovies(request);                   // converting cursor (i.e.. returned by find operations) to Array
    response.send(result);
})


// get movies by id
router.get('/:id', async function (request, response) {

    // for dynamic url we get the dynamic value from request.params which stores the dynamic part as an object
    const {id} = request.params;


    // Operation with local data
    // let final = movies.find((ele)=> ele.id === id)


    // Operation with MongoDB connection
    const final = await getMoviesById(id);


    final ? response.send(final) : response.status(404).send("No movies found")
    console.log(response);
})


// delete movies by id
router.delete('/:id', async function (request, response) {

    // for dynamic url we get the dynamic value from request.params which stores the dynamic part as an object
    const {id} = request.params;

    // Operation with MongoDB
    const final = await deleteMoviesById(id);

    final.deletedCount>0 ? response.send(final) : response.status(404).send("No movies found")
    console.log(response);
})


// Update movies by id
router.put('/:id', async function (request, response) {

    // for dynamic url we get the dynamic value from request.params which stores the dynamic part as an object
    const {id} = request.params;

    // Catching the data passed inside body
    const data = request.body;

    // Operation with MongoDB connection
    const final = await updateMoviesById(id, data);

    final.modifiedCount>0 ? response.send(final) : response.status(404).send("No movies found");
})


// create movies with postman
router.post('/', async function (request, response) {

    const data = request.body;

    // inserting the data in MongoDB
    const result = await createMovies(data);
    response.send(result)               // The response that we are sending is going to give us the insert operation result in mongo DB i.e... id
})



export const moviesRouter = router;





