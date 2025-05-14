document.addEventListener('DOMContentLoaded', function() {
    // Core animation elements
    const entrance = document.querySelector('.entrance');
    const door = document.querySelector('.door');
    const doorFrame = document.querySelector('.door-frame');
    const therapyRoom = document.querySelector('.therapy-room');
    
    // Check if modal button works independently
    console.log("Door animation script loaded");
    
    // Basic door animation function
    function updateScroll() {
        // Fixed height for predictable scrolling
        const totalScrollHeight = 2000;
        const scrollY = window.scrollY;
        const scrollPercent = (scrollY / totalScrollHeight) * 100;
        
        console.log("Scroll percent: " + scrollPercent);
        
        // Door phase (0-30%)
        if (scrollPercent <= 30) {
            // Door rotation
            const doorRotation = (scrollPercent / 30) * 85;
            door.style.transform = `rotateY(-${doorRotation}deg) translateZ(${doorRotation / 4}px)`;
            
            // Frame scaling
            const frameScale = 1 + (scrollPercent / 30) * 0.2;
            doorFrame.style.transform = `scale(${frameScale}) translateZ(${(frameScale - 1) * 30}px)`;
            
            // Entrance opacity
            entrance.style.opacity = 1;
            
            // Room visibility
            if (doorRotation > 20) {
                therapyRoom.classList.add('visible');
                therapyRoom.style.transform = 'scale(0.7) translateZ(-60px)';
            } else {
                therapyRoom.classList.remove('visible');
            }
        } 
        // Room phase (30-100%)
        else {
            // Door fully open
            door.style.transform = 'rotateY(-85deg) translateZ(21.25px)';
            doorFrame.style.transform = 'scale(1.2) translateZ(6px)';
            
            // Fade entrance
            const entranceOpacity = Math.max(0, 1 - ((scrollPercent - 30) / 30));
            entrance.style.opacity = entranceOpacity;
            
            // Show room
            therapyRoom.classList.add('visible');
            
            // Scale room
            const roomProgress = Math.min(1, (scrollPercent - 30) / 70);
            const roomScale = 0.7 + (roomProgress * 0.3);
            const zTranslate = -60 + (roomProgress * 60);
            
            therapyRoom.style.transform = `scale(${roomScale}) translateZ(${zTranslate}px)`;
        }
    }
    
    // Simpler scroll handler
    window.addEventListener('scroll', function() {
        updateScroll();
    });
    
    // Initial state
    updateScroll();
    
    // Test if DOM events are working
    console.log("Event setup complete");

    // ------------------------------------------------------
    // Journal functionality (separate from the door animation)
    // ------------------------------------------------------
    
    // Create and add the floating journal button to the DOM
    function setupJournalButton() {
        // Check if journal elements already exist
        if (document.getElementById('fixed-journal-container')) return;
        
        // Create journal button
        const journalContainer = document.createElement('div');
        journalContainer.id = 'fixed-journal-container';
        
        const journalIcon = document.createElement('div');
        journalIcon.id = 'journal-icon';
        journalIcon.textContent = '📝';
        
        journalContainer.appendChild(journalIcon);
        document.body.appendChild(journalContainer);
        
        // Create journal modal
        const journalModal = document.createElement('div');
        journalModal.id = 'journal-modal';
        
        const journalContent = document.createElement('div');
        journalContent.id = 'journal-content';
        
        // Add modal content
        journalContent.innerHTML = `
            <h2 id="journal-title">Your Journal Entry</h2>
            <textarea id="journal-text" placeholder="Express your thoughts here..."></textarea>
            <div id="journal-buttons">
                <button id="close-btn" class="journal-btn">Close</button>
                <button id="save-btn" class="journal-btn">Save Entry</button>
            </div>
        `;
        
        journalModal.appendChild(journalContent);
        document.body.appendChild(journalModal);
    }
    
    // Set up the journal functionality
    function setupJournalFunctionality() {
        // Journal elements
        const journalButton = document.getElementById('fixed-journal-container');
        const journalModal = document.getElementById('journal-modal');
        const journalText = document.getElementById('journal-text');
        const saveBtn = document.getElementById('save-btn');
        const closeBtn = document.getElementById('close-btn');
        
        // Open journal modal
        journalButton.addEventListener('click', function() {
            journalModal.style.display = 'flex';
            setTimeout(() => journalText.focus(), 100);
        });
        
        // Close journal modal
        closeBtn.addEventListener('click', function() {
            journalModal.style.display = 'none';
        });
        
        // Save journal entry
        saveBtn.addEventListener('click', function() {
            const text = journalText.value.trim();
            if (text !== '') {
                // Create entry object
                const entry = {
                    text: text,
                    date: new Date().toISOString()
                };
                
                // Get existing entries or create empty array
                const entries = JSON.parse(localStorage.getItem('journalEntries') || '[]');
                
                // Add new entry
                entries.push(entry);
                
                // Save to localStorage
                localStorage.setItem('journalEntries', JSON.stringify(entries));
                
                // Store current entry for the emotion exploration page
                localStorage.setItem('currentJournalEntry', text);
                
                // Redirect to emotion exploration page
                window.location.href = '../pages/emotion-exploration.html';
            }
        });
        
        // Close on outside click
        journalModal.addEventListener('click', function(e) {
            if (e.target === journalModal) {
                journalModal.style.display = 'none';
            }
        });
        
        // Prevent propagation from content
        document.getElementById('journal-content').addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
    
    // Initialize journal components
    setupJournalButton();
    setupJournalFunctionality();
}); 