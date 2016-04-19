'use strict';
const ipcRenderer = require('electron').ipcRenderer;
$('#add-birthdays').submit(function(e) {
  e.preventDefault();
  let name = $('#name').val();
  let day = $('#day').val();
  let month = $('#month').val(); 
  let yob = $('#year').val(); 
  ipcRenderer.send('inputs-form', {
    birthdayMonth: month, 
    name: name, 
    day: day, 
    year: yob
  });
  $('#name').val('');
  $('#day').val('');
  $('#month').val('');
  $('#year').val('');
})