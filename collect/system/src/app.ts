import express, {Application, Request, Response} from 'express';
import path from "path";
import watch from "./watch";
import {FileStores} from "./FileStores";

const app: Application = express();
const PORT: number = 3001;
export const watch_path = path.join(process.cwd(), "..", "article")
const fileStores: FileStores = new FileStores(watch_path);

watch(watch_path, fileStores)

app.get('/article**', (req: Request, res: Response): void => {
    let split = req.originalUrl.substring(1).split("/");
    split.splice(0, 1)
    if (req.header("x-tif-value")) {
        res.json(fileStores.getMessage(split))
    } else {
        res.json(fileStores.getPaths(split))
    }
});

app.listen(PORT, (): void => {
    console.log('SERVER IS UP ON PORT:', PORT);
});