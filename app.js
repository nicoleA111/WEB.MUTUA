
'use strict';

/* ========================================
   MUTUA — JAVASCRIPT PRINCIPAL
======================================== */

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciarMUTUA);
} else {
    iniciarMUTUA();
}

function iniciarMUTUA() {
    initMobileMenu();
    initHeader();
    initSmoothScroll();
    initSkillFilters();
    initSkillSearch();
    initAccount();
    initFavorites();
    initSkillConnections();
    initOtherButtons();
    initChatbot();
    initCurrentYear();

    // Recuperar la sesión si el usuario actualizó la página.
    initUserSession();

    console.log('MUTUA: plataforma iniciada correctamente.');
}

/* ========================================
   MENÚ MÓVIL
======================================== */

function initMobileMenu() {
    const menuButton = document.getElementById('menuToggle');
    const navigation = document.querySelector('.nav-links');

    if (!menuButton || !navigation) return;

    menuButton.addEventListener('click', () => {
        const isOpen = navigation.classList.toggle('active');

        menuButton.classList.toggle('active', isOpen);
        menuButton.setAttribute('aria-expanded', String(isOpen));
    });

    navigation.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navigation.classList.remove('active');
            menuButton.classList.remove('active');
            menuButton.setAttribute('aria-expanded', 'false');
        });
    });
}

/* ========================================
   ENCABEZADO
======================================== */

function initHeader() {
    const header = document.querySelector('.header');

    if (!header) return;

    const update = () => {
        header.classList.toggle('scrolled', window.scrollY > 30);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
}

/* ========================================
   DESPLAZAMIENTO SUAVE
======================================== */

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', event => {
            const id = link.getAttribute('href');

            if (!id || id === '#') return;

            const target = document.querySelector(id);

            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    });
}

/* ========================================
   BUSCADOR Y FILTROS DE HABILIDADES
======================================== */

function initSkillFilters() {
    const buttons = document.querySelectorAll(
        '#categoryList .category-chip'
    );

    const select = document.getElementById('categoryFilter');

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.dataset.category || 'all';

            buttons.forEach(item => {
                item.classList.remove('selected');
                item.classList.remove('active');
            });

            button.classList.add('selected');

            if (select) {
                select.value = category;
            }

            filterSkills();
        });
    });

    if (select) {
        select.addEventListener('change', () => {
            buttons.forEach(button => {
                const active = button.dataset.category === select.value;

                button.classList.toggle('selected', active);
                button.classList.toggle('active', active);
            });

            filterSkills();
        });
    }

    const searchButton = document.getElementById('searchBtn');

    if (searchButton) {
        searchButton.addEventListener('click', filterSkills);
    }
}

function initSkillSearch() {
    const search = document.getElementById('skillSearch');

    if (search) {
        search.addEventListener('input', filterSkills);
    }
}

function filterSkills() {
    const search = document.getElementById('skillSearch');
    const select = document.getElementById('categoryFilter');

    const query = search
        ? search.value.trim().toLowerCase()
        : '';

    const category = select
        ? select.value
        : 'all';

    const cards = document.querySelectorAll(
        '#skillsGrid .skill-card'
    );

    let visible = 0;

    cards.forEach(card => {
        const cardCategory = (
            card.dataset.category || ''
        ).toLowerCase();

        const text = (
            card.innerText || card.textContent || ''
        ).toLowerCase();

        const searchText = (
            card.dataset.search || ''
        ).toLowerCase();

        const matchesCategory =
            category === 'all' || cardCategory === category;

        const matchesSearch =
            text.includes(query) || searchText.includes(query);

        const show = matchesCategory && matchesSearch;

        card.hidden = !show;

        if (show) visible++;
    });

    const emptyMessage = document.getElementById('emptySkills');

    if (emptyMessage) {
        emptyMessage.hidden = visible !== 0;
    }
}

/* ========================================
   CUENTAS: REGISTRO E INICIO DE SESIÓN
======================================== */

