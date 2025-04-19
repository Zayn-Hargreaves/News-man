const flattenTree = (categories, level = 0) => {
    let result = [];
    categories.forEach((category) => {
        result.push({
            id: category.id,
            title: `${"— ".repeat(level)}${category.title}`, // Thụt lề theo cấp bậc
        });
        if (category.children && category.children.length > 0) {
            result = result.concat(flattenTree(category.children, level + 1));
        }
    });
    return result;
};

export {flattenTree}