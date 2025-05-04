 import { Table } from 'react-bootstrap';
import  {Axios} from "../../api/axios";

import { FaTrash } from "react-icons/fa";
import { FaPen } from "react-icons/fa";

import { Link } from 'react-router-dom';
import { Form,Button } from 'react-bootstrap';
import PaginatedItems from "./Pagination/Pagination";
import { useState,useEffect,useContext } from 'react';
import { WindowSize } from '../../context/WindowContext';


export default function TableShow(props) {

 const WindowContext = useContext(WindowSize);
  const windowSize = WindowContext.windowSize;
  
 function TransformDate(date) {

 const transformedDate = new Date(date); 
 
  const getFullYear = transformedDate.getUTCFullYear();
  const getMonth = (transformedDate.getUTCMonth() + 1).toString().padStart(2, "0");
  const getDate = transformedDate.getUTCDate().toString().padStart(2, "0");


  return `${getFullYear}-${getMonth}-${getDate}`;
}

  const currentUser = props.currentUser ||"";
  
  const [search,setSearch]= useState("")
  const [date,setDate]= useState("")
  const [pageFiltered, setPageFiltered] = useState(props.page);
  const [limitFiltered, setLimitFiltered] = useState(props.limit);
  const [FilteredData,setFilteredData]= useState([])
  const [FilteredTotal,setFilteredTotal]= useState(props.total)
  const [searchLoading,setSearchLoading]= useState(false);
  const idFilter = (props.page - 1) * props.limit + 1;
  
const FilteredDataByDate = date.length !== 0 ?props.data.filter((item) => {
      const itemDate = TransformDate(item.created_at); 
      const selectedDate = TransformDate(date);
      return itemDate === selectedDate;
    }):props.data;

    const filterSearchByData=date.length !==0 ?  FilteredData.filter((item) => {
      const itemDate = TransformDate(item.created_at); 
      const selectedDate = TransformDate(date);
      return itemDate === selectedDate;}):FilteredData;
      
 async function getSearchedData(){
 setSearchLoading(true);
    try {
        const res = await Axios.post(`${props.linkName}/search?title=${search}&limit=${limitFiltered}&page=${pageFiltered}`);
        
        setFilteredData(res.data.data);
        setFilteredTotal(res.data.total);
    } catch (err) {
        console.log(err);
    } finally {
        setSearchLoading(false);
    }
}

 useEffect(() => {
  const debounce = setTimeout(() => {
    if (search.length > 0) {
     
      getSearchedData();
    } else {
      setSearchLoading(false);
       
    }
  }, 500);

  return () => clearTimeout(debounce);
}, [search, pageFiltered, limitFiltered]);

  

const showWhichData = search.length > 0 
   ? filterSearchByData
   : FilteredDataByDate;



  // Always move the current user to the top, even in search results
  const sortedData = [...showWhichData].sort((a, b) => {
    if (currentUser.id === a.id) return -1; // Move current user to the top
    if (currentUser.id === b.id) return 1; // Move current user to the top
    return 0;
  });

  const headerShow = props.header.map((item, index) => <th key={index}>{item.name}</th>);

  const dataShow = sortedData.map((item, index) => (
    <tr key={index}>
      <td>{idFilter+index}</td>
      {props.header.map((item2, index2) => {
        let cellContent;
        switch (item2.key) {
          case 'created_at':
          case 'updated_at':
            cellContent = TransformDate(item[item2.key]);
             
            break;
          case 'category':
            cellContent = props.categories[item[item2.key]];
            break;
          case 'role':
            cellContent = 
              item[item2.key] === '1995' ? 'Admin' :
              item[item2.key] === '2001' ? 'User' :
              item[item2.key] === '1996' ? 'Guchee Manager' :
              item[item2.key] === '1999' ? 'Manager' :
              item[item2.key];
            break;
          case 'image':
            cellContent = (
              <img
                width={40}
                height={40}
                alt="Category image"
                src={"https://shopping-production.up.railway.app" + item[item2.key]} 
                className="rounded"
              />
            );
            break;
          case 'images':
            cellContent = item[item2.key].map((imgObj, key) => (
              <img 
                key={key}
                width={30}
                height={30}
                alt="img"
                src={"https://shopping-production.up.railway.app" + imgObj.image} 
                className="rounded"
                style={{ marginRight: '2px', marginBottom: '2px' }} 
              />
            ));
            break;
          default:
            cellContent = item[item2.key];
        }
        return <td key={index2}>{cellContent}</td>;
      })}
      <td>
        <div className="d-flex align-items-center gap-4">
          { currentUser.id === item.id ? (
            <Button style={{ fontSize: '0.95rem', padding: '0px 10px' }} variant="primary" size="sm" disabled>
              You
            </Button>
          ) : (
            <>
              <Link to={`${item.id}`}>
                <FontAwesomeIcon fontSize={'19px'} color={"grey"} icon={faPen} />
              </Link>
              <FontAwesomeIcon 
                cursor={'pointer'} 
                onClick={() => props.delete(item.id)}
                fontSize={'19px'} 
                color={"red"} 
                icon={faTrash} 
              />
            </>
          )}
        </div>
      </td>
    </tr>
  ));
  
  return (
    <>
      <div className="d-flex align-items-center justify-content-between my-3 " style={{ flexDirection: windowSize < 768 ? "column" : "row" ,gap:"10px"}}>
        <div className={windowSize < 768 ? "col-10" : "col-3"}>
          <Form.Control
            type="search"
            aria-label="input search"
            placeholder="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSearchLoading(true);
            }}
          />
        </div>
        <div className={windowSize < 768 ? "col-10" : "col-3"}>
          <Form.Control
            type="date"
            aria-label="input date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>
      <Table striped hover responsive className="low-shadow overflow-hidden">
        <thead className="px-2">
          <tr>
            <th className="f-cairo">ID</th>
            {headerShow}
            <th className="f-cairo">Action</th>
          </tr>
        </thead>
        <tbody>
          {props.loading ? (
            <tr>
              <td colSpan={12} className="text-center">Loading...</td>
            </tr>
          ) : searchLoading ? (
            <tr>
              <td colSpan={12} className="text-center">Searching...</td>
            </tr>
          ) : dataShow && dataShow.length > 0 ? (
            dataShow
          ) : (
            <tr>
              <td colSpan={12} className="text-center">No Data Found</td>
            </tr>
          )}
        </tbody>
      </Table>
      <div className="d-flex align-items-center justify-content-center flex-wrap my-2">
        <div className={windowSize < 768 ? "col-3" : "col-1"}>
          <Form.Select
            aria-label="Default select example"
            onChange={(e) =>{search.length>0?setLimitFiltered(e.target.value): props.setLimit(e.target.value)
            
            }}
          >
            <option disabled>Limit</option>
            <option value="3">3</option>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="30">30</option>
          </Form.Select>
        </div>
       <PaginatedItems
  setPage={props.setPage}
   setPageFiltered={setPageFiltered}
  itemsPerPage={search.length > 0?  limitFiltered : props.limit}
  total={search.length > 0 ? FilteredTotal : props.total}
  search={search}
/>

      </div>
    </>
  );
}
