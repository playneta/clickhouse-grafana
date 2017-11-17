"use strict";
///<reference path="../../../headers/common.d.ts" />app/core
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var $ = require("jquery");
var _ = require("lodash");
var SqlQueryBuilder = require("./query_builder");
var sql_query_1 = require("./sql_query");
var sdk_1 = require("app/plugins/sdk");
var Scanner = require("./scanner");
var SqlQueryCtrl = (function (_super) {
    __extends(SqlQueryCtrl, _super);
    /** @ngInject **/
    function SqlQueryCtrl($scope, $injector, templateSrv, $q, uiSegmentSrv) {
        var _this = _super.call(this, $scope, $injector) || this;
        _this.templateSrv = templateSrv;
        _this.$q = $q;
        _this.uiSegmentSrv = uiSegmentSrv;
        _this.queryModel = new sql_query_1["default"](_this.target, templateSrv, _this.panel.scopedVars);
        _this.queryBuilder = new SqlQueryBuilder(_this.target);
        _this.databaseSegment = uiSegmentSrv.newSegment(_this.target.database || { fake: true, value: '-- database --' });
        _this.tableSegment = uiSegmentSrv.newSegment(_this.target.table || { fake: true, value: '-- table --' });
        _this.dateColDataTypeSegment = uiSegmentSrv.newSegment(_this.target.dateColDataType || { fake: true, value: '-- date : col --' });
        _this.dateTimeColDataTypeSegment = uiSegmentSrv.newSegment(_this.target.dateTimeColDataType || { fake: true, value: '-- dateTime : col --' });
        _this.resolutions = _.map([1, 2, 3, 4, 5, 10], function (f) {
            return { factor: f, label: '1/' + f };
        });
        _this.target.round = _this.target.round || "0s";
        _this.target.intervalFactor = _this.target.intervalFactor || 1;
        _this.target.query = _this.target.query || "SELECT $timeSeries as t, count() FROM $table WHERE $timeFilter GROUP BY t ORDER BY t";
        _this.target.formattedQuery = _this.target.formattedQuery || _this.target.query;
        _this.scanner = new Scanner(_this.target.query);
        return _this;
    }
    SqlQueryCtrl.prototype.fakeSegment = function (value) {
        return this.uiSegmentSrv.newSegment({ fake: true, value: value });
    };
    SqlQueryCtrl.prototype.getDatabaseSegments = function () {
        return this.querySegment('DATABASES');
    };
    SqlQueryCtrl.prototype.databaseChanged = function () {
        this.target.database = this.databaseSegment.value;
        this.applySegment(this.tableSegment, this.fakeSegment('-- table : col --'));
        this.applySegment(this.dateColDataTypeSegment, this.fakeSegment('-- date : col --'));
        this.applySegment(this.dateTimeColDataTypeSegment, this.fakeSegment('-- dateTime : col --'));
    };
    SqlQueryCtrl.prototype.getTableSegments = function () {
        var target = this.target;
        target.tableLoading = true;
        return this.querySegment('TABLES').then(function (response) {
            target.tableLoading = false;
            return response;
        });
    };
    SqlQueryCtrl.prototype.tableChanged = function () {
        this.target.table = this.tableSegment.value;
        this.applySegment(this.dateColDataTypeSegment, this.fakeSegment('-- date : col --'));
        this.applySegment(this.dateTimeColDataTypeSegment, this.fakeSegment('-- dateTime : col --'));
        var self = this;
        this.getDateColDataTypeSegments().then(function (segments) {
            if (segments.length === 0) {
                return;
            }
            self.applySegment(self.dateColDataTypeSegment, segments[0]);
            self.dateColDataTypeChanged();
        });
        this.getDateTimeColDataTypeSegments().then(function (segments) {
            if (segments.length === 0) {
                return;
            }
            self.applySegment(self.dateTimeColDataTypeSegment, segments[0]);
            self.dateTimeColDataTypeChanged();
        });
    };
    SqlQueryCtrl.prototype.getDateColDataTypeSegments = function () {
        var target = this.target;
        target.dateLoading = true;
        return this.querySegment('DATE').then(function (response) {
            target.dateLoading = false;
            return response;
        });
    };
    SqlQueryCtrl.prototype.dateColDataTypeChanged = function () {
        this.target.dateColDataType = this.dateColDataTypeSegment.value;
    };
    SqlQueryCtrl.prototype.getDateTimeColDataTypeSegments = function () {
        var target = this.target;
        target.datetimeLoading = true;
        return this.querySegment('DATE_TIME').then(function (response) {
            target.datetimeLoading = false;
            return response;
        });
    };
    SqlQueryCtrl.prototype.dateTimeColDataTypeChanged = function () {
        this.target.dateTimeColDataType = this.dateTimeColDataTypeSegment.value;
    };
    SqlQueryCtrl.prototype.toggleEditorMode = function () {
        this.target.rawQuery = !this.target.rawQuery;
    };
    SqlQueryCtrl.prototype.toggleEdit = function (e, editMode) {
        if (editMode) {
            this.editMode = true;
            this.textareaHeight = "height: " + $(e.currentTarget).outerHeight() + "px;";
            return;
        }
        this.target.formattedQuery = this.highlight();
        if (this.editMode === true) {
            this.editMode = false;
            this.refresh();
        }
    };
    SqlQueryCtrl.prototype.formatQuery = function () {
        this.target.query = this.format();
        this.toggleEdit({}, false);
    };
    SqlQueryCtrl.prototype.toQueryMode = function () {
        this.target.formattedQuery = this.highlight();
        this.toggleEditorMode();
        this.refresh();
    };
    SqlQueryCtrl.prototype.format = function () {
        try {
            return this.getScanner().Format();
        }
        catch (err) {
            console.log("Parse error: ", err);
            return this.getScanner().raw();
        }
    };
    SqlQueryCtrl.prototype.highlight = function () {
        try {
            return this.getScanner().Highlight();
        }
        catch (err) {
            console.log("Parse error: ", err);
            return this.getScanner().raw();
        }
    };
    SqlQueryCtrl.prototype.getScanner = function () {
        if (this.scanner.raw() !== this.target.query) {
            this.scanner = new Scanner(this.target.query);
        }
        return this.scanner;
    };
    SqlQueryCtrl.prototype.handleQueryError = function (err) {
        this.error = err.message || 'Failed to issue metric query';
        return [];
    };
    SqlQueryCtrl.prototype.querySegment = function (type) {
        var query = this.queryBuilder.buildExploreQuery(type);
        return this.datasource.metricFindQuery(query)
            .then(this.uiSegmentSrv.transformToSegments(false))["catch"](this.handleQueryError.bind(this));
    };
    SqlQueryCtrl.prototype.applySegment = function (dst, src) {
        dst.value = src.value;
        dst.html = src.html || src.value;
        dst.fake = src.fake === undefined ? false : src.fake;
    };
    SqlQueryCtrl.prototype.getCollapsedText = function () {
        return this.target.query;
    };
    SqlQueryCtrl.templateUrl = 'partials/query.editor.html';
    return SqlQueryCtrl;
}(sdk_1.QueryCtrl));
exports.SqlQueryCtrl = SqlQueryCtrl;
