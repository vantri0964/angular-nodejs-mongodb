const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')
//gọi hàm user của models .....
const User = require('../models/user');
//goi ham useradmin của models
const UserAdmin = require('../models/userAdmin');
//goi ham useradmin của models
const Author = require('../models/author');
//goi ham product của models
const Product = require('../models/product');
//goi hàm cart của model
const Cart = require('../models/cart');
//goi commentUsẻ
const commentUser = require('../models/commentUser')
//goi slider
const slider = require('../models/slider')
//gọi chooseslider
const listslider=require('../models/listslider')
//start mongodb
const mongoose = require('mongoose');
const db = "mongodb://shoeshop:levantri1998@ds127094.mlab.com:27094/eventsdatabase";
mongoose.connect(db, { useNewUrlParser: true }, function (err) {
  if (err) {
    console.error('Error! ' + err)
  } else {
    console.log('Connected to mongodb')
  }
});

//end connect mongodb
router.get('/', (req, res) => { //gọi bên server,js
  res.send('router')
})

//gọi hàm register
router.post('/register', (req, res) => {
  let userData = req.body
  let user = new User(userData)
  user.save((err, registeredUserData) => {
    if (err) {
      console.log("loix " + err)
    } else {
      let payload = { subject: registeredUserData._id }
      let token = jwt.sign(payload, 'secretKey')
      res.status(200).send({ token })
    }
  })
})

//check mail
router.get('/checkmail/:id', (req, res) => {
  User.find().count({ email: req.params.id }, (err, check) => {
    if (err) {
      console.log(err)
    } else {
      check = check
      res.status(200).send({ check })
    }
  })
})

//goi ham  login
router.post('/login', (req, res) => {
  let userData = req.body
  User.findOne({ email: userData.email }, (err, user) => {
    if (err) {
      console.log(err)
    } else {
      if (!user) {
   
        res.status(401).send('Invalid Email')
      } else
        if (user.password !== userData.password) {
          let note
          res.status(401).send('Invalid Password')
        } else {
          let payload = { subject: user._id }
          let token = jwt.sign(payload, 'secretKey')
          let iduser = user._id
          let nameuser=user.fullname
          res.status(200).send({ token, iduser,nameuser })
        }
    }
  })
})

//login admin
router.post('/loginAdmin', (req, res) => {
  let userData = req.body
  UserAdmin.findOne({ UserName: userData.UserName }, (err, useradmin) => {
    if (err) {
      console.log(err)
    } else {
      if (!useradmin) {
        res.status(401).send('Invalid Email')
      } else
        if (useradmin.PassWord !== userData.PassWord) {
          res.status(401).send('Invalid Password')
        } else {
          let idadmin = useradmin._id
          res.status(200).send(idadmin);
        }
    }
  })
})

//Hiên thị sản phẩm
router.get('/events', (req, res) => {
  Product.find(function (err, events) {
    if (err) {
      res.send(err);
    }
    res.json(events);
  });
})

// get event Nam
router.get('/man', (req, res) => {
  Product.find({ loai: 'Nam' }, function (err, events) {
    if (err) {
      res.send(err);
    }
    res.json(events);
  });
})

// get event Nu
router.get('/woman', (req, res) => {
  Product.find({ loai: 'Nữ' }, function (err, events) {
    if (err) {
      res.send(err);
    }
    res.json(events);
  });
})

//Chi tiết sản phẩm
router.get('/detailshoe/:_id', function (req, res) {
  Product.findById(req.params._id, function (err, detail, next) {
    if (err) {
      res.send(err);
    }
    res.json(detail);
  });
});

//search
router.get('/search/:id', function (req, res) {
  Product.find({ $or: [{ 'name': {$regex: '^'+ req.params.id}},{ loai: { $regex: '^' + req.params.id } }] }, function (err, search, next) {
    if (err) {
      res.send(err);
    }
    res.json(search);
  });
});

//delete
router.delete('/delete/:id', function (req, res) {
  Product.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      res.send(err);
      res.json("product deleted fail!");
    }
    res.json("product deleted successfully!");
  });
});

//insert product
router.post('/insert', (req, res) => {
  let userData = req.body
  let product = new Product(userData)
  product.save((err, insertData) => {
    if (err) {
      console.log("Lỗi:" + err)
      res.json("false");
    } else {
      res.json("Id " + insertData._id + " Insert successfully!")
    }
  })
})

//update product
router.put('/update', (req, res) => {
  let userData = req.body
  Product.updateOne({ _id: userData._id }, userData, { new: true }, function (err) {
    if (err) {
      console.log("Lỗi:" + err)
      res.json("false");
    } else {
      res.json("true")
    }

  })
})

