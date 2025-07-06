console.log('title-changer');

// Store the original title
let originalTitle = document.title;
let isBackgrounded = false;
let intervalId: number | null = null;

// Emojis to alternate between
const emojis = ['🖖', '🖐️'];
let currentEmojiIndex = 0;

// Function to update title with emoji
function updateTitleWithEmoji() {
  if (isBackgrounded) {
    document.title = `${emojis[currentEmojiIndex]} ${originalTitle}`;
    currentEmojiIndex = (currentEmojiIndex + 1) % emojis.length;
  }
}

// Function to handle visibility change
function handleVisibilityChange() {
  if (document.hidden) {
    // Tab became backgrounded
    isBackgrounded = true;
    originalTitle = document.title;
    currentEmojiIndex = 0;
    
    // Start alternating emojis
    intervalId = window.setInterval(updateTitleWithEmoji, 200);
    updateTitleWithEmoji(); // Update immediately
  } else {
    // Tab became foregrounded
    isBackgrounded = false;
    
    // Stop the interval and restore original title
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    document.title = originalTitle;
  }
}

// Add event listener for visibility change
document.addEventListener('visibilitychange', handleVisibilityChange);
