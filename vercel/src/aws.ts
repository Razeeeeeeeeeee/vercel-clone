import {S3} from "aws-sdk";
import { response } from "express";
import fs from "fs";
import path from 'path'
import dotenv from 'dotenv';

dotenv.config({path: '.env.local'});

const s3 = new S3({
    accessKeyId:process.env.accessKeyId,
    secretAccessKey: process.env.secretAccessKey,
    endpoint:process.env.endpoint
});

export default async function uploadFile(fileName :string,filePath:string){
    const file = fs.readFileSync(filePath);
    fileName = fileName.replace(/\\/g,"/");
    const response=await s3.upload({
        Body: file,
        Bucket: "vercel",
        Key: fileName,
    }).promise();
    // console.log(response);

}