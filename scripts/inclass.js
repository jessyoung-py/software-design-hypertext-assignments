console.log('In-class exercise JavaScript file loaded'); 

// Function to process CSV data and create word cloud
async function createWordCloud() {
    try {
        console.log('Starting to create word cloud...');
        
        // Fetch the CSV file
        const response = await fetch('../assets/data/311sample.csv');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const csvText = await response.text();
        const rows = csvText.split('\n');
        const headers = rows[0].split(',');
        const descriptorIndex = headers.indexOf('Descriptor');
        
        if (descriptorIndex === -1) {
            throw new Error('Descriptor column not found in CSV');
        }
        
        // Count word frequencies
        const wordCount = {};
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i].split(',');
            if (row[descriptorIndex]) {
                const words = row[descriptorIndex].toLowerCase().split(/\s+/);
                words.forEach(word => {
                    if (word.length > 3) { // Only include words longer than 3 characters
                        wordCount[word] = (wordCount[word] || 0) + 1;
                    }
                });
            }
        }
        
        // Convert to word cloud format and sort by frequency
        const words = Object.entries(wordCount)
            .map(([text, size]) => ({ text, size }))
            .sort((a, b) => b.size - a.size)
            .slice(0, 100); // Limit to top 100 words
        
        // Set up the word cloud layout
        const width = 800;
        const height = 600;
        
        const layout = d3.layout.cloud()
            .size([width, height])
            .words(words)
            .padding(5)
            .rotate(() => 0)  // Set rotation to 0 for all words
            .fontSize(d => Math.sqrt(d.size) * 10)
            .on("end", draw);
        
        // Start the layout calculation
        layout.start();
        
        // Function to draw the word cloud
        function draw(words) {
            const svg = d3.select("#word-cloud")
                .attr("width", width)
                .attr("height", height);
                
            // Clear any existing content
            svg.selectAll("*").remove();
            
            // Create tooltip div if it doesn't exist
            let tooltip = d3.select("body").select(".tooltip-bubble");
            if (tooltip.empty()) {
                tooltip = d3.select("body").append("div")
                    .attr("class", "tooltip-bubble")
                    .style("opacity", 0);
            }
            
            const g = svg.append("g")
                .attr("transform", `translate(${width/2},${height/2})`);
            
            g.selectAll("text")
                .data(words)
                .enter().append("text")
                .attr("class", "word-cloud-text")
                .style("font-size", d => `${d.size}px`)
                .style("fill", d => d.size > 20 ? "#1f77b4" : "#aec7e8")
                .attr("text-anchor", "middle")
                .attr("transform", d => `translate(${d.x},${d.y})rotate(${d.rotate})`)
                .text(d => d.text)
                .on("mouseover", function(event, d) {
                    const [x, y] = d3.pointer(event, document.body);
                    tooltip.transition()
                        .duration(200)
                        .style("opacity", 1);
                    tooltip.html(`"${d.text}": ${d.size} occurrences`)
                        .style("left", (x) + "px")
                        .style("top", (y - 40) + "px");
                })
                .on("mouseout", function() {
                    tooltip.transition()
                        .duration(500)
                        .style("opacity", 0);
                });
        }
        
        console.log('Word cloud created successfully');
    } catch (error) {
        console.error('Error creating word cloud:', error);
        const container = document.getElementById('wordcloud-container');
        if (container) {
            container.innerHTML = `<div style="color: red; text-align: center; padding: 20px;">
                Error loading word cloud: ${error.message}
                <br>
                Check the console for more details.
            </div>`;
        }
    }
}

// Create the word cloud when the page loads
document.addEventListener('DOMContentLoaded', createWordCloud); 