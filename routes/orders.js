const express=require('express');
const router=express.Router();
const{database}=require('../config/helpers');




//Get ALL Orders
router.get('/',(req,res)=>{


    database.table('orders_details  as od')
        .join([{
            table:'orders as o',
            on:'o.id=od.order_id',
        },
            {
                table:'products ad p',
                on:'p.id=od.product_id',
            },
            {
                table:'users as us',
                on:'us.id=o.user_id',
            }
            ]
        )
        .withFields(['o.id','p.title as name','p.description','p.price','u.username'])
        .getAll()
        .then(orders=>{if(orders.length>0){
            res.status(200).json(orders);
        }
        else
        {
            res.json({message:'not founds'});
        }})




});



//Get By ID
router.get('/:id',(res,req)=>{

const order_id=req.param.id;


    database.table('orders_details  as od')
        .join([{
                table:'orders as o',
                on:'o.id=od.order_id',
            },
                {
                    table:'products ad p',
                    on:'p.id=od.product_id',
                },
                {
                    table:'users as us',
                    on:'us.id=o.user_id',
                }
            ]
        )
        .withFields(['o.id','p.title as name','p.description','p.price','u.username'])
        .filter({'o.id':order_id})
        .getAll()
        .then(orders=>{if(orders.length>0){
            res.status(200).json(orders);
        }
        else
        {
            res.json({message:`not founds with this ${order_id} order`});
        }})











});

//place new order
router.post('/new',(req,res)=>{



    let {userID,products}=req.body;
if(userID !==null && userID >0 && !isNaN(userID)){
    database.table('orders')
        .insert({user_id:userID})
        .then(newOrderId=>{
            if(newOrderId>0){
                products.forEach(async (p)=>{
                    let data=await database.table('products').filter({id:p.id}).withFields(['quantity']).get();
                    let incart=p.incart;


                    //number of pieces from attribut quantity

                    if(data.quantity>0){
                        data.quantity=data.quantity-incart;


                        if(data.quantity<0){
                            data.quantity=0;
                        }


                    }
                    else{
                        data.quantity=0;

                    }

                    database.table('orders_details')
                        .insert({
                            order_id:newOrderId,
                            product_id:p.id,
                            quantity:incart
                        }).then(newId=>{
                            database.table('product')
                                .filter({id:p.id})
                                .update({
                                    quantity:data.quantity
                                }).then(sucssecNumber=>{

                            }).catch(err=>console.log(err));
                    }).catch(err=>console.log(err));

                });
            }
            else{
                res.json({message:'new order failed while adding order details ',success:false})
            }
            res.json({
                messege:`order successfully placer with order id ${newOrderId}`,success:true,order_id:newOrderId,products:products
            });

    }).catch(err=>console.log(err));
}
else{
    res.json({message:'new order failed ',success:false});
}


});


// Fake Payment Getway Call

router.post('/payment',(req,res)=>{


    setTimeout(()=>{
        res.status(200).json({success:true});

    },3000);


});




module.exports=router;