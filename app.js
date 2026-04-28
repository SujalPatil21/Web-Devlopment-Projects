  let currentStep = 1;

  // ── HELPERS ──────────────────────────────────────
  function showErr(id, show) {
    const el = document.getElementById('err_' + id);
    if (el) el.classList.toggle('show', show);
  }
  function markField(id, valid) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.toggle('valid', valid);
    el.classList.toggle('invalid', !valid);
  }
  function val(id) { return document.getElementById(id)?.value.trim() || ''; }

  // ── STEP NAVIGATION ──────────────────────────────
  function goStep(n) {
    document.getElementById('formStep' + currentStep).style.display = 'none';
    currentStep = n;
    document.getElementById('formStep' + currentStep).style.display = 'block';
    updateProgress();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function updateProgress() {
    for (let i = 1; i <= 4; i++) {
      const el = document.getElementById('step' + i);
      el.classList.remove('active', 'done');
      if (i < currentStep) el.classList.add('done');
      if (i === currentStep) el.classList.add('active');
    }
  }

  // ── STEP 1 VALIDATION ────────────────────────────
  function validateStep1() {
    let ok = true;

    // First name
    const fn = val('firstName');
    const fnOk = fn.length >= 2 && /^[a-zA-Z\s]+$/.test(fn);
    showErr('firstName', !fnOk); markField('firstName', fnOk);
    if (!fnOk) ok = false;

    // Last name
    const ln = val('lastName');
    const lnOk = ln.length >= 1 && /^[a-zA-Z\s]+$/.test(ln);
    showErr('lastName', !lnOk); markField('lastName', lnOk);
    if (!lnOk) ok = false;

    // Father name
    const fath = val('fatherName');
    const fathOk = fath.length >= 2;
    showErr('fatherName', !fathOk); markField('fatherName', fathOk);
    if (!fathOk) ok = false;

    // DOB
    const dob = val('dob');
    let dobOk = false;
    if (dob) {
      const age = (new Date() - new Date(dob)) / (1000*60*60*24*365.25);
      dobOk = age >= 18 && age <= 60;
    }
    document.getElementById('err_dob').textContent = dob ? (dobOk ? '' : '⚠ Age must be between 18–60 years') : '⚠ Date of birth is required';
    showErr('dob', !dobOk); markField('dob', dobOk);
    if (!dobOk) ok = false;

    // Gender
    const gOk = val('gender') !== '';
    showErr('gender', !gOk); markField('gender', gOk);
    if (!gOk) ok = false;

    // Category
    const cOk = val('category') !== '';
    showErr('category', !cOk); markField('category', cOk);
    if (!cOk) ok = false;

    // Email
    const email = val('email');
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    showErr('email', !emailOk); markField('email', emailOk);
    if (!emailOk) ok = false;

    // Mobile
    const mob = val('mobile');
    const mobOk = /^[6-9]\d{9}$/.test(mob);
    showErr('mobile', !mobOk); markField('mobile', mobOk);
    if (!mobOk) ok = false;

    // Address
    const addr = val('address');
    const addrOk = addr.length >= 10;
    showErr('address', !addrOk); markField('address', addrOk);
    if (!addrOk) ok = false;

    // Nationality
    const natOk = val('nationality') !== '';
    showErr('nationality', !natOk); markField('nationality', natOk);
    if (!natOk) ok = false;

    // Aadhar
    const aadhar = val('aadhar');
    const aadharOk = /^\d{12}$/.test(aadhar);
    showErr('aadhar', !aadharOk); markField('aadhar', aadharOk);
    if (!aadharOk) ok = false;

    if (ok) goStep(2);
  }

  // ── STEP 2 VALIDATION ────────────────────────────
  function validateStep2() {
    let ok = true;

    const fields = [
      { id: 'degree',  test: v => v !== '' },
      { id: 'branch',  test: v => v.length >= 2 },
      { id: 'college', test: v => v.length >= 3 },
      { id: 'yop',     test: v => v !== '' },
      { id: 'cgpa',    test: v => v.length >= 1 },
      { id: 'rollno',  test: v => v.length >= 2 },
      { id: 'state',   test: v => v !== '' },
    ];

    fields.forEach(f => {
      const v = val(f.id);
      const pass = f.test(v);
      showErr(f.id, !pass); markField(f.id, pass);
      if (!pass) ok = false;
    });

    if (ok) goStep(3);
  }

  // ── STEP 3 VALIDATION ────────────────────────────
  function validateStep3() {
    let ok = true;

    // Paper
    const paperOk = val('paper') !== '';
    showErr('paper', !paperOk); markField('paper', paperOk);
    if (!paperOk) ok = false;

    // City 1
    const c1Ok = val('city1') !== '';
    showErr('city1', !c1Ok); markField('city1', c1Ok);
    if (!c1Ok) ok = false;

    // City 2
    const c2 = val('city2');
    const c2Ok = c2 !== '';
    showErr('city2', !c2Ok); markField('city2', c2Ok);
    if (!c2Ok) ok = false;

    // Cities must differ
    if (c2Ok && c1Ok && val('city1') === c2) {
      document.getElementById('err_city2').textContent = '⚠ City 2 must differ from City 1';
      showErr('city2', true); markField('city2', false);
      ok = false;
    }

    // Photo
    const photoOk = document.getElementById('photoInput').files.length > 0;
    showErr('photo', !photoOk);
    if (!photoOk) ok = false;

    // Declaration
    const declOk = document.getElementById('declare').checked;
    showErr('declare', !declOk);
    if (!declOk) ok = false;

    if (ok) submitForm();
  }

  // ── PHOTO PREVIEW ─────────────────────────────────
  function previewPhoto(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 200 * 1024) {
      alert('Photo must be under 200 KB.');
      e.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = ev => {
      const preview = document.getElementById('photoPreview');
      preview.src = ev.target.result;
      preview.style.display = 'block';
      document.getElementById('photoIcon').style.display = 'none';
      document.getElementById('photoText').textContent = file.name;
    };
    reader.readAsDataURL(file);
  }

  // ── SUBMIT ────────────────────────────────────────
  function submitForm() {
    // Generate random application ID
    const appId = 'GATE26-' + Math.random().toString(36).substring(2,7).toUpperCase() + '-' + Math.floor(1000+Math.random()*9000);
    document.getElementById('appId').textContent = appId;

    // Hide form steps, show success
    document.getElementById('formStep3').style.display = 'none';
    document.getElementById('progressBar').style.display = 'none';
    document.getElementById('successScreen').style.display = 'block';

    // Mark all steps done
    for (let i = 1; i <= 4; i++) {
      document.getElementById('step' + i)?.classList.add('done');
      document.getElementById('step' + i)?.classList.remove('active');
    }
  }

  // ── RESET ────────────────────────────────────────
  function resetForm() {
    document.querySelectorAll('input:not([type="checkbox"]), select, textarea').forEach(el => el.value = '');
    document.getElementById('declare').checked = false;
    document.getElementById('photoPreview').style.display = 'none';
    document.getElementById('photoIcon').style.display = 'block';
    document.getElementById('photoText').textContent = 'Click or drag to upload photo';
    document.querySelectorAll('.valid, .invalid').forEach(el => el.classList.remove('valid','invalid'));
    document.querySelectorAll('.error-msg.show').forEach(el => el.classList.remove('show'));

    document.getElementById('successScreen').style.display = 'none';
    document.getElementById('progressBar').style.display = 'flex';
    currentStep = 1;
    document.getElementById('formStep1').style.display = 'block';
    updateProgress();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ── LIVE VALIDATION ───────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('mobile').addEventListener('input', function() {
      this.value = this.value.replace(/\D/g,'');
    });
    document.getElementById('aadhar').addEventListener('input', function() {
      this.value = this.value.replace(/\D/g,'');
    });
  });