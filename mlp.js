function MLP(config){

    this.hidden = config.hidden;
    this.L = config.hidden.length
    this.precision = config.precision;
    this.maxEpochs = config.maxEpochs;
    this.out = config.out;
    this.lr = config.lr;
    //this.data = config.data;
    this.p = config.x.length    // quantidade de preditores (x1,x2,...)
    this.n = config.x[0].length // quantidade de amostras
    this.bias = config.bias

    this.wList = [];
    this.iList = Array.from({length: this.L+1}, () => null);
    this.yList = Array.from({length: this.L+1}, () => null);
    this.dList = Array.from({length: this.L+1}, () => null);
    this.eqmList = [];
    this.eqmSmooth = [];

    // Inicializa as martizes de pesos das camadas escondidas
    // mais a camada de saida com valores entre -0.5 e 0.5
    for (let i = 0; i < this.L; i++) {
        if(i==0){
            this.wList.push(
                wIn
                //math.add(
                //    math.random([this.hidden[i],this.p+1]), -.5
                //)
            )
        } else {
            this.wList.push(
                wH
                //math.add(
                //    math.random([this.hidden[i],this.hidden[i-1]+1]), -.5
                //)   
            )
        }     
    }
    this.wList.push(
        wOut
        //math.add(
        //    math.random([this.out,this.hidden[this.L-1]+1]), -.5
        //)    
    )    
}

MLP.prototype.predict = function MLP_predict(x,y){

    //let seed = 25;
    //let x_rand = math.transpose(shuffle(math.transpose(x),seed))
    //let y_rand = math.transpose(shuffle(math.transpose(y),seed))
    
    let n = x[0].length; // quantidade de amostras de teste

    /** Matriz de confusao
     * VP - Verdadeiro Positivo
     * FP - Falso Positivo
     * VN - Verdadeiro Negativo
     * FN - Falso Negativo
     */
    //let VP = 0;
    //let FP = 0;
    //let VN = 0;
    //let FN = 0;

    let confusionMatrix = Array.from({length: this.out}, () => Array.from({length: this.out}, () => 0));

    //let acertos = 0;
    //let erros = 0;
    
    for (let i = 0; i < n; i++) {
        let amostra = math.subset(x, math.index(math.range(0,this.p),math.range(i,i+1))); 
        this.forward(amostra); 
        let d;           // d = Saida desejada
        if(this.out==1){ // Apenas um neuronio de saida
            d = [[math.subset(y,math.index(0,i))]];
        } else {         // Mais de um neuronio de saida
            d = math.transpose([math.transpose(y)[i]]);
            //d = math.subset(y,math.index([0,this.out-1],i));
        }
        let y_hat = sign(this.yList[this.yList.length-1]);
        
        /**
         * Matriz de confusão
         * index       0   1    2    3    
         *           easy mid hard real (d)
         *   0  easy  a    b   c    d
         *   1  mid   x    y   z    w
         *   2  hard  j    k   l    m
         *   3  real  n    o   p    q 
         *      (y)
         */
           
        let index_d = 0;
        for (let j = 0; j < this.out; j++) {
            if(math.squeeze(d[j]) == 1){
                index_d = j;
                break;
            }            
        }

        let index_y = 0;
        for (let j = 0; j < this.out; j++) {
            if(math.squeeze(y_hat[j]) == 1){
                index_y = j;
                break;
            }            
        }

        confusionMatrix[index_y][index_d] += 1;
        
        //debugger
        //if( d == 1 ){
        //    (y_hat == 1) ? VP++ : FP++
        //} else {
        //    (y_hat == 1) ? FN++ : VN++
        //}
    }  
    debugger 
      
    //const acuracia = (VP + VN) / (VP + VN + FP + FN);
    //const precisao = VP / (VP + FP);
    //const especificidade = VN / (FP + VN);
    //const sensibilidade = VP / (VP + FN);
    //const f_score = (2*precisao*sensibilidade)/(precisao+sensibilidade);
    
}

MLP.prototype.train = function MLP_train(x,y){
        
    let eqm = 1;
    let eqmSum = 0;
    let epoch = 0;

    //randomiza os dados apenas uma vez
    //let seed = 1;
    //let x_rand = math.transpose(shuffle(math.transpose(x),seed))
    //let y_rand = math.transpose(shuffle(math.transpose(y),seed))

    while(eqm > this.precision && epoch < this.maxEpochs){

        // a cada rodada randomiza os dados
        //let x_rand = math.transpose(shuffle(math.transpose(x),seed))
        //let y_rand = math.transpose(shuffle(math.transpose(y),seed))
        //seed++;

        for (let i = 0; i < this.n; i++) {
            let amostra = math.subset(x, math.index(math.range(0,this.p),math.range(i,i+1)))        
            this.forward(amostra);         
            let d;           // d = Saida desejada
            if(this.out==1){ // Apenas um neuronio de saida
                d = [[math.subset(y,math.index(0,i))]];
            } else {         // Mais de um neuronio de saida
                d = math.transpose([math.transpose(y)[i]])
                //d = math.subset(y,math.index([0,this.out-1],i));
            }
            this.backward(amostra, d);
            //console.log("amostra " + i)
            //console.log(JSON.stringify(this.dList))
        } 
        
        eqm = this.erro(x,y);
        console.log( epoch, eqm )
        eqmSum += eqm
        this.eqmList.push(eqm);
        this.eqmSmooth.push(eqmSum/this.eqmList.length)
        epoch += 1;   
                  
    }  
    
    let x_eqm = Array.from({length: this.eqmList.length},(v,i)=> i+1 )
    plotGraph('plot3',[
        {x:x_eqm,y:this.eqmList,name:'learning'},
        {x:x_eqm,y:this.eqmSmooth,name:'mean'}
    ]);
}

