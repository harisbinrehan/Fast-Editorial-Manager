import {
  Accordion as AccordionMUI,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const Accordion = (props) => {
  return (
    <>
      <AccordionMUI>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
        >
          <Typography>{props?.title}</Typography>
        </AccordionSummary>
        <AccordionDetails>{props?.children}</AccordionDetails>
      </AccordionMUI>
    </>
  );
};

export default Accordion;
