import ReactPaginate from 'react-paginate';
import './Pagination.css';



export default function PaginatedItems({ itemsPerPage,setPage,total,setPageFiltered,search }) {
  const pageCount= Math.ceil(total/itemsPerPage);
  
  const handlePageClick = (e) => {
    
    if (search.length > 0) {
      setPageFiltered(e.selected+1)}
      else{
      setPage(e.selected+1);
      }
  };

  return (
      <ReactPaginate
        breakLabel="..."
        nextLabel=">>"
        onPageChange={handlePageClick}
        pageRangeDisplayed={2}
        pageCount={pageCount}
        previousLabel="<<"
        renderOnZeroPageCount={null}
        containerClassName="custom-pagination d-flex align-items-center justify-content-center mt-3"
        pageLinkClassName="pagination-tag-anchor mx-2  rounded-circle  text-secondary"
        activeLinkClassName="text-white bg-primary"
      />
  );
}

