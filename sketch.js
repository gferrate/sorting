let heights = [];
let n = 100;
let w;
let i = 0;
let j = 0;
let bgColor = [112, 224, 107];
let stickColor = [231, 68, 54];
let osc;
let waveForm;
let filter;
let heightLines = 350;
let fft;

//HOLA MAX SI ESTAS MIRANT AQUI QUE TINGUIS UN BON DIA

// Multiple waves
function setup() {
    createCanvas(650, 500);
    osc = new p5.Oscillator();
    filter = new p5.LowPass();
    fft = new p5.FFT();
    reset();
}

function buttonPressed() {
    reset();
}
function reset(){
    n = int(document.getElementById('nLines').value);
    i = 0;
    j = 0;
    heights = [];
    stroke(255);
    w = width / n;
    for (let t = 0; t < n; t++) {
        heights.push(random(heightLines));
    }
    /*let waves = ['sine', 'square', 'triangle', 'sawtooth']
    for (let w of waves) {
        if  (document.getElementById(w).checked == true){
            waveForm = w;
        }
    }*/

    osc.setType('sawtooth');
    osc.freq(240);
    osc.amp(0.5);
    osc.connect(filter);
    osc.start();
    //frameRate(1);
}
$(document).ready(function() {
    $("#sine").on('click', function() {
        osc.setType('sine');
        osc.amp(0.5);
    });
    $("#triangle").on('click', function() {
        osc.setType('triangle');
        osc.amp(0.5);
    });
    $("#square").on('click', function() {
        osc.setType('square');
        osc.amp(0.3);
    });
    $("#sawtooth").on('click', function() {
        osc.setType('sawtooth');
        osc.amp(0.3);
    });
});


function draw() {
    showLines();
    fill(0);
    noStroke();
    rect(0, heightLines, width, height);
    let spectrum = fft.analyze();
    fill(stickColor);
    for (let i = 0; i< spectrum.length; i++){
        let x = map(i, 0, spectrum.length, 0, width);
        let h = map(spectrum[i], 0, 255, height, heightLines) - height;
        rect(x, height, width/spectrum.length, h) ;
    }

    let filterFreq = int(document.getElementById('cutoff').value);
    document.getElementById('freqVal').innerHTML = filterFreq + 'Hz';
    document.getElementById('nLinesSpan').innerHTML = int(document.getElementById('nLines').value);

    //filterRes = map(mouseY, 0, height, 15, 5);
    filter.set(filterFreq, 15);//, filterRes);


    let freq = j/n*1500+200;
    //let freq = heights[j+1]/400*1000+300;
    osc.freq(freq);

    if (heights[j] < heights[j+1]){
        swap(j, j+1);
    }
    j++;
    if (j == n - i-1){
        j = 0;
        i++;
    }
    if (i == n-1){
        reset();
        console.log('Finished');
    }
}
function showLines(){
    background(bgColor);
    for (let m = n; m >= 0; m--){
        if (m == j){
            stroke(66);
        }else{
            stroke(stickColor); 
        }
        line(m * w + w / 2, heightLines, m * w + w / 2, heights[m]);
    }
}

function swap(u, p) {
    let temp = heights[u];
    heights[u] = heights[p];
    heights[p] = temp;
}
