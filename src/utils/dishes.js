export const transformToMenuFormat = (apiData) => {
    const categoryMap = new Map();

    apiData.data.forEach(item => {
        const categoryName = item.category.name;
        if (!categoryMap.has(categoryName)) {
            categoryMap.set(categoryName, []);
        }
        categoryMap.get(categoryName).push({
            displayOrder: categoryMap.get(categoryName).length + 1,
            id: item._id,
            name: item.name,
            price: `${item.price.toLocaleString()}đ`,
            saleStatus: item.stockStatus,
            image: item.image.url
        });
    });

    return Array.from(categoryMap, ([category, items]) => ({ category, items }));
};

export const transformToApiFormat = (menuData) => {
    return {
        success: true,
        total: menuData.reduce((sum, cat) => sum + cat.items.length, 0),
        totalPages: 0,
        currentPage: null,
        pageSize: null,
        data: menuData.flatMap(category =>
            category.items.map(item => ({
                _id: item.id,
                name: item.name,
                price: parseInt(item.price.replace(/\D/g, ""), 10),
                category: { name: category.category }, 
                image: { url: item.image, filePath: "/uploads/sample.jpg" }, 
                store: "67c6e409f1c07122e88619d6", 
                toppingGroups: [], 
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                __v: 0
            }))
        )
    };
};
