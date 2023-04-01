
function randomVerificationCode() {
  let verificationCode = "";
  for (let i = 0; i < 6; i++) {
    let index = parseInt(Math.random() * 3); //[0,1,2]
    let x = parseInt(Math.random() * 10 + 48); // 取0-9 的Ascii
    let y = parseInt(Math.random() * 26 + 97); // 取a-z 的Ascii
    let z = parseInt(Math.random() * 26 + 65); // 取A-Z 的Ascii
    let arr = [x, y, z];
    verificationCode += String.fromCharCode(arr[index]);
  }
  return verificationCode;
}

module.exports = randomVerificationCode;
