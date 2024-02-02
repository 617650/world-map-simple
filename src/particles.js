export class Particle {
    constructor (coordinates, context, startIndex = 0){
        this.coordinates = coordinates; // Array of canvas coordinates [x, y]
        this.context = context; // Canvas context to draw
        this.context.globalCompositeOperation = 'hard-light'; // source-over, hard-light, luminosity are good, difference has a cool background
        this.currentIndex = startIndex; // Current index in the coordinates array
        this.dragLength = 1; // Number of points to skip
        this.totalDistance = this.calculateTotalDistance(); // Total distance of the path
        this.speed = 1; // Speed of the particle
        this.radius = 1.5; // Size of the particle
    }

    calculateTotalDistance() {
        let totalDistance = 0;
        for (let i = 0; i < this.coordinates.length - 1; i++) {
            const [x1, y1] = this.coordinates[i];
            const [x2, y2] = this.coordinates[i + 1];
            totalDistance += Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
        }
        return totalDistance;
    }

    update() {
        // Move to the next point based on the speed and total distance
        const distancePerIndex = this.totalDistance / this.coordinates.length;
        const indexIncrement = this.speed / distancePerIndex;
        this.currentIndex += indexIncrement;

        // Loop back to the start if we reach the end
        if (this.currentIndex >= this.coordinates.length) {
            this.currentIndex -= this.coordinates.length;
        }
    }

    draw() {
        // Calculate the current and tail positions
        const currentPos = this.coordinates[Math.floor(this.currentIndex)];
        const tailPos = this.coordinates[Math.max(0, Math.floor(this.currentIndex - this.dragLength))];

        // Create a gradient for the particle stroke (glow effect)
        const gradient = this.context.createRadialGradient(currentPos[0], currentPos[1], 0, currentPos[0], currentPos[1], 3);
        // Color #1
        gradient.addColorStop(0, 'rgba(115, 103, 255, 1)');  // Inner color
        gradient.addColorStop(1, 'rgba(115, 103, 255, 0)');  // Outer color
        // Color #2
        gradient.addColorStop(0, 'rgba(255, 103, 103, 1)');  // Inner color
        gradient.addColorStop(1, 'rgba(255, 103, 103, 0)');  // Outer color

        // Draw a line from the tail position to the current position
        this.context.beginPath();
        this.context.moveTo(tailPos[0], tailPos[1]);
        this.context.lineTo(currentPos[0], currentPos[1]);
        this.context.strokeStyle = gradient; // Use the gradient for the stroke
        this.context.lineWidth = 1.5; // Adjust line width as needed
        this.context.stroke();

        // Draw the head of the particle
        this.context.beginPath();
        this.context.arc(currentPos[0], currentPos[1], 3, 0, Math.PI * 2);
        // Color #1
        this.context.fillStyle = '#7367FF'; // Adjust color as needed
        this.context.shadowColor = '#7367FF'; // Shadow color (same as particle color for glow effect)
        // Color #2
        this.context.fillStyle = '#FF6767'; 
        this.context.shadowColor = '#FF6767'; 
        this.context.shadowBlur = 5; // Glow effect size
        this.context.fill();
    }
}

export function animateParticles(paths, context){
    // Create multiple particles for each path with different start indices
    let particles = [];
    const particlesPerPath = 1; // Number of particles per path
    paths.forEach(coordinates => {
        for(let i = 0; i < particlesPerPath; i++){
            let startIndex = (coordinates.length / particlesPerPath) * i;
            particles.push(new Particle(coordinates, context, startIndex)); 
        }
    });
    
    function animate() {
        context.fillStyle = 'rgba(255, 255, 255, 0.05)';
        //context.fillStyle = 'rgba(0, 0, 0, 0.05)';
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);

        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        requestAnimationFrame(animate);
    }  
    
    animate();
}