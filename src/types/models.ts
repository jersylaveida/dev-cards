export interface Folder { id:string; name:string; createdAt:string; updatedAt:string }
export interface Deck { id:string; folderId:string|null; title:string; description:string|null; createdAt:string; updatedAt:string; lastAccessedAt:string|null }
export interface Flashcard { id:string; deckId:string; front:string; back:string; position:number; createdAt:string; updatedAt:string }
export interface LibraryBackup { version:1; exportedAt:string; folders:Folder[]; decks:Deck[]; flashcards:Flashcard[] }
