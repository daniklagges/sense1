$('#loginForm').submit(function (e) {
  e.preventDefault();

  const email = $('#email').val();
  const password = $('#password').val();

  if (email === '' || password === '') {
    mostrarAlerta('Todos los campos son obligatorios', 'danger');
    return;
  }

  localStorage.setItem('usuario', email);
  localStorage.setItem('saldo', localStorage.getItem('saldo') || 1000);

  mostrarAlerta('Login exitoso, redirigiendo...', 'success');

  setTimeout(() => {
    window.location.href = 'menu.html';
  }, 1500);
});

function mostrarAlerta(mensaje, tipo) {
  $('#alert-container').html(`
    <div class="alert alert-${tipo} mt-3">${mensaje}</div>
  `);
}
