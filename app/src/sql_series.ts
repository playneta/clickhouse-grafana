import _ from 'lodash';

export default class SqlSeries {
  series: any;
  meta: any;
  tillNow: any;
  from: any;
  to: any;

  /** @ngInject */
  constructor(options) {
    this.series = options.series;
    this.meta = options.meta;
    this.tillNow = options.tillNow;
    this.from = options.from;
    this.to = options.to;
  }

  toTable(): any {
    var self = this, data = [];
    if (this.series.length === 0) {
      return data;
    }

    var columns = [];
    _.each(self.meta, function (col) {
      columns.push({"text": col.name, "type": self._toJSType(col.type)})
    });

    var rows = [];
    _.each(self.series, function (ser) {
      var r = [];
      _.each(ser, function (v) {
        r.push(v)
      });
      rows.push(r)
    });

    data.push({
      "columns": columns,
      "rows": rows,
      "type": "table"
    });

    return data
  }

  toTimeSeries(): any {
    var self = this, timeSeries = [];
    if (self.series.length === 0) {
      return timeSeries;
    }

    // timeCol have to be the first column always
    var timeCol = self.meta[0], metrics = {}, intervals = [], t;
    _.each(self.series, function (series) {
      t = self._formatValue(series[timeCol.name]);
      intervals.push(t);

      // rm time value from series
      delete series[timeCol.name];
      _.each(series, function (val, key) {
        if (_.isArray(val)) {
          _.each(val, function (arr) {
            (metrics[arr[0]] = metrics[arr[0]] || {})[t] = arr[1];
          });
        } else {
          (metrics[key] = metrics[key] || {})[t] = val;
        }
      });
    });

    _.each(metrics, function (v, k) {
      var datapoints = [];
      _.each(intervals, function (interval) {
        if (metrics[k][interval] === undefined || metrics[k][interval] === null) {
          metrics[k][interval] = 0;
        }
        datapoints.push([self._formatValue(metrics[k][interval]), interval]);
      });
      timeSeries.push({target: k, datapoints});
    });

    return timeSeries;
  };

  _toJSType(type: any): string {
    switch (type) {
      case 'UInt8':
      case 'UInt16':
      case 'UInt32':
      case 'UInt64':
      case 'Int8':
      case 'Int16':
      case 'Int32':
      case 'Int64':
        return "number";
      default:
        return "string"
    }
  }

  _formatValue(value: any) {
    var numeric = Number(value);
    if (isNaN(numeric)) {
      return value
    } else {
      return numeric
    }
  };
}