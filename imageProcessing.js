
let dir = 'treino'
let imgSize = 32;

let files = 0
let arrfilePath = []
let arrImages = [];

processa()

async function processa(){

    let seed = 33
    // arr.length = quantidade de amostras
    let arr = await getImageData(dir, imgSize)
    arr = shuffle(arr,seed)

    
    let y = Array.from({length:arr.length}, (v,i) => {
        
        if(i<90){
            return [
                1,  //easy
                -1, //mid
                -1, //hard
                -1  //real
            ] 
        } else if(i<180) {
            return [
                -1, //easy
                -1, //mid
                1,  //hard
                -1  //real
            ] 
        } else if(i<270){
            return [
                -1, //easy
                1, //mid
                -1,  //hard
                -1  //real
            ]    
        } else {
            return [
                -1, //easy
                -1, //mid
                -1,  //hard
                1  //real
            ]
        }
    })
    y = shuffle(y,seed)

    let x_train = arr.slice(0,arr.length*.8);
    let y_train = y.slice(0,y.length*.8);

    let x_test = arr.slice(arr.length*.8, arr.length);
    let y_test = y.slice(y.length*.8, y.length);
    
    /** Configuração para MLP */
    const network = {
        hidden: [512,256], //[313,158],
        out: 4,
        lr: 0.033, //0.02
        maxEpochs: 125,
        precision: 0.005,
        data: arr,
        x: math.transpose(x_train),
        y: math.transpose(y_train),
        bias: -1
    }

    /** Configuração para RBF 
    const network = {
        hidden: [50], 
        bias: 1,
        out: 2,
        lr: 0.02, 
        maxEpochs: 200,
        precision: 0.003,
        x: math.transpose(x_train),
        y: math.transpose(y_train),
        centers: {
            lr: 0.1,
            maxEpochs: 40,
            precision: 0.1
        },
        data: arr
    }
    */
   
    /** RBF 
    const rbf = new RBF(network)
    rbf.train(network.x,network.y);
    rbf.predict(math.transpose(x_test),math.transpose(y_test))
    */

    /** MLP */
    const mlp = new MLP(network);
    mlp.train(network.x,network.y);  
    mlp.predict(math.transpose(x_test),math.transpose(y_test));
    debugger

}

async function getImageData(dir,size=32){
    
    const response = await fetch( `http://localhost:3000/?dir=${dir}&size=${size}` )
    const data = await response.json()
    let arrImg = [];
    
    for (const i in data) {
        arrImg.push(data[i]);
    }
    
    return arrImg;
}
