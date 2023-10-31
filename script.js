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

    const chestInput = document.getElementById("chest");
    chestInput.value = initialChest;
    chestInput.addEventListener("input", function () {
        const chest = parseFloat(chestInput.value) || 0;
        updateTruncatedCone(chest, parseFloat(waistInput.value) || 0, parseFloat(backWaistInput.value) || 0);
    });

    const waistInput = document.getElementById("waist");
    waistInput.value = initialWaist;
    waistInput.addEventListener("input", function () {
        const waist = parseFloat(waistInput.value) || 0;
        updateTruncatedCone(parseFloat(chestInput.value) || 0, waist, parseFloat(backWaistInput.value) || 0);
    });

    const backWaistInput = document.getElementById("back-waist");
    backWaistInput.value = initialBackWaist;
    backWaistInput.addEventListener("input", function () {
        const backWaist = parseFloat(backWaistInput.value) || 0;
        updateTruncatedCone(parseFloat(chestInput.value) || 0, parseFloat(waistInput.value) || 0, backWaist);
    });
    
    updateTruncatedCone(initialChest, initialWaist, initialBackWaist);

    colorSelector.addEventListener("change", function () {
        const selectedColor = parseInt(colorSelector.value, 16);
        material.color.set(selectedColor);
    });

    const downloadPatternButton = document.getElementById("download-pattern");

    downloadPatternButton.addEventListener("click", function () {
        const chest = parseFloat(chestInput.value) || 0;
        const waist = parseFloat(waistInput.value) || 0;
        const backWaist = parseFloat(backWaistInput.value) || 0;
        
        const patternText = `Measurement Order: Chest - ${chest}, Waist - ${waist}, Back Waist - ${backWaist}`;
        const blob = new Blob([patternText], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'pattern.txt';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    });
});
