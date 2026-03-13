export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Simula a latência da rede real (1.5 segundos) para a UI mostrar o Loading
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Validação de segurança no backend
    if (!body.matricula || !body.modalidade) {
      return Response.json(
        { message: "A Matrícula e a Modalidade são obrigatórias." },
        { status: 400 }
      );
    }

    return Response.json(
      { message: `Sucesso! O RM ${body.matricula} foi inscrito no torneio de ${body.modalidade}.` },
      { status: 201 }
    );
    
  } catch (error) {
    return Response.json(
      { message: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}