import React from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import createBreakpoints from "@material-ui/core/styles/createBreakpoints";

const breakpoints = createBreakpoints({});
const theme = createMuiTheme({
  overrides: {
    MuiTypography: {
      display4: {
        // fontSize: "5rem",
        [breakpoints.down("xs")]: {
          fontSize: "4rem"
        }
      },
      display1: {
        [breakpoints.down("xs")]: {
          fontSize: "1.5rem"
        }
      }
    }
  }
});

export default props => {
  return (
    <MuiThemeProvider theme={theme}>
      {props.children}
    </MuiThemeProvider>
  )
}