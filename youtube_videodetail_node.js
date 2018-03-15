


// Get statistics info by each video
var YouTube = require('youtube-node');

var youTube = new YouTube();
youTube.setKey('AIzaSyCZyVxgyR6x6AFDd3BOjoIr0H-vyWrGygo');

youTube.getById('k5DUhoa8P08', function(error, result) {
  if (error) {
    console.log(error);
  }
  else {
    console.log(JSON.stringify(result, null, 2));
  }
});
