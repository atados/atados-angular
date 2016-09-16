/* global ouibounce */

var handle = window.addEventListener ? 'addEventListener' : 'attachEvent';

var body = document.querySelector('body');
var dialog;
var underlay = document.querySelector('#exit-intent .modal-backdrop');
var target = document.querySelector('#exit-intent');
var closeButton;

var _targetClassname;
var _bodyClassName;

ouibounce(target, {
  sensitivity: 40,
  delay: 150,
  sitewide: true,
  aggressive: true,
  callback: function() {
    setTimeout(function() {
      dialog = document.querySelector('#exit-intent .modal-dialog')
      closeButton = document.querySelector('#modal-form-news-close-button')

      closeButton[handle]('click', function() {
        target.className = _targetClassname
        document.body.className = _bodyClassName
      })

      _targetClassname = target.className
      _bodyClassName = body.className
      target.className += " in"
      document.body.className += " modal-open"
    }, 20)
  }
});




underlay[handle]('click', function (e) {
  if (!dialog.contains(e.target)) {
    target.className = _targetClassname
    document.body.className = _bodyClassName
  }
});

