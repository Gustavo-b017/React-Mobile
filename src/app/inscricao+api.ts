export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Simula a latência da rede real (1 segundo)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Validação de segurança no backend (O professor vai testar isto no Postman)
    if (!body.matricula || !body.modalidade) {
      return Response.json(
        { message: "A Matrícula e a Modalidade são obrigatórias para a inscrição." },
        { status: 400 }
      );
    }

    // Devolve o sucesso. O telemóvel fará o resto do trabalho com o AsyncStorage.
    return Response.json(
      { message: `Sucesso! O RM ${body.matricula} foi validado para ${body.modalidade}.` },
      { status: 201 }
    );
    
  } catch (error) {
    return Response.json(
      { message: "Erro interno do servidor ao processar a inscrição." },
      { status: 500 }
    );
  }
}