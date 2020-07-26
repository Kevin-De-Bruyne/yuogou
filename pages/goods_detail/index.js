// 1.发送请求获取数据
// 2.点击轮播图 预览大图
      // 1.给轮播图绑定点击事件
      // 2.调用小程序的api previewImage
     //  3.点击 加入购物车
      // 1.先绑定点击事件
      // 2.获取缓存的购物车数据 数组格式
      // 3.先判断当前的商品是否已经存在与购物车
      // 4.已经存在 修改数据 执行购物车数量加一 重新把购物车数组 填充到缓存中
      // 5.不存在与购物车数组中 直接给购物车数组添加一个 新元素 购物车数量属性 num
      // 6.弹出用户提示
// 3.商品收藏
    // 1.页面onShow的时候，加载缓存中的商品收藏数据
    // 2.判断当前商品是不是被收藏
        // 1是 改变页面的图标
        // 2.不是
    // 3.点击商品收藏按钮
        // 1.判断该商品是否存于缓存数组中
        // 2.已经存在 吧商品删除
        // 3.没有存在 把商品添加到收藏数组中 存入到缓存中即可
import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj:{},
    // 商品是否被收藏
    isCollect:false
  },
  // 商品对象
  GoodsInfo:{},
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    let pages=getCurrentPages();
    let currentPages=pages[pages.length-1];
    let options=currentPages.options;

    const {goods_id}=options;
    this.getGoodsDetail(goods_id);

    
  },
  // 获取商品详情数据
  async getGoodsDetail(goods_id){
    const goodsObj = await request({ url: "/goods/detail", data:{goods_id}});
    this.GoodsInfo=goodsObj;
    // 1.获取缓存中的商品收藏的数组
    let collect = wx.getStorageSync("collect") || [];
    // 2.判断商品是否被收藏
    let isCollect = collect.some(v => v.goods_id === this.GoodsInfo.goods_id);
    this.setData({
      goodsObj:{
        goods_name:goodsObj.goods_name,
        goods_price: goodsObj.goods_price,
        // iphone部分手机 不识别webp图片格式
        // 最好找到后台 让他进行修改
        // 临时自己改 确保后台存在 1.webp =>1.jpg
        goods_introduce: goodsObj.goods_introduce.replace(/\.webp/g,'.jpg'),
        pics: goodsObj.pics
      },
      isCollect
    })
  },
  // 点击轮播图 放大预览
  handlePreviewImage(e){
    // 1.先构造要预览的图片数组
    const urls=this.GoodsInfo.pics.map(v=>v.pics_mid);
   //  2.接收传递过来的图片url
   const current=e.currentTarget.dataset.url
    wx.previewImage({
      current,
      urls,
    })
  },
  // 点击加入购物车
  handleCartAdd(){
    // 1.获取缓存中的购物车数组
    let cart=wx.getStorageSync("cart")||[];
    // 2.判断商品对象是否存在于购物车数组中
    let index=cart.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);
    if(index===-1){
      //3. 不存在
      this.GoodsInfo.num=1;
      this.GoodsInfo.checked=true;
      cart.push(this.GoodsInfo);
    }else{
      // 4.存在于购物车 num++
      cart[index].num++;
    }
    // 5.把购物车数据重新添加到缓存中
    wx.setStorageSync("cart", cart);
    // 6.弹窗
    wx.showToast({
      title: '加入成功',
      icon:"Success",
      mask:true
    });
  },
  // 点击商品收藏图标
  handleCollect(){
    let isCollect=false;
    // 1.获取缓存中的商品数组
    let collect=wx.getStorageSync("collect")||[];
    // 2.判断该商品是否被收藏
    let index=collect.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);
    // 3.当index不等于-1，表示收藏过
    if(index!=-1){
      // 能找到 已经收藏过了 在数组中删除该商品
      collect.splice(index,1);
       isCollect = false;
      wx.showToast({
        title: '取消成功',
        icon:"success",
        mask:true
      });
    }else{
      // 没有收藏过
      collect.push(this.GoodsInfo);
      isCollect = true;
      wx.showToast({
        title: '收藏成功',
        icon: "success",
        mask: true
      });
    }
    // 4.把数组存入到缓存中
    wx.setStorageSync("collect",collect);
    // 5.修改data中的属性 isCollect
    this.setData({isCollect});
  }
})