// Wait for the HTML document to be fully loaded and parsed
document.addEventListener('DOMContentLoaded', function () {
    // Find the container element with the class 'circle-container'
    const circleContainer = document.querySelector('.circle-container');
    // Find the black circle element by its unique id 'black-circle'
    const blackCircle = document.getElementById('black-circle');

    const redDots = []; // Keep track of red dots


    // Add a click event listener to the circle container
    circleContainer.addEventListener('click', function (event) {
        // Calculate the X and Y coordinates of the click relative to the container
        const clickX = event.clientX - circleContainer.getBoundingClientRect().left;
        const clickY = event.clientY - circleContainer.getBoundingClientRect().top;

        // Calculate the center, radius, and angle of the black circle
        // Calculate the offset for centering based on the container size and black circle size
        const offsetX = (circleContainer.offsetWidth - blackCircle.offsetWidth) / 2;
        const offsetY = (circleContainer.offsetHeight - blackCircle.offsetHeight) / 2;

        // Calculate the X and Y coordinates of the center of the black circle
        const centerX = offsetX + blackCircle.offsetWidth / 2;
        const centerY = offsetY + blackCircle.offsetHeight / 2;
        const radius = blackCircle.offsetWidth / 2;   // Radius of the black circle

        // Calculate the distance between the click point and the center of the black circle
        const distance = Math.sqrt((clickX - centerX) ** 2 + (clickY - centerY) ** 2);

        // Calculate the angle between the center of the circle and the click point
        const angle = Math.atan2(clickY - centerY, clickX - centerX);

        if (!isRedDotAtPosition(clickX, clickY)) {

            if (distance <= radius) {
                // Calculate the coordinates of the point on the perimeter of the black circle
                const perimeterX = centerX + radius * Math.cos(angle);
                const perimeterY = centerY + radius * Math.sin(angle);

                // Create a red dot at the calculated perimeter coordinates
                createRedDot(perimeterX, perimeterY);
            } else {
                // Calculate the coordinates of the point on the perimeter of the black circle
                const perimeterX = centerX + radius * Math.cos(angle);
                const perimeterY = centerY + radius * Math.sin(angle);

                // Create a red dot at the calculated perimeter coordinates
                createRedDot(perimeterX, perimeterY);
            }
        }else{
            removeRedDot(event.target);

        }
    });

    // Function to create a red dot element at the specified coordinates
    function createRedDot(x, y) {
        const redDot = document.createElement('div');
        redDot.className = 'red-dot'; // Set the class to 'red-dot'
        redDot.style.left = x - 5 + 'px'; // Set the left position with a 5px offset
        redDot.style.top = y - 5 + 'px';  // Set the top position with a 5px offset
        circleContainer.appendChild(redDot); // Add the red dot to the circle container
        redDots.push({ x, y, element: redDot });

    }

    function isRedDotAtPosition(x, y) {
        return redDots.some((redDot) => {
            const distance = Math.sqrt((x - redDot.x) ** 2 + (y - redDot.y) ** 2);
            return distance <= 5; // Adjust this value based on the red dot size
        });
    }

    function removeRedDot(redDotElement) {
        const index = redDots.findIndex((redDot) => redDot.element === redDotElement);
        if (index !== -1) {
            redDots.splice(index, 1);
            circleContainer.removeChild(redDotElement);
        }
    }


});
