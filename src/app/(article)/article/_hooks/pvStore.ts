import {
  action,
  autorun,
  computed,
  makeAutoObservable,
  observable,
} from "mobx";
import { Card, Note } from "@prisma/client";

// import { createNote } from "@/service/db/note";

export interface packageNote {
  [key: string]: Note & { card: Card | null };
}

export class ObserveServerNote implements ObserveNote {
  notes: packageNote = {};

  constructor(packages?: packageNote) {
    makeAutoObservable(this, {
      notes: observable,
      addNote: action,
      updateNote: action,
      count: computed,
    });
    if (packages) this.notes = packages;
  }

  get count() {
    return Object.keys(this.notes).length;
  }

  getNote(word: string) {
    return this.notes[word];
  }

  async addNote(word: string) {
    if (this.notes[word]) {
      return;
    }
    console.log(`addNote:${word}`);
    // this.notes[word] = await createNote({
    //   text: word,
    // });
  }

  async updateNote(word: string) {
    console.log(`updateNote:${word}`);
    // this.notes[word] = await createNote({
    //   text: word,
    // });
  }
}

export class ObserveClientNote implements ObserveNote {
  notes: packageNote = {};

  constructor(packages?: packageNote) {
    if (packages) this.notes = packages;
    makeAutoObservable(this, {
      notes: observable,
      addNote: action,
      updateNote: action,
      count: computed,
    });
  }

  get count() {
    return Object.keys(this.notes).length;
  }

  getNote(word: string) {
    return this.notes[word];
  }

  async addNote(word: string) {
    if (this.notes[word]) {
      return;
    }
    console.log(`addNote:${word}`);
    // this.notes[word] = await createNote({
    //   text: word,
    // });
  }

  async updateNote(word: string) {
    console.log(`updateNote:${word}`);
    // this.notes[word] = await createNote({
    //   text: word,
    // });
  }
}

export interface ObserveNote {
  getNote(word: string): Note & { card: Card | null };

  get count(): number;

  addNote(word: string): void;

  updateNote(word: string): void;
}
