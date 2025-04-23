console.log('JavaScript is working!');

// Add your JavaScript code here 

let stars = [];
const numStars = 200;
let shootingStars = [];
let lastShootingStar = 0;
const shootingStarInterval = 3000; // milliseconds between shooting stars

function setup() {
    const canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('canvas-container');
    
    // Create stars
    for (let i = 0; i < numStars; i++) {
        stars.push({
            x: random(width),
            y: random(height),
            size: random(1, 3),
            brightness: random(100, 255),
            twinkleSpeed: random(0.1, 0.3),
            speed: random(0.1, 0.5),
            originalX: random(width),
            twinklePattern: random(1) > 0.7 ? 'dramatic' : 'subtle',
            color: random(1) > 0.8 ? color(255, 200, 200) : color(255)
        });
    }
}

function createShootingStar() {
    // Random edge selection (0: top, 1: right, 2: bottom, 3: left)
    const edge = floor(random(4));
    let startX, startY, angle;
    
    // Set starting position and angle based on edge
    switch(edge) {
        case 0: // Top edge
            startX = random(width);
            startY = 0;
            angle = random(PI/4, 3*PI/4); // 45 to 135 degrees
            break;
        case 1: // Right edge
            startX = width;
            startY = random(height);
            angle = random(3*PI/4, 5*PI/4); // 135 to 225 degrees
            break;
        case 2: // Bottom edge
            startX = random(width);
            startY = height;
            angle = random(5*PI/4, 7*PI/4); // 225 to 315 degrees
            break;
        case 3: // Left edge
            startX = 0;
            startY = random(height);
            angle = random(7*PI/4, 9*PI/4) % TWO_PI; // 315 to 45 degrees
            break;
    }
    
    shootingStars.push({
        x: startX,
        y: startY,
        speed: random(5, 10),
        angle: angle,
        trail: [],
        maxTrailLength: 20,
        brightness: 255
    });
}

function draw() {
    background(0, 0, 30);
    
    // Check if it's time for a new shooting star
    if (millis() - lastShootingStar > shootingStarInterval) {
        createShootingStar();
        lastShootingStar = millis();
    }
    
    // Update and draw shooting stars
    for (let i = shootingStars.length - 1; i >= 0; i--) {
        let star = shootingStars[i];
        
        // Update position
        star.x += cos(star.angle) * star.speed;
        star.y += sin(star.angle) * star.speed;
        
        // Add current position to trail
        star.trail.push({x: star.x, y: star.y});
        if (star.trail.length > star.maxTrailLength) {
            star.trail.shift();
        }
        
        // Draw trail
        for (let j = 0; j < star.trail.length; j++) {
            let pos = star.trail[j];
            let alpha = map(j, 0, star.trail.length, 255, 0);
            stroke(255, alpha);
            strokeWeight(2);
            if (j > 0) {
                let prevPos = star.trail[j-1];
                line(prevPos.x, prevPos.y, pos.x, pos.y);
            }
        }
        
        // Draw head
        noStroke();
        fill(255, star.brightness);
        ellipse(star.x, star.y, 4);
        
        // Remove if off screen
        if (star.y > height + 50 || star.y < -50 || star.x > width + 50 || star.x < -50) {
            shootingStars.splice(i, 1);
        }
    }
    
    // Draw and update regular stars
    for (let star of stars) {
        // Enhanced twinkle effect
        if (star.twinklePattern === 'dramatic') {
            star.brightness += random(-0.5, 0.5);
            star.brightness = constrain(star.brightness, 30, 255);
        } else {
            star.brightness += random(-star.twinkleSpeed, star.twinkleSpeed);
            star.brightness = constrain(star.brightness, 100, 255);
        }
        
        // Move stars
        star.x += star.speed;
        if (star.x > width) {
            star.x = 0;
        }
        
        // Draw star with enhanced glow
        let starColor = star.color;
        starColor.setAlpha(star.brightness);
        fill(starColor);
        noStroke();
        
        // Dynamic glow based on brightness
        let glowSize = map(star.brightness, 30, 255, 10, 30);
        drawingContext.shadowBlur = glowSize;
        drawingContext.shadowColor = starColor;
        
        // Draw the star
        ellipse(star.x, star.y, star.size);
        
        // Add pulsing effect for dramatic twinklers
        if (star.twinklePattern === 'dramatic') {
            let pulseSize = map(sin(frameCount * 0.1), -1, 1, 0.8, 1.2);
            ellipse(star.x, star.y, star.size * pulseSize);
        }
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
} 