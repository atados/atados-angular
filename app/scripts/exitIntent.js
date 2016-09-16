/* global ouibounce */

var handle = window.addEventListener ? 'addEventListener' : 'attachEvent';

var body = document.querySelector('body');
var modal = document.querySelector('#exit-intent .modal');
var underlay = document.querySelector('#exit-intent .underlay');
var target = document.querySelector('#exit-intent');

ouibounce(target, {
  sensitivity: 40,
  delay: 150,
  sitewide: true,
  aggressive: true,
  callback: function() {
    setTimeout(function() {
      target.className += " in"
      document.body.className += "modal-open"
    }, 20)
  }
});

// body[handle]('click', function () {
//   target.style.display = 'none';
// });

// underlay[handle]('click', function () {
//   target.style.display = 'none';
// });

// modal[handle]('click', function (e) {
//   e.stopPropagation();
// });