function initAccount() {
    const modal = document.getElementById('modalOverlay');
    const form = document.getElementById('accountForm');

    if (!modal || !form) return;

    const loginButton = document.getElementById('loginBtn');
    const registerButton = document.getElementById('registerBtn');
    const finalRegisterButton = document.getElementById('finalRegisterBtn');
    const closeButton = document.getElementById('modalClose');
    const switchButton = document.getElementById('switchAccountMode');

    const nameField = document.getElementById('nameField');
    const nameInput = document.getElementById('accountName');
    const emailInput = document.getElementById('accountEmail');
    const passwordInput = document.getElementById('accountPassword');
    const submitButton = document.getElementById('accountSubmit');

    const title = document.getElementById('modalTitle');
    const description = document.getElementById('modalDescription');
    const message = document.getElementById('formMessage');
    const modalSwitch = document.getElementById('modalSwitch');

    let isRegistering = false;

    function setMessage(text, error = false) {
        message.textContent = text;
        message.style.color = error ? '#d93025' : '';
    }

    function changeMode(registering) {
        isRegistering = registering;

        nameField.hidden = !registering;
        nameInput.required = registering;

        passwordInput.autocomplete = registering
            ? 'new-password'
            : 'current-password';

        title.textContent = registering
            ? 'Crear cuenta en MUTUA'
            : 'Bienvenido a MUTUA';

        description.textContent = registering
            ? 'Completa tus datos para formar parte de la comunidad.'
            : 'Ingresa para continuar aprendiendo y compartiendo.';

        submitButton.textContent = registering
            ? 'Crear cuenta'
            : 'Iniciar sesión';

        modalSwitch.childNodes[0].textContent = registering
            ? '¿Ya tienes cuenta? '
            : '¿Aún no tienes cuenta?';

        switchButton.textContent = registering
            ? 'Inicia sesión'
            : 'Regístrate';

        setMessage('');
    }

    function openModal(registering = false) {
        changeMode(registering);
        modal.hidden = false;
        document.body.style.overflow = 'hidden';

        setTimeout(() => {
            if (registering) {
                nameInput.focus();
            } else {
                emailInput.focus();
            }
        }, 100);
    }

    function closeModal() {
        modal.hidden = true;
        document.body.style.overflow = '';
        form.reset();
        changeMode(false);
    }

    if (loginButton) {
        loginButton.addEventListener('click', () => openModal(false));
    }

    if (registerButton) {
        registerButton.addEventListener('click', () => openModal(true));
    }

    if (finalRegisterButton) {
        finalRegisterButton.addEventListener('click', () => openModal(true));
    }

    if (closeButton) {
        closeButton.addEventListener('click', closeModal);
    }

    if (switchButton) {
        switchButton.addEventListener('click', () => {
            changeMode(!isRegistering);
        });
    }

    modal.addEventListener('click', event => {
        if (event.target === modal) closeModal();
    });

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && !modal.hidden) {
            closeModal();
        }
    });

    form.addEventListener('submit', async event => {
        event.preventDefault();

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        if (!window.supabaseClient) {
            setMessage(
                'No se pudo conectar con Supabase. Revisa supabase.js.',
                true
            );
            return;
        }

        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const name = nameInput.value.trim();

        submitButton.disabled = true;
        submitButton.textContent = 'Procesando...';
        setMessage('');

        try {
            if (isRegistering) {
                const { data, error } =
                    await window.supabaseClient.auth.signUp({
                        email,
                        password,
                        options: {
                            data: {
                                nombre_completo: name
                            }
                        }
                    });

                if (error) throw error;

                if (data.session) {
                    setMessage('¡Tu cuenta fue creada correctamente!');
                    await cargarUsuario(data.user, true);
                } else {
                    setMessage(
                        'Cuenta creada. Revisa tu correo para confirmar el registro.'
                    );
                }

            } else {
                const { data, error } =
                    await window.supabaseClient.auth.signInWithPassword({
                        email,
                        password
                    });

                if (error) throw error;

                setMessage('¡Inicio de sesión exitoso!');

                await new Promise(resolve => setTimeout(resolve, 600));

                closeModal();
                await cargarUsuario(data.user, true);
            }

        } catch (error) {
            console.error('Error de cuenta:', error);

            setMessage(
                traducirError(error.message),
                true
            );

        } finally {
            submitButton.disabled = false;
            submitButton.textContent = isRegistering
                ? 'Crear cuenta'
                : 'Iniciar sesión';
        }
    });
}

