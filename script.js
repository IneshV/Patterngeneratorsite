document.addEventListener('DOMContentLoaded', function () {
    // DOM elements
    const topHalfCheckbox = document.getElementById('top-half-checkbox');
    const topHalfSection = document.getElementById('top-half-section');
    const bottomHalfCheckbox = document.getElementById('bottom-half-checkbox');
    const bottomHalfSection = document.getElementById('bottom-half-section');
    
    // Input fields
    const topCircumferenceInput = document.getElementById('top-circumference');
    const topHeightInput = document.getElementById('top-height');
    const bottomCircumferenceInput = document.getElementById('bottom-circumference');
    const bottomHeightInput = document.getElementById('bottom-height');
    const naturalWaistInput = document.getElementById('natural-waist');

    // Event listeners
    topHalfCheckbox.addEventListener('change', toggleTopHalfSection);
    bottomHalfCheckbox.addEventListener('change', toggleBottomHalfSection);
    document.getElementById('download-pattern').addEventListener('click', downloadPattern);
    topHalfCheckbox.addEventListener('change', draw);
    bottomHalfCheckbox.addEventListener('change', draw);


    // Event listeners for input fields
    topCircumferenceInput.addEventListener('input', draw);
    topHeightInput.addEventListener('input', draw);
    bottomCircumferenceInput.addEventListener('input', draw);
    bottomHeightInput.addEventListener('input', draw);
    naturalWaistInput.addEventListener('input', draw);

    // Three.js variables
    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer();
    const camera = new THREE.PerspectiveCamera(75, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x3498db, side: THREE.DoubleSide });

    const colorSelector = document.getElementById("color-selector");

    colorSelector.addEventListener('change', updateColor);
    function updateColor() {
        const selectedColor = colorSelector.value;   
        // Update material color
        material.color.setHex(parseInt(selectedColor, 16));
    }
    

    const wireframeMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });

    // Set up the initial scene
    initializeScene();

    // Call the draw function to set up the initial drawing based on checkbox states
    draw();

    // Function to initialize the Three.js scene
