import { clsx, type ClassValue } from 'clsx'; import { twMerge } from 'tailwind-merge'; export const cn=(...inputs:ClassValue[])=>twMerge(clsx(inputs))
export const formatDate=(iso:string|null)=>iso?new Intl.DateTimeFormat('pt-BR',{day:'2-digit',month:'short'}).format(new Date(iso)):'Novo'
