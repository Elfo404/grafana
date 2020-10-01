import _ from 'lodash';
import {
  MetricAggregation,
  MetricAggregationType,
  MetricsConfiguration,
  BucketsConfiguration,
  BucketAggregation,
} from './types';

export const metricAggregationConfig: MetricsConfiguration = {
  count: {
    label: 'Count',
    requiresField: false,
  },
  avg: {
    label: 'Average',
    requiresField: true,
    supportsInlineScript: true,
    supportsMissing: true,
  },
  sum: {
    label: 'Sum',
    requiresField: true,
    supportsInlineScript: true,
    supportsMissing: true,
  },
  max: {
    label: 'Max',
    requiresField: true,
    supportsInlineScript: true,
    supportsMissing: true,
  },
  min: {
    label: 'Min',
    requiresField: true,
    supportsInlineScript: true,
    supportsMissing: true,
  },
  extended_stats: {
    label: 'Extended Stats',
    requiresField: true,
    supportsMissing: true,
    supportsInlineScript: true,
  },
  percentiles: {
    label: 'Percentiles',
    requiresField: true,
    supportsMissing: true,
    supportsInlineScript: true,
  },
  cardinality: {
    label: 'Unique Count',
    requiresField: true,
    supportsMissing: true,
  },
  moving_avg: {
    label: 'Moving Average',
    requiresField: false,
    isPipelineAgg: true,
    minVersion: 2,
  },
  derivative: {
    label: 'Derivative',
    requiresField: false,
    isPipelineAgg: true,
    minVersion: 2,
  },
  cumulative_sum: {
    label: 'Cumulative Sum',
    requiresField: false,
    isPipelineAgg: true,
    minVersion: 2,
  },
  bucket_script: {
    label: 'Bucket Script',
    requiresField: false,
    isPipelineAgg: true,
    supportsMultipleBucketPaths: true,
    minVersion: 2,
  },
  raw_document: {
    label: 'Raw Document (legacy)',
    requiresField: false,
    isSingleMetric: true,
  },
  raw_data: {
    label: 'Raw Data',
    requiresField: false,
    isSingleMetric: true,
  },
  logs: {
    label: 'Logs',
    requiresField: false,
  },
};

export const bucketAggregationConfig: BucketsConfiguration = {
  terms: {
    label: 'Terms',
    requiresField: true,
  },
  filters: {
    label: 'Filters',
    requiresField: false,
  },
  geohash_grid: {
    label: 'Geo Hash Grid',
    requiresField: true,
  },
  date_histogram: {
    label: 'Date Histogram',
    requiresField: true,
  },
  histogram: {
    label: 'Histogram',
    requiresField: true,
  },
};

export const orderByOptions = [
  { text: 'Doc Count', value: '_count' },
  { text: 'Term value', value: '_term' },
];

export const orderOptions = [
  { text: 'Top', value: 'desc' },
  { text: 'Bottom', value: 'asc' },
];

export const sizeOptions = [
  { text: 'No limit', value: '0' },
  { text: '1', value: '1' },
  { text: '2', value: '2' },
  { text: '3', value: '3' },
  { text: '5', value: '5' },
  { text: '10', value: '10' },
  { text: '15', value: '15' },
  { text: '20', value: '20' },
];

export const extendedStats = [
  { text: 'Avg', value: 'avg' },
  { text: 'Min', value: 'min' },
  { text: 'Max', value: 'max' },
  { text: 'Sum', value: 'sum' },
  { text: 'Count', value: 'count' },
  { text: 'Std Dev', value: 'std_deviation' },
  { text: 'Std Dev Upper', value: 'std_deviation_bounds_upper' },
  { text: 'Std Dev Lower', value: 'std_deviation_bounds_lower' },
];

export const intervalOptions = [
  { text: 'auto', value: 'auto' },
  { text: '10s', value: '10s' },
  { text: '1m', value: '1m' },
  { text: '5m', value: '5m' },
  { text: '10m', value: '10m' },
  { text: '20m', value: '20m' },
  { text: '1h', value: '1h' },
  { text: '1d', value: '1d' },
];

