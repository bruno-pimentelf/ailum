import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formata um número de telefone para exibição
 * @param phoneNumber Número de telefone a ser formatado
 * @returns Número de telefone formatado
 */
export function formatPhoneNumber(phoneNumber: string): string {
  // Remove caracteres não numéricos
  const cleaned = phoneNumber.replace(/\D/g, "");
  
  // Verifica se é um número brasileiro (começa com 55)
  if (cleaned.startsWith("55") && cleaned.length >= 12) {
    // Formato: +55 (XX) XXXXX-XXXX
    const country = cleaned.substring(0, 2);
    const ddd = cleaned.substring(2, 4);
    const part1 = cleaned.substring(4, 9);
    const part2 = cleaned.substring(9, 13);
    
    return `+${country} (${ddd}) ${part1}-${part2}`;
  }
  
  // Se não for um número brasileiro ou não tiver o formato esperado
  // Tenta formatar de maneira genérica
  if (cleaned.length > 10) {
    const part1 = cleaned.substring(0, 2);
    const part2 = cleaned.substring(2, cleaned.length - 4);
    const part3 = cleaned.substring(cleaned.length - 4);
    
    return `+${part1} ${part2}-${part3}`;
  }
  
  // Se for um número curto, retorna como está
  return phoneNumber;
}
