import React from "react";
import { useSelector} from "react-redux";
import { Line } from "react-chartjs-2";

//   s = ["oilTemp"]
//   m = [
//         {at: 1571726094241
//         metric: "oilTemp"
//         unit: "F"
//         value: 127.16}
//     ]

// let timeStamp = 30
// changeTimeStamp = new Date(metric.at - withinTimeshamp*60000).getTime())

// get only timestamp from heartBeat
// new Date(heartBeat - 60 * 1000).toUTCString().slice(-11, -4)

// change from 1571774337500 to Tue Oct 22 2019 14:57:57
//.slice to just get the time
let convertUnixToTime = heartBeat => {
  let date = new Date(heartBeat); // - 60 * 1000).toUTCString().slice(-11, -4);

  let hours = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();

  if (hours > 12) hours = hours - 12;
  if (hours < 10) hours = `0${hours}`;
  if (minutes < 10) minutes = `0${minutes}`;
  if (seconds < 10) seconds = `0${seconds}`;

  return `${hours}:${minutes}:${seconds}`;
};

const ChartContainer = () => {
  //get all measurement data from state
  let allMeasurements = useSelector(state => state.metric.metricMeasurements);

  //get selected metrics from state
  let selectedMetrics = useSelector(state => state.metric.selectedMetrics);

  //get all measurement data only for the selected metrics
  let filteredMeasurements = selectedMetrics.map(chosenMetric => {
    return allMeasurements.filter(
      measurement => measurement.metric === chosenMetric
    );
  });


  // chartData = {
  //     labels: [time],
  //     datasets: [
  //         label: metric,
  //         data: [value, value, value, value]
  //     ]
  // }

  let chartData = {
    labels: [],
    datasets: []
  };

  let yAxisConfig = [];
  let xAxisConfig = [];

  let options = {
    animation: false,
    scales: {
      yAxes: yAxisConfig,
      xAxes: xAxisConfig
    }
  };

  //transform the filtered measurement data to fit with chart's data structure
  let transformedArray = selectedMetrics.map((metricName, i) => {
    let dataa = filteredMeasurements[i].filter(dataSet => {
      return metricName === dataSet.metric;
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

  if (selectedMetrics.length === 0) {
    return null;
  }

  return (
    <div className="chart">
      <Line data={chartData} width={100} height={50} options={options} />
    </div>
  );
};

export default ChartContainer;