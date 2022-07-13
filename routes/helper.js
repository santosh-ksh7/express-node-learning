import { client } from "../index.js";
import { ObjectId } from "mongodb";

export async function createMovies(data) {
    return await client.db("guvi").collection("movies").insertOne(data);
}
export async function updateMoviesById(id, data) {
    return await client.db("guvi").collection("movies").updateOne({ _id: ObjectId(id) }, { $set: data });
}
export async function deleteMoviesById(id) {
    return await client.db("guvi").collection("movies").deleteOne({ _id: ObjectId(id) });
}
export async function getMoviesById(id) {
    return await client.db("guvi").collection("movies").findOne({ _id: ObjectId(id) });
}
export async function getAllMovies(request) {
    return await client.db("guvi").collection("movies").find(request.query).toArray();
}
