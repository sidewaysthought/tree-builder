let people = [];
let nextId = 1;

const form = document.getElementById('person-form');
const list = document.getElementById('people-list');
const saveBtn = document.getElementById('save-btn');
const openBtn = document.getElementById('open-btn');

form.addEventListener('submit', event => {
  event.preventDefault();
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
});

list.addEventListener('click', event => {
  const button = event.target.closest('button[data-action="delete"]');
  if (button) {
    const id = parseInt(button.dataset.id, 10);
    people = people.filter(p => p.id !== id);
    renderPeople();
  }
});

saveBtn.addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(people, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'family.json';
  a.click();
  URL.revokeObjectURL(url);
});

openBtn.addEventListener('click', () => {
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
  list.innerHTML = '';
  for (const person of people) {
    const li = document.createElement('li');
    li.className = 'p-4 flex justify-between items-center';
    li.innerHTML = `
      <div>
        <p class="font-medium">${person.firstName} ${person.lastName}</p>
        <p class="text-sm text-gray-600">ID: ${person.id}</p>
      </div>
      <button data-action="delete" data-id="${person.id}" class="inline-flex items-center text-red-600" aria-label="Delete person ${person.id}">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
        <span class="ml-1">Delete</span>
      </button>
    `;
    list.appendChild(li);
  }
}
