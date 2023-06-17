import React, { useState } from 'react';

function ReviewArticleForm() {
  // Use the useState hook to store the form values in state
  const [formValues, setFormValues] = useState({
    title: '',
    keywords: '',
    content: '',
  });
  // Function to handle form input changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  }

  // Function to handle form submission
  const handleSubmit = (event) => {
    // Prevent the default form submission behavior
    event.preventDefault();
    // Review the form values and send them to the server or do something else with them
    console.log(formValues);
  }

  return (
    <div className='container'>
        <form onSubmit={handleSubmit}>
      <div className="form-group my-3">
        <label htmlFor="title">Article title:</label>
        <input type="text" className="form-control" name="title" value={formValues.title} onChange={handleChange} />
      </div>
      <div className="form-group my-3">
        <label htmlFor="keywords">Keywords:</label>
        <input type="text" className="form-control" name="keywords" value={formValues.keywords} onChange={handleChange} />
      </div>
      <div className="form-group my-3">
        <label htmlFor="content">Article Abstract:</label>
        <textarea className="form-control my-3" name="content" value={formValues.content} onChange={handleChange} />
      </div>
      <button type="submit" className="btn btn-primary my-3">Submit for Review</button>
    </form>
    </div>  
  );
}

export default ReviewArticleForm;