import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  data: {
    tabs: [
      {
        id: 0,
        value: "综合",
        isActive: true
      },
      {
        id: 1,
        value: "待付款",
        isActive: false
      },
      {
        id: 2,
        value: "待发货",
        isActive: false
      },
      {
        id: 3,
        value: "退货/退款",
        isActive: false
      }
    ]
  },
  onShow(options){
    // 1.获取当前小程序的页面栈-数组 长度最大是10页面
   let pages= getCurrentPages();
   // 2.数组中索引最大的页面就是当前页面
   let currentPage=pages[pages.length-1];
    console.log(currentPage.options);
  //  3.获取url上的type参数
  const {type}=currentPage.options;
  this.getOrders(type);
  },
  // 获取订单列表方法
 async getOrders(type){
      const res=await request({url:"/my/orders/all",data:{type}});
      console.log(res);
  },
  handleTabsItemChange(e) {
    // 1.获取被点击的标题索引
    const { index } = e.detail;
    //  2.修改原数组
    let { tabs } = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    // 3.赋值到data中
    this.setData({
      tabs
    })
  }


})