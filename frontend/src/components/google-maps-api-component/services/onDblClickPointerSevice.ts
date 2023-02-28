export const onDblClickPointerSevice = () => {
    setTimeout(async () => {
        const pointer = await document.getElementById('pointerId');
        await pointer.click();
        await pointer.click();
    }, 500);
};