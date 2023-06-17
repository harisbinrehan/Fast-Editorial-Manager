import {
  Box,
  CssBaseline,
  Toolbar,
  Card,
  Typography,
  Button,
  CardContent,
  CardActions,
  Grid,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const Editor = () => {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Box sx={{ display: "flex", ml: { md: "285px" } }}>
      <CssBaseline />
      <Box component="main" sx={{ flexGrow: 1, p: 3, pr: isSm ? '5px' : "15px", pl: "10px" }}>
        <Toolbar />
        <Grid container>
          <Grid container item xs={8} justifyContent={"space-evenly"} spacing={0} sx={{ marginBottom: '0px', maxHeight: "370px" }} >
            <Grid item md={5.5} sm={5.5} xs={11.5} sx={{ display: 'flex', maxHeight: isSm ? "240px" : "auto", marginBottom: '0px' }}>

              <Card
                sx={{
                  // maxWidth: 345,
                  marginBottom: "10px",
                  backgroundImage:
                    "linear-gradient(to bottom,#dad4ec,#f3e7e9)",
                  padding: isSm ? "0px" : "7px",

                }}>
                {/* <CardMedia
                        sx={{ height: 100 }}
                        image={paper}
                        title="green iguana"
                    /> */}
                <CardContent sx={{ py: "10px" }}>
                  <Typography gutterBottom variant="h5" component="div">
                    New Submissions
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Please click on the button to see all the requests. The
                    requests are sent to you by Editors You are able to Accept or
                    Decline the Pending Requests.
                  </Typography>
                </CardContent>
                <CardActions sx={{ py: "0px", pb: "3px" }}>
                  {/* <Button size="small">Share</Button> */}
                  <RouterLink
                    to="/Editor/NewSubmission"
                    style={{ textDecoration: "none" }}>
                    <Button size={isSm ? "small" : "large"}>
                      Click to see all the requests
                    </Button>
                  </RouterLink>
                </CardActions>
              </Card>
            </Grid>
            <Grid item md={5.5} sm={5.5} xs={11.5} sx={{ display: 'flex', maxHeight: isSm ? "240px" : "auto", marginBottom: '0px' }}>

              <Card
                sx={{
                  // maxWidth: 345,
                  marginBottom: "10px",
                  backgroundImage:
                    "linear-gradient(to bottom,#dad4ec,#f3e7e9)",
                  padding: isSm ? "0px" : "7px",
                }}>
                {/* <CardMedia
                        sx={{ height: 100 }}
                        image={paper}
                        title="green iguana"
                    /> */}
                <CardContent sx={{ py: "10px" }}>
                  <Typography gutterBottom variant="h5" component="div">
                    Assign Reviewers
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Please click on the button to see all the requests. The
                    requests are sent to you by Editors You are able to Accept or
                    Decline the Pending Requests.
                  </Typography>
                </CardContent>
                <CardActions sx={{ py: "0px", pb: "3px" }}>
                  {/* <Button size="small">Share</Button> */}
                  <RouterLink
                    to="/Editor/AssignReviewers"
                    style={{ textDecoration: "none" }}>
                    <Button size={isSm ? "small" : "large"}>
                      Click to see all the requests
                    </Button>
                  </RouterLink>
                </CardActions>
              </Card>
            </Grid>
            <Grid item md={5.5} sm={5.5} xs={11.5} sx={{ display: 'flex', maxHeight: isSm ? "240px" : "auto", marginBottom: '0px' }}>

              <Card
                sx={{
                  // maxWidth: 345,
                  marginBottom: "10px",
                  backgroundImage:
                    "linear-gradient(to bottom,#dad4ec,#f3e7e9)",
                  padding: isSm ? "0px" : "7px",
                }}>
                {/* <CardMedia
                        sx={{ height: 100 }}
                        image={paper}
                        title="green iguana"
                    /> */}
                <CardContent sx={{ py: "10px" }}>
                  <Typography gutterBottom variant="h5" component="div">
                    Pending Decisions
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Please click on the button to see all the requests. The
                    requests are sent to you by Editors You are able to Accept or
                    Decline the Pending Requests.
                  </Typography>
                </CardContent>
                <CardActions sx={{ py: "0px", pb: "3px" }}>
                  {/* <Button size="small">Share</Button> */}
                  <RouterLink
                    to="/Editor/PendingDecisions"
                    style={{ textDecoration: "none" }}>
                    <Button size={isSm ? "small" : "large"}>
                      Click to see all the requests
                    </Button>
                  </RouterLink>
                </CardActions>
              </Card>
            </Grid>
            <Grid item md={5.5} sm={5.5} xs={11.5} sx={{ display: 'flex', maxHeight: isSm ? "240px" : "auto", marginBottom: '0px' }}>

              <Card
                sx={{
                  // maxWidth: 345,
                  marginBottom: "10px",
                  backgroundImage:
                    "linear-gradient(to bottom,#dad4ec,#f3e7e9)",
                  padding: isSm ? "0px" : "7px",
                }}>
                {/* <CardMedia
                        sx={{ height: 100 }}
                        image={paper}
                        title="green iguana"
                    /> */}
                <CardContent sx={{ py: "10px" }}>
                  <Typography gutterBottom variant="h5" component="div">
                    Re-Submitted Papers
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Please click on the button to see all the requests. The
                    requests are sent to you by Editors You are able to Accept or
                    Decline the Pending Requests.
                  </Typography>
                </CardContent>
                <CardActions sx={{ py: "0px", pb: "3px" }}>
                  {/* <Button size="small">Share</Button> */}
                  <RouterLink
                    to="/Editor/ReSubmitted"
                    style={{ textDecoration: "none" }}>
                    <Button size={isSm ? "small" : "large"}>
                      Click to see all the requests
                    </Button>
                  </RouterLink>
                </CardActions>
              </Card>
            </Grid>
            <Grid item md={5.5} sm={5.5} xs={11.5} sx={{ display: 'flex', maxHeight: isSm ? "240px" : "auto", marginBottom: '0px' }}>

              <Card
                sx={{
                  // maxWidth: 345,
                  marginBottom: "10px",
                  backgroundImage:
                    "linear-gradient(to bottom,#dad4ec,#f3e7e9)",
                  padding: isSm ? "0px" : "7px",
                }}>
                {/* <CardMedia
                        sx={{ height: 100 }}
                        image={paper}
                        title="green iguana"
                    /> */}
                <CardContent sx={{ py: "10px" }}>
                  <Typography gutterBottom variant="h5" component="div">
                    Final Decisions
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Please click on the button to see all the requests. The
                    requests are sent to you by Editors You are able to Accept or
                    Decline the Pending Requests.
                  </Typography>
                </CardContent>
                <CardActions sx={{ py: "0px", pb: "3px" }}>
                  {/* <Button size="small">Share</Button> */}
                  <RouterLink
                    to="/Editor/FinalDecisions"
                    style={{ textDecoration: "none" }}>
                    <Button size={isSm ? "small" : "large"}>
                      Click to see all the requests
                    </Button>
                  </RouterLink>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
          <Grid item xs={4} md={4} sm={4}
          // sx={{ pl: 1 }}
          >
            <Card elevation={3} sx={{
              padding: "10px", backgroundImage:
                "linear-gradient(to bottom,#dad4ec,#f3e7e9)",
            }}>
              <Typography variant="h6" textAlign={"center"} color="#1565C0">
                Editor's Guide
              </Typography>
              <Typography variant="body">
                <ul>
                  <li>
                    <strong>New Submissions:</strong> Review new manuscript submissions
                    by authors. Check for completeness, relevance, and adherence to
                    journal guidelines.
                  </li>
                  <li>
                    <strong>Assign Manuscripts to Reviewers:</strong> Identify and
                    invite suitable reviewers for each manuscript, considering their
                    expertise, availability, and potential conflicts of interest.
                  </li>
                  <li>
                    <strong>Pending Reviews:</strong> Monitor the progress of
                    manuscripts under review. Send reminders to reviewers, if necessary,
                    and keep authors informed about the status of their submissions.
                  </li>
                  <li>
                    <strong>Reviewer Recommendations:</strong> Review the feedback and
                    recommendations provided by reviewers. This input will help you make
                    informed decisions about the manuscripts.
                  </li>
                  <li>
                    <strong>Final Decision by Editor:</strong> Based on the
                    reviewers' feedback and your assessment, decide whether to accept,
                    reject, or request revisions for each manuscript. Communicate the
                    decision to authors and provide guidance on next steps.
                  </li>
                </ul>
                As an Editor, your role is crucial in ensuring the quality and
                integrity of the published research. Thank you for your valuable
                contribution to the scholarly community.
              </Typography>

            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box >
  );
};
export default Editor;
