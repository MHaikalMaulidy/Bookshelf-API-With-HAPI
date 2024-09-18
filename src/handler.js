const { nanoid } = require('nanoid');
const bookshelf=require('./bookshelf');

const addBookHandler = (request, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading }=request.payload;
    const id=nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished= readPage === pageCount;

    const newBookshelf={
      id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt
    };
    if(name===undefined){
      const response = h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku',
      });
      response.code(400);
      return response;
    };
    if(readPage>pageCount){
      const response = h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
      });
      response.code(400);
      return response;
    };
    bookshelf.push(newBookshelf);
    const isSuccess = bookshelf.filter((list) => list.id === id).length > 0;
    if (isSuccess) {
      const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
          bookId: id,
      }
    });
    response.code(201);
    return response;
  };
};

const getAllBooksHandler = () => ({
  status: 'success',
  data: {
    books:bookshelf.map(book => ({
      id: book.id,
      name: book.name,
      publisher: book.publisher
  }))}
});

const getBookByIdHandler=(request, h)=>{
  const { id } = request.params;
  const book=bookshelf.filter((x)=>x.id===id)[0];

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};


const editBooksByIdHandler=(request, h)=>{
  const { id } = request.params;

  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
  const updatedAt=new Date().toISOString();
  if(name===undefined){
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  };
  if(readPage>pageCount){
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  };

  const index=bookshelf.findIndex((x)=>x.id===id);
  if (index !== -1) {
    bookshelf[index]={
      ...bookshelf[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  };
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan'
  });
  response.code(404);
  return response;
};

const deleteBooksByIdHandler=(request, h)=>{
  const { id } = request.params;
  const index=bookshelf.findIndex((x)=>x.id===id);

  if (index !== -1) {
    if (bookshelf[index].reading) {
      bookshelf.splice(index, 1);
  
      const response = h.response({
        status: 'success',
        message: 'Buku berhasil dihapus'
      });
      response.code(200);
      return response;
    }
    bookshelf.splice(index, 1);

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus'
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan'
  });
  response.code(404);
  return response;
};

const getAllReadingBooksHandler = () => {
  const readBook = bookshelf.filter((book) => book.reading === true);
  return {
    status: 'success',
    data: {
      books: readBook.map(book => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher
    }))
    }
  };
};
const getAllUnreadBooksHandler = () => {
  const readBook = bookshelf.filter((book) => book.reading === false);
  return {
    status: 'success',
    data: {
      books: readBook.map(book => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher
    }))
    }
  };
};

const getAllFinishedBooksHandler = () => {
  const readBook = bookshelf.filter((book) => book.finished === true);
  return {
    status: 'success',
    data: {
      books: readBook.map(book => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher
    }))
    }
  };
};

const getAllUnfinishBooksHandler = () => {
  const readBook = bookshelf.filter((book) => book.finished === false);
  return {
    status: 'success',
    data: {
      books: readBook.map(book => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher
    }))
    }
  };
};

const getWithFilter = (request) => {
  const name = request.query.name;
  const finish = request.query.finished;
  const reading = request.query.reading;

  if(name!==undefined){
    const hasNameValue = bookshelf.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()) === true);
    return {
      status: 'success',
      data: {
        books: hasNameValue.map(book => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher
      }))
      }
    };
  };

  if(reading!==undefined){
    if (reading === '1') {
      return getAllReadingBooksHandler();
    } else if(reading==='0'){
      return getAllUnreadBooksHandler();
    }
  };
  if(finish!==undefined){
    if (finish === '1') {
      return getAllFinishedBooksHandler();
    } else if(finish==='0'){
      return getAllUnfinishBooksHandler();
    }
  };
  return getAllBooksHandler()
};
module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBooksByIdHandler,
  deleteBooksByIdHandler,
  getAllReadingBooksHandler,
  getAllUnreadBooksHandler,
  getAllFinishedBooksHandler,
  getAllUnfinishBooksHandler,
  getWithFilter
};