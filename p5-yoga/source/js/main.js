var NUM_IMAGES = 2000;
var BASE_PATH = "photos"

var IMAGE_WIDTH = 100;
var IMAGE_HEIGHT = 100;

var TIMEOUT = 0.1;

var imgs;
var pixelsTotalArray;

function preload() {
  // Preload the Images
  imgs = [];

  for (var counter = 1; counter <= NUM_IMAGES; counter++) {
    var img = imgs[counter - 1];
    var imgPath = BASE_PATH + "/" + counter + ".jpg";
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

  if (img.width === 100 && img.height === 100) {
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

    return true
  }
  else {
    return false;
  }
}

var curImgIndex = 0;
var imgsAdded = 0;

function addNextImageToAggregate() {
  if (curImgIndex < NUM_IMAGES)
  // Add The Image To the Pixel Total Array
  do {
    var img = imgs[curImgIndex];
    var successfullyAdded = addToPixelsTotalArray(img);
    if(successfullyAdded) {
      imgsAdded++;
      console.log(imgsAdded);
    };

    curImgIndex++;
  } while (successfullyAdded === false);
}

function showAggregate() {
  var averagedPixelsArray = $.extend(true, [], pixelsTotalArray);

  // Average The Pixel Array
  averagedPixelsArray.forEach(function(pixel) {
    pixel.r /= imgsAdded;
    pixel.g /= imgsAdded;
    pixel.b /= imgsAdded;
  })

  // Draw the Image
  img = createImage(IMAGE_WIDTH, IMAGE_HEIGHT);
  img.loadPixels();

  var pixelCounter = 0;
  for(var i=0; i<IMAGE_WIDTH; i++) {
    for(var j=0; j<IMAGE_HEIGHT; j++) {
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

var addSequence = [1,1,1,1,1,1,1,1,1,1,2,4,8,16,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32];
var seqIndex = 0;

function keyPressed() {
  var numToAdd = 1; //addSequence[seqIndex];
  for(var i=0; i<numToAdd; i++) {
    addNextImageToAggregate();
  }
  redraw()
  seqIndex++;
}

function draw() {
  noLoop();
  showAggregate();
  showNextImage();
}
