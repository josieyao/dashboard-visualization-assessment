import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useQuery } from "urql";
import * as actions from "../store/actions";
import LinearProgress from "@material-ui/core/LinearProgress";
import Chart from "./Chart";

//   s = ["oilTemp"]
//   m = [
//         {at: 1571726094241
//         metric: "oilTemp"
//         unit: "F"
//         value: 127.16}
//     ]

let convertUnixToTime = heartBeat => {
  let date = new Date(heartBeat); // - 60 * 1000).toUTCString().slice(-11, -4);

  let hours = date.getHours();
  let minutes = date.getMinutes();
  // let seconds = date.getSeconds();

  if (hours > 12) hours = hours - 12;
  if (hours < 10) hours = `${hours}`;
  if (minutes < 10) minutes = `${minutes}`;
  // if (seconds < 10) seconds = `${seconds}`;

  return `${hours}:${minutes}`;
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

  //filter measurement data based on selected metrics
  let filteredMeasurements = selectedMetrics.map(chosenMetric => {
    return allMeasurements.filter(
      measurement => measurement.metric === chosenMetric
    );
  });

  // //creating the query input to find historical data (30 minutes before)
  let withinTimestamp = 30
  let time;

  // let currentUnixTime = new Date().getTime();
  // if (heartBeatTime !== undefined) {
    time = new Date(1571934517907 - withinTimestamp * 60000).getTime();
    // time = new Date(1571933042712 - withinTimestamp * 60000).getTime();
  // }

  let input = selectedMetrics.map(metricName => ({
    metricName: metricName,
    after: time
  }));

  const [result] = useQuery({ query: query2, variables: { input } });
  const { fetching, data, error } = result;


  console.log(data)

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
  let xAxisConfig = [
    {
      scaleLabel: {
        display: true,
        labelString: "Time"
      }
    }
  ];

  let transformedArray = selectedMetrics.map((metricName, i) => {
    let dataa = filteredMeasurements[i].filter(dataSet => {
      return metricName === dataSet.metric;
    });
    let dataValues = dataa.map(data => data.value);
    let timestamps = dataa.map(data => convertUnixToTime(data.at));

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
            : metricName === "flareTemp" ||
              metricName === "oilTemp" ||
              metricName === "waterTemp"
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

  let options = {
    animation: false,
    responsive: true,
    fill: false,
    scales: {
      yAxes: yAxisConfig,
      xAxes: xAxisConfig
    }
  };

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