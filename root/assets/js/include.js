function includeHtml(placeholderID, filepath, callback) {
    fetch(filepath)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.text();
        })
        .then(data => {
            const placeholder = document.getElementById(placeholderID);
            if (placeholder) {
                placeholder.innerHTML = data;

                if (filepath.includes('navbar.html')) {
                    const avatar = placeholder.querySelector("img.rounded-circle");
                    if (avatar) {
                        fetch("http://localhost/Coders_Battleground/Server/get_image.php", {
                            method: "GET",
                            credentials: "include"
                        })
                            .then(res => res.json())
                            .then(data => {
                                avatar.src = data.image_url || "../assets/images/placeholder-profile-pic.jpg";
                                
                            })
                            .catch(err => {
                                console.error("Error loading profile image:", err);
                            });
                    }
                }

                if (callback) callback();
            } else {
                console.error(`Element with id '${placeholderID}' not found.`);
            }
        })
        .catch(error => {
            console.error('Error fetching HTML:', error);
        });
}
