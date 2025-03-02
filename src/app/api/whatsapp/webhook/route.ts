import { NextResponse } from "next/server";

// Armazenamento temporário de mensagens (em produção, use um banco de dados)
const messageStore: Record<string, any[]> = {};

// Função auxiliar para logging
function logWebhookState(action: string, instanceName: string, data?: any) {
  console.log(`\n=== WEBHOOK ${action.toUpperCase()} ===`);
  console.log('Timestamp:', new Date().toISOString());
  console.log('Instance:', instanceName);
  if (data) console.log('Data:', JSON.stringify(data, null, 2));
  console.log('Current messageStore:', JSON.stringify(messageStore, null, 2));
  console.log('================\n');
}

export async function POST(request: Request) {
  try {
    // Log do request completo
    const rawData = await request.text();
    console.log('Raw webhook data:', rawData);
    
    // Parse do JSON
    const data = JSON.parse(rawData);
    
    // Identificar a instância
    const instanceName = data.instance || 
                        data.instanceName || 
                        data.instanceId || 
                        (data.key?.remoteJid ? data.key.remoteJid.split('@')[0] : null);

    if (!instanceName) {
      console.error('Webhook recebido sem identificação de instância:', data);
      // Adicionar mensagem de teste para debug
      const testInstance = 'test-instance';
      if (!messageStore[testInstance]) {
        messageStore[testInstance] = [];
      }
      messageStore[testInstance].push({
        type: 'debug',
        timestamp: new Date().toISOString(),
        content: 'Webhook received without instance identification',
        rawData: data
      });
      return NextResponse.json({ error: "Instance not identified" }, { status: 400 });
    }

    // Inicializar array de mensagens
    if (!messageStore[instanceName]) {
      messageStore[instanceName] = [];
    }

    // Criar mensagem com dados brutos para debug
    const newMessage = {
      timestamp: new Date().toISOString(),
      rawData: data,
      // Tentar extrair informações úteis
      text: data.message?.conversation || 
            data.message?.extendedTextMessage?.text ||
            data.text ||
            data.body ||
            'No text content',
      type: data.fromMe ? "sent" : "received",
      key: data.key || { id: Date.now().toString() },
      // Manter payload original para debug
      originalPayload: data
    };

    // Adicionar ao início do array
    messageStore[instanceName].unshift(newMessage);

    // Manter apenas últimas 100 mensagens
    if (messageStore[instanceName].length > 100) {
      messageStore[instanceName] = messageStore[instanceName].slice(0, 100);
    }

    logWebhookState('post', instanceName, newMessage);

    return NextResponse.json({ 
      success: true,
      stored: newMessage,
      messageCount: messageStore[instanceName].length
    });

  } catch (error) {
    console.error("Erro no webhook:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const instanceName = url.searchParams.get("instanceName");
    
    if (!instanceName) {
      return NextResponse.json(
        { error: "Nome da instância é obrigatório" },
        { status: 400 }
      );
    }

    logWebhookState('get', instanceName);

    // Se não houver mensagens, criar uma mensagem de teste
    if (!messageStore[instanceName] || messageStore[instanceName].length === 0) {
      messageStore[instanceName] = [{
        timestamp: new Date().toISOString(),
        type: "system",
        text: "Esta é uma mensagem de teste do sistema. Se você está vendo isto, o armazenamento está funcionando, mas nenhuma mensagem real foi recebida ainda.",
        key: { id: 'test-message-1' }
      }];
    }

    return NextResponse.json({
      success: true,
      instanceName,
      messages: messageStore[instanceName],
      debug: {
        totalInstances: Object.keys(messageStore).length,
        totalMessages: messageStore[instanceName]?.length || 0,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error("Erro ao obter mensagens:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

