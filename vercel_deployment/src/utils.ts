import { exec } from "child_process";
import path from "path";

export function buildProject(id: string){
    const filePath  = path.join(__dirname,`output/${id}`)
    
    return new Promise((resolve)=>{
    const child = exec(`docker info && docker pull node:alpine && docker run --rm -v ${filePath}:/app -w /app node:alpine sh -c "npm install ; npm run build" ` );

    child
    .stdout?.on('data',function(data){
        console.log("stdout:"+data)
    })

    child
    .stderr?.on('data',(data)=>{
        console.log("stderr:"+data);
    })

    child
    .on('close',(code)=>{
        resolve("")
    })


})}