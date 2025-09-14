// ----------- LOGIN -----------
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      email: loginForm.email.value,
      senha: loginForm.senha.value,
    };

    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok && result.token) {
        localStorage.setItem("token", result.token);
        alert("Login feito com sucesso!");
        window.location.href = "matricula.html";
      } else {
        alert(result.error || "Erro no login");
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao conectar com o servidor.");
    }
  });
}

// ----------- CADASTRO -----------
const cadastroForm = document.getElementById("cadastroForm");
if (cadastroForm) {
  cadastroForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      nome: cadastroForm.nome.value,
      email: cadastroForm.email.value,
      senha: cadastroForm.senha.value,
    };

    try {
      const res = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (res.ok) {
        alert(result.msg || "Cadastro realizado!");
        window.location.href = "login.html";
      } else {
        alert(result.error || "Erro ao cadastrar!");
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao conectar com o servidor.");
    }
  });
}

// ----------- MATRÍCULA -----------
const matriculaForm = document.getElementById("matriculaForm");
if (matriculaForm) {
  matriculaForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Você precisa estar logado!");
      return;
    }

    const data = {
      unidade: matriculaForm.unidade.value,
      categoria: matriculaForm.categoria.value,
    };

    try {
      const res = await fetch("http://localhost:3000/api/matriculas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (res.ok && result.matricula) {
        alert("Matrícula realizada com sucesso!");
        matriculaForm.reset();
      } else {
        alert(result.error || "Erro na matrícula");
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao conectar com o servidor.");
    }
  });
}