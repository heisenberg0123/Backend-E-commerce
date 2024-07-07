const express = require('express');
const router = express.Router();
const {database}=require('../config/helpers');










//Get ALL Products
router.get('/', function(req, res) {
let page=(req.query.page !==undefined && req.query.page!==0)? req.query.page:1;  //0.10.20.30
const limit =(req.query.limit  !==undefined && req.query.limit !==0)?  req.query.limit : 10;

let startvalue;
let endvalue;

if(page>0){
    startvalue=(page*limit)-limit;
    endvalue=page*limit;
}else{
    startvalue=0;
    endvalue=10;
}


database.table('products as p')
    .join([{
        table:'categories as c',
        on :'c.id=p.cat_id',
    }])
    .withFields([
        'c.title as category',
        'p.title as name',
        'p.quantity',
        'p.image',
        'p.id'
    ])
    .slice(startvalue,endvalue)
    .getAll()
    .then(prods=>{
        if(prods.length>0){
            res.status(200).json({
                count:prods.length,
                products:prods
            });
        }else{
            res.json({message:'not founds'});
        }
    })

});




//GEt By ID
router.get('/:prodId',(req,res)=>{

let productId=req.params.prodId;


    database.table('products as p')
        .join([{
            table:'categories as c',
            on :'c.id=p.cat_id',
        }])
        .withFields([
            'c.title as category',
            'p.title as name',
            'p.quantity',
            'p.image',
            'p.images',
            'p.id'
        ])
        .filter({'p.id':productId})
        .get()
        .then(prod=>{
            if(prod){
                res.status(200).json
                (prod);

            }else{
                res.json({message:'not product found with this ID'});
            }
        })

});



//GEt All Products for specific Gategorie

router.get('/gategory/:cat_name',(req,res)=>{

    let page=(req.query.page !==undefined && req.query.page!==0)? req.query.page:1;  //0.10.20.30
    const limit =(req.query.limit  !==undefined && req.query.limit !==0)?  req.query.limit : 10;

    let startvalue;
    let endvalue;

    if(page>0){
        startvalue=(page*limit)-limit;
        endvalue=page*limit;
    }else{
        startvalue=0;
        endvalue=10;
    }
const cat_title  =req.params.cat_name;

    database.table('products as p')
        .join([{
            table:'categories as c',
            on :`c.id=p.cat_id WHERE c.title LIKE '%${cat_title}%'`,
        }])
        .withFields([
            'c.title as category',
            'p.title as name',
            'p.quantity',
            'p.image',
            'p.id'
        ])
        .slice(startvalue,endvalue)
        .getAll()
        .then(prods=>{
            if(prods.length>0){
                res.status(200).json({
                    count:prods.length,
                    products:prods
                });
            }else{
                res.json({message:`not founds for this ${cat_title} gategory`});
            }
        })






});


module.exports = router;