function traducirError(error) {
    const text = (error || '').toLowerCase();

    if (text.includes('invalid login credentials')) {
        return 'Correo o contraseña incorrectos.';
    }

    if (text.includes('user already registered')) {
        return 'Este correo ya tiene una cuenta registrada.';
    }

    if (text.includes('password')) {
        return 'La contraseña no cumple los requisitos.';
    }

    if (text.includes('email')) {
        return 'Revisa que el correo electrónico sea válido.';
    }

    return 'No se pudo completar la operación: ' + error;
}

/* ========================================
   SESIÓN Y ENCABEZADO DEL USUARIO
======================================== */

let usuarioActual = null;

async function initUserSession() {
    if (!window.supabaseClient) return;

    try {
        const { data, error } =
            await window.supabaseClient.auth.getSession();

        if (error) throw error;

        if (data.session?.user) {
            await cargarUsuario(data.session.user, false);
        }

        window.supabaseClient.auth.onAuthStateChange(
            async (event, session) => {
                if (event === 'SIGNED_OUT') {
                    usuarioActual = null;
                    mostrarBotonesInvitado();
                    return;
                }

                if (session?.user) {
                    await cargarUsuario(session.user, false);
                }
            }
        );

    } catch (error) {
        console.error('Error al recuperar sesión:', error);
    }
}

async function cargarUsuario(user, mostrarFormulario = false) {
    if (!user) return;

    usuarioActual = user;

    try {
        const { data: perfil, error } = await window.supabaseClient
            .from('perfiles')
            .select('nombre_completo, telefono, ciudad, descripcion, foto_url')
            .eq('id', user.id)
            .maybeSingle();

        if (error) throw error;

        actualizarEncabezado(perfil, user);

        if (mostrarFormulario) {
            await abrirPerfil(user, perfil);
        }

    } catch (error) {
        console.error('Error al cargar los datos del usuario:', error);
        actualizarEncabezado(null, user);
        showToast('No se pudieron cargar todos los datos del perfil.');
    }
}

function actualizarEncabezado(perfil, user) {
    const acciones = document.querySelector('.nav-actions');

    if (!acciones) return;

    const nombre =
        perfil?.nombre_completo ||
        user.user_metadata?.nombre_completo ||
        user.email?.split('@')[0] ||
        'Mi perfil';

    const foto = perfil?.foto_url ||
        'https://placehold.co/100x100?text=M';

    acciones.innerHTML = `
        <button type="button" id="miPerfilBtn"
            style="
                display:flex;
                align-items:center;
                gap:9px;
                border:1px solid #e5e5e5;
                background:white;
                border-radius:30px;
                padding:5px 13px 5px 5px;
                cursor:pointer;
                color:#222;
                font:inherit;
            ">
            <img id="fotoUsuarioHeader"
                src="${escaparAtributo(foto)}"
                alt="Foto de perfil"
                style="
                    width:38px;
                    height:38px;
                    border-radius:50%;
                    object-fit:cover;
                ">
            <span style="font-weight:600;">
                ${escaparHTML(nombre)}
            </span>
        </button>

        <button type="button" id="cerrarSesionBtn"
            class="btn btn-outline">
            Cerrar sesión
        </button>
    `;

    document.getElementById('miPerfilBtn').addEventListener('click', () => {
        abrirPerfil(usuarioActual);
    });

    document.getElementById('cerrarSesionBtn').addEventListener(
        'click',
        cerrarSesion
    );

    const fotoHeader = document.getElementById('fotoUsuarioHeader');

    fotoHeader.addEventListener('error', () => {
        fotoHeader.src = 'https://placehold.co/100x100?text=M';
    });
}

