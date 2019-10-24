import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useQuery } from "urql";
import * as actions from "../store/actions";
import Chart from "./Chart";
import LinearProgress from "@material-ui/core/LinearProgress";

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

let convertUnixToTime = heartBeat => {
  let date = new Date(heartBeat);

  let hours = date.getHours();
  let minutes = date.getMinutes();
  // let seconds = date.getSeconds();

  if (hours > 12) hours = hours - 12;
  if (hours < 10) hours = `${hours}`;
  if (minutes < 10) minutes = `${minutes}`;
  // if (seconds < 10) seconds = `${seconds}`;

  return `${hours}:${minutes}`;
};

const ChartContainer = () => {
  const dispatch = useDispatch();
  //get all measurement data from state
  const allMeasurements = useSelector(state => state.metric.metricMeasurements);

  //get selected metrics from state
  const selectedMetrics = useSelector(state => state.metric.selectedMetrics);

  //get current unix time stamp (heartbeat) from state
  const heartBeat = useSelector(state => state.metric.heartBeat);

  //filter measurement data based on selected metrics
  let filteredMeasurements = selectedMetrics.map(chosenMetric => {
    return allMeasurements.filter(
      measurement => measurement.metric === chosenMetric
    );
  });

  // //creating the query input to find historical data (30 minutes before)
  let withinTimestamp = 30
  let time = new Date(heartBeat - withinTimestamp * 60000).getTime();

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
      type: actions.HISTORICAL_MEASUREMENTS_RECEIVED,
      historicalMeasurements: getMultipleMeasurements
    });
  }, [dispatch, data, error]);

  if (!data) return null;
  if (error) return `Error! ${error}`;

  //set chart data and configurations
  let chartData = {
    labels: [],
    datasets: []
  };
  let yAxisConfig = [];
  let xAxisConfig = [
    {
      scaleLabel: {
        display: true,
        labelString: "Time"
      }
    }
  ];
  let options = {
    animation: false,
    responsive: true,
    fill: false,
    scales: {
      yAxes: yAxisConfig,
      xAxes: xAxisConfig
    }
  };

  //transform the data to feed in the chart
  let transformedArray = selectedMetrics.map((metricName, i) => {
    let transformedMetricArray = filteredMeasurements[i].filter(dataSet => {
      return metricName === dataSet.metric;
    });
    let dataValues = transformedMetricArray.map(data => data.value);
    let timestamps = transformedMetricArray.map(data => convertUnixToTime(data.at));

    chartData.labels = timestamps;

    yAxisConfig.push({
      id: i,
      type: "linear",
      position: "left",
      scaleLabel: {
        display: true,
        responsive: true,
        labelString:
          metricName === "tubingPressure" || metricName === "casingPressure"
            ? "PSI"
            : metricName === "flareTemp" || metricName === "oilTemp" || metricName === "waterTemp"
            ? "F"
            : "%"
      }
    });
    return { label: metricName, data: dataValues, yAxisID: i };
  });

  chartData.datasets = transformedArray;

  //set the line colors for the chart
  let lineColors = 
    {
        tubingPressure: "rgb(255, 128, 128)",
        flareTemp: "rgb(236, 179, 255)",
        injValveOpen: "rgb(128, 179, 255)",
        oilTemp: "rgb(0, 230, 115)",
        casingPressure: "rgb(255, 255, 128)",
        waterTemp: "rgb(255, 102, 163)"
    }
  ;

  let chartColors = chartData.datasets.map(dataSet => {
      return {...dataSet, borderColor: lineColors[dataSet.label]}
  });

  chartData.datasets = chartColors

  if (selectedMetrics.length === 0) {
    return null;
  }

  if (fetching) return <LinearProgress />;

  return (
    <div>
        <Chart chartData={chartData} options={options}></Chart>
    </div>
  );
};

export default ChartContainer;