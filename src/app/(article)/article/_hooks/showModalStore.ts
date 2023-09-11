import {
  action,
  autorun,
  computed,
  makeAutoObservable,
  observable,
  runInAction,
} from "mobx";
import { putBody } from "@/app/(fsrs)/api/fsrs/scheduler/route";

interface hash {
  [key: string]: any;
}

export default class ShowModalStore {
  public point: point = { x: 0, y: 0 };
  public open = false;
  public selectOpen = false;
  cache: hash = {};
  public currentWord = "";
  public currentPhrase = "";
  public loading = false;
  public jisho = false;
  public ejje = false;

  constructor() {
    makeAutoObservable(this, {
      currentWord: observable,
      currentPhrase: observable,
      setCurrent: action,
      current: computed,
      loading: observable,
      open: observable,
      updateOpen: action,
      setSimple: action,
      point: observable,
      updatePoint: action,
      selectOpen: observable,
      updateSelectOpen: action,
      updateData: action,
    });
  }

  get current() {
    return {
      word: this.currentWord,
      phrase: this.currentPhrase,
      data: this.cache[this.currentWord],
    };
  }

  updatePoint(point: point) {
    this.point = point;
  }

  updateOpen(status: boolean) {
    this.open = status;
  }

  updateSelectOpen(status: boolean) {
    this.selectOpen = status;
  }

  async setCurrent(word: string, phrase: string, nid: string) {
    runInAction(() => {
      this.loading = true;
      this.currentWord = word;
      this.currentPhrase = phrase;
      if (this.cache[word] === undefined) {
        this.cache[word] = {};
      }
    });
    const note = await getNote(nid);
    runInAction(() => {
      this.cache[word] = {
        ...this.cache[word],
        phrase,
        note: note,
      };
      this.loading = false;
    });
    if (this.cache[word].jisho === undefined) {
      runInAction(() => {
        this.jisho = false;
      });
      getJisho(word, 1)
        .then((res) => {
          runInAction(() => {
            this.cache[word].jisho = res;
          });
        })
        .finally(() => {
          runInAction(() => {
            this.jisho = true;
          });
        });
    }
    if (this.cache[word].ejje === undefined) {
      runInAction(() => {
        this.ejje = false;
      });
      getWeblio_ejje(word)
        .then((res) => {
          runInAction(() => {
            this.cache[word].ejje = res;
          });
        })
        .finally(() => {
          runInAction(() => {
            this.ejje = true;
          });
        });
    }
  }

  setSimple(word: string, phrase: string, point: point, selectOpen: boolean) {
    this.currentWord = word;
    this.currentPhrase = phrase;
    this.point = point;
    this.selectOpen = selectOpen;
  }

  updateData() {
    return;
  }
}

export async function getNote(nid: string) {
  return fetch(`/api/note/${nid}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());
}

export async function getJisho(query: string, page: number = 1) {
  return fetch(`/api/jisho?query=${query}&page=${page}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "force-cache",
  })
    .then((res) => res.json())
    .then((res) => res.data);
}

export async function getWeblio_ejje(query: string) {
  return fetch(`/api/weblio/ejje?query=${query}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "force-cache",
  }).then((res) => res.json());
}