// Function to initialize the Three.js scene
function initializeScene() {
    renderer.setSize(300, 300);
    renderer.setClearColor(0xffffff);
    const threejsContainer = document.getElementById("threejs-container");
    threejsContainer.appendChild(renderer.domElement);
    camera.position.z = 5;
    camera.position.y = 2;
    camera.lookAt(0, 0, 0);

    const animate = () => {
        requestAnimationFrame(animate);
        // Add rotation to the scene around different axes
        scene.rotation.y += 0.005; // Rotation around the Y-axis
        scene.rotation.x += 0.002; // Rotation around the X-axis
        scene.rotation.z += 0.003; // Rotation around the Z-axis


        renderer.render(scene, camera);
    };
    animate();
}
    // Function to redraw the scene based on checkbox states and input values
    function draw() {
        console.log('Draw function called');
        const topCheckboxChecked = topHalfCheckbox.checked;
        const bottomCheckboxChecked = bottomHalfCheckbox.checked;

        console.log('Top Checkbox Checked:', topCheckboxChecked);
        console.log('Bottom Checkbox Checked:', bottomCheckboxChecked);

        // Clear existing cylinders and wireframes from the scene
        // Clear existing cylinders and wireframes from the scene
        while (scene.children.length > 0) {
            const child = scene.children[0];
            if (child.geometry) child.geometry.dispose();
            if (child.material) child.material.dispose();
            scene.remove(child);
        }
        // if (topCheckboxChecked && bottomCheckboxChecked){
        //     const topCircumference = parseFloat(topCircumferenceInput.value) || 36;
        //     const topHeight = parseFloat(topHeightInput.value) || 20;
        //     const midCircumference = parseFloat(naturalWaistInput.value) || 36;

        //     drawCylinder(topCircumference, midCircumference, topHeight, topHeight);

        //     const bottomCircumference = parseFloat(bottomCircumferenceInput.value) || 36;
        //     const bottomHeight = parseFloat(bottomHeightInput.value) || 20;

        //     drawCylinder(midCircumference, bottomCircumference, bottomHeight, -bottomHeight);

        //     drawrectangle(topCircumference, bottomCircumference, topHeight + bottomHeight, ypos = 0)
        // }
        // else 
        if (topCheckboxChecked){
        // Draw top cylinder if top checkbox is checked
            const topCircumference = parseFloat(topCircumferenceInput.value) || 36;
            const topHeight = parseFloat(topHeightInput.value) || 20;
            const midCircumference = parseFloat(naturalWaistInput.value) || 36;

            drawCylinder(topCircumference, midCircumference, topHeight, topHeight);
            drawrectangle(topCircumference, midCircumference, topHeight, ypos = topHeight)
        }

        // Draw bottom cylinder if bottom checkbox is checked
        if (bottomCheckboxChecked) {
            const bottomCircumference = parseFloat(bottomCircumferenceInput.value) || 36;
            const bottomHeight = parseFloat(bottomHeightInput.value) || 20;
            const midCircumference = parseFloat(naturalWaistInput.value) || 36;

            drawCylinder(midCircumference, bottomCircumference, bottomHeight, -bottomHeight);
            drawrectangle(midCircumference, bottomCircumference, bottomHeight, ypos = -bottomHeight)

        }

        camera.position.z = 5; // Adjust the camera position
        renderer.render(scene, camera); // Render the scene with the updated camera position
    }


    // Function to draw a rectangle with PlaneGeometry
    function drawrectangle(topCircumference, bottomCircumference, totalHeight, yPos) {
        // Calculate the new position and rotation of the rectangle based on the measurements
        const topRadius = topCircumference / 24;
        const bottomRadius = bottomCircumference / 24;
        const height = totalHeight / 10;

        const chest2 = topRadius / 12;
        const waist2 = bottomRadius / 12;

        const newrectangleGeometry = new THREE.PlaneGeometry((chest2+waist2) *2, Math.sqrt(Math.pow(height, 2) + Math.pow((chest2 - waist2), 2)));
        const rectangle = new THREE.Mesh(newrectangleGeometry, material);

        rectangle.position.y = rectangle.position.y  + 0.5* height;
        rectangle.geometry = newrectangleGeometry;

        // Calculate the new position of the rectangle along the Z-axis
        const rectangleZPosition = (topRadius+ bottomRadius) / 2;

        // Calculate the x value of the rectangle based on the half of its width
        const rectangleXPosition = rectangle.geometry.parameters.width / 2;

        // Set the position of the rectangle
        rectangle.position.set(rectangleXPosition, 0, rectangleZPosition);

        // Calculate the angle of rotation based on the slope of the cylinder
        const slope = (topRadius - bottomRadius) / height;
        const angle = Math.atan(slope); // Calculate the angle in radians

        // Set the rotation of the rectangle
        rectangle.rotation.x = angle;
        rectangle.rotation.y +=90;

        rectangle.position.y =  yPos/20
        scene.add(rectangle);

        const newRectWireframeGeometry = new THREE.EdgesGeometry(newrectangleGeometry);
        const rectwireframe = new THREE.LineSegments(newRectWireframeGeometry, wireframeMaterial);

        // Dispose of the old rectangle wireframe geometry and set the new wireframe geometry
        rectwireframe.geometry.dispose();
        rectwireframe.geometry = newRectWireframeGeometry;
        rectwireframe.position.copy(rectangle.position);
        rectwireframe.rotation.copy(rectangle.rotation);
        //rectwireframe.position.y.copy(rectangle.rotation);

        scene.add(rectwireframe);

        }

    function drawCylinder(topcircumference, bottomCircumference, height, yPos) {
        const Tradius = topcircumference / 24;
        const Bradius = bottomCircumference / 24;
        
        const geometry = new THREE.CylinderGeometry(Tradius, Bradius, height /10, 32, 1);
        const cylinder = new THREE.Mesh(geometry, material);
        cylinder.position.y = yPos/20; // Set the cylinder's y position
        scene.add(cylinder);

        // Create wireframe for the cylinder
        const wireframeGeometry = new THREE.EdgesGeometry(geometry);
        const wireframe = new THREE.LineSegments(wireframeGeometry, wireframeMaterial);
        wireframe.position.y = yPos/20; // Set the wireframe's y position
        scene.add(wireframe);
    }

    // Function to toggle top-half section visibility
    function toggleTopHalfSection() {
        topHalfSection.style.display = topHalfCheckbox.checked ? 'block' : 'none';
    }

    // Function to toggle bottom-half section visibility
    function toggleBottomHalfSection() {
        bottomHalfSection.style.display = bottomHalfCheckbox.checked ? 'block' : 'none';
    }

    // Function to handle pattern download
    function downloadPattern() {
        let patternText = '';
        const topCheckboxChecked = topHalfCheckbox.checked;
        const bottomCheckboxChecked = bottomHalfCheckbox.checked;

        if (topCheckboxChecked) {
            const topCircumference = parseFloat(topCircumferenceInput.value) || 36;
            const topHeight = parseFloat(topHeightInput.value) || 20;
            const midCircumference = parseFloat(naturalWaistInput.value) || 36;
    
            patternText += `Top Cylinder Measurements:\n`;
            patternText += `  Top Circumference: ${topCircumference}\n`;
            patternText += `  Mid Circumference: ${midCircumference}\n`;
            patternText += `  Top Height: ${topHeight}\n\n`;
        }
    
        if (bottomCheckboxChecked) {
            const bottomCircumference = parseFloat(bottomCircumferenceInput.value) || 36;
            const bottomHeight = parseFloat(bottomHeightInput.value) || 20;
            const midCircumference = parseFloat(naturalWaistInput.value) || 36;
    
            patternText += `Bottom Cylinder Measurements:\n`;
            patternText += `  Bottom Circumference: ${bottomCircumference}\n`;
            patternText += `  Mid Circumference: ${midCircumference}\n`;
            patternText += `  Bottom Height: ${bottomHeight}\n\n`;
        }
    
        const colorSelector = document.getElementById("color-selector");
        const selectedColor = colorSelector.options[colorSelector.selectedIndex].value;
    
        patternText += `Color: ${selectedColor}\n`;
    
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
    }
    
    // Get the "download-pattern" button
    const downloadPatternButton = document.getElementById("download-pattern");
    downloadPatternButton.addEventListener('click', downloadPattern);



});
