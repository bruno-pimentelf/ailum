import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const evolutionApiUrl = process.env.EVOLUTION_API_URL;
    const evolutionApiKey = process.env.EVOLUTION_API_KEY;

    if (!evolutionApiUrl || !evolutionApiKey) {
      console.log("API Instances - Configuração da Evolution API não encontrada");
      return NextResponse.json(
        { error: "Configuração da Evolution API não encontrada" },
        { status: 500 }
      );
    }

    // Buscar todas as instâncias na Evolution API
    const apiUrl = `${evolutionApiUrl}/instance/fetchInstances`;
    console.log("API Instances - Fazendo requisição para:", apiUrl);
    
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "apikey": evolutionApiKey
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Instances - Erro ao buscar instâncias:", errorData);
      return NextResponse.json(
        { error: "Erro ao buscar instâncias", details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("API Instances - Resposta recebida:", data);
    
    // Procurar a instância ailum-whatsapp
    const ailumInstance = data.find((instance: any) => instance.name === "miguelito-whatsapp");
    
    if (!ailumInstance) {
      return NextResponse.json(
        { error: "Instância ailum-whatsapp não encontrada" },
        { status: 404 }
      );
    }

    // Extrair as informações relevantes
    const result = {
      instanceName: ailumInstance.name,
      number: ailumInstance.ownerJid?.split("@")[0] || null,
      profileName: ailumInstance.profileName,
      profilePicUrl: ailumInstance.profilePicUrl,
      connectionStatus: ailumInstance.connectionStatus,
      stats: {
        messages: ailumInstance._count?.Message || 0,
        contacts: ailumInstance._count?.Contact || 0,
        chats: ailumInstance._count?.Chat || 0
      }
    };
    
    console.log("API Instances - Retornando:", result);
    return NextResponse.json(result);
  } catch (error) {
    console.error("API Instances - Erro ao buscar instâncias:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 