const API = "http://localhost:3000/api/admin";
const token = localStorage.getItem("token");

if (!token) {
  alert("Você precisa estar logado!");
  window.location.href = "login.html";
}

// Logout
document.getElementById("logoutBtn")?.addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "login.html";
});

// Função para criar tabela com botões
function criarTabela(id, dados, colunas, tipo = "") {
  const table = document.getElementById(id);
  table.innerHTML = "";
  let header = "<tr>";
  colunas.forEach((c) => (header += `<th>${c.header || c.key}</th>`));
  if (tipo) header += "<th>Ações</th>";
  header += "</tr>";
  table.innerHTML = header;

  dados.forEach((d) => {
    let row = `<tr data-id="${d.id}">`;
    colunas.forEach((c) => {
      const val = typeof c.get === "function" ? c.get(d) : d[c.key];
      row += `<td>${val ?? ""}</td>`;
    });

    if (tipo === "user") {
      row += `
        <td>
          <button class="btn" onclick="editarUser(${d.id})">Editar</button>
          <button class="btn" onclick="excluirUser(${d.id})">Excluir</button>
        </td>`;
    }

    if (tipo === "matricula") {
      row += `
        <td>
          <button class="btn" onclick="editarMatricula(${d.id}, '${d.unidade}', '${d.categoria}')">Editar</button>
          <button class="btn" onclick="excluirMatricula(${d.id})">Excluir</button>
        </td>`;
    }

    if (tipo === "login") {
      row += `
        <td>
          <button class="btn" onclick="excluirLogin(${d.id})">Excluir</button>
        </td>`;
    }

    row += "</tr>";
    table.innerHTML += row;
  });
}

// FETCH DATA
async function fetchUsers() {
  const res = await fetch(`${API}/users`, { headers: { Authorization: `Bearer ${token}` } });
  const data = await res.json();
  criarTabela("usersTable", data, [
    { key: "id", header: "ID" },
    { key: "nome", header: "Nome" },
    { key: "email", header: "Email" },
  ], "user");
}

async function fetchMatriculas() {
  const res = await fetch(`${API}/matriculas`, { headers: { Authorization: `Bearer ${token}` } });
  const data = await res.json();
  criarTabela("matriculasTable", data, [
    { key: "id", header: "ID" },
    { key: "user", header: "Usuário", get: (m) => m.User?.nome ?? "Usuário excluído" },
    { key: "unidade", header: "Unidade" },
    { key: "categoria", header: "Categoria" },
  ], "matricula");
}

async function fetchLogins() {
  const res = await fetch(`${API}/logins`, { headers: { Authorization: `Bearer ${token}` } });
  const data = await res.json();
  criarTabela("loginsTable", data, [
    { key: "id", header: "ID" },
    { key: "user", header: "Usuário", get: (l) => l.User?.nome ?? "Usuário excluído" },
    { key: "loginAt", header: "Data/Hora" },
    { key: "userId", header: "User ID" },
  ], "login");
}

// USER ACTIONS
async function excluirUser(id) {
  if (!confirm("Deseja excluir este usuário?")) return;
  const res = await fetch(`${API}/users/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
  const data = await res.json();
  alert(data.message);

  // Remove linha da tabela
  const row = document.querySelector(`#usersTable tr[data-id='${id}']`);
  if (row) row.remove();
}

async function editarUser(id) {
  const nome = prompt("Novo nome:");
  const email = prompt("Novo email:");
  if (!nome || !email) return;
  const res = await fetch(`${API}/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ nome, email }),
  });
  alert((await res.json()).message);
  fetchUsers();
}

// MATRICULA ACTIONS
async function excluirMatricula(id) {
  if (!confirm("Deseja excluir esta matrícula?")) return;
  const res = await fetch(`${API}/matriculas/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
  const data = await res.json();
  alert(data.message);

  const row = document.querySelector(`#matriculasTable tr[data-id='${id}']`);
  if (row) row.remove();
}

async function editarMatricula(id, unidade, categoria) {
  const novaUnidade = prompt("Nova unidade:", unidade);
  const novaCategoria = prompt("Nova categoria:", categoria);
  if (!novaUnidade || !novaCategoria) return;

  const res = await fetch(`${API}/matriculas/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ unidade: novaUnidade, categoria: novaCategoria }),
  });
  alert((await res.json()).message);
  fetchMatriculas();
}

// LOGIN ACTIONS
async function excluirLogin(id) {
  if (!confirm("Deseja excluir este login?")) return;
  const res = await fetch(`${API}/logins/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
  const data = await res.json();
  alert(data.message);

  // Remove a linha da tabela
  const row = document.querySelector(`#loginsTable tr[data-id='${id}']`);
  if (row) row.remove();

  // Opcional: recarregar tabela
  await fetchLogins();
}

// INIT
(async function init() {
  await fetchUsers();
  await fetchMatriculas();
  await fetchLogins();
})();
