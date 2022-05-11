const express = require('express'); //Import the express dependency
const fs = require('fs');
const cors = require('cors');
const jpgjs = require('jpeg-js'); /** https://github.com/jpeg-js/jpeg-js */
const resizeImageData = require('resize-image-data'); /** https://github.com/LinusU/resize-image-data */

const app = express();              //Instantiate an express app, the main work horse of this server
app.use(cors());

const port = 3000;

/** Retorna quantidade de arquivos no diretório "x" */
app.get('/', cors(), (req, res) => {

    let dir = req.query['dir'];
    let imgSize = Number(req.query['size']);

    const parent = 'treino/';
    let arrFiles = fs.readdirSync(parent, ()=>{})
    const l = fs.readdirSync(dir).length

    let o = {
        len: l,
        paths: arrFiles.map((el)=>{return `${parent}${el}`}),
        parent: parent
    }

    let arrImgData = [];
    let objImgData = {}
    let load = 0
    for (const p of o.paths) {
        if(load == 360) break
        console.log(p)
        // Le o arquivo 'jpg' a partir do path
        let jpegData = fs.readFileSync(p);
        // Retorna o buffer contendo os dados da imagem
        let rawImageData = jpgjs.decode(jpegData, {useTArray:true});   
        // Redimensiona a imagem para o tamanho desejado
        let resizedImage = resizeImageData(rawImageData, imgSize, imgSize, 'nearest-neighbor'/*'bilinear-interpolation'*/)
        // Transforma em escala de cinza
        const imgData = resizedImage.data
        let greyscaleImage = []
        for (let i = 0; i < imgData.length; i += 4) {
            let lightness = parseInt((imgData[i] + imgData[i + 1] + imgData[i + 2]) / 3);
            // Valor normalizado de [-1,1]
            lightness = (2*lightness/255)-1
            greyscaleImage.push(lightness)
        }
        objImgData[`img${load}`] = greyscaleImage;
        //arrImgData.push(greyscaleImage);
        //escreveLog(`\n\tCarregando Imagens... ${Math.round((load / o.paths.length)*100).toFixed(1)}%`)
        load++
    }
    //escreveLog(`\n\t${load} Imagens carregadas e processadas`)
    //console.log(arrImgData)

    //let jpegData = fs.readFileSync(o.paths[0]);
    //let rawImageData = jpeg.decode(jpegData, {useTArray:true});
    //console.log(rawImageData)

    res.send(
        JSON.stringify(objImgData)
    )
})
  
app.listen(port, () => {
    console.log(`App listening on http://localhost:${port}`)
})

function escreveLog(txt){
    console.clear();
    console.log(txt);
}
