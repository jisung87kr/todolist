/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Vue.component("my-list", {
    props: ['items', 'index'],
    template: '\n      <li :class="{completed:items.completed}">\n        <span class="txt" @click="complete">{{items.item}}</span>\n        <span class="info" :class={on:toggle}>\n            <span class="created">{{items.created}}</span>\n            <span class="del" @click="toggleBtn" v-if="!toggle"><i class="material-icons">&#xE888;</i></span>\n            <span class="btn positive" @click="del">YES</span>\n            <span class="btn nagative" @click="toggleBtn">NO</span>\n        </span>\n      </li>\n    ',
    data: function data() {
        var data = {
            toggle: false
        };
        return data;
    },
    methods: {
        complete: function complete(e) {
            e.stopPropagation();
            this.$emit("tg-complete", this.index);
            this.toggle = false;
        },
        del: function del(e) {
            this.$emit("tg-del", this.index);
            this.toggle = false;
        },
        toggleBtn: function toggleBtn(e) {
            e.stopPropagation();
            this.toggle == false ? this.toggle = true : this.toggle = false;
        }
    }
});

var app = new Vue({
    el: "#app",
    data: {
        list: [{
            "item": "청소하기",
            "created": "2017.8.31",
            "completed": false
        }, {
            "item": "빨래하기1",
            "created": "2017.8.31",
            "completed": true
        }]
    },
    computed: {
        watchAddItem: function watchAddItem() {
            var a = this.list.length;
        }
    },
    methods: {
        addList: function addList(e) {
            var val = e.target.value;
            if (val == "") {
                alert("값을 입력하세요");
            } else {
                var dt = new Date();
                var m = dt.getMonth() + 1;
                var d = dt.getDate();
                var y = dt.getFullYear();
                var additem = {
                    "item": val,
                    "created": y + "." + m + "." + d,
                    "completed": false
                };
                this.list.push(additem);
                e.target.value = "";
            }
        },
        toggleComplete: function toggleComplete(index) {
            this.list[index].completed == true ? this.list[index].completed = false : this.list[index].completed = true;
        },
        deleteItem: function deleteItem(index) {
            this.list.splice(index, 1);
        },
        clearComplete: function clearComplete() {
            var selectedArry = [];
            for (var key in this.list) {
                if (this.list[key]["completed"] == true) {
                    selectedArry.push(key);
                }
            }
            selectedArry = selectedArry.sort(function (a, b) {
                return b - a;
            });

            for (var key in selectedArry) {
                console.log(this.list[selectedArry[key]]);
                this.list.splice(selectedArry[key], 1);
            }
        }
    }
});

// animate
$(".input_item").keyup(function (e) {
    if (e.keyCode == 13) {
        $(".item_list li:last-child").addClass("rubberBand animated opacity");
        setTimeout(function () {
            $(".item_list li:last-child").removeClass("rubberBand animated opacity");
        }, 1500);
    };
});

/***/ })
/******/ ]);