export const movingAvgModelOptions = [
  { text: 'Simple', value: 'simple' },
  { text: 'Linear', value: 'linear' },
  { text: 'Exponentially Weighted', value: 'ewma' },
  { text: 'Holt Linear', value: 'holt' },
  { text: 'Holt Winters', value: 'holt_winters' },
];

export const pipelineOptions: any = {
  moving_avg: [
    { text: 'window', default: 5 },
    { text: 'model', default: 'simple' },
    { text: 'predict', default: undefined },
    { text: 'minimize', default: false },
  ],
  derivative: [{ text: 'unit', default: undefined }],
  cumulative_sum: [{ text: 'format', default: undefined }],
  bucket_script: [],
};

export const movingAvgModelSettings: any = {
  simple: [],
  linear: [],
  ewma: [{ text: 'Alpha', value: 'alpha', default: undefined }],
  holt: [
    { text: 'Alpha', value: 'alpha', default: undefined },
    { text: 'Beta', value: 'beta', default: undefined },
  ],
  holt_winters: [
    { text: 'Alpha', value: 'alpha', default: undefined },
    { text: 'Beta', value: 'beta', default: undefined },
    { text: 'Gamma', value: 'gamma', default: undefined },
    { text: 'Period', value: 'period', default: undefined },
    { text: 'Pad', value: 'pad', default: undefined, isCheckbox: true },
  ],
};

export function getMetricAggTypes(esVersion: number) {
  return _.filter(metricAggTypes, f => {
    if (f.minVersion) {
      return f.minVersion <= esVersion;
    } else {
      return true;
    }
  });
}

export function getPipelineOptions(metric: any) {
  if (!isPipelineAgg(metric.type)) {
    return [];
  }

  return pipelineOptions[metric.type];
}

export function isPipelineAgg(metricType: any) {
  if (metricType) {
    const po = pipelineOptions[metricType];
    return po !== null && po !== undefined;
  }

  return false;
}

export function isPipelineAggWithMultipleBucketPaths(metricType: MetricAggregationType) {
  return !!metricAggregationConfig[metricType].supportsMultipleBucketPaths;
  // return metricAggTypes.find(t => t.value === metricType && t.supportsMultipleBucketPaths) !== undefined;
}

export function getPipelineAggOptions(targets: any) {
  const result: any[] = [];
  _.each(targets.metrics, metric => {
    if (!isPipelineAgg(metric.type)) {
      result.push({ text: describeMetric(metric), value: metric.id });
    }
  });

  return result;
}

export function getMovingAvgSettings(model: any, filtered: boolean) {
  const filteredResult: any[] = [];
  if (filtered) {
    _.each(movingAvgModelSettings[model], setting => {
      if (!setting.isCheckbox) {
        filteredResult.push(setting);
      }
    });
    return filteredResult;
  }
  return movingAvgModelSettings[model];
}

export function getOrderByOptions(target: any) {
  const metricRefs: any[] = [];
  _.each(target.metrics, metric => {
    if (metric.type !== 'count') {
      metricRefs.push({ text: describeMetric(metric), value: metric.id });
    }
  });

  return orderByOptions.concat(metricRefs);
}

export function describeOrder(order: string) {
  const def: any = _.find(orderOptions, { value: order });
  return def.text;
}

export function describeMetric(metric: { type: string; field: string }) {
  const def: any = _.find(metricAggTypes, { value: metric.type });
  if (!def.requiresField && !isPipelineAgg(metric.type)) {
    return def.text;
  }
  return def.text + ' ' + metric.field;
}

export function describeOrderBy(orderBy: any, target: any) {
  const def: any = _.find(orderByOptions, { value: orderBy });
  if (def) {
    return def.text;
  }
  const metric: any = _.find(target.metrics, { id: orderBy });
  if (metric) {
    return describeMetric(metric);
  } else {
    return 'metric not found';
  }
}

export function defaultMetricAgg(id = 1): MetricAggregation {
  return { type: 'count', id, hide: false };
}

export function defaultBucketAgg(id = 1): BucketAggregation {
  return { type: 'date_histogram', id, settings: { interval: 'auto' } };
}

export const findMetricById = (metrics: any[], id: any) => {
  return _.find(metrics, { id: id });
};

export function hasMetricOfType(target: any, type: string): boolean {
  return target && target.metrics && target.metrics.some((m: any) => m.type === type);
}
