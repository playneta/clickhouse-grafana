"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var datasource_1 = require("./datasource");
exports.Datasource = datasource_1.ClickHouseDatasource;
var query_ctrl_1 = require("./query_ctrl");
exports.QueryCtrl = query_ctrl_1.SqlQueryCtrl;
var SqlConfigCtrl = (function () {
    function SqlConfigCtrl() {
    }
    SqlConfigCtrl.templateUrl = 'partials/config.html';
    return SqlConfigCtrl;
}());
exports.ConfigCtrl = SqlConfigCtrl;
var SqlQueryOptionsCtrl = (function () {
    function SqlQueryOptionsCtrl() {
    }
    SqlQueryOptionsCtrl.templateUrl = 'partials/query.options.html';
    return SqlQueryOptionsCtrl;
}());
exports.QueryOptionsCtrl = SqlQueryOptionsCtrl;
var SqlAnnotationsQueryCtrl = (function () {
    function SqlAnnotationsQueryCtrl() {
    }
    SqlAnnotationsQueryCtrl.templateUrl = 'partials/annotations.editor.html';
    return SqlAnnotationsQueryCtrl;
}());
exports.AnnotationsQueryCtrl = SqlAnnotationsQueryCtrl;
