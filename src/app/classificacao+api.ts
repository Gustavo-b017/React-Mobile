export async function GET() {
  // Simula latência de rede para testar a UI do frontend
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Lógica Sênior: Gera pontos dinâmicos para provar o Pull-to-Refresh a funcionar!
  const turmasBase = [
    { id: "1", nome: "3º ES Paulista" },
    { id: "2", nome: "2º ES Lins" },
    { id: "3", nome: "1º ADS" },
    { id: "4", nome: "2º SI" },
    { id: "5", nome: "3º BD" },
  ];

  const classificacaoDinamica = turmasBase.map(turma => ({
    ...turma,
    pontos: Math.floor(Math.random() * 50) + 10 // Gera pontuação aleatória entre 10 e 60
  }));

  return Response.json(classificacaoDinamica, { status: 200 });
}