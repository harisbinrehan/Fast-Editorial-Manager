import {Avatar as AvatarMUI, Typography} from "@mui/material"
const Avatar = (props) => {
  return (
    <>
      <AvatarMUI {...props}>
        <Typography variant="h3">
          {props.children}
        </Typography>
      </AvatarMUI>
    </>
  );
}

export default Avatar