function mostrarBotonesInvitado() {
    const acciones = document.querySelector('.nav-actions');

    if (!acciones) return;

    acciones.innerHTML = `
        <button type="button" class="btn btn-outline" id="loginBtn">
            Iniciar sesión
        </button>
        <button type="button" class="btn btn-primary" id="registerBtn">
            Crear cuenta
        </button>
    `;

    initAccount();
}

async function cerrarSesion() {
    if (!window.supabaseClient) return;

    const confirmar = confirm('¿Seguro que deseas cerrar sesión?');

    if (!confirmar) return;

    try {
        const { error } = await window.supabaseClient.auth.signOut();

        if (error) throw error;

        usuarioActual = null;
        mostrarBotonesInvitado();
        showToast('Sesión cerrada correctamente.');

    } catch (error) {
        console.error('Error al cerrar sesión:', error);
        showToast('No se pudo cerrar la sesión.');
    }
}

/* ========================================
   PERFIL: CONSULTAR Y EDITAR
======================================== */

async function abrirPerfil(user, perfilExistente = null) {
    if (!user || !window.supabaseClient) return;

    try {
        let perfil = perfilExistente;

        if (!perfil) {
            const { data, error } = await window.supabaseClient
                .from('perfiles')
                .select('nombre_completo, telefono, ciudad, descripcion, foto_url')
                .eq('id', user.id)
                .maybeSingle();

            if (error) throw error;

            perfil = data;
        }

        crearModalPerfil();

        const modal = document.getElementById('perfilModal');
        const formulario = document.getElementById('formPerfil');
        const mensaje = document.getElementById('mensajePerfil');
        const guardar = document.getElementById('guardarPerfil');
        const fotoInput = document.getElementById('perfilFoto');
        const vistaFoto = document.getElementById('vistaFotoPerfil');

        document.getElementById('perfilNombre').value =
            perfil?.nombre_completo ||
            user.user_metadata?.nombre_completo || '';

        document.getElementById('perfilTelefono').value =
            perfil?.telefono || '';

        document.getElementById('perfilCiudad').value =
            perfil?.ciudad || '';

        document.getElementById('perfilDescripcion').value =
            perfil?.descripcion || '';

        document.getElementById('perfilCorreo').textContent =
            user.email || '';

        vistaFoto.src = perfil?.foto_url ||
            'https://placehold.co/150x150?text=Foto';

        fotoInput.value = '';
        mensaje.textContent = '';

        let fotoTemporal = null;

        fotoInput.onchange = () => {
            const archivo = fotoInput.files[0];

            if (!archivo) return;

            if (!archivo.type.startsWith('image/')) {
                mensaje.textContent = 'Selecciona una imagen válida.';
                mensaje.style.color = 'red';
                fotoInput.value = '';
                return;
            }

            if (archivo.size > 5 * 1024 * 1024) {
                mensaje.textContent = 'La imagen no debe superar los 5 MB.';
                mensaje.style.color = 'red';
                fotoInput.value = '';
                return;
            }

            if (fotoTemporal) {
                URL.revokeObjectURL(fotoTemporal);
            }

            fotoTemporal = URL.createObjectURL(archivo);
            vistaFoto.src = fotoTemporal;
            mensaje.textContent = '';
        };

        function cerrarModalPerfil() {
            modal.style.display = 'none';
            document.body.style.overflow = '';

            if (fotoTemporal) {
                URL.revokeObjectURL(fotoTemporal);
                fotoTemporal = null;
            }

            formulario.onsubmit = null;
        }

        document.getElementById('cerrarPerfil').onclick =
            cerrarModalPerfil;

        modal.onclick = event => {
            if (event.target === modal) {
                cerrarModalPerfil();
            }
        };

        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        formulario.onsubmit = async event => {
            event.preventDefault();

            if (!formulario.checkValidity()) {
                formulario.reportValidity();
                return;
            }

            guardar.disabled = true;
            guardar.textContent = 'Guardando...';
            mensaje.textContent = '';

            try {
                let fotoUrl = perfil?.foto_url || null;
                const archivo = fotoInput.files[0];

                if (archivo) {
                    const extensionOriginal =
                        archivo.name.split('.').pop().toLowerCase();

                    const extension = /^[a-z0-9]+$/.test(extensionOriginal)
                        ? extensionOriginal
                        : 'jpg';

                    const nombreArchivo =
                        `${user.id}/${Date.now()}.${extension}`;

                    const { error: errorSubida } =
                        await window.supabaseClient.storage
                            .from('fotos-perfil')
                            .upload(nombreArchivo, archivo, {
                                upsert: false,
                                contentType: archivo.type
                            });

                    if (errorSubida) throw errorSubida;

                    const { data: urlData } =
                        window.supabaseClient.storage
                            .from('fotos-perfil')
                            .getPublicUrl(nombreArchivo);

                    fotoUrl = urlData.publicUrl;
                }

                const datosPerfil = {
                    id: user.id,
                    nombre_completo:
                        document.getElementById('perfilNombre').value.trim(),
                    telefono:
                        document.getElementById('perfilTelefono').value.trim(),
                    ciudad:
                        document.getElementById('perfilCiudad').value.trim(),
                    descripcion:
                        document.getElementById('perfilDescripcion').value.trim(),
                    foto_url: fotoUrl
                };

                const { error: errorGuardar } =
                    await window.supabaseClient
                        .from('perfiles')
                        .upsert(datosPerfil, { onConflict: 'id' });

                if (errorGuardar) throw errorGuardar;

                perfil = datosPerfil;

                actualizarEncabezado(perfil, user);

                mensaje.textContent = '¡Perfil guardado correctamente!';
                mensaje.style.color = 'green';

                showToast('Tu perfil está actualizado.');

                setTimeout(cerrarModalPerfil, 900);

            } catch (error) {
                console.error('Error al guardar perfil:', error);
                mensaje.textContent = 'Error: ' + error.message;
                mensaje.style.color = 'red';

            } finally {
                guardar.disabled = false;
                guardar.textContent = 'Guardar cambios';
            }
        };

    } catch (error) {
        console.error('Error al abrir perfil:', error);
        showToast('No se pudo cargar tu perfil.');
    }
}

