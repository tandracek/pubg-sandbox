const Jimp = require("jimp");
const winston = require('winston');

class Overlay {
  static get RED() { return Jimp.rgbaToInt(255, 0, 0, 255); }
  static get GREEN() { return Jimp.rgbaToInt(0, 255, 0, 255); }

  constructor(overlayImage, mapImage) {
    this.overlayImage = overlayImage;
    this.mapImage = mapImage;
    this.xScale = 816000 / this.mapImage.bitmap.width;
    this.yScale = 816000 / this.mapImage.bitmap.height;
  }

  static async init(mapImagePath) {
    const mapImage = await Jimp.read(mapImagePath);
    const overlayImage = await imageInit(mapImage.bitmap.width, mapImage.bitmap.height);
    return new Overlay(overlayImage, mapImage);
  }

  addCoordinate(telemetry, color, size) {
    //TODO null check things
    if (!telemetry.character) {
      winston.error("No character object found on telemetry event %j.", telemetry);
      return;
    }
    const coordinates = telemetry.character.location;
    const x = coordinates.x / this.xScale;
    const y = coordinates.y / this.yScale;
    // winston.info(`Setting coordinates for ${x},${y} and size of ${size}`);
    setPixelRange(this.overlayImage, color, size, x - (size / 2), size, y - (size / 2));
  }

  addCoordinates(telemetryObjects, color, size) {
    telemetryObjects.forEach(telemetry => this.addCoordinate(telemetry, color, size));
  }

  async mergeAndWrite(mergedPath) {
    return new Promise((resolve, reject) => {
      this.overlayImage.opacity(.5);
      this.overlayImage.write("miramar_overlay.png");
      this.mapImage.composite(this.overlayImage, 0, 0);
      this.mapImage.write(mergedPath, err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}

function range(size, startAt = 0) {
  return [...Array(size).keys()].map(i => i + startAt);
}

function setPixelRange(image, color, width, xStart, height, yStart) {
  // console.log("Setting pixel range from %d,%d to %d,%d.", xStart, width + xStart, yStart, height + yStart);
  range(width, xStart).forEach(x => {
    range(height, yStart).forEach(y => {
      image.setPixelColor(color, x, y);
    });
  });
}

function imageInit(width, height) {
  return new Promise((resolve, reject) => {
    new Jimp(width, height, 0xffffffff, (err, image) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(image);
    });
  });
}

module.exports = Overlay;