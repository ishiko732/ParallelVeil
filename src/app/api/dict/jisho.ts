import {NextApiRequest, NextApiResponse} from "next";
import {downloadFile, getAudioUrls, search} from "@/service/jisho";
import fs from "fs/promises";
import path from "path";

const AudioDirectory = path.join(process.cwd(), "collect", "audio");
export default async function handler(req: NextApiRequest, res: NextApiResponse<string>) {
    try {
        const text: string = req.query.text ?? (req.body?.text ?? '');
        const page: string = req.query.page ?? (req.body?.page ?? '1');
        const [dataResult, audioUrlResult] = await Promise.all([search(text, Number(page)), getAudioUrls(text)]);
        const mp3Dir = path.join(AudioDirectory, "mp3");
        const oggDir = path.join(AudioDirectory, "ogg");
        try {
            await fs.mkdir(mp3Dir, {recursive: true});
            await fs.mkdir(oggDir, {recursive: true});
        } catch (err) {
            console.error(`Failed to create audio directories: ${err}`);
        }
        const mp3Files = await fs.readdir(path.join(AudioDirectory, "mp3"));
        const oggFiles = await fs.readdir(path.join(AudioDirectory, "ogg"));
        const audioPromise: Promise<void>[] = []
        audioUrlResult.forEach(audio => {
            const mp3filePath = path.join(AudioDirectory, "mp3", audio.name + ".mp3")
            const oggfilePath = path.join(AudioDirectory, "ogg", audio.name + ".ogg")
            audio.mp3Url && !mp3Files.includes(audio.name + ".mp3") && audioPromise.push(downloadFile(audio.mp3Url, mp3filePath))
            audio.oggUrl && !oggFiles.includes(audio.name + ".ogg") && audioPromise.push(downloadFile(audio.oggUrl, oggfilePath))
        })
        await Promise.all(audioPromise)
        res.status(200).json(JSON.stringify(dataResult))
    } catch (err) {
        console.error(`Error occurred in handler: ${err}`);
        const dto = JSON.stringify({"error": 'Internal Server _error'})
        res.status(500).json(dto);
    }
}


