let people = [];
let nextId = 1;

const addBtn = document.getElementById('add-btn');
const emptyBtn = document.getElementById('empty-btn');
const exportBtn = document.getElementById('export-btn');
const importBtn = document.getElementById('import-btn');
const overlay = document.getElementById('overlay');
const drawer = document.getElementById('drawer');
const form = document.getElementById('person-form');
const cancelBtn = document.getElementById('cancel-btn');
const tableBody = document.getElementById('people-body');

addBtn.addEventListener('click', openDrawer);
cancelBtn.addEventListener('click', closeDrawer);
overlay.addEventListener('click', closeDrawer);

form.addEventListener('submit', e => {
  e.preventDefault();
  const data = new FormData(form);
  const person = {
    id: nextId++,
    firstName: data.get('firstName') || '',
    lastName: data.get('lastName') || '',
    birthDate: data.get('birthDate') || '',
    deathDate: data.get('deathDate') || '',
    birthPlace: data.get('birthPlace') || '',
    deathPlace: data.get('deathPlace') || '',
    gender: data.get('gender') || ''
  };
  people.push(person);
  renderPeople();
  form.reset();
  closeDrawer();
});

emptyBtn.addEventListener('click', () => {
  people = [];
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

function renderPeople() {
  tableBody.innerHTML = '';
  for (const person of people) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="px-4 py-2">${person.id}</td>
      <td class="px-4 py-2">${person.firstName}</td>
      <td class="px-4 py-2">${person.lastName}</td>
    `;
    tableBody.appendChild(tr);
  }
}

function openDrawer() {
  overlay.classList.remove('hidden');
  drawer.classList.remove('translate-y-full');
}

function closeDrawer() {
  overlay.classList.add('hidden');
  drawer.classList.add('translate-y-full');
}

renderPeople();

