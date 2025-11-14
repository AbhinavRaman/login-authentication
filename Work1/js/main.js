// Handle review form submission
document.addEventListener('DOMContentLoaded', function() {
    const reviewForm = document.getElementById('reviewForm');
    const reviewCards = document.querySelector('.review-cards');

    reviewForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent form from submitting normally

        // Get form values
        const userName = document.getElementById('userName').value.trim();
        const userReview = document.getElementById('userReview').value.trim();

        // Validate inputs
        if (!userName || !userReview) {
            alert('Please fill in all fields');
            return;
        }

        // Create new review card
        const newCard = document.createElement('div');
        newCard.className = 'card';
        
        // Create review text with quotes
        const reviewText = document.createElement('p');
        reviewText.textContent = `"${userReview}"`;
        
        // Create author name
        const authorName = document.createElement('span');
        authorName.textContent = `- ${userName}`;
        
        // Append elements to card
        newCard.appendChild(reviewText);
        newCard.appendChild(authorName);
        
        // Add animation by inserting at the beginning
        newCard.style.opacity = '0';
        newCard.style.transform = 'translateY(20px)';
        reviewCards.insertBefore(newCard, reviewCards.firstChild);
        
        // Animate in
        setTimeout(() => {
            newCard.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            newCard.style.opacity = '1';
            newCard.style.transform = 'translateY(0)';

            // After animation, remove inline styles so CSS :hover works
            setTimeout(() => {
                newCard.style.transition = '';
                newCard.style.transform = '';
                newCard.style.opacity = '';
            }, 600);
        }, 10);

        // Reset form
        reviewForm.reset();
    });
});