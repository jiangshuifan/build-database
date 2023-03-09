const { camelCase } = require('camel-case');
class CommonFunction {
  //对象变量转驼峰
  async formatObjPropertyToCamelCase(obj) {
    let data = {};
    for (let property in obj) {
      if (obj[property].constructor === Array && obj[property].length > 0) {
        data[camelCase(property)] = await formatObjPropertyToCamelCase(obj[property]);
      } else {
        data[camelCase(property)] = obj[property];
      }
    }
    return data;
  }
  //findAll得到的数组不是标准化的，调用方法标准化
  formatToNormalArray = async (findAllRes) => {
    let arr = [];
    for (let v of findAllRes) {
      let res = await this.formatObjPropertyToCamelCase(v.dataValues);
      arr.push(res);
    }
    return arr;
  };

  //某个表的不能重复的字段是否已经存在
  getValueIsExisted = async (table, valueObj) => {
    //存在则返回对应数据
    const res = await table.findOne({
      where: valueObj,
    });
    if (res) {
      return await this.formatObjPropertyToCamelCase(res.dataValues);
    } else {
      return false;
    }
  };
}

module.exports = new CommonFunction();
