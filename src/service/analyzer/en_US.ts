export default function splitWords(str: string): string[] {
    var strings = str.split(/\s+|(?=[".,:;!?()])/).filter(text => text !== '');
    var res: string[] = []
    for (let i = 0; i < strings.length; i++) {
        res.push(...strings[i].split(/(?<=["(])/))
    }
    return res
}
