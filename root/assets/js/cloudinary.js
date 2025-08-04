const CLOUD_NAME = "dcox7hpug";
            const UPLOAD_PRESET = "user_profile_upload";

            document.getElementById('upload-input').addEventListener('change', async function () {
                const file = this.files[0];
                const formData = new FormData();
                formData.append("file", file);
                formData.append("upload_preset", UPLOAD_PRESET);

                const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
                    method: "POST",
                    body: formData
                });

                const data = await res.json();
                console.log(data);
                document.getElementById("profile-pic").src = data.secure_url;

                await fetch("http://localhost/Coders_Battleground/Server/save_url.php", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ url: data.secure_url })
                })
                    .then(res => {
                        console.log("Backend response status:", res.status);
                        return res.json();
                    })
                    .then(json => {
                        console.log("Backend JSON response:", json);
                    })
                    .catch(err => {
                        console.error("Error calling save_url.php:", err);
                    });
            });