// slider
router.get('/carousel', (req, res) => {
  slider.find(function (err, carousel) {
    res.json(carousel)
  }).limit(2).skip(1);
})
//slider active
router.get('/carouselActive', (req, res) => {
  slider.find(function (err, carousel) {
    res.json(carousel);
  }).limit(1).skip(0);
})
//insert slider
router.post('/insertslider', (req, res) => {
  let userData = req.body
  let slider1 = new slider(userData)
  slider1.save((err, insertslider) => {
    if (err) {
      console.log("Lỗi:" + err)
      res.json("product insert fail!");
    } else {
      res.json("Id " + insertslider._id + " Insert Cart successfully!")
    }
  })
})
//delete slider
router.delete('/deleteslider/:id', function (req, res) {
  slider.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      res.send(err);
      res.json("slider deleted fail!");
    }
    res.json("slider deleted successfully!");
  });
});
//get thong tin list sider theo id
router.get('/infoslider/:id', (req, res) => {
  listslider.findById(req.params.id, function (err, updateslider) {
    if (err) {
      res.send(err);
    }
    res.json(updateslider);
  });
})
//update slider của danh sách
router.put('/updateslider', (req, res) => {
  let userData = req.body
  listslider.updateOne({ _id: userData._id }, userData, function (err) {
    if (err) {
      console.log("Lỗi:" + err)
      res.json("false");
    } else {
      res.json("Update " +userData.title +" thành công")
    }
  })
})
//get list slider
router.get('/listslider', (req, res) => {
  listslider.find(function (err, carousel) {
    res.json(carousel)
  });
})
//insert list slider
router.post('/insertListSlider', (req, res) => {
  let userData = req.body
  let slider1 = new listslider(userData)
  slider1.save((err, insertslider) => {
    if (err) {
      console.log("Lỗi:" + err)
      res.json("product insert fail!");
    } else {
      res.json("Id " + insertslider._id + " Insert Cart successfully!")
    }
  })
})
//delete list slider
router.delete('/deleteListSlider/:id', function (req, res) {
  listslider.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      res.send(err);
      res.json("slider deleted fail!");
    }
    res.json("slider deleted successfully!");
  });
});
//them gio hang
router.post('/insertCart', (req, res) => {
  let userData = req.body
  let cart = new Cart(userData)
  cart.save((err, insertCart) => {
    if (err) {
      console.log("Lỗi:" + err)
      res.json("product insert fail!");
    } else {
      res.json("Id " + insertCart._id + " Insert Cart successfully!")
    }
  })
})

//thong tin nguoi dung
router.get('/infouser', (req, res) => {
  User.find(function (err, events) {
    if (err) {
      res.send(err);
    }
    res.json(events);
  });
})

//sort gia cao den thấp
router.get('/sortASC', (req, res) => {
  Product.find(function (err, events) {
    if (err) {
      res.send(err);
    }
    res.json(events);
  }).sort({ cost: -1 });
})

//sort gia thap den cao
router.get('/sortDESC', (req, res) => {
  Product.find(function (err, events) {
    if (err) {
      res.send(err);
    }
    res.json(events);
  }).sort({ cost: 1 });
})

// author 
router.get('/author', (req, res) => {
  Author.find(function (err, events) {
    if (err) {
      res.send(err);
    }
    res.json(events);
  });
})

//hien thi gio hang da them
router.get('/shopcart/:id', (req, res) => {
  Cart.find({ iduser: req.params.id, confirm: 0 }, function (err, events) {
    if (err) {
      res.send(err);
    }
    res.json(events);
  });
})

//hien thi gio hang da mua
router.get('/shopcartbuy/:id', (req, res) => {
  Cart.find({ $and:[{iduser: req.params.id},{$or:[ {confirm:1},{confirm:3},{confirm:4},{confirm:2}]} ]}, function (err, events) {
    if (err) {
      res.send(err);
    }
    res.json(events);
  });
})


router.put('/updatecart', (req, res) => {
  let userData = req.body
  Cart.updateMany({ iduser: userData.iduser,confirm:0 }, userData, function (err) {
    if (err) {
      console.log("Lỗi:" + err)
      res.json("false");
    } else {
      res.json("true")
    }
  })
})

/// delete cart
router.delete('/deleteCart/:id', function (req, res) {
  Cart.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      res.send(err);
      res.json("product deleted fail!");
    }
    res.json("product deleted successfully!");
  });
});

//count số lượng sản phẩm đã thêm
router.get('/countcart/:id', function (req, res) {
  Cart.aggregate([
    { $match: { confirm: 0, iduser: req.params.id } },
    {
      $group: {
        _id: "$confirm",
        total: {
          $sum: "$soluong"
        }
      }
    }
  ]
    , function (err, count, next) {

      if (err) {
        res.send(err);
      }
      res.json(count)
    });
});

// tổng tiền đã thêm trong hóa đơn
router.get('/sumcost/:id', function (req, res) {
  Cart.aggregate([
    { $match: { confirm: 0, iduser: req.params.id } },
    {
      $group: {
        _id: "$confirm",
        total: {
          $sum: "$sumcost"
        }
      }
    }
  ]
    , function (err, sum, next) {

      if (err) {
        res.send(err);
      }
      res.json(sum)
    });
});
//xác nhận chờ giao hàng
router.get('/sumcostconfirm/:id', function (req, res) {
  Cart.aggregate([
    { $match: { confirm: 1, iduser: req.params.id } },
    {
      $group: {
        _id: "$confirm",
        total: {
          $sum: "$sumcost"
        }
      }
    }
  ]
    , function (err, sum, next) {

      if (err) {
        res.send(err);
      }
      res.json(sum)
    });
});
//
//insert comment
router.post('/insertComment', (req, res) => {
  let userData = req.body
  let CommentUser = new commentUser(userData)
  CommentUser.save((err, insertData) => {
    if (err) {
      console.log("Lỗi:" + err)
      res.json("false");
    } else {
      res.json("Thank you was comment!")
    }
  })
})

