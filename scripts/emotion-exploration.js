document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const emotionForm = document.getElementById('emotion-form');
    const emotionQuestion = document.getElementById('emotion-question');
    const colorQuestion = document.getElementById('color-question');
    const shapeQuestion = document.getElementById('shape-question');
    const visualizationContainer = document.getElementById('visualization-container');
    const journalDisplay = document.getElementById('journal-display');
    const journalContentDisplay = document.getElementById('journal-content-display');
    
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    const emotionOptions = document.querySelectorAll('.emotion-option');
    const colorInput = document.getElementById('color-input');
    const shapeOptions = document.querySelectorAll('.shape-option');
    
    const emotionDisplay = document.getElementById('emotion-display');
    const colorDisplay = document.getElementById('color-display');
    const shapeDisplay = document.getElementById('shape-display');
    
    const saveVisualizationBtn = document.getElementById('save-visualization');
    const startOverBtn = document.getElementById('start-over');
    const backToHomeBtn = document.getElementById('back-to-home');
    const backFromVizBtn = document.getElementById('back-from-viz');
    
    // State variables
    let currentStep = 1;
    const totalSteps = 3;
    let selectedEmotion = '';
    let selectedShape = '';
    let p5Instance = null;
    
    // Get journal entry from localStorage if available
    const journalEntry = localStorage.getItem('currentJournalEntry') || '';
    
    // Initialize
    function init() {
        updateButtons();
        attachEventListeners();
        displayJournalEntry();
        setupColorPicker();
    }
    
    // Setup color picker functionality
    function setupColorPicker() {
        const colorInput = document.getElementById('color-input');
        const colorPreview = document.getElementById('color-preview');
        const colorHexValue = document.getElementById('color-hex-value');
        
        // Set initial color
        if (colorPreview && colorHexValue) {
            colorPreview.style.backgroundColor = colorInput.value;
            colorHexValue.textContent = colorInput.value;
        }
        
        // Update when color changes
        colorInput.addEventListener('input', function() {
            if (colorPreview && colorHexValue) {
                colorPreview.style.backgroundColor = this.value;
                colorHexValue.textContent = this.value;
            }
        });
    }
    
    // Display the journal entry if available
    function displayJournalEntry() {
        if (journalEntry) {
            journalContentDisplay.textContent = journalEntry;
            journalDisplay.style.display = 'block';
        } else {
            journalDisplay.style.display = 'none';
        }
    }
    
    // Update button visibility based on current step
    function updateButtons() {
        prevBtn.style.display = currentStep === 1 ? 'none' : 'block';
        nextBtn.textContent = currentStep === totalSteps ? 'Create Visualization' : 'Next';
    }
    
    // Show the current question
    function showCurrentQuestion() {
        // Hide all questions
        emotionQuestion.style.display = 'none';
        colorQuestion.style.display = 'none';
        shapeQuestion.style.display = 'none';
        
        // Show the current question
        if (currentStep === 1) {
            emotionQuestion.style.display = 'block';
        } else if (currentStep === 2) {
            colorQuestion.style.display = 'block';
        } else if (currentStep === 3) {
            shapeQuestion.style.display = 'block';
        }
        
        updateButtons();
    }
    
    // Move to the next question
    function nextQuestion() {
        // Validate current step
        if (currentStep === 1 && !selectedEmotion) {
            alert('Please select an emotion');
            return;
        }
        
        if (currentStep === 3 && !selectedShape) {
            alert('Please select a shape');
            return;
        }
        
        // If on the last step, show visualization
        if (currentStep === totalSteps) {
            showVisualization();
            return;
        }
        
        // Move to next step
        currentStep++;
        showCurrentQuestion();
    }
    
    // Move to the previous question
    function prevQuestion() {
        if (currentStep > 1) {
            currentStep--;
            showCurrentQuestion();
        }
    }
    
    // Show the visualization
    function showVisualization() {
        // Hide the form
        emotionForm.style.display = 'none';
        
        // Show the visualization container
        visualizationContainer.style.display = 'block';
        
        // Update the emotion summary
        emotionDisplay.textContent = selectedEmotion;
        colorDisplay.textContent = colorInput.value;
        shapeDisplay.textContent = selectedShape;
        
        // Display journal entry in visualization if available
        const journalVizDisplay = document.getElementById('journal-viz-display');
        if (journalVizDisplay && journalEntry) {
            journalVizDisplay.textContent = journalEntry;
        }
        
        // Create the P5.js visualization
        createVisualization();
    }
    
    // Create the P5.js visualization
    function createVisualization() {
        const canvasContainer = document.getElementById('p5-canvas');
        
        // If there's already a p5 instance, remove it
        if (p5Instance) {
            p5Instance.remove();
        }
        
        // Create a new p5 instance
        p5Instance = new p5(function(p) {
            const emotion = selectedEmotion.toLowerCase();
            const color = colorInput.value;
            const shape = selectedShape;
            
            // Variables for different visualization types
            let pattern = 'default';
            let particles = [];
            let numParticles = 50;
            let time = 0;
            
            // Pattern-specific variables
            let raindrops = []; // For melancholy
            let fireworks = []; // For joy
            let anxietyLines = []; // For anxiety
            let angerExplosions = []; // For anger
            let spiralPoints = []; // For confusion
            let numFloatingParticles = 20; // For subdued
            
            // Determine pattern based on emotion
            if (emotion.includes('joy') || emotion.includes('hope') || emotion.includes('peace') || emotion.includes('gratitude')) {
                pattern = 'positive';
            } else if (emotion.includes('sadness') || emotion.includes('grief') || emotion.includes('emptiness') || emotion.includes('lonely')) {
                pattern = 'melancholy';
            } else if (emotion.includes('anger')) {
                pattern = 'anger';
            } else if (emotion.includes('anxiety') || emotion.includes('fear') || emotion.includes('overwhelmed')) {
                pattern = 'anxiety';
            } else if (emotion.includes('numb') || emotion.includes('shame') || emotion.includes('guilt')) {
                pattern = 'subdued';
            } else if (emotion.includes('confused')) {
                pattern = 'confusion';
            }
            
            p.setup = function() {
                const canvas = p.createCanvas(canvasContainer.offsetWidth, 400);
                canvas.parent(canvasContainer);
                
                // Initialize based on pattern
                switch(pattern) {
                    case 'positive':
                        setupFireworks();
                        break;
                    case 'melancholy':
                        setupMelancholy();
                        break;
                    case 'anger':
                        setupAnger();
                        break;
                    case 'anxiety':
                        setupAnxiety();
                        break;
                    case 'subdued':
                        setupSubdued();
                        break;
                    case 'confusion':
                        setupConfusion();
                        break;
                    default:
                        // Default particles
                        for (let i = 0; i < numParticles; i++) {
                            particles.push(new Particle());
                        }
                }
                
                // Use RGB color mode to handle hex colors properly
                p.colorMode(p.RGB, 255);
                p.frameRate(30);
            };
            
            p.draw = function() {
                time += 0.01;
                
                // Different rendering based on pattern
                switch(pattern) {
                    case 'positive':
                        drawFireworks();
                        break;
                    case 'melancholy':
                        drawMelancholy();
                        break;
                    case 'anger':
                        drawAnger();
                        break;
                    case 'anxiety':
                        drawAnxiety();
                        break;
                    case 'subdued':
                        drawSubdued();
                        break;
                    case 'confusion':
                        drawConfusion();
                        break;
                    default:
                        // Default particle behavior
                        p.background(255, 255, 255, 0.1);
                        particles.forEach(particle => {
                            particle.update();
                            particle.display();
                        });
                }
            };
            
            // POSITIVE EMOTIONS: Fireworks and sparkles
            function setupFireworks() {
                for (let i = 0; i < 3; i++) {
                    createNewFirework();
                }
            }
            
            function createNewFirework() {
                const x = p.random(p.width);
                const y = p.height;
                const targetY = p.random(p.height * 0.1, p.height * 0.5);
                fireworks.push({
                    x: x,
                    y: y,
                    targetY: targetY,
                    speed: p.random(4, 7),  // Faster upward movement (was 3-5)
                    particles: [],
                    exploded: false,
                    sparkColor: color,
                    size: p.random(5, 10)
                });
            }
            
            function drawFireworks() {
                // Clear with semi-transparent background
                p.background(255, 255, 255);
                
                // Process fireworks
                for (let i = fireworks.length - 1; i >= 0; i--) {
                    let fw = fireworks[i];
                    
                    if (!fw.exploded) {
                        // Draw rising firework
                        p.noStroke();
                        p.fill(fw.sparkColor);
                        drawShape(fw.x, fw.y, fw.size, shape);
                        
                        // Move upward
                        fw.y -= fw.speed;
                        
                        // Check if reached target height
                        if (fw.y <= fw.targetY) {
                            fw.exploded = true;
                            // Create explosion particles
                            for (let j = 0; j < 60; j++) {
                                let angle = p.random(p.TWO_PI);
                                let speed = p.random(1, 3);
                                fw.particles.push({
                                    x: fw.x,
                                    y: fw.y,
                                    vx: p.cos(angle) * speed,
                                    vy: p.sin(angle) * speed,
                                    alpha: 255,
                                    size: p.random(2, 8)
                                });
                            }
                        }
                    } else {
                        // Draw and update explosion particles
                        for (let j = fw.particles.length - 1; j >= 0; j--) {
                            let particle = fw.particles[j];
                            
                            p.noStroke();
                            // Create proper color with transparency
                            const particleColor = p.color(fw.sparkColor);
                            particleColor.setAlpha(particle.alpha);
                            p.fill(particleColor);
                            
                            drawShape(particle.x, particle.y, particle.size, shape);
                            
                            // Update position with gravity
                            particle.x += particle.vx;
                            particle.y += particle.vy + 0.05; // Gravity effect
                            particle.alpha -= 2; // Fade out
                            
                            // Remove faded particles
                            if (particle.alpha <= 0) {
                                fw.particles.splice(j, 1);
                            }
                        }
                        
                        // Remove firework if all particles are gone
                        if (fw.particles.length === 0) {
                            fireworks.splice(i, 1);
                            // Add a new firework
                            if (p.random() < 0.3 || fireworks.length < 2) {
                                createNewFirework();
                            }
                        }
                    }
                }
                
                // Ensure we always have some fireworks
                if (fireworks.length < 2 && p.random() < 0.05) {
                    createNewFirework();
                }
            }
            
            // MELANCHOLY EMOTIONS: Rain and growing trees
            function setupMelancholy() {
                // Clear any existing particles
                particles = [];
                
                // Create vertical dripping rain lines
                for (let i = 0; i < 150; i++) {
                    particles.push({
                        x: p.random(p.width),
                        y: p.random(-500, p.height),
                        length: p.random(40, 80),  // Much longer for dripping effect
                        speed: p.random(5, 8),    // Slower for dripping window effect
                        thickness: p.random(2, 4)  // Thicker for visibility
                    });
                }
            }
            
            function drawMelancholy() {
                // White background with less transparency
                p.background(255, 255, 255, 250);
                
                // Draw rain - vertical dripping lines
                for (let i = 0; i < particles.length; i++) {
                    let raindrop = particles[i];
                    
                    // Parse hex color properly
                    p.strokeWeight(raindrop.thickness);
                    const userColor = p.color(color); // Proper color conversion
                    p.stroke(userColor);
                    
                    // Vertical dripping lines
                    p.line(
                        raindrop.x, 
                        raindrop.y, 
                        raindrop.x,  // Perfectly vertical
                        raindrop.y + raindrop.length
                    );
                    
                    // Simple splash when rain hits bottom
                    if (raindrop.y + raindrop.length > p.height - 5) {
                        p.noStroke();
                        p.fill(userColor); // Use the same parsed color
                        p.ellipse(raindrop.x, p.height, raindrop.thickness * 8, raindrop.thickness);  // Wider splash
                    }
                    
                    // Update position normally
                    raindrop.y += raindrop.speed;
                    
                    // Reset if off screen
                    if (raindrop.y > p.height) {
                        raindrop.y = p.random(-100, -10);
                        raindrop.x = p.random(p.width);
                    }
                }
            }
            
            // ANGER EMOTIONS: Simple bouncing
            function setupAnger() {
                // Clear any existing shapes
                angerExplosions = [];
                
                // Create 3 bouncing shapes
                for (let i = 0; i < 3; i++) {
                    angerExplosions.push({
                        size: p.random(40, 70),  // Vary the sizes
                        baseSize: p.random(40, 70),
                        x: p.random(p.width * 0.2, p.width * 0.8),
                        y: p.random(p.height * 0.2, p.height * 0.8),
                        directionX: p.random() < 0.5 ? -1 : 1,
                        directionY: p.random() < 0.5 ? -1 : 1,
                        speed: p.random(3, 7),  // Different initial speeds
                        isShaking: false,
                        shakeDuration: 0,
                        sizeChangeTimer: p.random(10, 50)  // Stagger size changes
                    });
                }
            }
            
            function drawAnger() {
                // White background
                p.background(255);
                
                // Process each angry shape
                for (let i = 0; i < angerExplosions.length; i++) {
                    let angry = angerExplosions[i];
                    
                    // Randomly start shaking
                    if (p.random() < 0.01 && !angry.isShaking) {
                        angry.isShaking = true;
                        angry.shakeDuration = p.random(20, 40); // Shake for 20-40 frames
                    }
                    
                    // Randomly change size
                    angry.sizeChangeTimer--;
                    if (p.random() < 0.01 || angry.sizeChangeTimer <= 0) {
                        // Either grow or shrink
                        if (p.random() < 0.5) {
                            angry.size = angry.baseSize * p.random(1.2, 1.8); // Grow
                        } else {
                            angry.size = angry.baseSize * p.random(0.5, 0.9); // Shrink
                        }
                        angry.sizeChangeTimer = p.random(20, 60); // Wait before next size change
                    }
                    
                    // Calculate position with shake if active
                    let displayX = angry.x;
                    let displayY = angry.y;
                    
                    if (angry.isShaking) {
                        displayX += p.random(-5, 5);
                        displayY += p.random(-5, 5);
                        angry.shakeDuration--;
                        
                        if (angry.shakeDuration <= 0) {
                            angry.isShaking = false;
                        }
                    }
                    
                    // Draw the shape
                    p.noStroke();
                    p.fill(color);
                    drawShape(displayX, displayY, angry.size, shape);
                    
                    // Simple bounce logic
                    if (angry.x >= p.width - angry.size/2) {
                        angry.directionX = -1;
                        // Random speed change on bounce
                        angry.speed = p.random(3, 8);
                        
                        // Higher chance of shaking or size change on bounce
                        if (p.random() < 0.3 && !angry.isShaking) {
                            angry.isShaking = true;
                            angry.shakeDuration = p.random(15, 30);
                        }
                    } else if (angry.x <= angry.size/2) {
                        angry.directionX = 1;
                        // Random speed change on bounce
                        angry.speed = p.random(3, 8);
                        
                        // Higher chance of shaking or size change on bounce
                        if (p.random() < 0.3 && !angry.isShaking) {
                            angry.isShaking = true;
                            angry.shakeDuration = p.random(15, 30);
                        }
                    }
                    
                    if (angry.y >= p.height - angry.size/2) {
                        angry.directionY = -1;
                        // Random speed change on bounce
                        angry.speed = p.random(3, 8);
                        
                        // Higher chance of shaking or size change on bounce
                        if (p.random() < 0.3 && !angry.isShaking) {
                            angry.isShaking = true;
                            angry.shakeDuration = p.random(15, 30);
                        }
                    } else if (angry.y <= angry.size/2) {
                        angry.directionY = 1;
                        // Random speed change on bounce
                        angry.speed = p.random(3, 8);
                        
                        // Higher chance of shaking or size change on bounce
                        if (p.random() < 0.3 && !angry.isShaking) {
                            angry.isShaking = true;
                            angry.shakeDuration = p.random(15, 30);
                        }
                    }
                    
                    // Update position
                    angry.x += angry.directionX * angry.speed;
                    angry.y += angry.directionY * angry.speed;
                    
                    // Occasionally return to base size
                    if (p.random() < 0.01 && Math.abs(angry.size - angry.baseSize) > 10) {
                        angry.size = angry.baseSize;
                    }
                }
            }
            
            // ANXIETY EMOTIONS: Nervous line network
            function setupAnxiety() {
                // Create jittery lines and shapes
                for (let i = 0; i < 15; i++) {
                    anxietyLines.push({
                        points: [],
                        weight: p.random(1, 3),
                        jitterAmount: p.random(2, 8),
                        speed: p.random(1, 3),
                        color: color,
                        // Add shape-related properties
                        showShapes: p.random() < 0.7, // 70% of lines show shapes
                        shapeSize: p.random(8, 20),
                        shapeSpacing: p.floor(p.random(2, 5)) // How many points between shapes
                    });
                    
                    // Add initial points to line
                    const numPoints = p.floor(p.random(5, 15));
                    const startX = p.random(p.width);
                    const startY = p.random(p.height);
                    
                    for (let j = 0; j < numPoints; j++) {
                        anxietyLines[i].points.push({
                            x: startX + p.random(-50, 50),
                            y: startY + p.random(-50, 50),
                            targetX: p.random(p.width),
                            targetY: p.random(p.height),
                            jitterX: 0,
                            jitterY: 0
                        });
                    }
                }
            }
            
            function drawAnxiety() {
                // White background with slight fade
                p.background(255);
                
                // Draw and update anxiety lines
                for (let line of anxietyLines) {
                    p.noFill();
                    p.stroke(line.color);
                    p.strokeWeight(line.weight);
                    
                    // First draw the shapes if this line shows them
                    if (line.showShapes) {
                        p.noStroke();
                        p.fill(line.color);
                        
                        for (let j = 0; j < line.points.length; j += line.shapeSpacing) {
                            let point = line.points[j];
                            
                            // Apply jitter to shape positions too
                            let shapeX = point.x + p.random(-line.jitterAmount, line.jitterAmount);
                            let shapeY = point.y + p.random(-line.jitterAmount, line.jitterAmount);
                            
                            // Draw the user's selected shape
                            drawShape(shapeX, shapeY, line.shapeSize, shape);
                        }
                    }
                    
                    // Then draw line connecting all points
                    p.noFill();
                    p.stroke(line.color);
                    p.beginShape();
                    for (let point of line.points) {
                        // Apply jitter
                        point.jitterX = p.random(-line.jitterAmount, line.jitterAmount);
                        point.jitterY = p.random(-line.jitterAmount, line.jitterAmount);
                        
                        // Move toward target
                        point.x += (point.targetX - point.x) * 0.005 * line.speed;
                        point.y += (point.targetY - point.y) * 0.005 * line.speed;
                        
                        // Add vertex with jitter
                        p.vertex(point.x + point.jitterX, point.y + point.jitterY);
                        
                        // If near target, set new target
                        if (p.dist(point.x, point.y, point.targetX, point.targetY) < 20 && p.random() < 0.01) {
                            point.targetX = p.random(p.width);
                            point.targetY = p.random(p.height);
                        }
                    }
                    p.endShape();
                }
                
                // Periodically add more lines
                if (p.random() < 0.01 && anxietyLines.length < 20) {
                    // Add just one line with shapes instead of calling all of setupAnxiety()
                    const newLine = {
                        points: [],
                        weight: p.random(1, 3),
                        jitterAmount: p.random(2, 8),
                        speed: p.random(1, 3),
                        color: color,
                        showShapes: p.random() < 0.7,
                        shapeSize: p.random(8, 20),
                        shapeSpacing: p.floor(p.random(2, 5))
                    };
                    
                    // Add initial points to the new line
                    const numPoints = p.floor(p.random(5, 15));
                    const startX = p.random(p.width);
                    const startY = p.random(p.height);
                    
                    for (let j = 0; j < numPoints; j++) {
                        newLine.points.push({
                            x: startX + p.random(-50, 50),
                            y: startY + p.random(-50, 50),
                            targetX: p.random(p.width),
                            targetY: p.random(p.height),
                            jitterX: 0,
                            jitterY: 0
                        });
                    }
                    
                    anxietyLines.push(newLine);
                }
            }
            
            // SUBDUED EMOTIONS: Fading, minimal, foggy
            function setupSubdued() {
                // Create floating subdued particles
                for (let i = 0; i < numFloatingParticles; i++) {
                    particles.push({
                        x: p.random(p.width),
                        y: p.random(p.height),
                        size: p.random(30, 100),
                        opacity: p.random(0.1, 0.3),
                        speedX: p.random(-0.2, 0.2),
                        speedY: p.random(-0.1, 0.1),
                        fadeSpeed: p.random(0.001, 0.003),
                        growing: p.random() > 0.5
                    });
                }
            }
            
            function drawSubdued() {
                // Clear with heavily faded background
                p.background(255, 255, 255, 0.05);
                
                // Draw the foggy particles
                for (let i = particles.length - 1; i >= 0; i--) {
                    let particle = particles[i];
                    
                    p.noStroke();
                    // Create proper color with transparency
                    const particleColor = p.color(color);
                    particleColor.setAlpha(particle.opacity * 255);
                    p.fill(particleColor);
                    
                    // Draw with blur effect
                    for (let j = 0; j < 3; j++) {
                        const blurColor = p.color(color);
                        blurColor.setAlpha((particle.opacity / (j+2)) * 255);
                        p.fill(blurColor);
                        drawShape(particle.x, particle.y, particle.size + j*8, shape);
                    }
                    
                    // Update position very slowly
                    particle.x += particle.speedX;
                    particle.y += particle.speedY;
                    
                    // Fade in and out
                    if (particle.growing) {
                        particle.opacity += particle.fadeSpeed;
                        if (particle.opacity > 0.3) {
                            particle.growing = false;
                        }
                    } else {
                        particle.opacity -= particle.fadeSpeed;
                        if (particle.opacity < 0.1) {
                            particle.growing = true;
                        }
                    }
                    
                    // Wrap around edges
                    if (particle.x < -particle.size) particle.x = p.width + particle.size;
                    if (particle.x > p.width + particle.size) particle.x = -particle.size;
                    if (particle.y < -particle.size) particle.y = p.height + particle.size;
                    if (particle.y > p.height + particle.size) particle.y = -particle.size;
                }
            }
            
            // CONFUSION EMOTIONS: Spiral chaos
            function setupConfusion() {
                // Setup spiral points
                const numSpirals = p.floor(p.random(3, 6));
                for (let i = 0; i < numSpirals; i++) {
                    spiralPoints.push({
                        centerX: p.random(p.width),
                        centerY: p.random(p.height),
                        angle: 0,
                        radius: 0,
                        growSpeed: p.random(0.1, 0.3),
                        rotationSpeed: p.random(0.05, 0.1) * (p.random() > 0.5 ? 1 : -1),
                        maxRadius: p.random(100, 200),
                        points: [],
                        color: color
                    });
                }
            }
            
            function drawConfusion() {
                // Fade background
                p.background(255, 255, 255, 0.1);
                
                // Update and draw spirals
                for (let i = spiralPoints.length - 1; i >= 0; i--) {
                    let spiral = spiralPoints[i];
                    
                    // Grow spiral
                    spiral.angle += spiral.rotationSpeed;
                    spiral.radius += spiral.growSpeed;
                    
                    // Add new point
                    if (spiral.radius < spiral.maxRadius) {
                        let x = spiral.centerX + p.cos(spiral.angle) * spiral.radius;
                        let y = spiral.centerY + p.sin(spiral.angle) * spiral.radius;
                        
                        spiral.points.push({
                            x: x,
                            y: y,
                            size: p.map(spiral.radius, 0, spiral.maxRadius, 15, 5),
                            opacity: p.map(spiral.radius, 0, spiral.maxRadius, 1, 0.3)
                        });
                    }
                    
                    // Draw all points
                    for (let j = spiral.points.length - 1; j >= 0; j--) {
                        let point = spiral.points[j];
                        
                        p.noStroke();
                        // Create proper color with transparency
                        const pointColor = p.color(spiral.color);
                        pointColor.setAlpha(point.opacity * 255);
                        p.fill(pointColor);
                        
                        // Draw the shape
                        p.push();
                        p.translate(point.x, point.y);
                        p.rotate(j * 0.1); // Rotate shapes along spiral
                        drawShape(0, 0, point.size, shape);
                        p.pop();
                        
                        // Fade points
                        point.opacity -= 0.003;
                        
                        // Remove faded points
                        if (point.opacity <= 0) {
                            spiral.points.splice(j, 1);
                        }
                    }
                    
                    // Remove completed spirals
                    if (spiral.radius >= spiral.maxRadius && spiral.points.length === 0) {
                        spiralPoints.splice(i, 1);
                        
                        // Add new spiral
                        if (p.random() < 0.8) {
                            spiralPoints.push({
                                centerX: p.random(p.width),
                                centerY: p.random(p.height),
                                angle: 0,
                                radius: 0,
                                growSpeed: p.random(0.1, 0.3),
                                rotationSpeed: p.random(0.05, 0.1) * (p.random() > 0.5 ? 1 : -1),
                                maxRadius: p.random(100, 200),
                                points: [],
                                color: spiral.color
                            });
                        }
                    }
                }
                
                // Ensure we always have spirals
                if (spiralPoints.length === 0) {
                    setupConfusion();
                }
            }
            
            // Utility function to draw shapes based on selected shape
            function drawShape(x, y, size, shapeType) {
                switch(shapeType) {
                    case 'circle':
                        p.ellipse(x, y, size);
                        break;
                    case 'square':
                        p.rect(x - size/2, y - size/2, size, size);
                        break;
                    case 'triangle':
                        p.triangle(
                            x, y - size/2,
                            x - size/2, y + size/2,
                            x + size/2, y + size/2
                        );
                        break;
                    case 'star':
                        drawStar(x, y, size/2, size/4, 5);
                        break;
                    case 'wave':
                        drawWave(x, y, size);
                        break;
                    default:
                        p.ellipse(x, y, size);
                }
            }
            
            // Draw a star shape
            function drawStar(x, y, radius1, radius2, npoints) {
                let angle = p.TWO_PI / npoints;
                let halfAngle = angle / 2.0;
                p.beginShape();
                for (let a = 0; a < p.TWO_PI; a += angle) {
                    let sx = x + p.cos(a) * radius1;
                    let sy = y + p.sin(a) * radius1;
                    p.vertex(sx, sy);
                    sx = x + p.cos(a + halfAngle) * radius2;
                    sy = y + p.sin(a + halfAngle) * radius2;
                    p.vertex(sx, sy);
                }
                p.endShape(p.CLOSE);
            }
            
            // Draw a wave shape
            function drawWave(x, y, size) {
                p.beginShape();
                for (let i = 0; i < p.TWO_PI; i += 0.1) {
                    let xPos = x + p.cos(i) * size/2;
                    let yPos = y + p.sin(i) * size/2;
                    // Add a wavy effect
                    yPos += p.sin(i * 5) * size/10;
                    p.vertex(xPos, yPos);
                }
                p.endShape(p.CLOSE);
            }
            
            // Particle class for default behavior
            function Particle() {
                this.x = p.random(p.width);
                this.y = p.random(p.height);
                this.size = p.random(20, 50);
                this.speed = p.random(1, 2);
                this.direction = p.random(p.TWO_PI);
                this.rotation = 0;
                this.rotationSpeed = p.random(-0.05, 0.05);
                
                this.update = function() {
                    this.x += p.cos(this.direction) * this.speed;
                    this.y += p.sin(this.direction) * this.speed;
                    this.rotation += this.rotationSpeed;
                    
                    if (this.x < 0 || this.x > p.width) {
                        this.direction = p.PI - this.direction;
                    }
                    if (this.y < 0 || this.y > p.height) {
                        this.direction = -this.direction;
                    }
                };
                
                this.display = function() {
                    p.push();
                    p.translate(this.x, this.y);
                    p.rotate(this.rotation);
                    p.fill(color);
                    p.noStroke();
                    
                    drawShape(0, 0, this.size, shape);
                    
                    p.pop();
                };
            }
        });
    }
    
    // Save the visualization as an image
    function saveVisualization() {
        if (p5Instance) {
            p5Instance.save('my-emotion-visualization.png');
        }
    }
    
    // Start over
    function startOver() {
        currentStep = 1;
        selectedEmotion = '';
        colorInput.value = '#7c9885';
        selectedShape = '';
        
        // Reset emotion selections
        emotionOptions.forEach(option => {
            option.classList.remove('selected');
        });
        
        // Reset shape selections
        shapeOptions.forEach(option => {
            option.classList.remove('selected');
        });
        
        // Show the form and hide the visualization
        emotionForm.style.display = 'block';
        visualizationContainer.style.display = 'none';
        
        showCurrentQuestion();
    }
    
    // Attach event listeners
    function attachEventListeners() {
        // Navigation buttons
        nextBtn.addEventListener('click', nextQuestion);
        prevBtn.addEventListener('click', prevQuestion);
        
        // Emotion selection
        emotionOptions.forEach(option => {
            option.addEventListener('click', function() {
                // Remove selected class from all options
                emotionOptions.forEach(opt => opt.classList.remove('selected'));
                
                // Add selected class to clicked option
                this.classList.add('selected');
                
                // Save selected emotion
                selectedEmotion = this.getAttribute('data-emotion');
            });
        });
        
        // Shape selection
        shapeOptions.forEach(option => {
            option.addEventListener('click', function() {
                // Remove selected class from all options
                shapeOptions.forEach(opt => opt.classList.remove('selected'));
                
                // Add selected class to clicked option
                this.classList.add('selected');
                
                // Save selected shape
                selectedShape = this.getAttribute('data-shape');
            });
        });
        
        // Save visualization button
        saveVisualizationBtn.addEventListener('click', saveVisualization);
        
        // Start over button
        startOverBtn.addEventListener('click', startOver);
        
        // Back to home buttons
        if (backToHomeBtn) {
            backToHomeBtn.addEventListener('click', goBackToHome);
        }
        
        if (backFromVizBtn) {
            backFromVizBtn.addEventListener('click', goBackToHome);
        }
    }
    
    // Navigate back to the main therapy room
    function goBackToHome() {
        window.location.href = '../pages/final-project.html';
    }
    
    // Initialize
    init();
}); 