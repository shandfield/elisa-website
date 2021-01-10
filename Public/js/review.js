$(document).ready(function() {
    // reviewContainer holds all of the reviews
    var reviewContainer = $(".review-container");
    var postRatingSelect = $("#rating");
    // Click events for the edit and delete buttons
    $(document).on("click", "button.delete", handleReviewDelete);
    $(document).on("click", "button.edit", handleReviewEdit);
    postRatingSelect.on("change", handleRatingChange);
    var reviews;
  
    // This function grabs reviews from the database and updates the view to show them
    function getReviews(rating) {
      var ratingString = rating || "";
      if (ratingString) {
        ratingString = "/rating/" + ratingString;
      }
      $.get("/api/review" + ratingString, function(data) {
        console.log("Review", data);
        reviews = data;
        if (!reviews || !reviews.length) {
          displayEmpty();
        }
        else {
          initializeRows();
        }
      });
    }
  
    // This function does an API call to delete the review
    function deleteReview(id) {
      $.ajax({
        method: "DELETE",
        url: "/api/review/" + id
      })
        .then(function() {
          getReviews(postRatingSelect.val());
        });
    }
  
    // Getting the initial list of reviews
    getReviews();
    // InitializeRows handles appending all of our constructed post HTML inside the reviewContainer
    function initializeRows() {
      reviewContainer.empty();
      var reviewsToAdd = [];
      for (var i = 0; i < reviews.length; i++) {
        reviewsToAdd.push(createNewRow(reviews[i]));
      }
      reviewContainer.append(reviewsToAdd);
    }
  
    // This function constructs a reviews HTML
    function createNewRow(review) {
      var newReviewCard = $("<div>");
      newReviewCard.addClass("card");
      var newReviewCardHeading = $("<div>");
      newReviewCardHeading.addClass("card-header");
      var deleteBtn = $("<button>");
      deleteBtn.text("x");
      deleteBtn.addClass("delete btn btn-danger");
      var editBtn = $("<button>");
      editBtn.text("EDIT");
      editBtn.addClass("edit btn btn-default");
      var newReviewTitle = $("<h2>");
      var newReviewDate = $("<small>");
      var newReviewRating = $("<h5>");
      newReviewRating.text(review.rating);
      newReviewRating.css({
        float: "right",
        "font-weight": "700",
        "margin-top":
        "-15px"
      });
      var newReviewCardBody = $("<div>");
      newReviewCardBody.addClass("card-body");
      var newReviewBody = $("<p>");
      newReviewTitle.text(post.title + " ");
      newReviewBody.text(post.body);
      var formattedDate = new Date(post.createdAt);
      formattedDate = moment(formattedDate).format("MMMM Do YYYY, h:mm:ss a");
      newReviewDate.text(formattedDate);
      newReviewTitle.append(newReviewDate);
      newReviewCardHeading.append(deleteBtn);
      newReviewCardHeading.append(editBtn);
      newReviewCardHeading.append(newReviewTitle);
      newReviewCardHeading.append(newReviewRating);
      newReviewCardBody.append(newReviewBody);
      newReviewCard.append(newReviewCardHeading);
      newReviewCard.append(newReviewCardBody);
      newReviewCard.data("review", review);
      return newReviewCard;
    }
  
    // This function figures out which review the user wants to delete
      function handleReviewDelete() {
      var currentReview = $(this)
        .parent()
        .parent()
        .data("review");
      deletePost(currentReview.id);
    }
  
    // This function figures out which review to edit and takes the user to the correct HTML
     function handleReviewEdit() {
      var currentReview = $(this)
        .parent()
        .parent()
        .data("review");
      window.location.href = "/cms?post_id=" + currentPost.id;
    }
  
    // This function displays a message when there are no reviews for a certain rating
    function displayEmpty() {
      reviewContainer.empty();
      var messageH2 = $("<h2>");
      messageH2.css({ "text-align": "center", "margin-top": "50px" });
      messageH2.html("No posts yet for this rating.");
      reviewContainer.append(messageH2);
    }
  
    // This function handles reloading new posts when the rating changes
    function handleRatingChange() {
      var newReviewRating = $(this).val();
      getReviews(newReviewRating);
    }
  
  });
  