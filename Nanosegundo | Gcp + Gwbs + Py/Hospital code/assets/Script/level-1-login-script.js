
document.getElementById('faceAuth').addEventListener('click',) () => {
  const video = document.getElementById('video');
  video.style.display = 'block';
  // Access camera
  navigator.mediaDevices.getUserMedia({ video: true })
       .then(stream => { video.srcObject = stream; })
       .catch(err => { console.error("Camera error: " + err); });

  });

  document.getElementById('fingerAuth').addEventListener('click', () => {
      alert("Place finger on scanner...");
      //Simulate fingerprint detection logic
  });