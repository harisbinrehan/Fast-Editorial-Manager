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

const Reviewer = () => {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Box sx={{ display: "flex", ml: { md: "285px" } }}>
      <CssBaseline />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Grid container>
          <Grid item xs={8} sx={{ px: 1 }}>
            <Card
              sx={{
                // maxWidth: 345,
                marginBottom: "10px",
                backgroundImage:
                  "linear-gradient(to bottom, rgba(200,200,300,.3) 0%, rgba(200,200,300,0) 100%)",
              }}>
              {/* <CardMedia
                      sx={{ height: 100 }}
                      image={paper}
                      title="green iguana"
                    /> */}
              <CardContent sx={{ py: "10px" }}>
                <Typography gutterBottom variant="h5" component="div">
                  New Review Invitations
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
                  to="/Reviewer/NewInvitations"
                  style={{ textDecoration: "none" }}>
                  <Button size={isSm ? "small" : "large"}>
                    Click to see all the requests
                  </Button>
                </RouterLink>
              </CardActions>
            </Card>
            <Card
              sx={{
                // maxWidth: 345,
                marginBottom: "10px",
                backgroundImage:
                  "linear-gradient(to bottom, rgba(200,200,300,.3) 0%, rgba(200,200,300,0) 100%)",
              }}>
              {/* <CardMedia
                      sx={{ height: 100 }}
                      image={paper}
                      title="green iguana"
                    /> */}
              <CardContent sx={{ py: "10px" }}>
                <Typography gutterBottom variant="h5" component="div">
                  Pending Reviews
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
                  to="/Reviewer/PendingReviews"
                  style={{ textDecoration: "none" }}>
                  <Button size={isSm ? "small" : "large"}>
                    Click to see your Pending Reviews
                  </Button>
                </RouterLink>
              </CardActions>
            </Card>
            <Card
              sx={{
                // maxWidth: 345,
                marginBottom: "10px",
                backgroundImage:
                  "linear-gradient(to bottom, rgba(200,200,300,.3) 0%, rgba(200,200,300,0) 100%)",
              }}>
              {/* <CardMedia
                      sx={{ height: 100 }}
                      image={paper}
                      title="green iguana"
                    /> */}
              <CardContent sx={{ py: "10px" }}>
                <Typography gutterBottom variant="h5" component="div">
                  Completed Reviews
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
                  to="/Reviewer/Completed-Reviews"
                  style={{ textDecoration: "none" }}>
                  <Button size={isSm ? "small" : "large"}>
                    Click to see all the requests
                  </Button>
                </RouterLink>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={4} sx={{ pl: 1 }}>
            <Card elevation={3} sx={{
              padding: "10px", backgroundImage:
                "linear-gradient(to bottom, rgba(200,200,300,.3) 0%, rgba(200,200,300,0) 100%)",
            }}>
              <Typography variant="h6" textAlign={"center"} color="#1565C0">
                Reviewer's Guide
              </Typography>
              <Typography variant="body">
                A reviewer in an editorial manager is responsible for evaluating research papers and providing feedback. Their tasks include:

                <ul>
                  <li>Receiving new review invitations and responding with their availability.</li>
                  <li>Reviewing assigned research papers thoroughly and providing constructive feedback.</li>
                  <li>Evaluating the quality, validity, and relevance of the research.</li>
                  <li>Submitting their reviews and recommendations on the paper's acceptance, revision, or rejection.</li>
                  <li>Tracking pending reviews to ensure timely completion.</li>
                  <li>Monitoring completed reviews for reference and record-keeping purposes.</li>
                  <li>Communicating with editors and authors as needed to provide clarification or additional information on their reviews.</li>
                  <li>Maintaining confidentiality and adhering to ethical guidelines during the review process.</li>
                </ul>
                As a reviewer, you play a crucial role in ensuring the quality and integrity of research published in the journal. Your expert opinion and feedback contribute to the improvement of research papers and the overall scientific community.
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};
export default Reviewer;
