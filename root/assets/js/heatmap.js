//Generates heatmap
function heatmap(element) {

    var totalDays = 365;
    var levels = [0, 1, 2, 3, 4]; // levels decide which color to show on each box of the heatmap i.e controls how dark the shade of green is

    for (let i = 0; i < totalDays; i++) {
        var level = Math.floor(Math.random() * levels.length); //random levels for demo
        var box = document.createElement("div");
        box.classList.add("day-box");
        if (level > 0) box.classList.add(`level-${level}`);
        element.appendChild(box);
    }
}