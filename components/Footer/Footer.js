import React from "react";
import makeStyles from '@mui/styles/makeStyles';
import ListItem from "@mui/material/ListItem";
import List from "@mui/material/List";
import styles from "assets/jss/nextjs-material-dashboard/components/footerStyle.js";
import Link from "next/link";

const useStyles = makeStyles(styles);

export default function Footer(props) {
  const classes = useStyles();
  return (
    <footer className={classes.footer}>
      <div className={classes.container}>
        <div className={classes.left}>
          <List className={classes.list}>
            <ListItem className={classes.inlineBlock}>
              <Link href="/admin/sesiones">
                <a>Sesiones</a>
              </Link>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <Link href="/admin/ayuda">
                <a>Ayuda</a>
              </Link>
            </ListItem>
          </List>
        </div>
        <p className={classes.right}>
          <span>
            &copy; {1900 + new Date().getYear()}{" "}
            <a
              href="https://cs.uns.edu.ar/home/"
              target="_blank"
              className={classes.a}
            >
              DCIC
            </a>{" "}
            /{" "}
            <a
              href="https://www.uns.edu.ar/"
              target="_blank"
              className={classes.a}
            >
              UNS
            </a>{" "}
            /{" "}
            <a
              href="https://www.argentina.gob.ar/inta"
              target="_blank"
              className={classes.a}
            >
              INTA
            </a>
          </span>
        </p>
      </div>
    </footer>
  );
}
