const canvas = document.getElementById("trapezoid-canvas");
const context = canvas.getContext("2d");

function drawSymmetricalTrapezoid(chest, waist, garheight) {
    const topBase = chest; // Chest (inches)
    const bottomBase = waist; // Waist (inches)
    const height = garheight; // Garment height (inches)

    const halfTopWidth = topBase * 5; // Scale for better visibility
    const halfBottomWidth = bottomBase * 5; // Scale for better visibility

    const x1 = (canvas.width - halfTopWidth) / 2;
    const x2 = (canvas.width + halfTopWidth) / 2;
    const x3 = (canvas.width - halfBottomWidth) / 2;
    const x4 = (canvas.width + halfBottomWidth) / 2;

    const y1 = 0;
    const y2 = 0;
    const y3 = height * 10; // Scale for better visibility
    const y4 = height * 10; // Scale for better visibility

    context.clearRect(0, 0, canvas.width, canvas.height);

    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.lineTo(x4, y3);
    context.lineTo(x3, y4);
    context.closePath();

    const colorSelector = document.getElementById("color-selector");
    const selectedColor = colorSelector.options[colorSelector.selectedIndex].value;
    context.fillStyle = "#" + selectedColor;
    context.fill();
}

const chestInput = document.getElementById("chest");
const waistInput = document.getElementById("waist");
const garheightInput = document.getElementById("garheight"); // Corrected ID

drawSymmetricalTrapezoid(chestInput.value, waistInput.value, garheightInput.value);

const colorSelector = document.getElementById("color-selector");
colorSelector.addEventListener("change", function () {
    drawSymmetricalTrapezoid(chestInput.value, waistInput.value, garheightInput.value);
});

chestInput.addEventListener("input", function () {
    drawSymmetricalTrapezoid(chestInput.value, waistInput.value, garheightInput.value);
});

waistInput.addEventListener("input", function () {
    drawSymmetricalTrapezoid(chestInput.value, waistInput.value, garheightInput.value);
});

garheightInput.addEventListener("input", function () {
    drawSymmetricalTrapezoid(chestInput.value, waistInput.value, garheightInput.value);
});
