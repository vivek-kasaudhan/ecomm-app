import express from "express";
import formidable from "express-formidable";


import { isAdmin, requireSignin } from "../middlewares/authmiddleware.js";
import {  braintreePaymentctrl, braintreeTokenctrl, createProductctrl, deleteProductctrl, getProductctrl, getSingleProductctrl, productCategoryctrl, productCountctrl, productFilterctrl, productListCtrl, productPhotoctrl, relatedProductctrl, searchProductctrl, updateProductctrl } from "../contollers/productController.js";

const router  =  express.Router()

router.post('/create-product',requireSignin,isAdmin,formidable(),createProductctrl)

router.get('/get-product',getProductctrl)

router.get('/get-single-product/:slug',getSingleProductctrl)

router.get('/product-photo/:pid',productPhotoctrl)

router.delete('/delete-product/:pid',deleteProductctrl)


router.put('/update-product/:pid',requireSignin,isAdmin,formidable(),updateProductctrl)


// filter product

router.post('/product-filters',productFilterctrl)

//productcount
router.get('/product-count',productCountctrl)

//product per page
router.get('/product-list/:page',productListCtrl)


// search product using name of product

router.get('/search/:keyword',searchProductctrl)


//related product controller
router.get('/related-product/:pid/:cid',relatedProductctrl)


//category wise product on clicking
router.get('/product-category/:slug',productCategoryctrl)

//payments route 
// getting payment token
router.get('/braintree/token',braintreeTokenctrl)

//payments
router.post('/braintree/payment',requireSignin,braintreePaymentctrl)



export default router