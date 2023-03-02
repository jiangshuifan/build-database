const puppeteer = require('puppeteer');
const path = require('path');


class PdfHandler {
  download = async function (ctx, next) {
    try {
      const fileName = `简历${new Date().getTime()}.pdf`
      const imagePath = path.resolve(__dirname, '../../public/images/test.png')
      const pdfPath = path.resolve(__dirname, '../../public/pdfs/', fileName)
      const browser = await puppeteer.launch({});
      const page = await browser.newPage();

      await page.goto('http://127.0.0.1:5173/');
      // Set screen size
      await page.setViewport({ width: 1980, height: 1024 });
      // Type into search box
      // await page.type('.resume-page', 'test', {});

      // Wait and click on first result
      const searchResultSelector = '.g-container';
      await page.waitForSelector(searchResultSelector);
      let rect = await page.evaluate(() => {
        const element = document.querySelector(
          '.g-container'
        );  // 选择包含指定class属性的dom节点
        const { x, y, width, height } = element.getBoundingClientRect();
        return {
          x: x,
          y: y,
          width,
          height,
        };
      });
      await page.screenshot({
        path: imagePath,
        // clip:{}//设置截取区域
      });
      await page.pdf({
        path: pdfPath,
        format: "A4",
        preferCSSPageSize: true,
      })
      // ctx.set({
      //   'Content-Type': 'application/octet-stream',// 告诉浏览器这是一个二进制文件
      //   'Content-Disposition': 'attachment; filename=target.pdf'// 告诉浏览器这是一个需要下载的文件
      // })
      ctx.body = { url: `${ctx.request.protocol}://${ctx.request.host}/public/${fileName}` }
    } catch (err) {
      console.log(err)
    }

  }

}

module.exports = new PdfHandler()