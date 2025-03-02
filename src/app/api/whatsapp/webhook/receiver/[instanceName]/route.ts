import { NextResponse } from "next/server";

// Armazenamento temporário de mensagens (em produção, use um banco de dados)
const messageStore: Record<string, any[]> = {};

export async function POST(
  request: Request,
  { params }: { params: { instanceName: string } }
) {
  try {
    const instanceName = params.instanceName;
    
    // Verificar token de segurança (opcional)
    const url = new URL(request.url);
    const token = url.searchParams.get("token");
    
    // Log para debug
    console.log(`Webhook POST recebido para instância: ${instanceName}`);
    console.log(`Token: ${token}`);
    
    // Inicializar array de mensagens para esta instância se não existir
    if (!messageStore[instanceName]) {
      messageStore[instanceName] = [];
    }
    
    // Obter dados do corpo da requisição
    let rawData;
    try {
      rawData = await request.text();
      console.log("Raw webhook data:", rawData);
      const data = JSON.parse(rawData);
      
      // Processar o evento com base no tipo
      const eventType = data.event || "unknown";
      console.log(`Evento recebido: ${eventType}`);
      
      // Extrair informações da mensagem
      let messageData: any = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        webhookEvent: eventType,
        rawData: data
      };
      
      // Processar diferentes tipos de eventos
      if (eventType === "messages.upsert") {
        // Extrair dados da mensagem
        const messageInfo = data.data || {};
        
        messageData = {
          ...messageData,
          key: messageInfo.key,
          pushName: messageInfo.pushName,
          message: messageInfo.message,
          messageTimestamp: messageInfo.messageTimestamp,
          type: messageInfo.key?.fromMe ? "sent" : "received",
          text: messageInfo.message?.conversation || 
                messageInfo.message?.extendedTextMessage?.text || 
                "Sem texto"
        };
      } else if (eventType === "connection.update") {
        // Evento de atualização de conexão
        messageData = {
          ...messageData,
          connectionState: data.data?.state || "unknown",
          type: "system"
        };
      } else if (eventType === "qrcode.updated") {
        // Evento de atualização de QR code
        messageData = {
          ...messageData,
          qrcode: data.data?.qrcode,
          type: "system"
        };
      }
      
      // Adicionar ao início do array para mostrar mensagens mais recentes primeiro
      messageStore[instanceName].unshift(messageData);
      
      // Limitar o tamanho do array para evitar consumo excessivo de memória
      if (messageStore[instanceName].length > 100) {
        messageStore[instanceName] = messageStore[instanceName].slice(0, 100);
      }
      
      console.log(`Mensagem armazenada para ${instanceName}. Total: ${messageStore[instanceName].length}`);
      console.log("Estado atual do messageStore:", JSON.stringify(messageStore, null, 2));
      
      return NextResponse.json({ 
        success: true,
        message: "Evento recebido com sucesso",
        instanceName,
        eventType,
        messageStored: messageData
      });
    } catch (parseError) {
      console.error("Erro ao processar dados do webhook:", parseError);
      console.log("Dados brutos recebidos:", rawData);
      return NextResponse.json(
        { error: "Erro ao processar dados do webhook", details: parseError instanceof Error ? parseError.message : String(parseError) },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Erro ao processar webhook:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// Endpoint para consultar mensagens armazenadas
export async function GET(
  request: Request,
  { params }: { params: { instanceName: string } }
) {
  try {
    const instanceName = params.instanceName;
    
    // Verificar token de segurança (opcional)
    const url = new URL(request.url);
    const token = url.searchParams.get("token");
    
    console.log(`Consultando mensagens para instância: ${instanceName}`);
    
    // Se não houver mensagens, criar uma mensagem de teste
    if (!messageStore[instanceName] || messageStore[instanceName].length === 0) {
      messageStore[instanceName] = [{
        id: 'test-message-1',
        timestamp: new Date().toISOString(),
        type: "system",
        text: "Esta é uma mensagem de teste do sistema. Se você está vendo isto, o armazenamento está funcionando, mas nenhuma mensagem real foi recebida ainda.",
        key: { id: 'test-message-1' }
      }];
    }
    
    console.log(`Retornando ${messageStore[instanceName].length} mensagens para ${instanceName}`);
    
    // Retornar mensagens armazenadas para esta instância
    return NextResponse.json({
      success: true,
      instanceName,
      messages: messageStore[instanceName] || []
    });
  } catch (error) {
    console.error("Erro ao consultar mensagens:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
