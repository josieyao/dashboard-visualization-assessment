import React from "react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "./CardHeader";

const query = gql`
  query($metricName: String!) {
    getLastKnownMeasurement(metricName: $metricName) {
      at
      metric
      value
      unit
    }
  }
`;

const CurrentDataCard = ({ metricName }) => {
  const { loading, error, data } = useQuery(query, {
    variables: { metricName },
    pollInterval: 1300
  });

  if (loading) return null;
  if (error) return `Error! ${error}`;

  return (
    <Card className="mr-3 text-center d-inline-block">
      <CardHeader title={data.getLastKnownMeasurement.metric} />
      <CardContent>
        <h4>
          {data.getLastKnownMeasurement.value}{" "}
          <small className="text-muted">
            {data.getLastKnownMeasurement.unit}
          </small>
        </h4>
      </CardContent>
    </Card>
  );
};

export default CurrentDataCard;
