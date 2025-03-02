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

    // Desconectar instância na Evolution API
    const response = await fetch(`${evolutionApiUrl}/instance/delete/${instanceName}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "apikey": evolutionApiKey
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erro ao desconectar instância:", errorData);
      return NextResponse.json(
        { error: "Erro ao desconectar instância", details: errorData },
        { status: response.status }
      );
    }

    return NextResponse.json({
      status: "SUCCESS",
      error: false,
      response: {
        message: "Instance deleted"
      }
    });
  } catch (error) {
    console.error("Erro ao desconectar instância:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}