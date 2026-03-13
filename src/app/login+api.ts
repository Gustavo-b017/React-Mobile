export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // A MÁGICA: Simula um servidor real com 1.5s de delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // LÓGICA SÊNIOR: Trata a string para evitar erros bobos de teclado (espaços e maiúsculas)
    const loginTratado = email ? email.trim().toLowerCase() : "";

    // Validação flexível e segura
    if ((loginTratado === "rm123456" || loginTratado.includes("@")) && password === "123") {
      return Response.json(
        { message: "Acesso autorizado!", email: loginTratado },
        { status: 200 }
      );
    }

    return Response.json(
      { message: "Credenciais inválidas. Tente RM: rm123456 e Senha: 123" },
      { status: 401 }
    );
  } catch (error) {
    return Response.json(
      { message: "Erro interno no servidor." },
      { status: 500 }
    );
  }
}