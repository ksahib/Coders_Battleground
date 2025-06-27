function heatmap(element) {

    var totalDays = 365; // or 52 * 7 = 364
    var levels = [0, 1, 2, 3, 4]; // activity levels

    for (let i = 0; i < totalDays; i++) {
        var level = Math.floor(Math.random() * levels.length); // random level for demo
        var box = document.createElement("div");
        box.classList.add("day-box");
        if (level > 0) box.classList.add(`level-${level}`);
        element.appendChild(box);
    }
}