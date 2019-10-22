import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import * as actions from "../store/actions";
import { useQuery } from "urql";
import Multiselect from "multiselect-dropdown-react";
import LinearProgress from "@material-ui/core/LinearProgress";

const query = `{
        getMetrics
    }`;

const SelectDropDown = () => {
  const dispatch = useDispatch();

  //fetch all the metrics
  const [result] = useQuery({
    query
  });

  const { fetching, data, error } = result;

  const metricsData = [];
  
  useEffect(
    () => {
      if (error) {
        dispatch({ type: actions.API_ERROR, error: error.message });
        return;
      }
      if (!data) return;
      const { getMetrics } = data;
      //    console.log(getMetrics)
      getMetrics.map(metric =>
        metricsData.push({ name: `${metric}`, value: `${metric}` })
      );
      //    console.log(metricsData)
      dispatch({ type: actions.SELECT_DROP_DOWN_DATA_RECEIVED, getMetrics });
    }
    //[ data ]
  );

  //filter metrics
  const selectMetrics = options => {
    dispatch({ type: actions.SELECTED_METRICS_RECEIVED, options });
  };

  if (fetching) return <LinearProgress />;

  return (
    <div>
      <Multiselect options={metricsData} onSelectOptions={selectMetrics} />
    </div>
  );
};

export default SelectDropDown;