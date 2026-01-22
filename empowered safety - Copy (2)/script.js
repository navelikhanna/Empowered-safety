console.log("✅ JS file loaded");

// Add contact to UI list (still optional if you want a display)
function addContact() {
    const name = document.getElementById("contactName").value;
    const number = document.getElementById("contactNumber").value;

    if (name && number) {
        let li = document.createElement("li");
        li.textContent = `${name}: ${number}`;
        document.getElementById("contactList").appendChild(li);
        document.getElementById("contactName").value = "";
        document.getElementById("contactNumber").value = "";
    } else {
        alert("❗ Please enter both name and number.");
    }
}

// Send SOS and fetch location
function requestLocation() {
    console.log("🚨 requestLocation() triggered");

    if (confirm("⚠ This app wants to access your location. Allow?")) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    console.log("✅ Location access granted");
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    alert(`📍 Location: \nLatitude: ${lat}\nLongitude: ${lon}`);

                    // ✅ Hardcoded verified number
                    const contactNumber = "+918390964262";
                    console.log("📤 Sending SOS to:", contactNumber);
                    console.log("🗺 Including location:", lat, lon);


                    fetch("http://127.0.0.1:5000/sos", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                        number: contactNumber,
                        latitude: lat,
                        longitude: lon
    
                        })

                    })
                    .then(response => {
                        console.log("📨 Response received:", response);
                        return response.json();
                    })
                    .then(data => {
                        console.log("📨 Final response JSON:", data);
                        if (data.status === "success") {
                            alert("✅ SOS sent successfully! SID ");
                        } else {
                            alert("❌ Failed to send SOS:\n" );
                        }
                    })
                    .catch(error => {
                        console.error("🚫 Network/Fetch error:", error);
                        alert("❌ Error connecting to SOS server.");
                    });
                },
                error => {
                    console.error("❌ Geolocation error:", error);
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            alert("❌ Location permission was denied.");
                            break;
                        case error.POSITION_UNAVAILABLE:
                            alert("❌ Location information is unavailable.");
                            break;
                        case error.TIMEOUT:
                            alert("❌ The request to get your location timed out.");
                            break;
                        default:
                            alert("❌ An unknown error occurred while accessing location.");
                            break;
                    }
                }
            );
        } else {
            alert("⚠ Geolocation not supported by your browser.");
        }
    } else {
        alert("❌ Location access denied by user.");
    }
}

// Police button
function alertPolice() {
    alert("🚓 Alert sent to nearest police station!");
}

// Simulated health scan
function startHealthScan() {
    document.getElementById("healthResults").style.display = "none";
    document.getElementById("scanner").style.display = "none";

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function (stream) {
                document.getElementById("scanner").style.display = "block";

                setTimeout(() => {
                    const heartRate = Math.floor(Math.random() * (130 - 60) + 60);
                    const bp = Math.floor(Math.random() * (160 - 90) + 90);

                    document.getElementById("heartRate").innerText = heartRate;
                    document.getElementById("bp").innerText = bp;
                    document.getElementById("scanner").style.display = "none";
                    document.getElementById("healthResults").style.display = "block";

                    if (heartRate > 120 || bp > 150) {
                        document.getElementById("sosWarning").innerText =
                            "⚠ Abnormal vitals detected! SOS may be auto-triggered.";
                    } else {
                        document.getElementById("sosWarning").innerText = "Vitals normal.";
                    }

                    stream.getTracks().forEach(track => track.stop());
                }, 3000);
            })
            .catch(function () {
                alert("❌ Camera access denied.");
            });
    } else {
        alert("⚠ Camera not supported.");
    }
}

// Optional stress classification
function getStressLevel(bpm) {
    if (bpm <= 90) return "L-0";
    else if (bpm <= 110) return "L-1";
    else return "L-2";
}

function handleStressLevel(bpm) {
    const level = getStressLevel(bpm);
    const alertBox = document.getElementById("stress-alert");
    alertBox.style.display = "block";

    if (level === "L-0") {
        alertBox.innerHTML = "✅ You're calm and stable (L-0)";
        alertBox.style.backgroundColor = "#d4edda";
        alertBox.style.color = "#155724";
    } else if (level === "L-1") {
        alertBox.innerHTML = "⚠️ Moderate stress (L-1). Try to relax.";
        alertBox.style.backgroundColor = "#fff3cd";
        alertBox.style.color = "#856404";
    } else if (level === "L-2") {
        alertBox.innerHTML = "🚨 High stress (L-2)! SOS may be needed.";
        alertBox.style.backgroundColor = "#f8d7da";
        alertBox.style.color = "#721c24";
    }
}
