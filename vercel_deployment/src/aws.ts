import { S3 } from "aws-sdk";
import { dir } from "console";
import fs from 'fs';
import path from "path";
import dotenv from 'dotenv'

dotenv.config({path: '.env.local'});

const s3 = new S3({
    accessKeyId: process.env.accessKeyId,
    secretAccessKey: process.env.secretAccessKey,
    endpoint:process.env.endpoint
});


export async function download(prefix:string){
    console.log(prefix);
    const allFiles = await s3.listObjectsV2({
        Bucket:"vercel",
        Prefix:prefix
    }).promise();
    const allPromises = allFiles.Contents?.map(async ({Key})=>{
        return new Promise( (resolve)=>{
            if(!Key){
                resolve("");
                return;
            }

            const finalPath = path.join(__dirname,Key);
            const outputPath = fs.createWriteStream(finalPath);
            const dirName = path.dirname(finalPath);
            
            if(!fs.existsSync(dirName)){
                fs.mkdirSync(dirName,{recursive: true});
            }
            s3.getObject({
                Bucket: "vercel",
                Key: Key || ""
            }).createReadStream().pipe(outputPath)
            .on("finish",()=>{
                resolve("");
            });
        })
    })||[];

    console.log("awaiting");
    await Promise.all(allPromises?.filter(x=> x!==undefined));
}

export function getFiles(dir:string){
    let response:string[] =[];
    const filelist = fs.readdirSync(dir);
    filelist.forEach(file => {
        const fullpath = path.join(dir,file);
         if (fs.statSync(fullpath).isDirectory())
            {response=response.concat(getFiles(fullpath))}
            
        else {response.push(fullpath);}
})
return response;
};

async function uploadFile(fileName :string,filePath:string){
    const file = fs.readFileSync(filePath);
    fileName = fileName.replace(/\\/g,"/");
    const response=await s3.upload({
        Body: file,
        Bucket: "vercel",
        Key: fileName,
    }).promise();
    // console.log(response);

}
export async function copyFinal(id:string){
    const filePath = path.join(__dirname,`output/${id}/dist`);
    const allFiles = await getFiles(filePath);
    await Promise.all(allFiles.map(async (file)=>{
        await uploadFile(`dist/${id}/`+file.substring(filePath.length+1),file);
    }))
}