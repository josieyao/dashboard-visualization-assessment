import React from "react";
import { useSelector } from "react-redux";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "./CardHeader";

//get the most current measurement data for a selected metric
const CurrentDataCard = ({ metricName }) => {
  let newMeasurement = useSelector(state =>
    [...state.metric.metricMeasurements]
      .reverse()
      .find(measurement => measurement.metric === metricName)
  );

  return (
    <Card
      className="mr-3 text-center d-inline-block"
      style={{ display: "flex" }}
    >
      <CardHeader title={newMeasurement.metric} />
      <CardContent>
        <h4>
          {newMeasurement.value}{" "}
          <small className="text-muted">{newMeasurement.unit}</small>
        </h4>
      </CardContent>
    </Card>
  );
};

export default CurrentDataCard;
