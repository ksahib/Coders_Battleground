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
                if (callback) callback();
            } else {
                console.error(`Element with id '${placeholderID}' not found.`);
            }
        })
        .catch(error => {
            console.error('Error fetching HTML:', error);
        });
}
