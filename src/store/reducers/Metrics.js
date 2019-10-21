import * as actions from "../actions";

const initialState = {
    metrics: [],
    selectedMetrics: [],
    metricMeasurements: []
}

//get metrics list for select drop down 
const selectDropDownDataReceived = (state = initialState, action) => {
    return { 
        ...state, 
        metrics: action.getMetrics 
    }
}

//selected metrics picked
const selectedMetricsReceived = (state = initialState, action) => {
    return {
        ...state,
        selectedMetrics: [ ...action.options ]
    }
}

//get all metric measurements
const metricMeasurementsReceived = (state = initialState, action) => {
    return {
        ...state,
        metricMeasurements: [ ...action.getMultipleMeasurements]
    }
}

const handlers = {
    [actions.SELECT_DROP_DOWN_DATA_RECEIVED]: selectDropDownDataReceived,
    [actions.SELECTED_METRICS_RECEIVED]: selectedMetricsReceived,
    [actions.METRIC_MEASUREMENTS_RECEIVED]: metricMeasurementsReceived
  };
  
  export default (state = initialState, action) => {
    const handler = handlers[action.type];
    if (typeof handler === "undefined") return state;
    return handler(state, action);
  };