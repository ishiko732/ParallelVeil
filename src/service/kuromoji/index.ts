import kuromoji from 'kuromoji';

const tokenizer: () => Promise<kuromoji.Tokenizer<kuromoji.IpadicFeatures>> = async () => {
    const path = require('path');
    const realPath = path.resolve('src/service');
    return await new Promise((resolve, reject) => {
        kuromoji
            .builder({
                dicPath: `${realPath}/kuromoji/dict`,
            })
            .build((err, _tokenizer) => {
                if (!!err) {
                    reject(err);
                }
                resolve(_tokenizer);
            });
    });
}


export default tokenizer;