import {commandOptions, createClient} from 'redis'
import { download, copyFinal } from './aws'
import { buildProject } from './utils'

const subscriber = createClient();
subscriber.connect();

const publisher = createClient();
publisher.connect();


async function main(){
    while(1){
        const response = await subscriber
            .brPop(
                commandOptions({isolated:true}),
                'build-queue',
                0
            );
        //@ts-ignore
        const id = response.element;
        
        await download(`output/${id}`);
        console.log("downloaded");

        console.log("Building.....");
        await buildProject(id);
        console.log('built');
        await copyFinal(id);
        console.log('Finished upload');
        publisher.hSet("status",id,"deployed")
    }
}

main();