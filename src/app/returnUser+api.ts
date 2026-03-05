export async function POST(request: Request): Promise<Response> {
  const { email, password } = await request.json();
  
  return Response.json({
    email,
    password,
  })
}