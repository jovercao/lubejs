"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
exports.__esModule = true;
require("reflect-metadata");
function logType(target, key) {
    var t = Reflect.getMetadata("design:type", target, key);
    console.log(t);
    console.log(key + " type: " + t.name);
}
var Demo = /** @class */ (function () {
    function Demo() {
    }
    __decorate([
        logType // apply property decorator
        ,
        __metadata("design:type", String)
    ], Demo.prototype, "attr1");
    __decorate([
        logType,
        __metadata("design:type", Number)
    ], Demo.prototype, "attr2");
    return Demo;
}());
