const { NotImplementedError } = require('../extensions/index.js');

/**
 * Implement class VigenereCipheringMachine that allows us to create
 * direct and reverse ciphering machines according to task description
 * 
 * @example
 * 
 * const directMachine = new VigenereCipheringMachine();
 * 
 * const reverseMachine = new VigenereCipheringMachine(false);
 * 
 * directMachine.encrypt('attack at dawn!', 'alphonse') => 'AEIHQX SX DLLU!'
 * 
 * directMachine.decrypt('AEIHQX SX DLLU!', 'alphonse') => 'ATTACK AT DAWN!'
 * 
 * reverseMachine.encrypt('attack at dawn!', 'alphonse') => '!ULLD XS XQHIEA'
 * 
 * reverseMachine.decrypt('AEIHQX SX DLLU!', 'alphonse') => '!NWAD TA KCATTA'
 * 
 */
class VigenereCipheringMachine {
  constructor(isDirect) {
    this.isDirect = Boolean(isDirect);
  }

  encrypt(message, key) {

    function isUpperCase(letter) {
      var l = letter.charCodeAt();
      if (l >= 65 && l <= 90) {
        return true;
      } else {
        return false;
      }
    };

    function isLowerCase(letter) {
      var l = letter.charCodeAt();
      if (l >= 97 && l <= 122) {
        return true;
      } else {
        return false;
      }
    };

    let crypter = "";

    for (let i = 0, j = 0; i < message.length; i++) {
      let currentLetter = message[i];

      if (isUpperCase(currentLetter)) {
        var upperLetter = ((currentLetter.charCodeAt() - 65) + (key[j % key.length].toUpperCase().charCodeAt() - 65)) % 26;
        crypter += String.fromCharCode(upperLetter + 65);
        j++;
      } else if (isLowerCase(currentLetter)) {
        var lowerLetter = ((currentLetter.charCodeAt() - 97) + (key[j % key.length].toLowerCase().charCodeAt() - 97)) % 26;
        crypter += String.fromCharCode(lowerLetter + 97);
        j++;
      } else {
        crypter += currentLetter;
      }
    }
    crypter = crypter.toUpperCase();

    if (!(this.isDirect)) {
      crypter = crypter.split("").reverse().join("");
    }
    return crypter;
  }

  decrypt(encryptedMessage, key) {
    function stringToIntList(string) {
      var s = new Array();
      for (var i = 0; i < string.length; i++) {
        s[i] = string.charCodeAt(i);
      }
      return s;
    }
    function intsToCharList(integers) {
      var ints = new Array();
      for (var i = 0; i < integers.length; i++) {
        ints[i] = String.fromCharCode(integers[i]);
      }
      return ints;
    }
    function makeTable() {
      var table = new Array();
      var minASCII = parseInt(document.getElementById('minASCII').value);
      var maxASCII = parseInt(document.getElementById('maxASCII').value);
      var i = 0;
      while (i + minASCII < maxASCII) {
        var line = new Array();
        for (var j = 0; j < maxASCII - minASCII; j++) {
          if (j + i + minASCII >= maxASCII) {
            line[line.length] = (j + i) - (maxASCII - minASCII) + minASCII;
          } else {
            line[line.length] = j + i + minASCII;
          }
        }
        table[table.length] = line;
        i++;
      }
      return table;
    }

    if (!this.isDirect) {
      encryptedMessage = encryptedMessage.split("").reverse().join("");
    }
    encryptedMessage = stringToIntList(encryptedMessage.value);
    key = stringToIntList(key.value);
    let table = makeTable();
    let keyChar = 0;
    let message = new Array();
    while (message.length < encryptedMessage.length) {
      for (let i = 0; i < encryptedMessage.length; i++) {
        let row = table[0].indexOf(key[keyChar]);
        let col = table[row].indexOf(encryptedMessage[i]);
        message[message.length] = table[0][col];
        if (keyChar < key.length - 1) {
          keyChar++;
        } else {
          keyChar = 0;
        }
      }
    }
    message = intsToCharList(message).join("");
    encryptedMessage = message;
    return encryptedMessage;
  }
}

module.exports = {
  VigenereCipheringMachine
};
