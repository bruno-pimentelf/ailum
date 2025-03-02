import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { instanceName } = await request.json();
    
    if (!instanceName) {
      return NextResponse.json(
        { error: "Nome da instância é obrigatório" },
        { status: 400 }
      );
    }

    const evolutionApiUrl = process.env.EVOLUTION_API_URL;
    const evolutionApiKey = process.env.EVOLUTION_API_KEY;

    if (!evolutionApiUrl || !evolutionApiKey) {
      return NextResponse.json(
        { error: "Configuração da Evolution API não encontrada" },
        { status: 500 }
      );
    }

    console.log(`Criando instância: ${instanceName}`);
    console.log(`URL da API: ${evolutionApiUrl}`);

    // Criar instância na Evolution API
    const response = await fetch(`${evolutionApiUrl}/instance/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": evolutionApiKey
      },
      body: JSON.stringify({
        instanceName: instanceName,
        qrcode: true,
        integration: "WHATSAPP-BAILEYS"
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erro da API Evolution:", errorData);
      return NextResponse.json(
        { error: "Erro ao criar instância", details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("Resposta da API Evolution:", data);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Erro ao criar instância:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 