import Dexie, { type EntityTable } from 'dexie'
import type { Deck, Flashcard, Folder } from '../types/models'

export class DevCardsDatabase extends Dexie {
  folders!: EntityTable<Folder, 'id'>
  decks!: EntityTable<Deck, 'id'>
  flashcards!: EntityTable<Flashcard, 'id'>
  constructor(name = 'devcards') {
    super(name)
    this.version(1).stores({ folders:'id, name, updatedAt', decks:'id, folderId, updatedAt, lastAccessedAt', flashcards:'id, deckId, [deckId+position], updatedAt' })
  }
}
export const db = new DevCardsDatabase()
