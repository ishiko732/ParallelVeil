import chokidar from "chokidar";
import {FileStores} from "./FileStores";
import 'log-timestamp';

export default function watch(watchPath: string, fileStores: FileStores) {
    const watcher = chokidar.watch(watchPath, {
        persistent: true,
        ignored: [/(^|[\/\\])\../, '.DS_Store'],
        ignoreInitial: false,
        ignorePermissionErrors: false,
        atomic: true // or a custom 'atomicity delay', in milliseconds (default 100)
    });

// ready

    watcher.on("ready", async () => {
        console.log(`watch [${watchPath}] starting...`)
    })
    watcher
        .on('add', async (path) => {
            fileStores.addFile(path)
            console.log(`File ${path} has been added`)
        })
        .on('change', async (path) => {
            fileStores.changeFile(path)
            console.log(`File ${path} has been changed`)
        })
        .on('unlink', async (path) => {
            fileStores.delete(path)
            console.log(`File ${path} has been removed`)
        });


    watcher
        .on('addDir', async (path) => {
            if (path === watchPath) {
                return;
            }
            fileStores.addFolder(path)
            console.log(`Directory ${path} has been added`)
        })
        .on('unlinkDir', async (path) => {
            fileStores.delete(path)
            console.log(`Directory ${path} has been removed`)
        })
        .on('error', async (error) => {
            console.log(`Watcher error: ${error}`)
        })
    return watcher;
}