function crearModalPerfil() {
    if (document.getElementById('perfilModal')) return;

    const modal = document.createElement('div');
    modal.id = 'perfilModal';

    modal.style.cssText = `
        position:fixed;
        inset:0;
        background:rgba(0,0,0,0.7);
        z-index:99999;
        display:none;
        align-items:center;
        justify-content:center;
        padding:20px;
    `;

    modal.innerHTML = `
        <div style="
            background:white;
            color:#222;
            padding:28px;
            border-radius:16px;
            width:100%;
            max-width:460px;
            max-height:90vh;
            overflow-y:auto;
            box-sizing:border-box;
        ">
            <button id="cerrarPerfil" type="button"
                aria-label="Cerrar perfil"
                style="
                    float:right;
                    border:0;
                    background:transparent;
                    font-size:24px;
                    cursor:pointer;
                ">×</button>

            <h2 style="margin-top:5px;">Mi perfil MUTUA</h2>
            <p style="color:#666;">
                Consulta y actualiza tu información personal.
            </p>

            <p id="perfilCorreo"
                style="font-size:13px;color:#777;overflow-wrap:anywhere;">
            </p>

            <form id="formPerfil">
                <div style="text-align:center;margin:20px 0;">
                    <img id="vistaFotoPerfil"
                        alt="Foto de perfil"
                        style="
                            width:115px;
                            height:115px;
                            border-radius:50%;
                            object-fit:cover;
                            border:3px solid #ddd;
                            display:block;
                            margin:0 auto 12px;
                        ">

                    <label for="perfilFoto"
                        style="cursor:pointer;color:#555;font-weight:600;">
                        Cambiar foto de perfil
                    </label>

                    <input id="perfilFoto"
                        type="file"
                        accept="image/*"
                        style="display:block;margin:10px auto;">
                    <small style="color:#777;">
                        Imagen de máximo 5 MB.
                    </small>
                </div>

                <label for="perfilNombre">Nombre completo</label>
                <input id="perfilNombre" type="text" required
                    style="
                        width:100%;padding:11px;margin:7px 0 15px;
                        box-sizing:border-box;
                    ">

                <label for="perfilTelefono">Teléfono</label>
                <input id="perfilTelefono" type="tel" required
                    style="
                        width:100%;padding:11px;margin:7px 0 15px;
                        box-sizing:border-box;
                    ">

                <label for="perfilCiudad">Ciudad</label>
                <input id="perfilCiudad" type="text" required
                    style="
                        width:100%;padding:11px;margin:7px 0 15px;
                        box-sizing:border-box;
                    ">

                <label for="perfilDescripcion">Descripción personal</label>
                <textarea id="perfilDescripcion"
                    rows="4"
                    placeholder="Cuéntanos sobre ti..."
                    style="
                        width:100%;padding:11px;margin:7px 0 15px;
                        box-sizing:border-box;
                        resize:vertical;
                    "></textarea>

                <button id="guardarPerfil" type="submit"
                    style="
                        width:100%;
                        padding:13px;
                        border:0;
                        border-radius:8px;
                        background:#6750d8;
                        color:white;
                        font-weight:600;
                        cursor:pointer;
                    ">
                    Guardar cambios
                </button>

                <p id="mensajePerfil" role="status"
                    style="text-align:center;"></p>
            </form>
        </div>
    `;

    document.body.appendChild(modal);
}

