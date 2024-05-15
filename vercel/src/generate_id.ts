let MAX_LENGTH = 5;

export default function generate(){
    let set = '1234567890qwertyuiopasdfghjklzxcvbnm';
    let ans ='';
    for(let i = 0; i<MAX_LENGTH;i++){
        ans+=set[Math.floor(Math.random()*set.length)];
    }
    return ans;
}
