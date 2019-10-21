import React from "react";
import CurrentDataCard from "./CurrentDataCard";
import { useSelector } from "react-redux";
import { Provider, createClient } from "urql";

const client = createClient({
  url: "https://react.eogresources.com/graphql"
});

const getSelectedMetrics = state => {
  return state.metric.selectedMetrics;
};

export default () => {
  return (
    <Provider value={client}>
      <CurrentDataContainer />
    </Provider>
  );
};

const CurrentDataContainer = () => {
  const selectedMetrics = useSelector(getSelectedMetrics);

  return (
    <div>
      {selectedMetrics.map((metric, index) => {
        return <CurrentDataCard key={index} metricName={metric} />;
      })}
    </div>
  );
};
