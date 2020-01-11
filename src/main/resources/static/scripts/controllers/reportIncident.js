'use strict';

angular.module('petPatrolApp')
  .controller('reportIncidentCtrl', ['$scope', '$rootScope', '$http', function ($scope, $rootScope, $http) {
    $scope.incident = "Wybierz rodzaj zgłoszenia";
    $scope.inne = null;
    $scope.location = null;
    $scope.optradio = "yes";
    $scope.email = null;
    $scope.description = null;
    let id = null;

    $scope.init = function () {
      $http.get("/getEventId").then(function (response) {
        id = response.data;
        console.log(id);
      });
    };

    $scope.setIncident = function (incident) {
      $scope.incident = incident;
    };

    $scope.getAddres = function () {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
      } else {
        document.innerHTML = "Geolocation is not supported by this browser.";
      }

      function showPosition(position) {
        $http.get("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + position.coords.latitude + "," + position.coords.longitude + "&key=AIzaSyCaYeCmNWNFLv9XVeOYvCY4k4jLA7Gwa-Y").then(function (response) {
          $scope.location = response.data.results[0].formatted_address;
        });
      }
    };

    $scope.uploadEvent = function () {
      let alerts = [];
      if ((isBlank($scope.inne) && $scope.incident === 'Inne') || $scope.incident === 'Wybierz rodzaj zgłoszenia') {
        alerts.push("rodzaj zgłoszenia");
      }
      if (isBlank($scope.location)) {
        alerts.push("lokalizacje");
      }
      if (isBlank($scope.description)) {
        alerts.push("opis");
      }
      if (isBlank($scope.email) && $scope.optradio === 'yes') {
        alerts.push("email");
      }
      if (filesToUpload.length <= 0) {
        alerts.push("zdjecia");
      }
      if (alerts.length > 0) {
        alert("Dodaj: " + alerts.join(", ") + "!");
        return;
      }

      uploadFiles();
      let data = {
        id: id,
        title: ($scope.incident === 'Inne') ? $scope.inne : $scope.incident,
        location: $scope.location,
        description: $scope.description,
        email: $scope.email,
        pictures: pictures
      };

      setTimeout(function () {
        console.log(data);
        $http.post("/events", data).then(function (response) {
          if (response.status === 200) {
            $("#successModal").modal('toggle');
          } else {
            $("#failureModal").modal('toggle');
          }
        }).catch((err) => {
          console.error('An error occurred:', err.error);
          $("#failureModal").modal('toggle');
        });
      }, 2000);
    }
  }]);

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
