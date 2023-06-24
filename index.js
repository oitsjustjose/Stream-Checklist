const key = "checklist-items";
const objs = JSON.parse(window.localStorage.getItem(key) || "{}");
let currentId = 0;

const save = () => {
  window.localStorage.setItem(key, JSON.stringify(objs));
};

const updateChecklistItem = (id, name, done) => {
  objs[id] = { name, done };
};

const deleteChecklistItem = (id) => {
  delete objs[id];
  save();
};

const onChange = () => {
  save();
  render();
};

const render = () => {
  const checklistEl = document.getElementById("checklist");
  checklistEl.innerHTML = "";

  Object.keys(objs).forEach(id => {
    const { name, done } = objs[id];
    const inputGroup = document.createElement('div');
    inputGroup.className = 'input-group mb-3';

    /* Prepend (for the checkbox) */
    const inputPrepend = document.createElement('div');
    inputPrepend.className = 'input-group-prepend';
    const inputPrependGroupText = document.createElement('div');
    inputPrependGroupText.className = 'input-group-text';

    /* Checkbox and input together so they can read each other's vals on change */
    const checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    checkbox.ariaLabel = "Checkbox for following text input";
    checkbox.checked = done;
    inputPrependGroupText.appendChild(checkbox);
    inputPrepend.appendChild(inputPrependGroupText);

    const input = document.createElement('input');
    input.type = "text";
    input.className = "form-control";
    input.ariaLabel = "Text input with checkbox";
    input.value = name;
    input.style.textDecoration = done ? 'line-through' : 'none';
    input.id = `${id}-${name}`;

    input.addEventListener('input', _ => {
      updateChecklistItem(id, input.value, checkbox.checked);
      save();
    });

    checkbox.addEventListener('change', _ => {
      updateChecklistItem(id, input.value, checkbox.checked);
      if (checkbox.checked) {
        input.style.textDecoration = 'line-through';
      } else {
        input.style.textDecoration = 'none';
      }
      save();
    });

    /* The delete button */
    const inputGroupAppend = document.createElement('div');
    inputGroupAppend.className = 'input-group-append';
    const btn = document.createElement('button');
    btn.className = "btn btn-danger";
    btn.type = 'button';
    btn.addEventListener('click', _ => {
      deleteChecklistItem(id);
      onChange();
    });
    btn.innerHTML = `
      <svg class="svg-icon" viewBox="0 0 20 20">
        <path d="M17.114,3.923h-4.589V2.427c0-0.252-0.207-0.459-0.46-0.459H7.935c-0.252,0-0.459,0.207-0.459,0.459v1.496h-4.59c-0.252,0-0.459,0.205-0.459,0.459c0,0.252,0.207,0.459,0.459,0.459h1.51v12.732c0,0.252,0.207,0.459,0.459,0.459h10.29c0.254,0,0.459-0.207,0.459-0.459V4.841h1.511c0.252,0,0.459-0.207,0.459-0.459C17.573,4.127,17.366,3.923,17.114,3.923M8.394,2.886h3.214v0.918H8.394V2.886z M14.686,17.114H5.314V4.841h9.372V17.114z M12.525,7.306v7.344c0,0.252-0.207,0.459-0.46,0.459s-0.458-0.207-0.458-0.459V7.306c0-0.254,0.205-0.459,0.458-0.459S12.525,7.051,12.525,7.306M8.394,7.306v7.344c0,0.252-0.207,0.459-0.459,0.459s-0.459-0.207-0.459-0.459V7.306c0-0.254,0.207-0.459,0.459-0.459S8.394,7.051,8.394,7.306"></path>
      </svg>
    `;
    inputGroupAppend.appendChild(btn);

    inputGroup.appendChild(inputPrepend);
    inputGroup.appendChild(input);
    inputGroup.appendChild(inputGroupAppend);
    checklistEl.appendChild(inputGroup);
  });
};

const load = () => {
  if (objs) {
    try {
      currentId = Math.max(Object.keys(objs));
    } catch (ex) {
      alert(`Failed to load saved checklist: ${ex}`);
    }
  }

  document.getElementById('form').addEventListener('submit', evt => {
    evt.preventDefault();
    evt.stopPropagation();

    currentId += 1;
    objs[currentId] = {
      name: document.getElementById('new-item-name').value,
      done: document.getElementById('new-item-done').checked
    };
    onChange();
    document.getElementById('new-item-name').value = '';
    document.getElementById('new-item-done').checked = false;
  });

  render();
};



window.addEventListener('load', load);
