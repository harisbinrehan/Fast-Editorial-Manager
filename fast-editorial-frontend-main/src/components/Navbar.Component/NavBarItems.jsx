import {Grid, Box, Button} from '@mui/material'
import {Link as RouterLink} from 'react-router-dom'

const NavBarItems = (props) => {
    return (
        <>
        

            <Box
              {...props}
              alignItems='center'
              sx={{
                  height: 55,
                  marginY: 0.5,
                }}
                >
                {/* <img/> */}
                {/* <Button>{props.title}</Button> */}
                {props.children}
            </Box>
        </>
    )
}

export default NavBarItems