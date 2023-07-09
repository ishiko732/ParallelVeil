import seedrandom from "seedrandom";
import {Card, State} from "ts-fsrs";

abstract class AQueue<T> {
    abstract add(e: T): void;

    abstract add(e: T, position: number): void;

    abstract remove(pos?: number): T;

    abstract get(pos: number): T;

    abstract size(): number;

    abstract isEmpty(): boolean;

    abstract randomPos(): number;

    abstract top(): T;

    abstract list(): readonly T[];

    abstract reset(): AQueue<T>;

}

export class Queue<T> extends AQueue<T> {
    private q: T[] = []

    add(e: T): void {
        this.q.push(e)
    }

    isEmpty(): boolean {
        return this.q.length == 0;
    }

    randomPos(): number {
        if (this.isEmpty()) {
            throw new Error("queue is empty")
        }
        const date = new Date();
        const seed = date.getUTCDate() + "_" + date.getTime();
        const generator = seedrandom(seed);
        const random = generator();
        return Math.max(0, Math.floor(this.size() * random))
    }


    remove(pos?: number): T {
        if (this.isEmpty()) {
            throw new Error("queue is empty")
        }
        if (!pos || pos === 0) {
            return this.q.shift() as T
        } else {
            if (pos > this.q.length) {
                throw new Error("The pos exceeds the length")
            }
            return this.q.splice(pos, 1)[0]
        }
    }

    get(pos: number): T {
        if (this.isEmpty()) {
            throw new Error("queue is empty")
        }
        if (pos > this.q.length) {
            throw new Error("The pos exceeds the length")
        }

        return this.q[pos];
    }


    size(): number {
        return this.q.length;
    }

    top(): T {
        if (this.isEmpty()) {
            throw new Error("queue is empty")
        }
        return this.q[0];
    }

    reset(): AQueue<T> {
        this.q = []
        return this;
    }


    list(): readonly T[] {
        return this.q;
    }
}


export class QueueBox {
    public newQueue: Queue<Card> = new Queue<Card>()
    public learningQueue: Queue<Card> = new Queue<Card>()
    public reviewQueue: Queue<Card> = new Queue<Card>()

    private list = [this.newQueue, this.learningQueue, this.reviewQueue]
    private weights = [0.2, 0.5, 0.3]


    reset(callback?: Function): void {
        this.newQueue.reset()
        this.learningQueue.reset()
        this.reviewQueue.reset()
        callback && callback()
    }

    fill(cards: Card[], now?: Date, reset?: boolean, callback?: Function): boolean {
        if (!now) {
            now = new Date()
        }
        reset && this.reset()
        cards.forEach(card => this.updateQueue(card, now as Date))
        callback && callback()
        return true;
    }

    /**
     * 更新卡片状态后对队列系更新
     * <p>复习状态卡片不需要更新</p>
     * @param card 调度后卡片
     * @param now 当前时间
     * @param callback 扩展操作
     */
    updateQueue(card: Card, now: Date, callback?: Function): void {
        switch (card.state) {
            case State.New:
                this.newQueue.add(card)
                break;
            case State.Learning:
            case State.Relearning:
                this.learningQueue.add(card)
                break;
            case State.Review:
                now.diff(card.due, "minutes") > 0 && this.reviewQueue.add(card)
                break;
        }
        callback && callback()
    }

    get(random: boolean = false) {
        const option = random ? this._get_random_option() : 0;
        const queue = this.list[option]
        const pos = random ? queue.randomPos() : 0;
        return queue.remove(pos);
    }

    _get_random_option(): number {
        const date = new Date();
        const seed = "get_" + date.getUTCDate() + "_" + date.getTime();
        const generator = seedrandom(seed);
        const randomNumber = generator();
        let weightSum = 0;
        for (let i = 0; i < this.weights.length; i++) {
            weightSum += this.weights[i];
            if (randomNumber < weightSum) {
                return i;
            }
        }
        return 0;
    }

}