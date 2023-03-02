
class TypeHandler{
  getTypeList(ctx,next){
    console.log('=======获取类型列表=======')
    console.log(ctx.request.body)
    ctx.body={
      success:true,
      data:[
        {id:'1',name:'诗词'},
        {id:'2',name:'vue笔记'},
        {id:'3',name:'开发心得'},
        {id:'4',name:'算法学习'}
      ]
    }
  }
  createType(ctx,next){
    console.log('=======创建类型=======')
    console.log(ctx.request.body)
    ctx.body={
      success:true
    }
  }
  getTypeArticles(ctx){
    console.log('=======类型下文章列表=======')
    let currentTime = new Date()
    let time =`${currentTime.getFullYear()}-${currentTime.getMonth()+1}-${currentTime.getDate()}`
    console.log(ctx.request.body)
    ctx.body={
      success:true,
      type:"1",
      data:[
        {
          id:'1-1',
          title:'破阵子·燕子来时新社',
          time,
        },
        {
          id:'1-2',
          title:'清平乐·红笺小字',
          time,
          
        },
        {
          id:'1-3',
          title:'宣州谢朓楼饯别校书叔云',
          time,
        },
        {
          id:'1-4',
          title:'望江南·梳洗罢',
          time,
        },
      ]
    }
  }
  
  getArticleContent(ctx){
    console.log('=======文章内容=======')
    let articleId=ctx.request.body.articleInfo.id
    let reflect={
      '1-1':'燕子来时新社，梨花落后清明。池上碧苔三四点，叶底黄鹂一两声。日长飞絮轻。巧笑东邻女伴，采桑径里逢迎。疑怪昨宵春梦好，元是今朝斗草赢。笑从双脸生。',
      '1-2':"红笺小字，说尽平时意。鸿雁在云鱼在水，惆怅此情难寄。斜阳独倚西楼，遥山巧对帘钩。人面不知何处去，绿波依旧东流",
      '1-3':"弃我去者，昨日之日不可留。乱我心者，今日之日多烦忧。长风万里送秋雁，对此可以酣高楼。蓬莱文章建安骨，中间小谢又清发。俱怀逸兴壮思飞，欲上青天揽明月。抽刀断水水更流，举杯消愁愁更愁。人生在世不称意，明朝散发弄扁舟。",
      '1-4':"梳洗罢，独倚望江楼。过尽千帆皆不是，斜晖脉脉水悠悠。肠断白蘋洲。"
    }
    let content =reflect[articleId]
    ctx.body={
      success:true,
      data:content
    }
  }
  deleteArticle(ctx){
    console.log('=======删除文章，移动到回收站=======')
    let randomValue = Math.random()
    ctx.body={
      success:randomValue>0.5?true:false
    }
  }
}

module.exports =new TypeHandler()