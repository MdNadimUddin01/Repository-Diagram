import { v4 as uuidv4 } from "uuid";
import {classCode ,extMap ,iconMap} from "../utils/constants.js"
class Trie {
  currentValue;
  isLast;
  children;
  id;
  constructor(value, u_id) {
    this.currentValue = value;
    this.isLast = false;
    this.children = new Map();
    this.id = u_id;
  }
}


function insertIntoTrie(trie, path, index) {
  if (index >= path.length) {
    return;
  }

  let children = trie.children;
  //
  if (children.get(path[index])) {
    insertIntoTrie(children.get(path[index]), path, index + 1);
  } else {
    let currentNode = new Trie(path[index] ,uuidv4());
      const ext = currentNode.currentValue.toLowerCase().match(/\.[^.]+$/)?.[0] || "";
      currentNode.isLast = extMap[`${ext}`] ? true : false;
     
        
     children.set(path[index], currentNode);
      insertIntoTrie(currentNode, path, index + 1);
      
  }
}

function trieTraversal(trie , mermaidCodeArr) {
  // console.log(trie)
  let children = trie.children;
  // console.log(trie)

  children.forEach((value, key) => {

    const ext = value.currentValue.toLowerCase().match(/\.[^.]+$/)?.[0] || "";
      const icon = !value.isLast ? "📂" : iconMap[ext] || "📄";
      const className = !value.isLast ? "folderNode" : extMap[`${ext}`] || "unknownFile";

      mermaidCodeArr.push(
        !value.isLast
          ? `${trie.id} --> ${value.id}((${icon} ${value.currentValue})):::${className}`
          : `${trie.id} --> ${value.id}[${icon} ${value.currentValue}]:::${className}`
      );
      
    trieTraversal(value , mermaidCodeArr);
  });

  // console.log(mermaidCodeArr)
}

export const generateMermaidCode = async (req, res) => {
  
  const { file, repoName } = req.body;
  // console.log(file)
  let arr = JSON.parse(file)

 try {
   let trie = new Trie(repoName, uuidv4());
 
   for (let i = 0; i < arr.length; i++) {
     let temp = arr[i].split("/");
    //  console.log(arr[i]);
     insertIntoTrie(trie, temp, 0);
   }
     
     let mermaidCodeArr = ["flowchart TD", `${trie.id}((🏠 ${repoName})):::rootNode`];
     trieTraversal(trie, mermaidCodeArr);
   let mermaidCode = ""
   
   for (let i = 0; i < mermaidCodeArr.length ; i++) {
     mermaidCode += mermaidCodeArr[i]+"\n"
   }
 
   for (let i = 0; i < classCode.length; i++){
     mermaidCode += classCode[i] +"\n"
   }

   return res.status(200).send({
     message: "Code Recieved",
     result:mermaidCode,
   });
 } catch (error) {
  console.log("Error : ", error);
  return res.status(500).send({
    message: "Internal Server Error",
  });
 }

};
