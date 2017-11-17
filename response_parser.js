"use strict";
exports.__esModule = true;
///<reference path="../../../headers/common.d.ts" />
var _ = require("lodash");
var ResponseParser = (function () {
    function ResponseParser() {
    }
    ResponseParser.prototype.parse = function (query, results) {
        if (!results || results.data.length === 0) {
            return [];
        }
        var sqlResults = results.data;
        var res = [], v;
        _.each(sqlResults, function (row) {
            _.each(row, function (value) {
                if (_.isArray(value) || _.isOb) {
                    v = value[0];
                }
                else {
                    v = value;
                }
                if (res.indexOf(v) === -1) {
                    res.push(v);
                }
            });
        });
        return _.map(res, function (value) {
            return { text: value };
        });
    };
    return ResponseParser;
}());
exports["default"] = ResponseParser;
