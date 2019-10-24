import React, { useEffect } from "react";
import CurrentDataCard from "./CurrentDataCard";
import { useSubscription } from "urql";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../store/actions";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";

const query = `
  subscription {
    newMeasurement {
      at
      metric
      value
      unit
    }
  }
`;


const getSelectedMetrics = state => {
  return state.metric.selectedMetrics;
};

const CurrentDataContainer = () => {
  const selectedMetrics = useSelector(getSelectedMetrics);
  const dispatch = useDispatch();


  const [result] = useSubscription({
    query
  });
  const { data, error } = result;
  
  useEffect(() => {
    if (error) {
      dispatch({ type: actions.API_ERROR, error: error.message });
      return;
    }

    if (!data) return;
      const { newMeasurement } = data;
      // console.log(newMeasurement);

      dispatch({ type: actions.METRIC_MEASUREMENTS_RECEIVED, newMeasurement });
    }, [dispatch, data, error]
  );

  if (!data) return null;
  if (error) return `Error! ${error}`;

  const flexContainer = {
    padding: 0,
    display: 'grid',
    grid: '100px / auto auto auto auto'
  };

  if (selectedMetrics.length === 0) {
    return (
      <h2 style={{marginLeft: '14px'}}>Please type in the search bar to select metrics</h2>
    )
  }

  return (
    <List style={flexContainer}>
      {selectedMetrics.map((metric, index) => {
        return (
          <ListItem key={index}>
            <CurrentDataCard key={index} metricName={metric} />
          </ListItem>
        );
      })}
    </List>
  );
};

export default CurrentDataContainer;
