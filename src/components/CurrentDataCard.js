import React from "react";
import { useSelector } from "react-redux";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "./CardHeader";


const CurrentDataCard = ({ metricName }) => {
 
  let newMeasurement = useSelector(state =>
    state.metric.metricMeasurements
      .reverse()
      .find(measurement => measurement.metric === metricName)
  );

  return (
    <Card className="mr-3 text-center d-inline-block">
      <CardHeader title={newMeasurement.metric} />
      <CardContent>
        <h4>
          {newMeasurement.value}
          <small className="text-muted">{newMeasurement.unit}</small>
        </h4>
      </CardContent>
    </Card>
  );
};

export default CurrentDataCard;
