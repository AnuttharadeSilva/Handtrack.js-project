const modelParams = {
    flipHorizontal: true,
    imageScaleFactor: 0.7,
    maxNumBoxes: 20,
    iouThreshold: 0.5,
    scoreThreshold: 0.85
}

// access webcam
navigator.getUserMedia = navigator.getUserMedia ||
                        navigator.webkitGetUserMedia || 
                        navigator.mozGetUserMedia ||
                        navigator.msGetUserMedia;

//select from html
const video = document.querySelector('#video');
const audio = document.querySelector('#audio');
const canvas = document.querySelector('#canvas');
const context = canvas.getContext('2d');
const drawingCanvas = document.querySelector('#drawingCanvas');
const ctx = drawingCanvas.getContext('2d');
let model;

handTrack.startVideo(video).then(status =>{
    if(status){
        navigator.getUserMedia(
            { video: {} },
            stream => {
                video.srcObject = stream;
                runDetection();
            },
            err => console.log(err)
        );
    }
});

let old_x = 0;
let old_y = 0;

function runDetection(){
    model.detect(video)
    .then(predictions => {
        console.log(predictions);
        model.renderPredictions(predictions, canvas, context, video);
        if(predictions.length > 0){
            var new_x =predictions[0]['bbox'][0];
            var new_y =predictions[0]['bbox'][1];
            ctx.beginPath(); // begin
            ctx.lineWidth = 3;
            ctx.lineCap = 'round';
            ctx.strokeStyle = '#c0392b';
            ctx.moveTo(old_x, old_y); // from
            ctx.lineTo(new_x, new_y); // to
            old_x = new_x;
            old_y = new_y;
            ctx.stroke(); // draw it!
        }
        requestAnimationFrame(runDetection);
        
    });
}

handTrack.load(modelParams).then(lmodel => {
    model = lmodel;
});