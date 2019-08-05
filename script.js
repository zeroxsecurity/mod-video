let s3;
let theStream;
let theRecorder;
let recordedChunks = [];
let blob = null;
let url = null;
let camera = 'front' // front, back
let allElements = '.video-record .video-playback .record-btn .go-back-btn .toggle-cam-btn .progress-btn .download-btn .upload-btn .stop-btn';

$(function(){
  // Initialise Bucket
  setupBucket();

  // Get stream
  getStream();
});

/**
* Event Handlers
*/
function onCameraSwitch() {
  camera = camera === 'front' ? 'back' : 'front';
  getStream();
}

function onBackClick() {
  showElements('.video-record .record-btn .toggle-cam-btn');  
  getStream();
}

function onStreamRecord() {
  showElements('.stop-btn .video-record');
  recordedChunks = [];

  try {
    recorder = new MediaRecorder(theStream, {mimeType: "video/webm"});
  } catch (e) {
    console.error('Exception while creating MediaRecorder: ' + e);
    return;
  }
  theRecorder = recorder;
  console.log('MediaRecorder created');
  recorder.ondataavailable = recorderOnDataAvailable;
  recorder.start(100);
}

function onStreamStop() {
  showElements('.upload-btn .download-btn .video-playback .go-back-btn');

  console.log('Saving data');
  theRecorder.stop();
  stopAllMediaTracks();

  blob = new Blob(recordedChunks, {type: "video/*"});
  url = (window.URL || window.webkitURL).createObjectURL(blob);

  var mediaControl = document.querySelector('.video-playback');
  mediaControl.src = url;
}

function onFileInput() {
  $('#file-input-video').trigger('click');
}

function onFileUpload() {
  showElements(".video-playback .progress-btn");
  let progressRef = $(".progress-btn p");

  var photoKey = new Date().getTime().toString() + ".webm";
  s3.upload({
    Key: photoKey,
    Body: blob,
    ACL: 'public-read'
  }, function(err, data) {
    if (err) {
      return console.log('There was an error uploading your video: ', err.message);
    }
    alert('Successfully uploaded video.');
    // viewAlbum(albumName);
  }).on('httpUploadProgress',function(progress) {
    let progressStr = Math.round((progress.loaded / progress.total) * 100) + '%';
    console.log(progressStr);
    progressRef.text(progressStr);
    
    if(progressStr === '100%') {
      showElements(".go-back-btn .video-playback .download-btn");
    }
  });
}

function onFileDownload() {
  var a = document.createElement("a");
  document.body.appendChild(a);
  a.style = "display: none";
  a.href = url;
  a.download = 'test.webm';
  a.click();

  // setTimeout() here is needed for Firefox.
  setTimeout(function () {
    (window.URL || window.webkitURL).revokeObjectURL(url);
  }, 100); 
}

$("#file-input-video").change(function(){
  showElements('.upload-btn .download-btn .video-playback .go-back-btn');

  stopAllMediaTracks();

  blob = $(this)[0].files[0];
  var url = (window.URL || window.webkitURL).createObjectURL(blob);

  var mediaControl = document.querySelector('.video-playback');
  mediaControl.src = url;
});


/**
* Helpers
*/
function setupBucket() {
  var albumBucketName = 'video-upload-6052019';
  var bucketRegion = 'us-east-1';
  var IdentityPoolId = 'us-east-1:0dce9491-45ec-4e98-9f36-cfc7cf7bc70e';

  AWS.config.update({
    region: bucketRegion,
    credentials: new AWS.CognitoIdentityCredentials({
      IdentityPoolId: IdentityPoolId
    })
  });

  s3 = new AWS.S3({
    apiVersion: '2006-03-01',
    params: {Bucket: albumBucketName}
  });
}

function recorderOnDataAvailable (event) {
  if (event.data.size == 0) return;
  console.log('ondataavailable, type: ' + event.data.type);
  recordedChunks.push(event.data);
}

function getUserMedia(options, successCallback, failureCallback) {
  /*
  var api = navigator.getUserMedia || navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia || navigator.msGetUserMedia;

  if (api) {
    return api.bind(navigator)(options, successCallback, failureCallback);
  }
  alert('User Media API not supported.');
  */
  navigator.mediaDevices.getUserMedia(options).then(successCallback, failureCallback);
}

function getStream() {
  var facingMode = camera === 'front' ? { facingMode: "user" } : { facingMode: "environment" };
  var constraints = {video: facingMode, audio: true};
  getUserMedia(constraints, function (stream) {
    var mediaControl = document.querySelector('.video-record');
    if (navigator.mozGetUserMedia) {
      mediaControl.mozSrcObject = stream;
    } else {
      mediaControl.srcObject = stream;
    }

    theStream = stream;
  }, function (err) {
    alert('Error: ' + err);
  });
}

function showElements(elements) {
  hideElements(allElements);

  elements.split(" ").forEach(e => {
    $(e).css({
      'display': 'flex'
    });
  });
}

function hideElements(elements) {
  elements.split(" ").forEach(e => {
    $(e).css({
      'display': 'none'
    });
  });
}

function stopAllMediaTracks() {
  theStream.getTracks().forEach(track => track.stop());
}