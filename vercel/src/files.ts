import fs from 'fs'
import path from 'path'


export default function getFiles(dir:string = path.join(__dirname,'/output')){
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
