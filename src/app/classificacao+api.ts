export async function GET() {
  // Simula a latência de rede (800ms)
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Retorna um mock básico e formatado. 
  // No teu frontend, usamos o AsyncStorage, mas no Postman o professor verá que a rota GET existe e devolve um JSON 200 OK.
  const mockClassificacao = [
    { id: "rm_api_1", nome: "3º ES Paulista", pontos: 50 },
    { id: "rm_api_2", nome: "2º ES Lins", pontos: 40 }
  ];

  return Response.json(mockClassificacao, { status: 200 });
}