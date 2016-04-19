'use strict';
window.$ = window.jQuery = require("./js/jquery-2.2.3.min.js");
const myButton = document.getElementById('notification');
console.log(require('remote').getGlobal('sharedObject')[0]["model"]);
const globalState = require('remote');
let birthdayArray;
let mainTbl = $('.table tbody');

// helper functions
let createEl = function(el) {
    return document.createElement(el);
};

let createText = function(text) {
  return document.createTextNode(text);
}

require('electron').ipcRenderer.on('ping', function(event, message) {
  let birthdayArray = message;
  let table = $('.mainBody')[0];
  $('.birthday-row').empty();

  birthdayArray.forEach(function(item) {
    let row = createEl('tr');
    row.className = "birthday-row";
    let data1 = createEl('th');
    let data2 = createEl('th');
    let data3 = createEl('th');
    let text1 = createText(item.name);
    let text2 = createText(item.day);
    let text3 = createText(item.birthdayMonth);
    data1.appendChild(text1);
    data2.appendChild(text2); 
    data3.appendChild(text3);   
    row.appendChild(data1);
    row.appendChild(data2);
    row.appendChild(data3);
    table.appendChild(row);
  })
});