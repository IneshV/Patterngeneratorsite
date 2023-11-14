// Wait for the HTML document to be fully loaded before executing JavaScript
document.addEventListener("DOMContentLoaded", function () {
    // Create a new Three.js scene
    const scene = new THREE.Scene();

    // Create a perspective camera with a 75-degree field of view and an aspect ratio of 1
    const camera = new THREE.PerspectiveCamera(75, 1);

    // Create a WebGL renderer
    const renderer = new THREE.WebGLRenderer();

    // Set the size of the renderer canvas to 300x300 pixels
    renderer.setSize(300, 300);

    // Set the background color of the renderer to white
    renderer.setClearColor(0xffffff);

    // Get the HTML element with the id "threejs-container" to append the renderer canvas to
    const threejsContainer = document.getElementById("threejs-container");
    threejsContainer.appendChild(renderer.domElement);

    // Get the color selector input element
    const colorSelector = document.getElementById("color-selector");

    // Create a basic material with an initial blue color for the truncated cone
    const material = new THREE.MeshBasicMaterial({ color: 0x3498db, side: THREE.DoubleSide });

    // Create a cylinder geometry for the truncated cone
    const cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32, 1);

    // Create a mesh (3D object) for the truncated cone using the material and geometry
    const truncatedCone = new THREE.Mesh(cylinderGeometry, material);

    // Add the truncated cone to the scene
    scene.add(truncatedCone);

    // Create an edges geometry to represent the wireframe of the truncated cone
    const wireframeGeometry = new THREE.EdgesGeometry(cylinderGeometry);

    // Create a line material for the wireframe with a black color
    const wireframeMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });

    // Create a line segments object for the wireframe using the geometry and material
    const wireframe = new THREE.LineSegments(wireframeGeometry, wireframeMaterial);

    // Add the wireframe to the scene
    scene.add(wireframe);

    // Create a geometry for the rectangle
    const rectangleGeometry = new THREE.PlaneGeometry(2, 4);

    // Create a material for the rectangle with the same color as the cylinder
    const rectangleMaterial = new THREE.MeshBasicMaterial({ color: material.color });

    // Create a mesh for the rectangle using the geometry and material
    const rectangle = new THREE.Mesh(rectangleGeometry, rectangleMaterial);

    // Position the rectangle in front of the cylinder and align its left side with the front side of the cylinder
    const rectangleZPosition = truncatedCone.position.z + truncatedCone.geometry.parameters.height; // Adjust the Z position to be slightly in front of the cone
    rectangle.position.set(1, 0, 1);

    // Calculate the angle of rotation based on the slope of the cylinder
    const slope = (truncatedCone.geometry.parameters.radiusTop - truncatedCone.geometry.parameters.radiusBottom) / truncatedCone.geometry.parameters.height;
    const angle = Math.atan(slope); // Calculate the angle in radians

    // Rotate the rectangle to face towards the user
    rectangle.rotation.x = angle;

    // Add the rectangle to the scene
    scene.add(rectangle);

    // Set the initial camera position
    camera.position.z = 5;
    camera.position.y = 2; // Adjust the camera's Y position if needed
    camera.lookAt(0, 0, 0); // Make the camera look at the center of the scene (0, 0, 0)

    // Define an animation function
    const animate = () => {
        requestAnimationFrame(animate);

        // Render the scene with the camera
        renderer.render(scene, camera);
    };

    // Start the animation loop
    animate();

    // Function to update the truncated cone based on measurements
    function updateTruncatedCone(chest, waist, backWaist) {
        const topRadius = chest / 2;
        const bottomRadius = waist / 2;
        const height = backWaist;

        // Create a new geometry for the truncated cone
        const newGeometry = new THREE.CylinderGeometry(topRadius, bottomRadius, height, 32, 1);

        // Dispose of the old geometry and set the new geometry for the truncated cone
        truncatedCone.geometry.dispose();
        truncatedCone.geometry = newGeometry;

        // Dispose of the old wireframe geometry and set the new wireframe geometry
        wireframe.geometry.dispose();
        wireframe.geometry = new THREE.EdgesGeometry(newGeometry);
    }

    // Function to update the rectangle based on measurements
    function updateRectangle(chest, waist, backWaist) {
        // Calculate the new position and rotation of the rectangle based on the measurements
        const topRadius = chest / 2;
        const bottomRadius = waist / 2;
        const height = backWaist;

        // Calculate the new position of the rectangle along the Z-axis
        const rectangleZPosition = height / 2;

        // Calculate the x value of the rectangle based on the half of its width
        const rectangleXPosition = rectangle.geometry.parameters.width / 2;

        // Set the position of the rectangle
        rectangle.position.set(rectangleXPosition, 0, rectangleZPosition);

        // Calculate the angle of rotation based on the slope of the cylinder
        const slope = (topRadius - bottomRadius) / height;
        const angle = Math.atan(slope); // Calculate the angle in radians

        // Set the rotation of the rectangle
        rectangle.rotation.x = angle;
    }

    // Initial measurement values
    const initialChest = 3;
    const initialWaist = 2;
    const initialBackWaist = 4;

    // Get input elements for chest, waist, and backWaist and set their initial values
    const chestInput = document.getElementById("chest");
    chestInput.value = initialChest;
    const waistInput = document.getElementById("waist");
    waistInput.value = initialWaist;
    const backWaistInput = document.getElementById("back-waist");
    backWaistInput.value = initialBackWaist;

    // Event listener for chest input
    chestInput.addEventListener("input", function () {
        // Get the updated chest measurement from the input field
        const chest = parseFloat(chestInput.value) || 0;
        // Call the updateTruncatedCone function with the updated measurements
        updateTruncatedCone(chest, parseFloat(waistInput.value) || 0, parseFloat(backWaistInput.value) || 0);

        // Call the updateRectangle function with the updated measurements
        updateRectangle(chest, parseFloat(waistInput.value) || 0, parseFloat(backWaistInput.value) || 0);
    });

    // Event listener for waist input
    waistInput.addEventListener("input", function () {
        // Get the updated waist measurement from the input field
        const waist = parseFloat(waistInput.value) || 0;
        // Call the updateTruncatedCone function with the updated measurements
        updateTruncatedCone(parseFloat(chestInput.value) || 0, waist, parseFloat(backWaistInput.value) || 0);

        // Call the updateRectangle function with the updated measurements
        updateRectangle(parseFloat(chestInput.value) || 0, waist, parseFloat(backWaistInput.value) || 0);
    });

    // Event listener for backWaist input
    backWaistInput.addEventListener("input", function () {
        // Get the updated backWaist measurement from the input field
        const backWaist = parseFloat(backWaistInput.value) || 0;
        // Call the updateTruncatedCone function with the updated measurements
        updateTruncatedCone(parseFloat(chestInput.value) || 0, parseFloat(waistInput.value) || 0, backWaist);

        // Call the updateRectangle function with the updated measurements
        updateRectangle(parseFloat(chestInput.value) || 0, parseFloat(waistInput.value) || 0, backWaist);
    });

    // Update the truncated cone and rectangle with the initial measurements
    updateTruncatedCone(initialChest, initialWaist, initialBackWaist);
    updateRectangle(initialChest, initialWaist, initialBackWaist);

    // Event listener for color selector
    colorSelector.addEventListener("change", function () {
        // Get the selected color value from the color selector and set it as the material color
        const selectedColor = parseInt(colorSelector.value, 16);
        material.color.set(selectedColor);
    });

    // Get the "download-pattern" button
    const downloadPatternButton = document.getElementById("download-pattern");

    // Event listener for downloading the pattern
    downloadPatternButton.addEventListener("click", function () {
        // Get the current measurement values from the input fields
        const chest = parseFloat(chestInput.value) || 0;
        const waist = parseFloat(waistInput.value) || 0;
        const backWaist = parseFloat(backWaistInput.value) || 0;

        // Create a text pattern with the measurement values
        const patternText = `Measurement Order: Chest - ${chest}, Waist - ${waist}, Back Waist - ${backWaist}`;

        // Create a Blob containing the text pattern as a text/plain file
        const blob = new Blob([patternText], { type: 'text/plain' });

        // Create a URL for the Blob
        const url = window.URL.createObjectURL(blob);

        // Create a download link and trigger a click to download the file
        const a = document.createElement('a');
        a.href = url;
        a.download = 'pattern.txt';
        document.body.appendChild(a);
        a.click();

        // Revoke the URL to free up resources
        window.URL.revokeObjectURL(url);
    });
});

