var NUM_IMAGES = 14;
var BASE_PATH = "photos"
var IMAGE_EXTENSION = ".png"

var IMAGE_WIDTH = 320;
var IMAGE_HEIGHT = 180;

var TRANSITION_DELAY = 400;

var imgs;
var pixelsTotalArray;

function preload() {
  // Preload the Images
  imgs = [];

  for (var counter = 1; counter <= NUM_IMAGES; counter++) {
    var img = imgs[counter - 1];
    var imgPath = BASE_PATH + "/" + counter + IMAGE_EXTENSION;
    var img = loadImage(imgPath);
    imgs.push(img);
  }

  // Initialize Empty Pixel Array For Total Pixels
  pixelsTotalArray = [];
  for (var i = 0; i<IMAGE_HEIGHT*IMAGE_WIDTH; i++) {
    pixelsTotalArray[i] = {r: 0, g: 0, b: 0}
  }
}

function addToPixelsTotalArray(img) {
  img.loadPixels();

  for (var i=0; i<pixelsTotalArray.length; i++) {
    var destPixel = pixelsTotalArray[i];

    for (var j=0; j<4; j++) {
      var sourcePixel = img.pixels[i*4 + j];

      if(j === 0) {
        destPixel.r += sourcePixel;
      }
      else if(j === 1) {
        destPixel.g += sourcePixel;
      }
      else if (j === 2) {
        destPixel.b += sourcePixel;
      }
    }
  }
}

var curImgIndex = 0;
var imgsAdded = 0;

function addNextImageToAggregate() {
  if (curImgIndex < NUM_IMAGES) {
    var img = imgs[curImgIndex];
    addToPixelsTotalArray(img);
    imgsAdded++;
    console.log(imgsAdded);

    curImgIndex++;
  }
}

function showAggregate() {
  var averagedPixelsArray = $.extend(true, [], pixelsTotalArray);

  // Average The Pixel Array
  averagedPixelsArray.forEach(function(pixel, i) {
    pixel.r /= imgsAdded;
    pixel.g /= imgsAdded;
    pixel.b /= imgsAdded;

    // if (i < 1) {
    //   console.log(pixel.r, pixel.g, pixel.b)
    // }

  })

  // Draw the Image
  img = createImage(IMAGE_WIDTH, IMAGE_HEIGHT);
  img.loadPixels();

  var pixelCounter = 0;
  for(var i=0; i<IMAGE_HEIGHT; i++) {
    for(var j=0; j<IMAGE_WIDTH; j++) {
      var pixel = averagedPixelsArray[pixelCounter];
      img.set(j, i, color(pixel.r, pixel.g, pixel.b));
      pixelCounter++;
    }
  }
  img.updatePixels();
  image(img, 0, 0);
}

function showNextImage() {
  image(imgs[curImgIndex], IMAGE_WIDTH, 0);
}

function setup() {
  // Create the Canvas
  var cnv = createCanvas(IMAGE_WIDTH*2, IMAGE_HEIGHT);
  cnv.parent('sketch');
}

var totTransitions = 0;

function transition() {
  addNextImageToAggregate();
  redraw()
  totTransitions++;
}

function keyPressed() {
  if (totTransitions < NUM_IMAGES) {
    transition();
  }
}

var interval = setInterval(function() {
  if (totTransitions < NUM_IMAGES) {
    transition();
  }
  else {
    clearInterval(interval);
  }
}, TRANSITION_DELAY)

function draw() {
  noLoop();
  showAggregate();
  showNextImage();
}
