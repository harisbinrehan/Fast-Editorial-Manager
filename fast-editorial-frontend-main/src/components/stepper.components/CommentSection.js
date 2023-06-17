import React, { useState, useContext } from "react";
import { Button, Grid } from "@mui/material";
import { ManuscriptContext } from "../../context/Manuscript/Manuscript";
import axios from "axios";
const saveCommentToDatabase = async (manuscriptId, comment) => {
  try {
    const response = await axios.put(
      'http://localhost:8000/author/additional-comments',
      {
        manuscriptId: manuscriptId,
        additionalComments: comment,
      }
    );
    console.log(response.data);
  } catch (error) {
    console.error('Error saving comment:', error);
  }
};
function CommentSection() {
  const { comments, setComments, manuscriptId } = useContext(ManuscriptContext);
  console.log('comments', comments);
  // Function to handle adding a new comment
  const handleSubmit = (event) => {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Get the value of the textarea element
    const newComment = event.target.elements.comment.value;
    if (newComment.trim() !== "") {
      // Add the new comment to the list of comments
      setComments([...comments, newComment]);
      saveCommentToDatabase(manuscriptId, newComment);

      // Clear the textarea
      event.target.elements.comment.value = "";
    }
    // Add the new comment to the list of comments

    // Clear the textarea
    // event.target.elements.comment.value = "";
  };

  return (
    <div className="container my-3">
      <div
        className="comment-section bg-light"
        style={{ backgroundColor: "#ADD8E6", width: "100%", height: "100%" }}>
        <h3 className="text-center">
          Add Additional Comments for your Document
        </h3>
        {/* Render the list of comments */}
        <ul className="list-unstyled">
          {comments.map((comment, index) => (
            <li key={index}>{comment}</li>
          ))}
        </ul>
        {/* Form for adding a new comment */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <textarea className="form-control" name="comment" rows="8" />
          </div>
          {/* <button type="submit" className="btn btn-primary my-3">
            Add Comment
          </button> */}
          <Grid container justifyContent={"center"} margin={2}>
            <Button type="submit" variant="contained">
              Add Comment
            </Button>
          </Grid>
        </form>
      </div>
    </div>
  );
}
export default CommentSection;
