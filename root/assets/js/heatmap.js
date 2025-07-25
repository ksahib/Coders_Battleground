//Generates heatmap
function heatmap(element, submissionData) {
    const totalDays = 365;
    const now = new Date();

    for (let i = 0; i < totalDays; i++) {
        const date = new Date();
        date.setDate(now.getDate() - (totalDays - i - 1)); // Past date

        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        const formattedDate = `${yyyy}-${mm}-${dd}`;

        const count = submissionData[formattedDate] || 0;
        const level = getLevel(count);

        const box = document.createElement("div");
        box.classList.add("day-box");
        if (level > 0) box.classList.add(`level-${level}`);
        box.title = `${formattedDate}: ${count} submissions`; // Tooltip
        element.appendChild(box);
    }
}

function getLevel(count) {
    if (count >= 5) return 4;
    if (count >= 3) return 3;
    if (count >= 2) return 2;
    if (count >= 1) return 1;
    return 0;
}
