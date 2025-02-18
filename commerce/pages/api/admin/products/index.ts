import { getSession } from "next-auth/react";
import Product from "@/models/Product";
import db from "@/utils/db";

const handler = async (req:any, res:any) => {
    const session:any = await getSession({req});
    if (!session || !session.user.isAdmin){
        return res.status(401).send('admin signin required');

    }
   // const { user } = session;
    if (req.method === 'GET'){
        return getHandler(req, res);
    }else if(req.method === 'POST') {
        return postHandler(req, res);
    }
    else {
        return res.status(400).send({message: 'Method not allowed'})
    }
};
const postHandler = async (req:any, res:any) => {
    await db.connect();
    const newProduct = new Product({
        name:'Enter the product name',
        slug: 'insert-slug-no-space-lowercase-no-accents' + Math.random(),
        image: 'Insert image with H:850px X W:700px',
        price: 0,
        brand: 'Insert brand name',
        category: 'Enter the category with lowercase letters and no spaces',
        flavor: 'enter the flavor of the product',
        countInStock: 0,
        description: 'Enter product description',
        rating: 0,
        numReviews: 0,
    });
    const product = await newProduct.save();
    await db.disconnect()
    res.send({message: 'Product created successfully', product})
}
const getHandler = async (req:any, res:any) => {
    await db.connect();
    const products = await Product.find({});
    await db.disconnect();
    res.send(products);
}

export default handler;

