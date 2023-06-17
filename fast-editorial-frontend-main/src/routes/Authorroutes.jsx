import React from 'react'
import {
  BrowserRouter,
  Route,
  Routes,
  Link,
  useLocation,
} from "react-router-dom";
import DrawerMain from '../components/Drawer.component/Drawer.main';
import Author from '../pages/author/Author';
const Authorroutes = ({ mobileOpen, handleDrawerToggle }) => {
  return (
    <Route
      path="/Author"
      component={
        <DrawerMain
          handleDrawerToggle={handleDrawerToggle}
          mobileOpen={mobileOpen}
        />
      }>
      <Route path="/Author/main" component={Author} />
    </Route>
  );
};
export default Authorroutes