/* ========================================
   SEGURIDAD: TEXTO PARA HTML
======================================== */

function escaparHTML(texto) {
    return String(texto ?? '').replace(/[&<>"']/g, caracter => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    })[caracter]);
}

function escaparAtributo(texto) {
    return escaparHTML(texto);
}

/* ========================================
   FAVORITOS
======================================== */

function initFavorites() {
    document.querySelectorAll('.favorite-btn').forEach(button => {
        button.addEventListener('click', () => {
            const favorite = button.classList.toggle('favorited');

            button.textContent = favorite ? '♥' : '♡';
            button.setAttribute('aria-pressed', String(favorite));
        });
    });
}

/* ========================================
   CONECTAR CON UNA HABILIDAD
======================================== */

function initSkillConnections() {
    document.querySelectorAll('.contact-btn').forEach(button => {
        button.addEventListener('click', () => {
            const skill = button.dataset.skill || 'esta habilidad';

            showToast(
                'Para conectar con ' + skill +
                ', inicia sesión en MUTUA.'
            );

            const loginButton = document.getElementById('loginBtn');

            if (loginButton) loginButton.focus();
        });
    });
}

/* ========================================
   OTROS BOTONES
======================================== */

function initOtherButtons() {
    const publishButton = document.getElementById('publishBtn');
    const shareButton = document.getElementById('shareResourceBtn');

    if (publishButton) {
        publishButton.addEventListener('click', () => {
            openAccountFromOtherButton(true);
        });
    }

    if (shareButton) {
        shareButton.addEventListener('click', () => {
            openAccountFromOtherButton(true);
        });
    }
}

function openAccountFromOtherButton(registering) {
    if (usuarioActual) {
        abrirPerfil(usuarioActual);
        return;
    }

    const button = document.getElementById('registerBtn');

    if (button) {
        button.click();
    } else {
        showToast('La función estará disponible al iniciar sesión.');
    }
}

/* ========================================
   NOTIFICACIONES
======================================== */

function showToast(text) {
    const toast = document.getElementById('toast');

    if (!toast) return;

    toast.textContent = text;
    toast.hidden = false;

    if (showToast.timeout) {
        clearTimeout(showToast.timeout);
    }

    showToast.timeout = setTimeout(() => {
        toast.hidden = true;
    }, 3500);
}

/* ========================================
   CHATBOT MUTUA
======================================== */

function initChatbot() {
    const toggle = document.getElementById('chat-toggle');
    const chatbox = document.getElementById('chatbox');
    const close = document.getElementById('chat-close');
    const messages = document.getElementById('chat-messages');
    const options = document.getElementById('chat-options');
    const home = document.getElementById('chat-home');

    if (!toggle || !chatbox || !close || !messages || !options || !home) {
        console.warn(
            'MUTUA: no se encontraron todos los elementos del chatbot.'
        );
        return;
    }

    const menus = {
        inicio: {
            message: '¡Hola! Bienvenido a MUTUA. Selecciona el tema sobre el que necesitas ayuda.',
            options: [
                ['¿Cómo funciona la plataforma?', 'funciona'],
                ['¿Cómo puedo registrarme?', 'registro'],
                ['¿Cómo intercambio habilidades?', 'intercambio'],
                ['¿Cómo encuentro personas?', 'personas'],
                ['¿Cómo puedo contactar?', 'contacto']
            ]
        },

        funciona: {
            message: 'Nuestra plataforma conecta personas que quieren enseñar y aprender habilidades mediante intercambios, sin utilizar dinero.',
            options: [
                ['¿Cómo puedo registrarme?', 'registro'],
                ['¿Cómo intercambio habilidades?', 'intercambio'],
                ['Volver al menú', 'inicio']
            ]
        },

        registro: {
            message: 'Para registrarte debes crear una cuenta, completar tus datos y agregar las habilidades que puedes enseñar y las que quieres aprender.',
            options: [
                ['¿Qué habilidades puedo ofrecer?', 'habilidades'],
                ['Volver al menú', 'inicio']
            ]
        },

        intercambio: {
            message: 'Selecciona una habilidad que quieras aprender, encuentra a alguien que pueda enseñarla y envíale una solicitud de intercambio.',
            options: [
                ['¿Cómo encuentro personas?', 'personas'],
                ['¿Cómo puedo registrarme?', 'registro'],
                ['Volver al menú', 'inicio']
            ]
        },

        personas: {
            message: 'Puedes explorar los perfiles de otros usuarios y revisar qué conocimientos ofrecen y cuáles desean aprender.',
            options: [
                ['¿Cómo intercambio habilidades?', 'intercambio'],
                ['Volver al menú', 'inicio']
            ]
        },

        contacto: {
            message: 'Puedes comunicarte con nosotros mediante el formulario de contacto disponible en la plataforma.',
            options: [
                ['Volver al menú', 'inicio']
            ]
        },

        habilidades: {
            message: 'Puedes ofrecer conocimientos de idiomas, dibujo, música, cocina, tecnología, programación y muchas otras áreas.',
            options: [
                ['¿Cómo intercambio habilidades?', 'intercambio'],
                ['Volver al menú', 'inicio']
            ]
        }
    };

    function addMessage(text, type) {
        const div = document.createElement('div');

        div.className = 'message ' + type;
        div.textContent = text;

        messages.appendChild(div);
        messages.scrollTop = messages.scrollHeight;
    }

    function showMenu(name) {
        const selected = menus[name];

        if (!selected) return;

        addMessage(selected.message, 'bot');
        options.replaceChildren();

        selected.options.forEach(item => {
            const button = document.createElement('button');

            button.type = 'button';
            button.textContent = item[0];

            button.addEventListener('click', () => {
                addMessage(item[0], 'user');
                showMenu(item[1]);
            });

            options.appendChild(button);
        });
    }

    toggle.addEventListener('click', () => {
        chatbox.classList.add('active');
    });

    close.addEventListener('click', () => {
        chatbox.classList.remove('active');
    });

    home.addEventListener('click', () => {
        addMessage('Volver al menú principal', 'user');
        showMenu('inicio');
    });

    showMenu('inicio');
}

/* ========================================
   AÑO AUTOMÁTICO
======================================== */

function initCurrentYear() {
    document.querySelectorAll('[data-current-year], #current-year')
        .forEach(element => {
            element.textContent = new Date().getFullYear();
        });
}

// Version MUTUA actualizada
