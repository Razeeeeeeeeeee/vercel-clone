import express from 'express';
import {S3} from 'aws-sdk'
import dotenv from 'dotenv';

dotenv.config({path:'.env.local'});

const PORT = process.env.PORT;

const s3 = new S3({
    accessKeyId:process.env.accessKeyId,
    secretAccessKey: process.env.secretAccessKey,
    endpoint:process.env.endpoint
});

const app = express();

app.get('/*',async (req,res)=>{
    const host = req.hostname;
    const id = host.split(".")[0];
    const filePath = req.path;

    const content = await s3.getObject({
        Bucket:"vercel",
        Key:`dist/${id}${filePath}`
    }).promise();

    console.log(`dist/${id}${filePath}`)

    const type = filePath.endsWith("html") ? "text/html" : filePath.endsWith("css") ? "text/css" : "application/javascript";
    res.set("Content-Type",type);
    res.send(content.Body);
 
})



console.log(`Listening on Port ${PORT}`);
app.listen(PORT);