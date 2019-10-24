import * as actions from "../actions";

const initialState = {
  heartBeat: 0,
  metrics: [],
  selectedMetrics: [],
  metricMeasurements: [],
  historicalMeasurements: []
};

//get metrics list for select drop down
const selectDropDownDataReceived = (state = initialState, action) => {
  return {
    ...state,
    metrics: action.getMetrics
  };
};

//selected metrics picked
const selectedMetricsReceived = (state = initialState, action) => {
  return {
    ...state,
    heartBeat: new Date().getTime(),
    selectedMetrics: [...action.options]
  };
};

//get all metric measurements
const metricMeasurementsReceived = (state = initialState, action) => {
  return {
    ...state,
    metricMeasurements: [...state.metricMeasurements, action.newMeasurement]
  };
};

//get historical measurements
const historicalMeasurementsReceived = (state = initialState, action) => {
  return {
    ...state,
    metricMeasurements: [
      ...action.historicalMeasurements.reduce(
        (measurments, measurement) => [
          ...measurments,
          ...measurement.measurements
        ],
        []
      )
    ]
  };
};

const handlers = {
  [actions.SELECT_DROP_DOWN_DATA_RECEIVED]: selectDropDownDataReceived,
  [actions.SELECTED_METRICS_RECEIVED]: selectedMetricsReceived,
  [actions.METRIC_MEASUREMENTS_RECEIVED]: metricMeasurementsReceived,
  [actions.HISTORICAL_MEASUREMENTS_RECEIVED]: historicalMeasurementsReceived
};

export default (state = initialState, action) => {
  const handler = handlers[action.type];
  if (typeof handler === "undefined") return state;
  return handler(state, action);
};