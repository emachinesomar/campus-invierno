(() => {
  // Theme toggle
  const html = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const themeLabel = document.getElementById('themeLabel');

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    const isDark = theme === 'dark';
    themeToggle.setAttribute('aria-pressed', String(isDark));
    themeIcon.textContent = isDark ? '☀️' : '🌙';
    themeLabel.textContent = isDark ? 'Modo claro' : 'Modo oscuro';
  }

  const savedTheme = localStorage.getItem('campus-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(savedTheme || (prefersDark ? 'dark' : 'light'));

  themeToggle.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    localStorage.setItem('campus-theme', next);
    applyTheme(next);
  });

  // Form elements
  const form = document.getElementById('mainForm');
  const participantsGrid = document.getElementById('participantsGrid');
  const addParticipantBtn = document.getElementById('addParticipantBtn');
  const hpField = document.getElementById('hp-field');

  const sumCount = document.getElementById('sumCount');
  const sumMaterial = document.getElementById('sumMaterial');
  const sumDonation = document.getElementById('sumDonation');
  const sumTotal = document.getElementById('sumTotal');
  const formPartCount = document.getElementById('formPartCount');
  const formMatCost = document.getElementById('formMatCost');
  const formTotalCost = document.getElementById('formTotalCost');

  const progressSteps = document.getElementById('progressSteps');
  const liveSummary = document.getElementById('liveSummary');

  const voluntarioCheck = document.getElementById('voluntario-check');
  const daysSelection = document.getElementById('daysSelection');
  const daysCounter = document.getElementById('daysCounter');
  const daysGrid = document.getElementById('daysGrid');
  const allDaysCheck = document.getElementById('voluntario-todos');

  const donacionSelect = document.getElementById('donacion-select');
  const donacionCustom = document.getElementById('donacionCustom');

  const hpError = document.createElement('p');
  hpError.className = 'error-msg';
  hpError.hidden = true;
  const captchaContainer = document.querySelector('.captcha__container');
  if (captchaContainer) {
    captchaContainer.appendChild(hpError);
  } else {
    form.appendChild(hpError);
  }

  function showHpError() {
    hpError.textContent = 'No rellenar este campo anti-bot';
    hpError.hidden = false;
    form.reportValidity();
  }

  function hideHpError() {
    hpError.hidden = true;
  }

  // Captcha
  const captchaDisplay = document.getElementById('captchaDisplay');
  const captchaInput = document.getElementById('captchaInput');
  const refreshCaptchaBtn = document.getElementById('refreshCaptchaBtn');
  const captchaError = document.getElementById('captchaError');

  let currentCaptcha = '';

  function generateCaptcha() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    currentCaptcha = Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    captchaDisplay.textContent = currentCaptcha;
    captchaError.hidden = true;
    captchaInput.value = '';
  }

  refreshCaptchaBtn.addEventListener('click', generateCaptcha);
  generateCaptcha();

  // Participants
  let participantUid = 0;

  function inferGroupFromDob(dobStr) {
    if (!dobStr) return '';
    const dob = new Date(dobStr);
    if (Number.isNaN(dob.getTime())) return '';
    const ref = new Date(2026, 11, 23);
    let age = ref.getFullYear() - dob.getFullYear();
    const m = ref.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && ref.getDate() < dob.getDate())) age--;
    if (age <= 5) return 'Etapa Infantil';
    if (age <= 8) return '1º a 3º de Primaria';
    if (age <= 10) return '4º a 5º de Primaria';
    if (age <= 14) return '6º de Primaria a 3º de la ESO';
    return 'A partir de 4º de la ESO';
  }

  function createParticipantCard(id) {
    participantUid += 1;
    const uid = participantUid;
    const card = document.createElement('div');
    card.className = 'participant-card';
    card.innerHTML = `
      <div class="participant-card__top">
        <span class="participant-card__title">Participante</span>
        <button type="button" class="btn btn--ghost btn--sm remove-part-btn">Eliminar</button>
      </div>
      <div class="participant-card__fields">
        <div class="field">
          <label for="p_nom_${uid}" class="form-label">Nombre completo del participante <span class="form-required">*</span></label>
          <input type="text" id="p_nom_${uid}" name="participante_nombre[]" placeholder="Ej. Lucía Martínez" required>
        </div>
        <div class="field">
          <label for="p_dob_${uid}" class="form-label">Fecha de nacimiento <span class="form-required">*</span></label>
          <input type="date" id="p_dob_${uid}" name="participante_nacimiento[]" required>
        </div>
        <div class="field">
          <label for="p_grp_${uid}" class="form-label">Grupo / Etapa <span class="form-required">*</span></label>
          <select id="p_grp_${uid}" name="participante_grupo[]" required>
            <option value="">Selecciona o calcula por fecha...</option>
            <option value="Etapa Infantil">Etapa Infantil — Acompañado por un adulto</option>
            <option value="1º a 3º de Primaria">1º a 3º de Primaria — Autónomo</option>
            <option value="4º a 5º de Primaria">4º a 5º de Primaria — Autónomo</option>
            <option value="6º de Primaria a 3º de la ESO">6º de Primaria a 3º de la ESO — Autónomo</option>
            <option value="A partir de 4º de la ESO">A partir de 4º de la ESO — Voluntariado y Formación</option>
          </select>
        </div>
        <div class="field field--full companion-field" hidden>
          <label for="p_comp_${uid}" class="form-label">Adulto acompañante (Etapa Infantil) <span class="form-required">*</span></label>
          <input type="text" id="p_comp_${uid}" name="participante_adulto_acompanante[]" placeholder="Nombre completo y parentesco del adulto que le acompañará las 5 horas">
        </div>
      </div>
    `;

    const dobInput = card.querySelector(`#p_dob_${uid}`);
    const grpSelect = card.querySelector(`#p_grp_${uid}`);
    const removeBtn = card.querySelector('.remove-part-btn');

    dobInput.addEventListener('change', () => {
      const inferred = inferGroupFromDob(dobInput.value);
      if (inferred) {
        grpSelect.value = inferred;
      }
      updateSummary();
    });
    grpSelect.addEventListener('change', updateSummary);
    removeBtn.addEventListener('click', () => {
      card.remove();
      renumberParticipants();
      updateSummary();
    });

    participantsGrid.appendChild(card);
    renumberParticipants();
    updateSummary();
  }

  function renumberParticipants() {
    const cards = [...participantsGrid.querySelectorAll('.participant-card')];
    cards.forEach((card, idx) => {
      card.querySelector('.participant-card__title').textContent = `Participante #${idx + 1}`;
      const removeBtn = card.querySelector('.remove-part-btn');
      removeBtn.hidden = cards.length === 1;
    });
    updateSummary();
  }

  function updateSummary() {
    const count = participantsGrid.querySelectorAll('.participant-card').length;
    const matCost = count * 5;
    let donation = 0;
    if (donacionSelect.value === 'otro') {
      donation = Math.max(0, Number(donacionCustom.value) || 0);
    } else {
      donation = Number(donacionSelect.value) || 0;
    }
    const total = matCost + donation;
    sumCount.textContent = String(count);
    sumMaterial.textContent = `${matCost}€`;
    sumDonation.textContent = `${donation}€`;
    sumTotal.textContent = `${total}€`;
    formPartCount.textContent = String(count);
    formMatCost.textContent = `${matCost}€`;
    formTotalCost.textContent = `${total}€`;
    return total;
  }

  // Volunteer
  voluntarioCheck.addEventListener('change', () => {
    daysSelection.hidden = !voluntarioCheck.checked;
  });

  function updateDaysCounter() {
    const inputs = daysGrid.querySelectorAll('input[name="voluntario-dias[]"]');
    const checked = inputs.filter((i) => i.checked).length;
    daysCounter.textContent = `${checked} ${checked === 1 ? 'día seleccionado' : 'días seleccionados'}`;
    allDaysCheck.checked = checked === inputs.length;
  }

  document.querySelectorAll('input[name="voluntario-dias[]"]').forEach((inp) => inp.addEventListener('change', updateDaysCounter));
  allDaysCheck.addEventListener('change', () => {
    document.querySelectorAll('input[name="voluntario-dias[]"]').forEach((inp) => { inp.checked = allDaysCheck.checked; });
    updateDaysCounter();
  });

  // Donation
  donacionSelect.addEventListener('change', () => {
    donacionCustom.hidden = donacionSelect.value !== 'otro';
    if (donacionSelect.value !== 'otro') donacionCustom.value = '';
    updateSummary();
  });
  donacionCustom.addEventListener('input', updateSummary);

  // Initialize participants
  function createParticipant() {
    createParticipantCard(0);
  }
  addParticipantBtn.addEventListener('click', createParticipant);
  updateSummary();

  // Form submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const hp = hpField.value.trim();
    if (hp) return showHpError();
    hideHpError();

    if (!form.reportValidity()) {
      showHpError();
      return;
    }

    if (captchaInput.value.trim().toUpperCase() !== currentCaptcha) {
      captchaError.hidden = false;
      captchaInput.focus();
      return;
    }
    captchaError.hidden = true;

    const total = updateSummary();
    const randomNum = String(Math.floor(1000 + Math.random() * 9000));
    const locatorCode = document.getElementById('locatorCode');
    locatorCode.textContent = `NAV-26-${randomNum}`;
    const dialogTotal = document.getElementById('dialogTotal');
    dialogTotal.textContent = `${total}€`;
    const metodo = form.querySelector('input[name="metodo-pago"]:checked')?.value;
    const bizumInfo = document.getElementById('bizumInfo');
    bizumInfo.hidden = metodo !== 'bizum';

    const confirmDialog = document.getElementById('confirmDialog');
    confirmDialog.showModal();
  });

  const copyBizumBtn = document.getElementById('copyBizumBtn');
  copyBizumBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText('634541119');
      copyBizumBtn.textContent = '¡Copiado!';
      setTimeout(() => { copyBizumBtn.textContent = 'Copiar Teléfono'; }, 2000);
    } catch {
      showHpError();
    }
  });

  const closeDialogBtn = document.getElementById('closeDialogBtn');
  const newRegBtn = document.getElementById('newRegBtn');
  const resetBtn = document.getElementById('resetBtn');
  const confirmDialog = document.getElementById('confirmDialog');

  closeDialogBtn.addEventListener('click', () => confirmDialog.close());
  newRegBtn.addEventListener('click', () => {
    confirmDialog.close();
    resetAll();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  function resetAll() {
    form.reset();
    participantsGrid.replaceChildren();
    createParticipant();
    daysSelection.hidden = true;
    donacionCustom.hidden = true;
    updateDaysCounter();
    updateSummary();
    generateCaptcha();
    hpField.value = '';
    hpError.hidden = true;
    confirmDialog.close();
  }

  resetBtn.addEventListener('click', () => {
    resetAll();
    showToast('Formulario limpiado.');
  });

  function showToast(msg) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '1';
      setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => document.body.removeChild(toast), 300);
      }, 3000);
    }, 100);
  }

  // Initialize
  createParticipant();
  updateSummary();
})();