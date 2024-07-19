/*eslint-disable*/
import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import Link from "next/link";
import { useRouter } from "next/router";
import makeStyles from '@mui/styles/makeStyles';
import Drawer from "@mui/material/Drawer";
import Hidden from "@mui/material/Hidden";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Icon from "@mui/material/Icon";
// core components
import AdminNavbarLinks from "components/Navbars/AdminNavbarLinks.js";
import Image from "next/image";

import styles from "assets/jss/nextjs-material-dashboard/components/sidebarStyle.js";

const useStyles = makeStyles(styles);

export default function Sidebar(props) {
  // used for checking current route
  const router = useRouter();
  // creates styles for this component
  const classes = useStyles();
  // verifies if routeName is the one active (in browser input)
  function activeRoute(routeName) {
    return router.route.indexOf(routeName) > -1 ? true : false;
  }
  const { color, logo, image, logoText, routes } = props;
  var links = (
    <List className={classes.list}>
      {routes.map((prop, key) => {
        var activePro = " ";
        var listItemClasses;

        listItemClasses = classNames({
          [" " + classes[color]]: activeRoute(prop.layout + prop.path),
        });

        const whiteFontClasses = classNames({
          [" " + classes.whiteFont]: activeRoute(prop.layout + prop.path),
        });
        return (
          <Link href={prop.layout + prop.path} key={key}>
            <a className={activePro + classes.item}>
              <ListItem button className={classes.itemLink + listItemClasses}>
                {typeof prop.icon === "string" ? (
                  <Icon
                    className={classNames(classes.itemIcon, whiteFontClasses)}
                  >
                    {prop.icon}
                  </Icon>
                ) : (
                  <prop.icon
                    className={classNames(classes.itemIcon, whiteFontClasses)}
                  />
                )}
                <ListItemText
                  primary={prop.name}
                  className={classNames(classes.itemText, whiteFontClasses)}
                  disableTypography={true}
                />
              </ListItem>
            </a>
          </Link>
        );
      })}
    </List>
  );
  var brand = (
    <div className={classes.logo}>
      <a
        // href="https://www.argentina.gob.ar/inta"
        className={classNames(classes.logoLink)}
        target="_blank"
      >
        <div className={classes.logoImage}>
          <img src={logo['src']} alt="logo" className={classes.img} />
        </div>
        {logoText}
      </a>
      <div style={{ display: "flex", marginTop: 20 }}>
        <Image
          src="/inta-logo.png"
          alt="logo inta"
          width={120}
          height={64}
          className={{
            flex: "auto",
          }}
          onClick={() =>
            window.open("https://www.argentina.gob.ar/inta", "_blank")
          }
        />
        <Image
          src="/dcic-logo.png"
          alt="logo dcic"
          width={121}
          height={64}
          className={{
            flex: "auto",
          }}
          onClick={() => window.open("https://cs.uns.edu.ar/home/", "_blank")}
        />
        <Image
          src="/uns-logo.png"
          alt="logo uns"
          width={121}
          height={64}
          className={{
            flex: "auto",
          }}
          onClick={() => window.open("https://www.uns.edu.ar/", "_blank")}
        />
      </div>
    </div>
  );
  return (
    <div>
      <Hidden mdUp implementation="css">
        <Drawer
          variant="temporary"
          anchor={"right"}
          open={props.open}
          classes={{
            paper: classNames(classes.drawerPaper),
          }}
          onClose={props.handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          {brand}
          <div className={classes.sidebarWrapper}>
            {/* {<AdminNavbarLinks />} */}
            {links}
          </div>
          {image !== undefined ? (
            <div
              className={classes.background}
              style={{ backgroundImage: "url(" + image['src'] + ")" }}
            />
          ) : null}
        </Drawer>
      </Hidden>
      <Hidden mdDown implementation="css">
        <Drawer
          anchor={"left"}
          variant="permanent"
          open
          classes={{
            paper: classNames(classes.drawerPaper),
          }}
        >
          {brand}
          <div className={classes.sidebarWrapper}>{links}</div>
          {image !== undefined ? (
            <div
              className={classes.background}
              style={{ backgroundImage: "url(" + image['src'] + ")" }}
            />
          ) : null}
        </Drawer>
      </Hidden>
    </div>
  );
}

Sidebar.propTypes = {
  handleDrawerToggle: PropTypes.func,
  bgColor: PropTypes.oneOf([
    "white",
    "purple",
    "blue",
    "green",
    "orange",
    "red",
  ]),
  logo: PropTypes.object,
  image: PropTypes.object,
  logoText: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object),
  open: PropTypes.bool,
};