MLP.prototype.forward = function MLP_forward(x){

    for (let i = 0; i < this.wList.length; i++) {
        if(i==0){
            let bias = math.concat([[this.bias]],x,0) 
            //this.iList[i] = gpuMatMul(this.wList[i], bias);
            this.iList[i] = math.multiply(this.wList[i], bias);
            this.yList[i] = math.tanh(this.iList[i]);
        } else {
            let bias = math.concat([[this.bias]],this.yList[i-1],0);
            //this.iList[i] = gpuMatMul(this.wList[i], bias);
            this.iList[i] = math.multiply(this.wList[i], bias);
            this.yList[i] = math.tanh(this.iList[i]);
        }       
    } 
}

MLP.prototype.backward = function MLP_backward(x,d){

    for (let i = this.wList.length-1; i > -1; i--) {
        // Ajustando camada de saida
        if(i==this.wList.length-1){
            let erro = math.subtract(d,this.yList[i]) 
            this.dList[i] = math.dotMultiply(
                tanhDerivative(this.iList[i]),
                erro
            )
            let bias = math.concat([[this.bias]], this.yList[i-1], 0);
            let gradient = math.multiply(
                this.lr, math.multiply(this.dList[i], math.transpose(bias))
                //gpuMatMul(this.dList[i], math.transpose(bias))
            )
            this.wList[i] = math.add(this.wList[i], gradient)
        }
        // Ajustando primeira camada escondida
        else if(i == 0){
            let w = removeBias(this.wList[i+1]);
            let erro = math.multiply(math.transpose(w), this.dList[i+1]) //gpuMatMul(math.transpose(w), this.dList[i+1]) 
            this.dList[i] = math.dotMultiply(
                tanhDerivative(this.iList[i]), 
                erro
            )
            let bias = math.concat([[this.bias]], x, 0);
            let gradient = math.multiply(
                this.lr, math.multiply(this.dList[i], math.transpose(bias))
                //gpuMatMul(this.dList[i], math.transpose(bias))
            )
            this.wList[i] = math.add(this.wList[i], gradient) 
        } 
        // Ajustando camada escondida intermediaria
        else {
            let w = removeBias(this.wList[i+1]);
            let erro = math.multiply(math.transpose(w), this.dList[i+1]) //gpuMatMul(math.transpose(w), this.dList[i+1]) 
            this.dList[i] = math.dotMultiply(
                tanhDerivative(this.iList[i]), 
                erro
            )
            let bias = math.concat([[this.bias]], this.yList[i-1], 0);
            let gradient = math.multiply(
                this.lr, math.multiply(this.dList[i], math.transpose(bias))
                //gpuMatMul(this.dList[i], math.transpose(bias))
            )
            this.wList[i] = math.add(this.wList[i], gradient)
        }
    }    
}

MLP.prototype.erro = function MLP_erro(x,y){

    let eqm = 0;
    let eqi = 0;
    
    for (let i = 0; i < this.n; i++) {
        let amostra = math.subset(x, math.index(math.range(0,this.p),math.range(i,i+1)))   
        this.forward(amostra); 
        let d;           // d = Saida desejada
        if(this.out==1){ // Apenas um neuronio de saida
            d = [[math.subset(y,math.index(0,i))]];
        } else {         // Mais de um neuronio de saida
            d = math.transpose([math.transpose(y)[i]])
            //d = math.subset(y,math.index([0,this.out-1],i));
        }
        let erro = 0
        for (let j = 0; j < this.out; j++) {
            erro = math.subtract(d[j],this.yList[this.yList.length-1][j])
            erro = math.multiply(erro,erro)
            eqi = eqi + erro      
        }
        eqm += eqi;
    }
    eqm = eqm / (2 * this.n)
    return eqm
}

MLP.prototype.boundary = function MLP_boundary(x){

    let n = x[0].length; // quantidade de amostras de teste
    let y_pred = []
    
    for (let i = 0; i < n; i++) {
        let amostra = math.subset(
            x, math.index([0,this.p-1],i)
        )
        this.forward(amostra); 
        
        // Essa parte serve para casos onde
        // ha apenas um neuronio de saida
        let y = sign(this.yList[this.yList.length-1]);
        y_pred.push(y)
    }  
    
    return y_pred

}
