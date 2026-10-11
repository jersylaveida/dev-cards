import { db, type DevCardsDatabase } from '../db'
import type { Deck, Flashcard, Folder, LibraryBackup } from '../../types/models'
const now=()=>new Date().toISOString(), id=()=>crypto.randomUUID()

export const libraryRepository = {
  async createFolder(name:string):Promise<Folder>{ const t=now(), folder={id:id(),name:name.trim(),createdAt:t,updatedAt:t}; if(!folder.name) throw new Error('Informe o nome da pasta.'); await db.folders.add(folder); return folder },
  async updateFolder(folderId:string,name:string){ const clean=name.trim(); if(!clean) throw new Error('Informe o nome da pasta.'); await db.folders.update(folderId,{name:clean,updatedAt:now()}) },
  async deleteFolder(folderId:string){ await db.transaction('rw',db.folders,db.decks,async()=>{ await db.decks.where('folderId').equals(folderId).modify({folderId:null,updatedAt:now()}); await db.folders.delete(folderId) }) },
  async saveDeck(input:{id?:string;title:string;description?:string;folderId?:string|null}){ const title=input.title.trim(); if(!title) throw new Error('Informe o título do deck.'); const t=now(); if(input.id){await db.decks.update(input.id,{title,description:input.description?.trim()||null,folderId:input.folderId||null,updatedAt:t}); return input.id} const deck:Deck={id:id(),title,description:input.description?.trim()||null,folderId:input.folderId||null,createdAt:t,updatedAt:t,lastAccessedAt:null}; await db.decks.add(deck); return deck.id },
  async deleteDeck(deckId:string, database:DevCardsDatabase=db){ await database.transaction('rw',database.decks,database.flashcards,async()=>{await database.flashcards.where('deckId').equals(deckId).delete();await database.decks.delete(deckId)}) },
  async touchDeck(deckId:string){await db.decks.update(deckId,{lastAccessedAt:now()})},
  async saveCard(input:{id?:string;deckId:string;front:string;back:string}){const front=input.front.trim(),back=input.back.trim();if(!front||!back)throw new Error('Preencha a frente e o verso.');const t=now();if(input.id){await db.flashcards.update(input.id,{front,back,updatedAt:t});return input.id}const last=await db.flashcards.where('deckId').equals(input.deckId).sortBy('position');const card:Flashcard={id:id(),deckId:input.deckId,front,back,position:(last.at(-1)?.position??-1)+1,createdAt:t,updatedAt:t};await db.flashcards.add(card);await db.decks.update(input.deckId,{updatedAt:t});return card.id},
  async deleteCard(cardId:string){const card=await db.flashcards.get(cardId);if(!card)return;await db.transaction('rw',db.flashcards,db.decks,async()=>{await db.flashcards.delete(cardId);const rest=await db.flashcards.where('deckId').equals(card.deckId).sortBy('position');await Promise.all(rest.map((c,i)=>db.flashcards.update(c.id,{position:i})));await db.decks.update(card.deckId,{updatedAt:now()})})},
  async export():Promise<LibraryBackup>{const [folders,decks,flashcards]=await Promise.all([db.folders.toArray(),db.decks.toArray(),db.flashcards.toArray()]);return {version:1,exportedAt:now(),folders,decks,flashcards}},
  async import(data:unknown,database:DevCardsDatabase=db){const parsed=validateBackup(data);await database.transaction('rw',database.folders,database.decks,database.flashcards,async()=>{await Promise.all([database.flashcards.clear(),database.decks.clear(),database.folders.clear()]);await database.folders.bulkAdd(parsed.folders);await database.decks.bulkAdd(parsed.decks);await database.flashcards.bulkAdd(parsed.flashcards)})}
}

const iso=(v:unknown)=>typeof v==='string'&&!Number.isNaN(Date.parse(v))
export function validateBackup(v:unknown):LibraryBackup{
  if(!v||typeof v!=='object')throw new Error('Arquivo de backup inválido.')
  const x=v as Partial<LibraryBackup>;if(x.version!==1||!Array.isArray(x.folders)||!Array.isArray(x.decks)||!Array.isArray(x.flashcards))throw new Error('Formato de backup incompatível.')
  const folders=x.folders as Folder[],decks=x.decks as Deck[],cards=x.flashcards as Flashcard[]
  if(!folders.every(f=>typeof f.id==='string'&&!!f.name?.trim()&&iso(f.createdAt)&&iso(f.updatedAt)))throw new Error('O backup contém pastas inválidas.')
  const folderIds=new Set(folders.map(f=>f.id));if(!decks.every(d=>typeof d.id==='string'&&!!d.title?.trim()&&(d.folderId===null||folderIds.has(d.folderId))&&iso(d.createdAt)&&iso(d.updatedAt)))throw new Error('O backup contém decks inválidos.')
  const deckIds=new Set(decks.map(d=>d.id));if(!cards.every(c=>typeof c.id==='string'&&deckIds.has(c.deckId)&&!!c.front?.trim()&&!!c.back?.trim()&&Number.isInteger(c.position)&&iso(c.createdAt)&&iso(c.updatedAt)))throw new Error('O backup contém cartões inválidos.')
  return x as LibraryBackup
}
