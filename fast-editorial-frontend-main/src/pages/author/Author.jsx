import {
  Box,
  CssBaseline,
  Toolbar,
  Card,
  Typography,
  Button,
  Grid,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import Accordion from "../../components/Accordian.component/Accordion";

const Author = () => {


  return (
    <>
      <Box sx={{ display: "flex", ml: { md: "290px" } }}>
        <CssBaseline />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
          <Grid container>
            <Grid item xs={8} sx={{ px: 1 }}>
              <Accordion title="New Submission">
                <Grid container spacing={1}>
                  <Grid item md={12} sm={12} xs={12}>
                    {/* resusable make a component of a grid item and pass all the buttons with name */}
                    <RouterLink
                      to="/Author/Stepper"
                      style={{ textDecoration: "none" }}>
                      <Button color="secondary" variant="outlined">
                        Submit New Manuscript
                      </Button>
                    </RouterLink>
                  </Grid>
                  <Grid item md={12} sm={12} xs={12}>
                    <RouterLink
                      to="/Author/incomplete-submission"
                      style={{ textDecoration: "none" }}>
                      <Button color="secondary" variant="outlined">
                        Incomplete Submission
                      </Button>
                    </RouterLink>
                  </Grid>
                  {/* <Grid item md={12} sm={12} xs={12}>
                    <Button color="secondary" variant="outlined">
                      Submission in Process
                    </Button>
                  </Grid> */}
                </Grid>
              </Accordion>
              <Accordion title="Review">
                <Grid container spacing={1}>
                  <Grid item md={12} sm={12} xs={12}>
                    {/* resusable make a component of a grid item and pass all the buttons with name */}
                    <RouterLink
                      to="/Author/Submissions-Needing-Revision"
                      style={{ textDecoration: "none" }}>
                      <Button color="error" variant="outlined">
                        Submissions Needing Revision
                      </Button>
                    </RouterLink>
                  </Grid>
                  <Grid item md={12} sm={12} xs={12}>
                    <RouterLink
                      to="/Author/Revisions-Being-Processed"
                      style={{ textDecoration: "none" }}>
                      <Button color="error" variant="outlined">
                        Revisions being Processed
                      </Button>
                    </RouterLink>
                  </Grid>
                  <Grid item md={12} sm={12} xs={12}>
                    <RouterLink
                      to="/Author/Declined-Manuscripts"
                      style={{ textDecoration: "none" }}>
                      <Button color="error" variant="outlined">

                        Declined Manuscripts
                      </Button>
                    </RouterLink>
                  </Grid>
                </Grid>
              </Accordion>
              <Accordion title="Completed">
                <Grid container spacing={1}>
                  <Grid item md={12} sm={12} xs={12}>
                    {/* resusable make a component of a grid item and pass all the buttons with name */}
                    <RouterLink
                      to="/Author/Submissions-with-Decision"
                      style={{ textDecoration: "none" }}>
                      <Button color="success" variant="outlined">
                        Submissions with Decision
                      </Button>
                    </RouterLink>
                  </Grid>
                  <Grid item md={12} sm={12} xs={12}>
                    <RouterLink
                      to="/Author/Completed-Submission"
                      style={{ textDecoration: "none" }}>
                      <Button color="success" variant="outlined">
                        Completed Submissions
                      </Button>
                    </RouterLink>
                  </Grid>
                </Grid>
              </Accordion>
            </Grid>
            <Grid item xs={4} sx={{ px: 1 }}>
              <Card elevation={3} sx={{ padding: "10px" }}>
                <Typography variant="h6" textAlign={"center"} color="#1565C0">
                  Author's Guide
                </Typography>
                <Typography variant="body">
                  In the Editorial Manager, authors have several responsibilities and options to manage their submissions. Key tasks and features include:
                  <ul>
                    <li>Submitting manuscripts by clicking on the "Submit New Manuscript" button and providing the necessary files and general information about the research article.</li>
                    <li>Recommending reviewers to help the editorial team find suitable experts for evaluating the manuscript.</li>
                    <li>Adding additional comments to facilitate the revision process and improve the manuscript.</li>
                    <li>Tracking the status of their submissions, including incomplete submissions, revisions under processing, and completed submissions.</li>
                    <li>Keeping track of changes and revisions made to their manuscript during the review process.</li>
                    <li>Communicating with the editorial team and reviewers as needed to address any questions or concerns about the manuscript.</li>
                    <li>Using the "Completed Submissions" section to review the final versions of accepted manuscripts and their publication status.</li>
                  </ul>
                  As an author, you play a crucial role in advancing scientific knowledge and contributing to the research community through your work. The Editorial Manager helps you manage your submissions and stay informed about their progress throughout the publication process.
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default Author;
