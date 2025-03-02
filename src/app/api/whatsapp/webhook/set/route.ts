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
    const appUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

    if (!evolutionApiUrl || !evolutionApiKey) {
      return NextResponse.json(
        { error: "Configuração da Evolution API não encontrada" },
        { status: 500 }
      );
    }

    // Gerar um token único para este usuário/instância
    const webhookToken = Buffer.from(`${instanceName}-${Date.now()}`).toString('base64');
    
    // URL do webhook que aponta para sua própria aplicação
    const webhookUrl = `${appUrl}/api/whatsapp/webhook/receiver/${instanceName}?token=${webhookToken}`;

    // Configurar webhook na Evolution API
    const response = await fetch(`${evolutionApiUrl}/webhook/set/${instanceName}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": evolutionApiKey
      },
      body: JSON.stringify({
        webhook: {
          enabled: true,
          url: webhookUrl,
          headers: {
            "authorization": `Bearer ${webhookToken}`,
            "Content-Type": "application/json"
          },
          byEvents: false,
          base64: false,
          events: [
            "QRCODE_UPDATED",
            "MESSAGES_UPSERT",
            "MESSAGES_UPDATE",
            "MESSAGES_DELETE",
            "SEND_MESSAGE",
            "CONNECTION_UPDATE",
            "CALL"
          ]
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erro ao configurar webhook:", errorData);
      return NextResponse.json(
        { error: "Erro ao configurar webhook", details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("Webhook configurado com sucesso:", data);
    
    return NextResponse.json({
      success: true,
      webhookUrl,
      webhookToken,
      response: data
    });
  } catch (error) {
    console.error("Erro ao configurar webhook:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
