function isBlank(str) {
  return (!str || /^\s*$/.test(str));
}

$('#myModal').on('shown.bs.modal', function () {
  $('#myInput').trigger('focus')
});

// ************************ Drag and drop ***************** //
let dropArea = document.getElementById("drop-area");
let filesToUpload = [];
let pictures = [];

// Prevent default drag behaviors
;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, preventDefaults, false);
  document.body.addEventListener(eventName, preventDefaults, false);
})

// Highlight drop area when item is dragged over it
;['dragenter', 'dragover'].forEach(eventName => {
  dropArea.addEventListener(eventName, highlight, false);
})

;['dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, unhighlight, false);
});

// Handle dropped files
dropArea.addEventListener('drop', handleDrop, false);

function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

function highlight(e) {
  dropArea.classList.add('highlight')
}

function unhighlight(e) {
  dropArea.classList.remove('active')
}

function handleDrop(e) {
  let dt = e.dataTransfer;
  let files = dt.files;

  handleFiles(files)
}

let uploadProgress = [];
let progressBar = document.getElementById('progress-bar');

function initializeProgress(numFiles) {
  progressBar.value = 0;
  uploadProgress = [];

  for (let i = numFiles; i > 0; i--) {
    uploadProgress.push(0)
  }
}

function updateProgress(fileNumber, percent) {
  uploadProgress[fileNumber] = percent;
  let total = uploadProgress.reduce((tot, curr) => tot + curr, 0) / uploadProgress.length;
  console.debug('update', fileNumber, percent, total);
  progressBar.value = total
}

function handleFiles(files) {
  files = [...files];
  initializeProgress(files.length);

  files.forEach(file => filesToUpload.push(file));
  files.forEach(previewFile)
}

function uploadFiles() {
  filesToUpload.flat().forEach(uploadFile);
}

function previewFile(file) {
  let reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onloadend = function () {
    let img = document.createElement('img');
    img.src = reader.result;
    document.getElementById('gallery').appendChild(img)
  }
}

function uploadFile(file, i) {
  var url = '/files';
  var xhr = new XMLHttpRequest();
  var formData = new FormData();
  xhr.open('POST', url, true);
  xhr.responseType = 'json';
  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

  // Update progress (can be used to show progress indicator)
  xhr.upload.addEventListener("progress", function (e) {
    updateProgress(i, (e.loaded * 100.0 / e.total) || 100)
  });

  xhr.addEventListener('readystatechange', function (e) {
    if (xhr.readyState == 4 && xhr.status == 200) {
      updateProgress(i, 100);
      pictures.push(xhr.response);
    } else if (xhr.readyState == 4 && xhr.status != 200) {
      // Error. Inform the user
    }
  });

  formData.append('file', file);
  xhr.send(formData)
}

function initAutocomplete() {
  var scope = angular.element($("body[ng-controller='reportEventCtrl']")).scope();

  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 50.029800, lng: 19.905820},
    zoom: 13,
    mapTypeId: 'roadmap'
  });

  // Create the search box and link it to the UI element.
  var input = document.getElementById('pac-input');
  var searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function () {
    searchBox.setBounds(map.getBounds());
  });

  var markers = [];
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', function () {
    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }

    // Clear out the old markers.
    markers.forEach(function (marker) {
      marker.setMap(null);
    });
    markers = [];

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function (place) {
      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      }

      var myMarker = new google.maps.Marker({
        map: map,
        draggable: true,
        title: place.name,
        position: place.geometry.location
      });

      scope.$apply(function () {
        scope.location = place.formatted_address;
      });

      // Create a marker for each place.
      markers.push(myMarker);

      google.maps.event.addListener(myMarker, 'dragend', function (evt) {
        $.get(
          "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + evt.latLng.lat() + "," + evt.latLng.lng() + "&key=AIzaSyBT6ALF0NpSAfhDPNQ0aI279UDrYRY6U7w",
          function (response) {
            scope.$apply(function () {
              scope.location = response.results[0].formatted_address;
            });
          }
        );
      });

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });
}
