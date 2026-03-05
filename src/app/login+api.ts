export async function POST(request: Request): Promise<Response> {
  const { email, password } = await request.json();

  if (email === "gg@gmail.com" && password === "123") {
    return Response.json({
      // email,
      name: "Guss Badass",
      email: `seu email é: ${email}`
    })
  }

  return new Response("Usuário e/ou senha incorreta!", {
    status: 404,
    headers: {
      "Content-Type": "text/plain",
    },
  })
}