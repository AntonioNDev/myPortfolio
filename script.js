document.getElementById('year').textContent = new Date().getFullYear();

initThreeJS()

function initThreeJS() {
    const container = document.getElementById('canvas-container');
    
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0b1120); // Deep background

    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(16, 12, 18); // Pulled back

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.03;
    controls.enableZoom = false; 
    controls.enablePan = false; 
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.3;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
    dirLight.position.set(10, 20, 10);
    scene.add(dirLight);

    const particleCount = 450;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    
    for(let i=0; i < particleCount * 3; i++) {
        particlePos[i] = (Math.random() - 0.5) * 60; 
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    
    const particleMat = new THREE.PointsMaterial({
        color: 0x4f46e5,
        size: 0.1,
        transparent: true,
        opacity: 0.4
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    const plotGroup = new THREE.Group();
    scene.add(plotGroup);

    // A. The Surface Geometry
    const size = 10; // Smaller size
    const segments = 45; // High enough for smooth wave, low enough to show flat shading
    const geometry = new THREE.PlaneGeometry(size, size, segments, segments);
    geometry.rotateX(-Math.PI / 2); // Lay flat

    const material = new THREE.MeshPhongMaterial({
        vertexColors: true,
        flatShading: true,
        side: THREE.DoubleSide,
        shininess: 30
    });

    const mesh = new THREE.Mesh(geometry, material);
    plotGroup.add(mesh);

    const boxHeight = 6;
    
    const gridHelper = new THREE.GridHelper(size, 10, 0x444444, 0x222222);
    gridHelper.position.y = -boxHeight / 2;
    plotGroup.add(gridHelper);

    const gridHelperBack = new THREE.GridHelper(size, 10, 0x444444, 0x222222);
    gridHelperBack.rotation.x = Math.PI / 2;
    gridHelperBack.scale.set(1, 1, boxHeight/size);
    gridHelperBack.position.set(0, 0, -size / 2);
    plotGroup.add(gridHelperBack);
    
    const gridHelperSide = new THREE.GridHelper(size, 10, 0x444444, 0x222222);
    gridHelperSide.rotation.z = Math.PI / 2;
    gridHelperSide.scale.set(boxHeight/size, 1, 1);
    gridHelperSide.position.set(-size / 2, 0, 0);
    plotGroup.add(gridHelperSide);

    const boxGeo = new THREE.BoxGeometry(size, boxHeight, size);
    const edges = new THREE.EdgesGeometry(boxGeo);
    const lineMat = new THREE.LineBasicMaterial({ color: 0x444444, linewidth: 1 });
    const boundingBox = new THREE.LineSegments(edges, lineMat);
    plotGroup.add(boundingBox);

    plotGroup.position.y = -1;

    function makeTextSprite(message) {
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'rgba(0, 0, 0, 0)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#94a3b8'; // Tailwind slate-400
        ctx.font = 'bold 26px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(message, 64, 32);
        
        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(2.5, 1.25, 1);
        return sprite;
    }

    for (let i = -5; i <= 5; i+=5) {
        let xTick = makeTextSprite(i.toString());
        xTick.position.set(i, -boxHeight/2 - 0.6, size/2 + 0.2);
        plotGroup.add(xTick);
        
        // Y ticks (MATLAB depth)
        let zTick = makeTextSprite(i.toString());
        zTick.position.set(size/2 + 0.2, -boxHeight/2 - 0.6, i);
        plotGroup.add(zTick);
    }
    
    // Z ticks (MATLAB height)
    for (let i = -2; i <= 2; i+=2) {
        let yTick = makeTextSprite(i.toString());
        yTick.position.set(-size/2 - 0.6, i, size/2 + 0.2);
        plotGroup.add(yTick);
    }

    // Axis Names
    let xLabel = makeTextSprite("X");
    xLabel.position.set(0, -boxHeight/2 - 1.4, size/2 + 1.2);
    plotGroup.add(xLabel);

    let zLabel = makeTextSprite("Z");
    zLabel.position.set(size/2 + 1.2, -boxHeight/2 - 1.4, 0);
    plotGroup.add(zLabel);

    let yLabel = makeTextSprite("Y");
    yLabel.position.set(-size/2 - 1.2, boxHeight/2 + 0.6, size/2 + 0.2);
    plotGroup.add(yLabel);

    function getColdColor(value) {
        const c1 = new THREE.Color(0x081236); // Dark Blue
        const c2 = new THREE.Color(0x008fb3); // Cyan
        const c3 = new THREE.Color(0xccfbf1); // Light Teal
        
        const c = new THREE.Color();
        if (value < 0.5) {
            c.lerpColors(c1, c2, value * 2);
        } else {
            c.lerpColors(c2, c3, (value - 0.5) * 2);
        }
        return { r: c.r, g: c.g, b: c.b };
    }

    window.addEventListener('resize', onWindowResize, false);
    function onWindowResize() {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }

    let time = 0;
    const positionAttribute = geometry.attributes.position;
    
    function animate() {
        requestAnimationFrame(animate);

        time += 0.01; 

        const colors = [];
        const amplitude = 2.0;
        
        for (let i = 0; i < positionAttribute.count; i++) {
            const x = positionAttribute.getX(i);
            const z = positionAttribute.getZ(i);
            
            // Math function: Combination of sine and cosine
            const y = Math.sin((x / 2) + time) * Math.cos((z / 2) + time * 0.8) * amplitude;
            positionAttribute.setY(i, y);

            // Normalize Y to 0.0 - 1.0 for colormap
            const normY = (y + amplitude) / (amplitude * 2);
            
            // Get Cold Color (Dark Blue -> Cyan -> Light Teal)
            const rgb = getColdColor(normY);
            colors.push(rgb.r, rgb.g, rgb.b);
        }
        
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        positionAttribute.needsUpdate = true;
        geometry.computeVertexNormals();

        particles.rotation.y = time * 0.05;
        particles.rotation.x = time * 0.02;

        controls.update();
        renderer.render(scene, camera);
    }

    // Start loop
    animate();
}