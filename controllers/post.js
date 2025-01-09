import { Post } from "../models/post.js";
import { User } from "../models/user.js";

export const createPost = async (req,res)=>{
try {
        //1. take data from user
        const {title, content, category} = req.body;
        if(!title || !category){
            return res.status(401).json("provide all details");
        }
    
        //2. get the loggined useIdr
        const userId = req.user;
        const user = await User.findOne({_id:userId});
   
    
        //3. craete post
        const post = await new Post({
            title: title,
            content: content,
            category: category,
            user: userId
        })
        await post.save();
        user.posts.push(post._id);
        await user.save();
    
        //4. generate response
        res.status(200).json("Post created successfully");
} catch (error) {
    res.status(500).json("Something went wrong check the console")
    console.debug(error);
}
}

export const sortfetch = async(req,res)=>{
    //1. get keyword for sorting from user
   const keyword = req.query.sort;
   if(!keyword){
    return;
   }
    
   const notMatchKeywordQuery = {content: { $nin: [new RegExp(`${keyword}`, 'i')] }};
   const matchKeywordQuery = {content: { $in: [new RegExp(`${keyword}`, 'i')] }};
   const projection ={
        _id: 0,
        title: 1,
        content:1
    }
    const includeKeyword = await Post.find(matchKeywordQuery,projection).exec()
    const notIncludeKeyword = await Post.find(notMatchKeywordQuery,projection).exec()
    const result = includeKeyword.concat(notIncludeKeyword);
    res.json(result);
}

export const searchPost = async(req,res)=>{
    //1. get keyword for sorting from user
   const keyword = req.query.search; 
   
   const query = keyword ? { content: { $regex: new RegExp(keyword, 'i') } } : {}; 

   const projection ={
    _id: 0,
    title: 1,
    content:1
}

    const result = await Post.find(query,projection).sort({createdAt:1}).exec()
    console.debug(result);
    res.status(200).json(result);

}