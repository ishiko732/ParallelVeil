import { action, computed, makeAutoObservable, observable } from "mobx";
import { Card, Note } from "@prisma/client";
import { Card as fsrsCard, ReviewLog as fsrsLog } from "ts-fsrs/lib/models";
import { putBody } from "@/app/(fsrs)/api/fsrs/scheduler/route";
import { transCard } from "@/app/(fsrs)/fsrs/help";

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

  async updateNote(word: string, grade: putBody) {
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
  }

  async updateNote(word: string, grade: putBody) {
    console.log(`updateNote:${word}`);
    const data = await fsrsScheduler(grade);
    this.notes[word] = {
      ...data,
      card: transCard(data.card),
    };
  }
}

export interface ObserveNote {
  getNote(word: string): Note & { card: Card | null };

  get count(): number;

  addNote(word: string): void;

  updateNote(word: string, grade: putBody): void;
}

export interface gradeDataFromNote {
  card: fsrsCard;
  log: fsrsLog;
}

export async function fsrsScheduler(json: putBody) {
  return await fetch(`/api/fsrs/scheduler`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(json),
  }).then((res) => res.json());
}
