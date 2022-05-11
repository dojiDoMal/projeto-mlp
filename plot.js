function plotData(el,data){
    
    let trace = {    
        x: data.class1.x,    
        y: data.class1.y,
        name: data.class1.name,    
        mode: 'markers',    
        type: 'scatter'  
    };   

    let trace2 = {    
        x: data.class2.x,    
        y: data.class2.y, 
        name: data.class2.name,   
        mode: 'markers',    
        type: 'scatter'  
    };  

    const layout = {
        xaxis: {
            autorange: true, //false,
            //range: [-1.1,1.1]
        },
        yaxis: {
            autorange: true, //false,
            //range: [-1.1,1.1]
        }    
    }

    var plt = [trace, trace2];

    Plotly.newPlot(el, plt, layout, {responsive: true});
}

function plotGraph(el,data){
    
    let trace = []

    for (let i = 0; i < data.length; i++) {
        trace.push({
            x: data[i].x,    
            y: data[i].y,
            name: data[i].name,    
            mode: 'lines',
            type: 'scatter'    
        })
    }  

    const layout = {
        xaxis: {
            autorange: true, //false,
            //range: [-1.1,1.1]
        },
        yaxis: {
            autorange: true, //false,
            //range: [-1.1,1.1]
        }    
    }

    Plotly.newPlot(el, trace, layout, {responsive: true});
}

function plotPoints(el,data){
    
    let trace = []

    for (let i = 0; i < data.length; i++) {
        trace.push({
            x: data[i].x,    
            y: data[i].y,
            name: data[i].name,    
            mode: 'markers',
            type: 'scatter',
            marker: {size: 4, color: data[i].color}    
        })
    }  

    const layout = {
        xaxis: {
            autorange: true, //false,
            //range: [-1.1,1.1]
        },
        yaxis: {
            autorange: true, //false,
            //range: [-1.1,1.1]
        }    
    }

    Plotly.newPlot(el, trace, layout, {responsive: true});
}