import {watch_path} from "./app";
import * as pathNode from 'path'
import {getMdData} from "./ProcessMd";

type FileType = 'file' | 'folder'

interface FileValue {
    name: string,
    path: string
    route: string,
    value?: { [key: string]: any },

    [key: string]: any; // 添加字符串索引签名
}

export interface FileTree {
    [key: string]: FileValue | FileTree
}


export class FileStores {
    tree: FileTree = {}


    public getKeys(path: string[]): string[] {
        let message = this.getMessage(path);
        return message ? Object.keys(message) : [];
    }

    public getMessage(path: string[]) {
        let exec = this.tree;
        for (let i = 0; exec && i < path.length; i++) {
            if (path[i] === '') {
                break
            }
            exec = exec[path[i]]
        }
        return exec
    }


    private get watchPath() {
        return watch_path.charAt(watch_path.length - 1) !== '/' ? `${watch_path}/` : watch_path
    }

    addFolder(path: string) {
        this._add(path, 'folder')
    }

    addFile(path: string) {
        this._add(path, 'file')
    }

    delete(path: string) {
        let paths = path.replace(this.watchPath, "").split('/');
        let exec = this.tree;
        for (let i = 0; exec && i < paths.length - 1; i++) {
            exec = exec[paths[i]];
        }
        // 删除属性
        let ret = undefined;
        if (exec && typeof exec === 'object') {
            ret = exec[paths[paths.length - 1]]
            delete exec[paths[paths.length - 1]];
        }
        return ret
    }

    private async _add(path: string, type: FileType) {
        let paths = path.replace(this.watchPath, "").split('/');
        let exec: FileTree = this.tree;

        for (let i = 0; i < paths.length; i++) {
            if (!exec[paths[i]] && (i !== paths.length - 1 || type == 'folder')) {
                exec[paths[i]] = {}
            } else if (i === paths.length - 1 && type == 'file') {
                exec[paths[i]] = {
                    name: paths[i],
                    route: path.replace(this.watchPath, ""),
                    path: path,
                }
                let ext = pathNode.extname(path);
                if (ext === ".md") {
                    exec[paths[i]].value = await getMdData(path)
                }

            }
            exec = exec[paths[i]]
        }
    }
}

const fileStores: FileStores = new FileStores();

export default fileStores;