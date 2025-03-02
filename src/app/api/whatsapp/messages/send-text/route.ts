import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { instanceName, phoneNumber, message } = await request.json();
    
    if (!instanceName || !phoneNumber || !message) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios" },
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

    // Formatar número de telefone e adicionar sufixo do WhatsApp
    const formattedPhone = `${phoneNumber.replace(/\D/g, "")}@s.whatsapp.net`;
    
    // Enviar mensagem via Evolution API
    const response = await fetch(`${evolutionApiUrl}/message/sendText/${instanceName}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": evolutionApiKey
      },
      body: JSON.stringify({
        number: formattedPhone,
        text: message,
        options: {
          delay: 1200,
          linkPreview: false
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erro ao enviar mensagem:", errorData);
      return NextResponse.json(
        { error: "Erro ao enviar mensagem", details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("Mensagem enviada com sucesso:", data);
    
    return NextResponse.json({
      success: true,
      response: data
    });
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
