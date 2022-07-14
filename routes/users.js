import express from "express";
import { createuser, getUserByName } from "./helper.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";



const router = express.Router();            // using Router in express & replacing all app.*  --> router.* .  Also replace (/users  --> / ) as it is already mentioned in index.js when mentioning moviesRouter



// generating hash values

async function generateHash(password){
    const no_of_rounds = 10;
    const salting_value = await bcrypt.genSalt(no_of_rounds);
    const hash_value = await bcrypt.hash(password, salting_value);
    // console.log(hash_value);
    return(hash_value)
}



// create user -- register
router.post('/signup', async function (request, response) {

    const {username, password} = request.body;              // destructured the body to extract what i need

    const verifyifalreadyexist = await getUserByName(username);         // checking if user already exist
    console.log(verifyifalreadyexist);

    if(verifyifalreadyexist){
        response.status(400).send("User already exist")                     // aborting insert operation coz already exist
    }else if(password.length < 8){
        response.status(400).send("Password length too short")                 // aborting insert operation coz password length is less than 8           
    }else{
        const hashed_password = await generateHash(password);           // generetaed hash value from async func. with await
        console.log(hashed_password);

        const result = await createuser({username : username, password : hashed_password});             // sent the data accordingly to DB 
        response.send(result)    
    }               
})


// login
router.post('/login', async function (request, response) {

    const {username, password} = request.body;              // destructured the body to extract what i need

    const verifyifalreadyexist = await getUserByName(username);         // checking if user exists
    console.log(verifyifalreadyexist);

    if(!verifyifalreadyexist){
        response.status(400).send("Invalid credentials")                     // aborting operation coz doesn't exist
    }else{
        const stored_password = verifyifalreadyexist.password;
        const check_password_match =  await bcrypt.compare(password, stored_password )         // comparinh hash value of entered password from body & stored password from DB
        console.log(check_password_match);
        if(check_password_match){
            const token = jwt.sign({id : verifyifalreadyexist._id}, process.env.secret_key);
            response.send({token : token, msg : "Succesfully logged in"})
        }else{
            response.status(400).send("Invalid credentials")
        }
    }               
})


export const usersRouter = router;

