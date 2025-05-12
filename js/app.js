const API = 'http://leoproti.com.br:8004/alunos';
// DOM
const form = document.getElementById('aluno-form');
const bodyTable = document.getElementById('alunos-body');
const feedback = document.getElementById('feedback');
const modal = document.getElementById('modal');
const editForm = document.getElementById('edit-form');

// Fetch util corrigido
async function request(url = '', opts = {}) {
  try {
    const res = await fetch(API + url, opts);
    if (!res.ok) throw new Error(res.statusText);
    return await res.json();
  } catch (e) {
    feedback.textContent = 'Erro na API: ' + e.message;
    console.error(e);
  }
}

// Carrega lista de alunos ao abrir a página
window.onload = loadAlunos;
async function loadAlunos() {
  const alunos = await request('-view');
  bodyTable.innerHTML = '';
  alunos.forEach(a => {
    bodyTable.innerHTML += 
      `<tr>
        <td><img src="img/placeholder.jpg" alt="avatar"></td>
        <td>${a.nome}</td>
        <td>${a.email}</td>
        <td>${a.idade}</td>
        <td>
          <button onclick="openEdit(${a.id})" title="Editar aluno">✏️</button>
          <button onclick="del(${a.id})" title="Excluir aluno">🗑️</button>
        </td>
      </tr>`;
  });
}

// Criar novo aluno (POST)
form.addEventListener('submit', async e => {
  e.preventDefault();
  const data = {
    nome: form.nome.value,
    email: form.email.value,
    idade: +form.idade.value
  };
  await request('', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify(data)
  });
  feedback.textContent = 'Aluno cadastrado com sucesso!';
  form.reset();
  loadAlunos();
});

// Abrir modal de edição (PUT)
window.openEdit = async id => {
  const [aluno] = await request(`-view?id=${id}`);
  document.getElementById('edit-id').value = aluno.id;
  document.getElementById('edit-nome').value = aluno.nome;
  document.getElementById('edit-email').value = aluno.email;
  document.getElementById('edit-idade').value = aluno.idade;
  modal.classList.remove('hidden');
};

// Fechar modal ao clicar no “×”
document.getElementById('close-modal').onclick = () =>
  modal.classList.add('hidden');

// Submeter edição
editForm.addEventListener('submit', async e => {
  e.preventDefault();
  const id = editForm['edit-id'].value;
  const body = {
    nome: editForm['edit-nome'].value,
    email: editForm['edit-email'].value,
    idade: +editForm['edit-idade'].value
  };
  await request(`/${id}`, {
    method: 'PUT',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify(body)
  });
  modal.classList.add('hidden');
  loadAlunos();
});

// Excluir aluno (DELETE)
window.del = async id => {
  if (confirm('Confirmar exclusão deste aluno?')) {
    await request(`/${id}`, { method: 'DELETE' });
    loadAlunos();
  }
};
