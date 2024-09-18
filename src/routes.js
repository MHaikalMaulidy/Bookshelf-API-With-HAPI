const { addBookHandler,getBookByIdHandler,editBooksByIdHandler,deleteBooksByIdHandler,getWithFilter }=require('./handler');

const routes=[
    {
    method: 'POST',
    path: '/books',
    handler: addBookHandler
    },
    {
    method: 'GET',
    path: '/books',
    handler:getWithFilter
    },
    {
    method:'GET',
    path:'/books/{id}',
    handler: getBookByIdHandler
    },
    {
    method: 'PUT',
    path: '/books/{id}',
    handler: editBooksByIdHandler
    },
    {
    method: 'DELETE',
    path: '/books/{id}',
    handler: deleteBooksByIdHandler
    }
];
module.exports=routes;