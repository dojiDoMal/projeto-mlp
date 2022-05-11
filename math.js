
// gpu = new GPU();

// /** Calcula o produto entre duas matrizes utilizando a GPU */
// function gpuMatMul(mat1, mat2) {
  
//     let k = mat1[0].length;
//     let n = mat1.length;   
//     let m = mat2[0].length;
      
//     let kernel = gpu.createKernel(function (mat1, mat2) {
//         let sum = 0;
//         for (let i = 0; i < this.constants.k; i++) {
//             sum += mat1[this.thread.y][i] * mat2[i][this.thread.x];
//         }
//         return sum;
//     }, {
//         output: [m,n], 
//         constants: { k: k } 
//     });

//     let output_gpu = kernel(mat1, mat2);

//     /** Remove a tipagem da Array */
//     output_gpu = Array.from({length: output_gpu.length},(v,i)=>{return Array.from(output_gpu[i])});
    
//     return output_gpu;
// }


/**
* @description Método que gera cordenadas (x,y) cartesianas de acordo com o espiral de Arquimedes
* @param {int} noiseAmount - Amplifcador de aleatoriedade.
* @param {bool} inv - Gera um espiral invertido. 
* @returns {object} Cordenadas cartesianas (x,y) 
* @public
*  __________________________
* |__theta___|__qtd_pontos__|
* |_0.006284_|_____1000_____|
*/
function archimedeanSpiral(noiseAmount = 1, inv = false){
    let a = -1.5;
    const b = 2;
    let r = 0;
    let x = [];
    let y = [];
    let theta = 0;
    
    for (theta = 0; theta < 2*Math.PI; theta+=0.006284) {
        r = a + b*theta;
        if(inv) r *= -1;   
        x.push(r*Math.cos(theta) + Math.random()*noiseAmount);
        y.push(r*Math.sin(theta) + Math.random()*noiseAmount);        
    }
    
    return { 
        x: x, 
        y: y
    };    
}


/**
* Permite embaralhar um array de forma determinável por meio de uma seed.
* @param {array} array O array que deverá ser embaralhado 
* @param {number} seed O valor da seed
* @returns {array} O array embaralhado
*/
function shuffle(array, seed) {                
    var m = array.length, t, i;
    while (m) {
        i = Math.floor(random(seed) * m--);   
        t = array[m];
        array[m] = array[i];
        array[i] = t;
        ++seed                                     
    }
    return array;
}

/**
* Gera um numero aleatório a partir de uma seed
* @param {number} seed O valor da seed
* @returns {number} Um número aleatório gerado com base na seed 
*/ 
function random(seed) {
    var x = Math.sin(seed++) * 10000; 
    return x - Math.floor(x);
}

function tanhDerivative(x){
    let aux = math.tanh(x)
    aux = math.dotMultiply(aux,aux);
    return math.subtract(1,aux);
}

function removeBias(w){
    let aux = []
    for (let j = 0; j < w.length; j++) {
        aux.push(w[j].slice(1,w[j][0].length))
    }
    return aux;
}

function normalize(x, range=[-1,1], zeroOne=true){
    //let min = math.min(x);
    //let max = math.max(x);
    let aux = [];
    let min = range[0];
    let max = range[1];
    
    if(zeroOne==true){
        for (let i = 0; i < x.length; i++) {
            aux.push( (x[i] - min) / (max - min) )    
        }
    } else {
        for (let i = 0; i < x.length; i++) {
            aux.push( (2*((x[i] - min) / (max - min)))-1 )    
        }    
    }
    
    return aux
}

function zNormalize(x){
    let std = math.std(x)
    let mean = math.mean(x)
    let aux = []
    
    for (let i = 0; i < x.length; i++) {
        aux.push( (x[i] - mean) / std );        
    }
    
    return aux;
}

function sign(x){
    return x.map((v,i) => {
        if(v>=0){
            return [1];
        } else {
            return [-1];
        }
    })
}

function criaGrid(range, step){
    let stp = step;
    let min = range[0]
    let max = range[1]
    let length = ((max-min)/stp)
    let grid = []
    let points = Array.from({length:length+1},(v,i)=>{
        if(i==0) return min;
        let x = ((i*(max-min))/length)+min
        return Number((Math.round(x/stp)*stp).toFixed(3))
    });
    for (let i = 0; i < points.length; i++) {
        for (let j = 0; j < points.length; j++) {
            grid.push( [points[j],points[i]] )            
        }        
    }
    return grid;
}

function norm(x, range=[-1,1]){
    //let min = math.min(x);
    //let max = math.max(x);
    let aux = [];
    let min = range[0];
    let max = range[1];
    
    for (let i = 0; i < x.length; i++) {
        aux.push( (2*((x[i] - min) / (max - min)))-1 )    
    }  
   
    return aux
}
