// Define API URL
var API_URL = 'https://ekwbhfe4ld.execute-api.ap-south-1.amazonaws.com/TEST/'; // Ensure this is correctly set to your API Gateway base URL

// Function to upload file details to DynamoDB via API Gateway
document.getElementById('uploadButton').onclick = function () {
    var fileInput = document.getElementById('fileInput');
    var files = fileInput.files;
    if (files.length === 0) {
        alert("Please select a file to upload.");
        return;
    }

    var fileName = files[0].name; // Assuming you want to upload the first selected file

    var inputData = {
        "fileName": fileName
    };

    $.ajax({
        url: API_URL, // Replace with your API Gateway endpoint
        type: 'POST',
        data: JSON.stringify(inputData),
        contentType: 'application/json; charset=utf-8',
        success: function () {
            alert("File name uploaded successfully!");
        },
        error: function (error) {
            console.error("Error uploading file name:", error);
            alert("Error uploading file name. Please try again.");
        }
    });
};



// Function to fetch file details from DynamoDB via API Gateway
function fetchFilesFromDynamoDB() {
    $.ajax({
        url: API_URL,
        type: 'GET',
        success: function (data) {
            console.log('Files fetched:', data);
            // Parse the JSON string into a JavaScript object
            var files = JSON.parse(data.body); // Assuming data.body is a JSON string as logged
            displayFiles(files);
        },
        error: function (err) {
            console.error('Error fetching files:', err);
        }
    });
}


// Function to delete a file from DynamoDB via API Gateway
function deleteFile(fileName) {
    $.ajax({
        url: API_URL, // Assuming you have a '/delete' resource set up
        type: 'DELETE',
        // You do not need to set contentType for a DELETE request as there's no body
        data: { 'fileName': fileName }, // jQuery will process this correctly
        success: function (data) {
            console.log('File deleted:', data);
            fetchFilesFromDynamoDB(); // Refresh the list after deletion
        },
        error: function (err) {
            console.error('Error deleting file:', err);
            alert("Error deleting file. Please try again.");
        }
    });
}


// Function to display files in the table
function displayFiles(files) {
    const tableBody = document.querySelector('#fileTable tbody');
    tableBody.innerHTML = '';
    files.forEach(file => {
        const row = tableBody.insertRow();
        row.insertCell(0).textContent = file.fileName;
        row.insertCell(1).textContent = file.fileSize;
        row.insertCell(2).innerHTML = `<a href="path/to/pdfs/${file.fileName}" target="_blank">Download</a>`;
        row.insertCell(3).innerHTML = `<button onclick="deleteFile('${file.fileName}')">Delete</button>`;
    });
}

document.addEventListener('DOMContentLoaded', function () {
    fetchFilesFromDynamoDB();
});
