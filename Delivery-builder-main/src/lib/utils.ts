import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// --- ADICIONE A FUNÇÃO ABAIXO ---
/**
 * Formata um número para uma string de moeda em Reais (BRL).
 * @param price O número a ser formatado.
 * @returns A string formatada, ex: "R$ 10,50".
 */
export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);
};