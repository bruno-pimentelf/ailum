import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { where, page = 1, offset = 10, instanceName } = await request.json();
    
    if (!instanceName) {
      return NextResponse.json(
        { error: "O nome da instância é obrigatório" },
        { status: 400 }
      );
    }

    if (!where?.key?.remoteJid) {
      return NextResponse.json(
        { error: "O número de telefone (remoteJid) é obrigatório" },
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

    // Buscar mensagens via Evolution API
    const response = await fetch(`${evolutionApiUrl}/chat/findMessages/${instanceName}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": evolutionApiKey
      },
      body: JSON.stringify({
        where,
        page,
        offset
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erro ao buscar mensagens:", errorData);
      return NextResponse.json(
        { error: "Erro ao buscar mensagens", details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Formatar as mensagens para o formato esperado pelo frontend
    const formattedMessages = data.messages.records.map((msg: any) => {
      // Determinar o conteúdo da mensagem com base no tipo
      let content = "";
      let mediaUrl = "";
      let mediaType = "";
      
      if (msg.message?.conversation) {
        content = msg.message.conversation;
        mediaType = "text";
      } else if (msg.message?.imageMessage) {
        content = msg.message.imageMessage.caption || "[Imagem]";
        mediaUrl = msg.message.imageMessage.url;
        mediaType = "image";
      } else if (msg.message?.videoMessage) {
        content = msg.message.videoMessage.caption || "[Vídeo]";
        mediaUrl = msg.message.videoMessage.url;
        mediaType = "video";
      } else if (msg.message?.audioMessage) {
        content = "[Áudio]";
        mediaUrl = msg.message.audioMessage.url;
        mediaType = "audio";
      } else if (msg.message?.documentMessage) {
        content = msg.message.documentMessage.fileName || "[Documento]";
        mediaUrl = msg.message.documentMessage.url;
        mediaType = "document";
      } else if (msg.message?.stickerMessage) {
        content = "[Sticker]";
        mediaUrl = msg.message.stickerMessage.url;
        mediaType = "sticker";
      } else if (msg.message?.extendedTextMessage) {
        content = msg.message.extendedTextMessage.text || "";
        mediaType = "text";
      } else {
        // Tentar extrair texto de qualquer tipo de mensagem
        if (msg.conversation) {
          content = msg.conversation;
          mediaType = "text";
        } else if (typeof msg.message === 'string') {
          content = msg.message;
          mediaType = "text";
        } else {
          content = "[Mensagem não suportada]";
        }
      }
      
      return {
        id: msg.id,
        key: msg.key,
        messageType: msg.messageType,
        timestamp: msg.messageTimestamp 
          ? new Date(msg.messageTimestamp * 1000).toISOString()
          : undefined,
        type: msg.key.fromMe ? "sent" : "received",
        pushName: msg.pushName,
        messageTimestamp: msg.messageTimestamp,
        content: content,
        mediaUrl: mediaUrl,
        mediaType: mediaType,
        conversation: msg.message?.conversation,
        rawData: msg
      };
    });

    return NextResponse.json({
      messages: {
        total: data.messages.total,
        pages: data.messages.pages,
        currentPage: data.messages.currentPage,
        records: formattedMessages
      }
    });
  } catch (error) {
    console.error("Erro ao buscar mensagens:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
