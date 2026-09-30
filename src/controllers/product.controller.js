import { productModel } from "../models/product.model.js";
import { uploadFile } from "../services/storage.service.js";

export const createProducts = async (req, res) =>{
    console.log(req.body);
    console.log(req.files);


    const uploadImages = req.files.map((file) => {
        return uploadFile({
            buffer: file.buffer,
            fileName: file.originalname
        })
    })

    const response = await Promise.all(uploadImages)
    const fileUrls = response.map(response => response.url)

    console.log(fileUrls)

    const product = await productModel.create({
        title: req.body.title,
        description: req.body.description,
        price: {
            amount: req.body.price.amount,
            currency: req.body.price.currency,
        },
        sizes: req.body.sizes,
        images: fileUrls,
        seller: req.user.userId
    })

    res.status(200).json({
        message:"Product created successfully",
        data:{
            product
        }
    })
    
}

export const listAllProducts = async (req, res)=>{
    const products = await productModel.find({
        published: true
    })

    res.status(200).json({
        message: "Products fetched successfully",
        data: {
            products
        }
    })
}

export const listAllProductToSeller = async (req, res)=>{
    const products = await productModel.find()

    return res.status(200).json({
        message: "Products fetched successfully",
        data: {
            products
        }
    })
}

export const unListProducts = async (req, res)=>{
    const { id } = req.params

    const product = await productModel.findById(id)

    if(!product){
        return res.status(404).json({
            message: "Product not found by Id"
        })
    }

    await productModel.findByIdAndUpdate(id,{
        published: false
    })
    return res.status(200).json({
        message: "Product unPublished successfully"
    })
}

export const listProducts = async (req, res)=>{
    const { id } = req.params

    const product = await productModel.findById(id)

    if(!product){
        return res.status(404).json({
            message: "Product not found by Id"
        })
    }

    await productModel.findByIdAndUpdate(id,{
        published: true
    })
    return res.status(200).json({
        message: "Product published successfully"
    })
}