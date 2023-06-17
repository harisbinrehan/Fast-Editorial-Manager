import React, { useEffect, useContext } from "react";
import { Stepper, Step, StepLabel, Button, Grid } from "@mui/material";
import FillForm from "../../components/stepper.components/FillForm";
import CommentSection from "../../components/stepper.components/CommentSection";
import FileUploader from "../../components/stepper.components/UploadFiles";
import { useState } from "react";
import Reviewpref from "../../components/stepper.components/Review.preferance";
import { ManuscriptContext } from "../../context/Manuscript/Manuscript";
import ReviewSubmission from "../../components/stepper.components/ReviewSubmission";

import { useNavigate } from "react-router-dom";
const MyStepper = () => {
  const [activeStep, setActiveStep] = React.useState(0);
  console.log("step: ", activeStep);
  const steps = ["Upload file", "Fill form", "Recommend Reviewers", "Comments", "Review Submission"];

  const [nextDisable, setNextDisable] = useState(true);
  const { updateData, submitManuscript } = useContext(ManuscriptContext);
  const navigate = useNavigate();
  const handleNext = async () => {
    if (activeStep !== steps.length - 1) {
      console.log('in handlenxt');
      await updateData(activeStep); // Make the API call on every next button click
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else {
      await submitManuscript(); // Call submitManuscript API when the last step is reached
      navigate("/Author/main");
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const handleStepClick = (step) => {
    setActiveStep(step);
  };

  return (
    <div style={{ marginTop: "100px" }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => (
          <Step key={label} onClick={() => handleStepClick(index)}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {activeStep === 0 && (
        <div>
          {/* <FileUploader/> */}
          <FileUploader />
          {/* render file upload component here */}
        </div>
      )}
      {activeStep === 1 && (
        <div>
          {/* render form with five input fields here */}
          <FillForm />
        </div>
      )}
      {activeStep === 2 && (
        <div>
          <Reviewpref />
          {/* render content for step 3 here */}
        </div>
      )}
      {activeStep === 3 && (
        <div>
          <CommentSection />
          {/* render content for step 4 here */}
        </div>
      )}
      {activeStep === 4 && (
        <div>
          <ReviewSubmission />
        </div>
      )}

      <Grid display="flex" margin={3} justifyContent="center">
        <Button disabled={activeStep === 0} onClick={handleBack}>
          Back
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleNext}
          disable={nextDisable}>
          {activeStep === steps.length - 1 ? "Submit" : "Next"}
        </Button>
      </Grid>
    </div>
  );
};
export default MyStepper;
