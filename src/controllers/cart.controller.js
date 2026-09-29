import { productModel } from "../models/product.model.js";
import { cartModel } from "../models/cart.model.js";

export const addToCart = async (req, res) => {
    const { productID, quantity, size} = req.body();

    const product = await productModel.findById(productID)

    if(!product){
        return res.status(400).json({
            message: "Product not found"
        })
    }

    const selectedSize = product.size.find(s => s.size === size)

    if(!selectedSize){
        return res.status(400).json({
            message: "Invalid Size"
        })
    }

    if(selectedSize.stock < qnatity){
        return res.status(400).json({
            message: "Insufficient stock"
        })
    }

    const cart = await cartModel.findOne({ user: req.user.userId }) ?? await cartModel.create({ user: req.user.userId })

    const productInCart =  cart.products.find(p => (p.product.toString() === productID) && (p.size === size))

    if(productInCart){
        if((productInCart.quantity + quantity) < selectedSize.stock){
            return res.status(400).json({
                message: "InSufficient stock"
            })
        }
    }

    await cartModel.updateOne(
        {
            user: req.user.userId,
            "products.product": productID,
            "products.size": size
        },
        {
            $inc:{
                "products.$.quantity": quantity
            }
        }
    )

    return res.status(200).json({
        message: "Product quantity updated successfully"
    })

    await cartModel.findOneAndUpdate({
        user: req.user.userId
    }, {
        $push:{
            products:{
                product: productID,
                quantity: quantity,
                size: size
            }
        },
    })

    return res.status(200).json({
        message: "Product added to cart"
    })
}

export const getCartcontroller = async (req, res)=>{
    const cart = (await cartModel.findOne({ user: req.user.userId}) 
    ?? 
    await cartModel.create({ user: req.user.userId }))

    return res.status(200).json({
        message: "Cart retrived successfully",
        data:{
            cart
        }
    })
}