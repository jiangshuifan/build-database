const nodemailer = require("nodemailer");


/**
 * interface mailConfig{
 *  host:string,//域名
 *  port:number,//端口 
 *  secure:boolean,//安全
 *  auth:{
 *    user:string,//发件人
 *    pass:string//授权码
 *  }
 * }
 */
/**
 * interface recipient{//收件人
 *  account:string,//账号
 *  port:number,//端口 
 *  secure:boolean,//安全
 *  auth:{
 *    user:string,//发件人
 *    pass:string//授权码
 *  }
 * }
 */
const sendMailer = async (mailConfig, mail) => {//这样调用就会返回一个promise对象
  //创建一个SMTP客户端对象
  let transporter = nodemailer.createTransport(mailConfig);
  //传入的mail就是邮件信息
  /**
   * interface mail:{
   *  from:string,//发件人
   *  to:string,//收件人
   *  subject:string,//主题
   *  text?:string//纯文本
   *  html?:string//html字符串代码
   * }
   */
  //发送邮件
  transporter.sendMail(mail);
}

const sendVerificationCodeWithMail = async (recipient, mailConfig) => {
  //user用户账号信息
  let { account,//收件人
    verificationCode,//验证码
    projectName,//项目名
  } = recipient;
  let mail = {
    from: mailConfig.auth.user,	// 发件人
    subject: "注册邮件",// 主题
    to: account,// 收件人
    // 邮件内容，HTML格式,也可以时普通文本
    // text: "验证码", //可以是链接，也可以是验证码
    html: `<div>用户，您好！</div>
    <p>您正在${projectName}进行注册验证，验证码五分钟有效，请尽快完成注册</p>
    <p>验证码为：<span style="text-decoration:underline">${verificationCode}</span></p>
     <p>备注：若非本人操作请忽略该邮件</p>`
  };
  sendMailer(mailConfig, mail)
}


const sendResetPasswordVCodeWithMail = async (recipient, mailConfig) => {
  //user用户账号信息
  let { account,//收件人
    verificationCode,//验证码
    projectName,//项目名
  } = recipient;
  let mail = {
    from: mailConfig.auth.user,	// 发件人
    subject: "注册邮件",// 主题
    to: account,// 收件人
    // 邮件内容，HTML格式,也可以时普通文本
    // text: "验证码", //可以是链接，也可以是验证码
    html: `<div>用户，您好！</div>
    <p>您正在${projectName}进行密码重置，验证码五分钟有效，请尽快完成操作</p>
    <p>验证码为：<span style="text-decoration:underline">${verificationCode}</span></p>
    <p>备注：若非本人操作请忽略该邮件</p>`
  };
  sendMailer(mailConfig, mail)
}
module.exports = {
  sendMailer, sendVerificationCodeWithMail,sendResetPasswordVCodeWithMail
}