var region = "ap-south-1";
var accessKeyId = "AKIAWEIHDT6GZ74AJH5Z";
var secretAccessKey = "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";


AWS.config.update({
    region: region,
    credentials: new AWS.Credentials(accessKeyId, secretAccessKey)
});

var s3 = new AWS.S3();

var data = []; // Initialize data array

function refreshFileList(bucketname) {
    var tableBody = document.querySelector("#fileTable tbody");
    tableBody.innerHTML = "";

    s3.listObjectsV2({ Bucket: bucketname }, (err, responseData) => {
        if (err) {
            console.log("Error fetching file list", err);
        } else {
            data = responseData.Contents; // Populate data array
            displayFileList(data); // Display the file list
            console.log(data);
        }
    });
}

function displayFileList(data) {
    var tableBody = document.querySelector("#fileTable tbody");

    data.forEach(function (object) {
        var fileRow = document.createElement('tr');
        var fileNameCell = document.createElement('td');
        fileNameCell.textContent = object.Key;
        fileRow.appendChild(fileNameCell);

        var fileSizeCell = document.createElement('td');
        fileSizeCell.textContent = object.Size;
        fileRow.appendChild(fileSizeCell);

        var downloadCell = document.createElement('td');
        var downloadLink = document.createElement('a');
        downloadLink.href = s3.getSignedUrl("getObject", {
            Bucket: "nest000",
            Key: object.Key,
        });
        downloadLink.textContent = "Download";
        downloadCell.appendChild(downloadLink);
        fileRow.appendChild(downloadCell);

        var deleteCell = document.createElement('td');
        var deleteButton = document.createElement('button');
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener('click', () => {
            deleteFile("nest000", object.Key);
        });

        deleteCell.appendChild(deleteButton);
        fileRow.appendChild(deleteCell);

        tableBody.appendChild(fileRow);
    });
}

function uploadFile(bucketname) {
    let files = document.getElementById('fileInput').files

    var fileCount = files.length

    for (var i = 0; i < fileCount; i++) {
        var file = files[i];
        var params = {
            Bucket: bucketname,
            Key: file.name,
            Body: file
        };
        s3.upload(params, (err, data) => {
            if (err) {
                console.log("Error uploading file", err);
            } else {
                console.log("File uploaded successfully");
                refreshFileList(bucketname);
            }
        });
    }
}

function deleteFile(bucketname, key) {
    var params = {
        Bucket: bucketname,
        Key: key
    };
    s3.deleteObject(params, (err, data) => {
        if (err) {
            console.log("Error deleting file", err);
        } else {
            console.log("File deleted successfully", data);
            refreshFileList(bucketname);
        }
    });
}

document.getElementById("searchButton").addEventListener("click", function () {
    var searchQuery = document.getElementById("searchInput").value.trim().toLowerCase();

    if (searchQuery === "") {
        // If the search input is empty, refresh the file list to display all files
        refreshFileList("nest000");
        return;
    }

    // Filter the file list based on the search query
    var filteredData = [];
    data.forEach(function (object) {
        if (object.Key.toLowerCase().includes(searchQuery)) {
            filteredData.push(object);
        }
    });

    // Display the filtered file list
    displayFileList(filteredData);
});

// Initial file list display
refreshFileList("nest000");