
import express from 'express';
import cors from 'cors';
import generate from './generate_id';
import simpleGit from 'simple-git';
import getFiles from './files';
import path from 'path';
import uploadFile from "./aws";
import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config({path: '.env.local'});

const publisher = createClient();
publisher.connect();
const subscriber = createClient();
subscriber.connect();

let app = express();
let PORT= process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/deploy',async (req,res)=>{
    const repoUrl = req.body.repoUrl;
    const id = generate();

    await simpleGit().clone(repoUrl,path.join(__dirname,`/output/${id}`));
    console.log("Received succesfully");
    const files = getFiles(path.join(__dirname,`/output/${id}`));

    await Promise.all(files.map(async (file)=>{
        await uploadFile(file.slice(__dirname.length+1),file);
    }))

    publisher.lPush("build-queue",id);
    publisher.hSet("status",id,"uploaded");
    
    res.json({
        id,
    });

})

app.get('/status',async (req,res)=>{
    const id = req.query.id;
    const response = await subscriber.hGet("status",id as string);
    res.json({
        status: response
    });

})


console.log(`Server running on http://localhost:${PORT}`);
app.listen(PORT);