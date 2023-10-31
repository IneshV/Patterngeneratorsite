document.addEventListener("DOMContentLoaded", function () {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(300, 300);
    renderer.setClearColor(0xffffff);

    const threejsContainer = document.getElementById("threejs-container");
    threejsContainer.appendChild(renderer.domElement);

    const colorSelector = document.getElementById("color-selector");
    const material = new THREE.MeshBasicMaterial({ color: 0x3498db, side: THREE.DoubleSide });

    const cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32, 1);
    const truncatedCone = new THREE.Mesh(cylinderGeometry, material);
    scene.add(truncatedCone);

    const wireframeGeometry = new THREE.EdgesGeometry(cylinderGeometry);
    const wireframeMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
    const wireframe = new THREE.LineSegments(wireframeGeometry, wireframeMaterial);
    scene.add(wireframe);

    camera.position.z = 5;

    const animate = () => {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    };

    animate();

    function updateTruncatedCone(chest, waist, backWaist) {
        const topRadius = chest / 2;
        const bottomRadius = waist / 2;
        const height = backWaist;

        const newGeometry = new THREE.CylinderGeometry(topRadius, bottomRadius, height, 32, 1);

        truncatedCone.geometry.dispose();
        truncatedCone.geometry = newGeometry;

        wireframe.geometry.dispose();
        wireframe.geometry = new THREE.EdgesGeometry(newGeometry);
    }

    const initialChest = 3;
    const initialWaist = 2;
    const initialBackWaist = 4;

    document.getElementById("chest").value = initialChest;
    document.getElementById("waist").value = initialWaist;
    document.getElementById("back-waist").value = initialBackWaist;
    updateTruncatedCone(initialChest, initialWaist, initialBackWaist);

    colorSelector.addEventListener("change", function () {
        const selectedColor = parseInt(colorSelector.value, 16);
        material.color.set(selectedColor);
    });

    const submitButton = document.getElementById("submit-measurements");

    submitButton.addEventListener("click", function () {
        const chest = parseFloat(document.getElementById("chest").value) || 0;
        const waist = parseFloat(document.getElementById("waist").value) || 0;
        const backWaist = parseFloat(document.getElementById("back-waist").value) || 0;

        updateTruncatedCone(chest, waist, backWaist);
    });
});
