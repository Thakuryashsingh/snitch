import { Router } from "express";
import { authenticate, authenticateSeller } from "../middlewares/auth.middlieware.js";
import { createProducts, listAllProducts, listAllProductToSeller, listProducts, unListProducts } from "../controllers/product.controller.js";
import { listProductValidator, productsValidator, unListProductValidator } from "../validator/products.validation.js";
import multer from "multer";

const upload = multer({ 
    storage: multer.memoryStorage(),
    limits:{
        files: 5,
        fileSize: 1 * 1024 * 1024 //1MB
    }
})

const router = Router();

router.post("/", authenticate, authenticateSeller, upload.array("images"), (req, res, next)=>{
    req.body?.price && (req.body.price = JSON.parse(req.body.price))
    req.body?.sizes && (req.body.sizes = JSON.parse(req.body.sizes)) 
    next()
},productsValidator, createProducts)

router.get("/", authenticate, listAllProducts)

router.get("/seller", authenticate, authenticateSeller, listAllProductToSeller)

router.patch("/unlist/:id", authenticate, authenticateSeller, unListProductValidator, unListProducts)

router.patch("/list/:id", authenticate, authenticateSeller, listProductValidator, listProducts)


export default router;
