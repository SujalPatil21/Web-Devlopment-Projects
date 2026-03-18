document.getElementById("feedbackForm").addEventListener("submit", function(e){

    e.preventDefault();

    // Collect values
    let feedback = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        satisfaction: document.getElementById("satisfaction").value,
        ease: document.getElementById("ease").value,
        rating: document.getElementById("rating").value,
        recommend: document.querySelector('input[name="recommend"]:checked')?.value,
        speed: document.getElementById("speed").value,
        support: document.querySelector('input[name="support"]:checked')?.value,
        likes: document.getElementById("likes").value,
        issues: document.getElementById("issues").value,
        improvements: document.getElementById("improvements").value,
        reuse: document.getElementById("reuse").value,
        message: document.getElementById("message").value
    };

    // Validation (don’t skip this)
    if(!feedback.recommend || !feedback.support){
        alert("Please answer all required radio questions");
        return;
    }

    // Store in localStorage
    let allFeedback = JSON.parse(localStorage.getItem("feedbackData")) || [];
    allFeedback.push(feedback);
    localStorage.setItem("feedbackData", JSON.stringify(allFeedback));

    // Debug: see data in console
    console.log(feedback);

    // Success message
    alert("Feedback submitted successfully, " + feedback.name);

    // Reset form
    document.getElementById("feedbackForm").reset();
});