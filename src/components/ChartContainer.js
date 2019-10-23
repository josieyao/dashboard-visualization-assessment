import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useQuery } from "urql";
import * as actions from "../store/actions";
import { Line } from "react-chartjs-2";

//   s = ["oilTemp"]
//   m = [
//         {at: 1571726094241
//         metric: "oilTemp"
//         unit: "F"
//         value: 127.16}
//     ]

let convertUnixToTime = heartBeat => {
  let date = new Date(heartBeat);

  let hours = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();

  if (hours > 12) hours = hours - 12;
  if (hours < 10) hours = `0${hours}`;
  if (minutes < 10) minutes = `0${minutes}`;
  if (seconds < 10) seconds = `0${seconds}`;

  return `${hours}:${minutes}:${seconds}`;
};

const query2 = `
  query($input: [MeasurementQuery!]!) {
    getMultipleMeasurements(input: $input) {
      metric
      measurements {
        at
        metric
        value
        unit
      }
    }
  }
`;

const ChartContainer = () => {
  const dispatch = useDispatch();

  //get all measurement data from state
  const allMeasurements = useSelector(state => state.metric.metricMeasurements);

  //get selected metrics from state
  const selectedMetrics = useSelector(state => state.metric.selectedMetrics);

  const pastMeasurementsData = useSelector(
    state => state.metric.pastMeasurements
  );

  //filter measurement data based on selected metrics
  let filteredMeasurements = selectedMetrics.map(chosenMetric => {
    return allMeasurements.filter(
      measurement => measurement.metric === chosenMetric
    );
  });

  //creating the query input to find historical data (30 minutes before) 
  let withinTimestamp = 30
  let time = new Date(1571871148543 - (withinTimestamp * 60000)).getTime();
  let input = selectedMetrics.map(metricName => ({
    metricName: metricName,
    after: time
  }));

  const [result] = useQuery({ query: query2, variables: { input } });
  const { fetching, data, error } = result;

  useEffect(() => {
    if (error) {
      dispatch({ type: actions.API_ERROR, error: error.message });
      return;
    }

    if (!data) return;
    const { getMultipleMeasurements } = data;
    dispatch({
      type: actions.PAST_MEASUREMENTS_RECEIVED,
      pastMeasurements: getMultipleMeasurements
    });
  }, [dispatch, data, error]);

  if (!data) return null;
  if (error) return `Error! ${error}`;

  let chartData = {
    labels: [],
    datasets: []
  };
  let yAxisConfig = [];

  let transformedArray = selectedMetrics.map((metricName, i) => {
    let dataa = filteredMeasurements[i].filter(dataSet => {
      return metricName == dataSet.metric;
    });
    let betterData = dataa.map(data => data.value);
    let timestamps = dataa.map(data => convertUnixToTime(data.at));
    chartData.labels = timestamps;

    yAxisConfig.push({
      id: i,
      type: "linear",
      position: "left"
    });

    return { label: metricName, data: betterData, yAxisID: i };
  });

  chartData.datasets = transformedArray;

  let xAxisConfig = [];
  let options = {
    animation: false,
    scales: {
      yAxes: yAxisConfig,
      xAxes: xAxisConfig
    }
  };

  if (selectedMetrics.length === 0) {
    return null;
  }

  return (
    <div className="chart">
      CHART COMPONENT
      <Line data={chartData} width={100} height={50} options={options} />
    </div>
  );
};

export default ChartContainer;