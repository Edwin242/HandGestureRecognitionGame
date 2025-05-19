import './bootstrap';
import $ from 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

document.addEventListener('DOMContentLoaded', function () {
  const buttonlogin = document.getElementById('btn-login');
  if (buttonlogin) {
    buttonlogin.addEventListener('click', () => {
      document.getElementById('welcome').classList.add('d-none');
      document.getElementById('login').classList.remove('d-none');
    });
  }
});
