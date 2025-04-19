const CreateTree = (categories)=>{
    const map = {}
    const tree = []
    categories.forEach(category => {
        map[category.id] = {...category,children:[]}
    });
    categories.forEach(category =>{
        if(category.parentId){
            map[category.parentId].children.push(map[category.id])
        }else{
            tree.push(map[category.id])
        }
    })
    return tree
}

module.exports = {CreateTree}