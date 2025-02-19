import { getSession } from "next-auth/react";
import User from "@/models/User";
import db from "@/utils/db";


const handler = async (req:any, res:any) => {
    const session:any = await getSession({req});
    if (!session || !session.user.isAdmin) {
         return res.status(401).send('admin signin required');

    }
    if(req.method === 'DELETE'){
        return deleteHandler(req, res);

    }else{
        return res.status(400).send({message: 'Method not allowed'});
    }
}   

const deleteHandler = async (req:any, res:any) => {
    await db.connect();
    const user:any = await User.findById(req.query.id);
    if(user){
    await user.deleteOne();
    await db.disconnect();
    res.send({message: 'User delete successfully!'});
}else {
    await db.disconnect();
    res.status(404).send({message: 'Users Not Found!'});
 }

};

export default handler