function includeHtml(placeholderID, filepath) {
    fetch(filepath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            const placeholder = document.getElementById(placeholderID);
            if(placeholder) {
                placeholder.innerHTML = data;
            } else {
                console.error(`Element with id '${placeholder}' not found.`);
            }
        })
        .catch(error => {
            console.error('Error fetching HTML:', error);
        });
}