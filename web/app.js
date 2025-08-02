let people = [];
let nextId = 1;

document.addEventListener('DOMContentLoaded', () => {
  const addBtn = document.getElementById('add-btn');
  const emptyBtn = document.getElementById('empty-btn');
  const exportBtn = document.getElementById('export-btn');
  const importBtn = document.getElementById('import-btn');
  const overlay = document.getElementById('overlay');
  const drawer = document.getElementById('drawer');
  const form = document.getElementById('person-form');
  const cancelBtn = document.getElementById('cancel-btn');
  const tableBody = document.getElementById('people-body');
  const birthDateInput = document.getElementById('birth-date');
  const deathDateInput = document.getElementById('death-date');
  const firstNameInput = document.getElementById('first-name');
  const lastNameInput = document.getElementById('last-name');
  const birthPlaceInput = document.getElementById('birth-place');
  const deathPlaceInput = document.getElementById('death-place');
  const genderSelect = document.getElementById('gender');
  const parentSelect = document.getElementById('parent-id');
  const partnerSelect = document.getElementById('partner-id');
  const idInput = document.getElementById('person-id');
  const heading = document.getElementById('add-person-heading');

  function renderPeople() {
    tableBody.innerHTML = '';
    for (const person of people) {
      const parent = people.find(p => p.id === person.parentId);
      const partner = people.find(p => p.id === person.partnerId);
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="px-4 py-2">${person.id}</td>
        <td class="px-4 py-2">${person.firstName}</td>
        <td class="px-4 py-2">${person.lastName}</td>
        <td class="px-4 py-2">${parent ? parent.firstName + ' ' + parent.lastName : ''}</td>
        <td class="px-4 py-2">${partner ? partner.firstName + ' ' + partner.lastName : ''}</td>
        <td class="px-4 py-2 flex gap-1">
          <button data-id="${person.id}" class="edit-btn inline-flex items-center rounded bg-gray-200 px-2 py-1 text-gray-800">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"/>
            </svg>
            <span>Edit</span>
          </button>
          <button data-id="${person.id}" class="delete-btn inline-flex items-center rounded bg-gray-200 px-2 py-1 text-gray-800">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3H4m16 0h-4"/>
            </svg>
            <span>Delete</span>
          </button>
        </td>
      `;
      tableBody.appendChild(tr);
    }
    tableBody.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.id, 10);
        const person = people.find(p => p.id === id);
        if (person) {
          openDrawer(person);
        }
      });
    });
    tableBody.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.id, 10);
        people = people.filter(p => p.id !== id);
        for (const p of people) {
          if (p.parentId === id) p.parentId = undefined;
          if (p.partnerId === id) p.partnerId = undefined;
        }
        renderPeople();
      });
    });
  }

  function populateRelationshipOptions(currentId = null) {
    parentSelect.innerHTML = '<option value="">Select</option>';
    partnerSelect.innerHTML = '<option value="">Select</option>';
    for (const p of people) {
      if (p.id === currentId) continue;
      const label = `${p.id}: ${p.lastName}, ${p.firstName} (${p.birthDate} - ${p.deathDate})`;
      const parentOption = document.createElement('option');
      parentOption.value = p.id;
      parentOption.textContent = label;
      parentSelect.appendChild(parentOption);
      const partnerOption = document.createElement('option');
      partnerOption.value = p.id;
      partnerOption.textContent = label;
      partnerSelect.appendChild(partnerOption);
    }
  }

  function openDrawer(person = null) {
    populateRelationshipOptions(person ? person.id : null);
    if (person) {
      heading.textContent = 'Edit Person';
      idInput.value = person.id;
      firstNameInput.value = person.firstName;
      lastNameInput.value = person.lastName;
      birthDateInput.value = person.birthDate;
      deathDateInput.value = person.deathDate;
      birthPlaceInput.value = person.birthPlace;
      deathPlaceInput.value = person.deathPlace;
      genderSelect.value = person.gender;
      parentSelect.value = person.parentId || '';
      partnerSelect.value = person.partnerId || '';
    } else {
      heading.textContent = 'Add Person';
      form.reset();
      idInput.value = '';
    }
    overlay.classList.remove('hidden');
    overlay.setAttribute('aria-hidden', 'false');
    drawer.classList.remove('translate-y-full');
    firstNameInput.focus();
  }

  function closeDrawer() {
    overlay.classList.add('hidden');
    overlay.setAttribute('aria-hidden', 'true');
    drawer.classList.add('translate-y-full');
    addBtn.focus();
  }

  function maskDateInput(e) {
    let v = e.target.value.replace(/\D/g, '').slice(0, 8);
    let result = '';
    if (v.length > 0) {
      result = v.slice(0, 4);
      if (v.length > 4) {
        result += '-' + v.slice(4, 6);
        if (v.length > 6) {
          result += '-' + v.slice(6, 8);
        }
      }
    }
    e.target.value = result;
  }

  addBtn.addEventListener('click', openDrawer);
  cancelBtn.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeDrawer();
    }
  });

  birthDateInput.addEventListener('input', maskDateInput);
  deathDateInput.addEventListener('input', maskDateInput);

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const data = new FormData(form);
    const id = data.get('id');
    if (id) {
      const person = people.find(p => p.id === parseInt(id, 10));
      if (person) {
        person.firstName = data.get('firstName') || '';
        person.lastName = data.get('lastName') || '';
        person.birthDate = data.get('birthDate') || '';
        person.deathDate = data.get('deathDate') || '';
        person.birthPlace = data.get('birthPlace') || '';
        person.deathPlace = data.get('deathPlace') || '';
        person.gender = data.get('gender') || '';
        person.parentId = data.get('parentId') ? parseInt(data.get('parentId'), 10) : undefined;
        person.partnerId = data.get('partnerId') ? parseInt(data.get('partnerId'), 10) : undefined;
      }
    } else {
      const person = {
        id: nextId++,
        firstName: data.get('firstName') || '',
        lastName: data.get('lastName') || '',
        birthDate: data.get('birthDate') || '',
        deathDate: data.get('deathDate') || '',
        birthPlace: data.get('birthPlace') || '',
        deathPlace: data.get('deathPlace') || '',
        gender: data.get('gender') || '',
        parentId: data.get('parentId') ? parseInt(data.get('parentId'), 10) : undefined,
        partnerId: data.get('partnerId') ? parseInt(data.get('partnerId'), 10) : undefined
      };
      people.push(person);
    }
    renderPeople();
    form.reset();
    closeDrawer();
  });

  emptyBtn.addEventListener('click', () => {
    people = [];
    nextId = 1;
    renderPeople();
  });

  exportBtn.addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(people, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'family.json';
    a.click();
    URL.revokeObjectURL(url);
  });

  importBtn.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = e => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = ev => {
        try {
          const data = JSON.parse(ev.target.result);
          if (Array.isArray(data)) {
            people = data;
            nextId = data.reduce((max, p) => Math.max(max, p.id), 0) + 1;
            renderPeople();
          }
        } catch (err) {
          console.error('Invalid file', err);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  });

  renderPeople();
});

