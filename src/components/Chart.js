import React from "react";
import { Line } from "react-chartjs-2";

const Chart = props => {
  return (
    <div className="chart">
      <Line data={props.chartData} options={props.options} />
    </div>
  );
};

export default Chart;