//thong tin của user
router.get('/detailUser/:id', function (req, res) {
  User.findById(req.params.id, function (err, detailUser, next) {
    if (err) {
      res.send(err);
    }
    res.json(detailUser);
  });
});

//delete user
router.delete('/deleteUser/:id', function (req, res) {
  User.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      res.send(err);
      res.json("User deleted fail!");
    }
    res.json("User deleted successfully!");
  });
});

//update user
router.put('/updateuser', (req, res) => {
  let userData = req.body
  User.updateMany({ _id: userData._id }, userData, function (err) {
    if (err) {
      console.log("Lỗi:" + err)
      res.json("false");
    } else {
      res.json("true")
    }

  })
})
// tổng số lượng của từng loại sản phẩm
router.get('/sumcountproduct', function (req, res) {
  Cart.aggregate([
    // { $match: { confirm:4} },
    {
      $group: {
        _id: "$namesp",
        total: {
          $sum: "$soluong"
        }
      }
    }
  ]
    , function (err, sum, next) {

      if (err) {
        res.send(err);
      }
      res.json(sum)
    });
});
router.get('/producthight/:id', function (req, res) {
  Product.find({name: req.params.id} , function (err, prohight, next) {
    if (err) {
      res.send(err);
    }
    res.json(prohight);
  });
});
//tổng số sản phẩm
router.get('/countallproduct',function(req,res){
  Product.find().count({},function(err,countproduct){
    if(err){
      console.log(err)
    }
    res.json(countproduct)
  });
})
// lấy sản phẩm cuối cùng
router.get('/endproduct/:id',function(req,res){
  Product.find({},function(err,endproduct){
    if(err){
      console.log(err)
    }
    res.json(endproduct)
  }).limit(1).skip(Number(req.params.id));
})
//get comment của người dùng
router.get('/commentList',function(req,res){
  commentUser.find({},function(err,comment){
    if(err){
      console.log(err)
    }
    res.json(comment)
  });
})
///
router.delete('/deletecomment/:id', function (req, res) {
  commentUser.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      res.send(err);
      res.json("comment deleted fail!");
    }
    res.json("comment deleted successfully!");
  });
});

//get product:
router.get('/productxacnhan/:id', (req, res) => {
  Cart.find({confirm: req.params.id}, function (err, events) {
    if (err) {
      res.send(err);
    }
    res.json(events);
  });
})
//xác nhận người dùng mua hàng
router.put('/xacnhanadmin', (req, res) => {
  let userData = req.body
  Cart.updateOne({ _id:userData._id }, userData, function (err) {
    if (err) {
      console.log("Lỗi:" + err)
      res.json("false");
    } else {
      res.json("true")
    }
  })
})

//kiểm tra sản phẩm trong giỏ hàng có chưa trong event component
router.put('/kiemtrasanpham',function(req,res){
  let cartdata=req.body
  Cart.find().count({iduser:cartdata.iduser,idproduct:cartdata.idproduct,confirm:0},function(err,countproduct){
    if(err){
      console.log(err)
    }
    check=countproduct
    res.status(200).send({check})
  });
})
//Tính số lương sản phẩ của sản phẩm đó
router.put('/tinhsoluongsanphamdaco',function(req,res){
  let cartdata=req.body
  Cart.find({iduser:cartdata.iduser,idproduct:cartdata.idproduct,confirm:0},function(err,countproduct){
    if(err){
      console.log(err)
    }
    res.json(countproduct);
  });
})
//cập nhật lại số lượng giỏ hàng khi đã tồn tại sản phẩm trong event component
router.put('/updatesanphamdatontai',function(req,res){
  let cartdata=req.body
  Cart.updateOne({iduser:cartdata.iduser,idproduct:cartdata.idproduct,confirm:cartdata.confirm},cartdata,function(err){
    if(err){
      console.log(err)
    }
    res.json(" bạn đã cập nhật số lượng lên "+ cartdata.soluong)
  });
})
//đếm số slider trong component slider
router.get('/countslider',function(req,res){
  slider.find().count({},function(err,countslider){
    if(err){
      console.log(err)
    }
    res.json(countslider)
  });
})
function verifyToken(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).send('Unauthorized request')
  }
  let token = req.headers.authorization.split(' ')[1]
  if (token === 'null') {
    return res.status(401).send('Unauthorized request')
  }
  let payload = jwt.verify(token, 'secretKey')
  if (!payload) {
    return res.status(401).send('Unauthorized request')
  }
  req.userId = payload.subject
  next()
}
module.exports = router;