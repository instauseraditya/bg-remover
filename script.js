import { removeBackground } from "https://cdn.jsdelivr.net/npm/@imgly/background-removal@1.6.0/dist/browser.js";

const upload = document.getElementById("upload");
const previewImg = document.getElementById("previewImg");
const resultImg = document.getElementById("resultImg");
const removeBtn = document.getElementById("removeBtn");
const downloadBtn = document.getElementById("downloadBtn");

let selectedFile;

// Handle file upload
upload.addEventListener("change", () => {
  selectedFile = upload.files[0];
  
  if (!selectedFile) return;

  // Validate file type
  if (!selectedFile.type.startsWith('image/')) {
    alert('Please select a valid image file');
    return;
  }

  // Preview the uploaded image
  const reader = new FileReader();
  reader.onload = (e) => {
    previewImg.src = e.target.result;
  };
  reader.readAsDataURL(selectedFile);

  // Reset result
  resultImg.src = "";
  downloadBtn.style.display = "none";
  removeBtn.disabled = false;
});

// Handle background removal
removeBtn.onclick = async () => {
  if (!selectedFile) {
    alert('Please select an image first');
    return;
  }

  try {
    // Update button state
    removeBtn.textContent = "Processing...";
    removeBtn.disabled = true;

    // Remove background
    const blob = await removeBackground(selectedFile);
    const url = URL.createObjectURL(blob);

    // Display result
    resultImg.src = url;
    downloadBtn.href = url;
    downloadBtn.download = `removed-bg-${selectedFile.name.split('.')[0]}.png`;
    downloadBtn.style.display = "inline-block";

    // Reset button
    removeBtn.textContent = "Remove Background";
    removeBtn.disabled = false;

  } catch (error) {
    console.error("Error removing background:", error);
    alert("Failed to remove background. Please try again or use a different image.");
    
    // Reset button
    removeBtn.textContent = "Remove Background";
    removeBtn.disabled = false;
  }
};

// Optional: Add drag and drop functionality
const uploadLabel = document.querySelector('.upload-label');

uploadLabel.addEventListener('dragover', (e) => {
  e.preventDefault();
  uploadLabel.style.borderColor = '#764ba2';
  uploadLabel.style.background = '#f0f2ff';
});

uploadLabel.addEventListener('dragleave', (e) => {
  e.preventDefault();
  uploadLabel.style.borderColor = '#667eea';
  uploadLabel.style.background = '#f8f9ff';
});

uploadLabel.addEventListener('drop', (e) => {
  e.preventDefault();
  uploadLabel.style.borderColor = '#667eea';
  uploadLabel.style.background = '#f8f9ff';
  
  const files = e.dataTransfer.files;
  if (files.length > 0) {
    upload.files = files;
    upload.dispatchEvent(new Event('change'));
  }
});
