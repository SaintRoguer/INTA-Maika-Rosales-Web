import React from "react";
import Card from "../../../components/Card/Card.js";
import CardBody from "../../../components/Card/CardBody.js";
import SingleProgressBar from "./SingleProgressBar.js";

export default function PercentagesCard(props) {
  const { percentages, title } = props;

  return (
    // <Card chart style={{ backgroundColor: "rgba(31, 47, 51, 1)" }}> //dark color de la app mobile por si el negro no convence
    <Card chart style={{ backgroundColor: "black" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: 0,
        }}
      >
        <h4 style={{ color: "white" }}>
          <strong>Porcentajes de cobertura</strong> {title}
        </h4>
      </div>

      <CardBody>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
          }}
        >
          <SingleProgressBar
            percentage={percentages.percentageGreen}
            color={"32CD32"}
          />
          <SingleProgressBar
            percentage={percentages.percentageYellow}
            color={"fce303"}
          />
          <SingleProgressBar
            percentage={percentages.percentageNaked}
            color={"f5f7f7"}
          />
        </div>
      </CardBody>
    </Card>
  );
}
