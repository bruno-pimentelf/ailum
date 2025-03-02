import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    // Pegar o instanceName da URL
    const url = new URL(request.url);
    const instanceName = url.searchParams.get("instanceName");
    
    console.log("API Status - Verificando instância:", instanceName);
    
    if (!instanceName) {
      console.log("API Status - Nome da instância não fornecido");
      return NextResponse.json(
        { error: "Nome da instância é obrigatório" },
        { status: 400 }
      );
    }

    const evolutionApiUrl = process.env.EVOLUTION_API_URL;
    const evolutionApiKey = process.env.EVOLUTION_API_KEY;

    if (!evolutionApiUrl || !evolutionApiKey) {
      console.log("API Status - Configuração da Evolution API não encontrada");
      return NextResponse.json(
        { error: "Configuração da Evolution API não encontrada" },
        { status: 500 }
      );
    }

    // Verificar status da instância na Evolution API
    const apiUrl = `${evolutionApiUrl}/instance/connectionState/${instanceName}`;
    console.log("API Status - Fazendo requisição para:", apiUrl);
    
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "apikey": evolutionApiKey
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Status - Erro ao verificar status da instância:", errorData);
      return NextResponse.json(
        { error: "Erro ao verificar status da instância", details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("API Status - Resposta recebida:", data);
    
    // A resposta da Evolution API já vem com o formato correto
    // Vamos apenas repassar a resposta como está
    const result = data;
    
    console.log("API Status - Retornando:", result);
    return NextResponse.json(result);
  } catch (error) {
    console.error("API Status - Erro ao verificar status da instância:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 