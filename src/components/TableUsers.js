import { useEffect } from "react";
import Table from "react-bootstrap/Table";
import { useState } from "react";
import { fetchAllUser } from "../services/UserService";
import ReactPaginate from "react-paginate";
import ModalAddNew from "./ModalAddNew";
import ModalEditUser from "./ModalEditUser";
import ModalConfirm from "./ModalConfirm";
import _, { debounce } from "lodash";
import { CSVLink, CSVDownload } from "react-csv";
import Papa from "papaparse";
import { toast } from "react-toastify";
import "./TableUser.scss";

const TableUsers = (props) => {
  const [listUsers, setListUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [isShowModalAddNew, setIsShowModalAddNew] = useState(false);
  const [isShowModalEdit, setIsShowModalEdit] = useState(false);
  const [dataUserEdit, setDataUserEdit] = useState({});

  const [isShowModalDelete, setIsShowModalDelete] = useState(false);
  const [dataUserDelete, setDataUserDelete] = useState({});

  const [sortBy, setSortBy] = useState("asc");
  const [sortField, setSortField] = useState("id");

  const [keyword, setKeyword] = useState("");
  const [dataExport, setDataExport] = useState([]);

  const handleClose = () => {
    setIsShowModalAddNew(false);
    setIsShowModalEdit(false);
    setIsShowModalDelete(false);
  };

  const handleUpdateUser = (user) => {
    setListUsers([user, ...listUsers]);
  };

  const handleEditUser = (user) => {
    setDataUserEdit(user);
    setIsShowModalEdit(true);
  };

  const handleEditUserFromModal = (user) => {
    let cloneListUsers = _.cloneDeep(listUsers);
    let index = listUsers.findIndex((item) => item.id === user.id);
    cloneListUsers[index].first_name = user.first_name;
    console.log("before: ", listUsers, "after: ", cloneListUsers);
    setListUsers(cloneListUsers);
  };

  const handleDeleteUserFromModal = (user) => {
    let cloneListUsers = _.cloneDeep(listUsers);
    cloneListUsers = cloneListUsers.filter((item) => item.id !== user.id);
    setListUsers(cloneListUsers);
  };

  const handleSort = (sortBy, sortField) => {
    setSortBy(sortBy);
    setSortField(sortField);

    let cloneListUsers = _.cloneDeep(listUsers);
    cloneListUsers = _.orderBy(cloneListUsers, [sortField], [sortBy]);
    setListUsers(cloneListUsers);
  };

  useEffect(() => {
    //call api
    getUsers(1);
  }, []);

  const getUsers = async (page) => {
    let res = await fetchAllUser(page);

    if (res && res.data) {
      setTotalUsers(res.total);
      setListUsers(res.data);
      setTotalPages(res.total_pages);
    }
  };

  const handlePageClick = (event) => {
    getUsers(+event.selected + 1);
  };

  const handleDeleteUser = (user) => {
    setIsShowModalDelete(true);
    setDataUserDelete(user);
    // console.log("delete data", user);
  };

  const handleSearch = debounce(() => {
    //hàm debounce handle số lần user call api lại quá nhiều,
    //trong hàm này k cần vì đã gán value cho button gọi value cuối cùng của user nhập vào.
    let temp = keyword;
    if (temp) {
      let cloneListUsers = _.cloneDeep(listUsers);
      cloneListUsers = cloneListUsers.filter((item) =>
        item.email.includes(temp)
      );
      setListUsers(cloneListUsers);
    } else {
      getUsers(1);
    }
  }, 100);

  const getUsersExport = (event, done) => {
    let results = [];
    if (listUsers && listUsers.length > 0) {
      results.push(["Id", "Email", "First name", "Last name"]);
      listUsers.map((item, index) => {
        let arr = [];
        arr[0] = item.id;
        arr[1] = item.email;
        arr[2] = item.first_name;
        arr[3] = item.last_name;
        results.push(arr);
      });
      setDataExport(results);
      done();
    }
  };

  const handleImportCSV = (event) => {
    if (event.target && event.target.files && event.target.files[0]) {
      let file = event.target.files[0];
      if (file.type !== "text/csv") {
        toast.error("Only accept csv files");
        return;
      }
      Papa.parse(file, {
        // header: true,
        complete: function (results) {
          let rawCSV = results.data;
          if (rawCSV.length > 0) {
            if (rawCSV[0] && rawCSV[0].length === 3) {
              if (
                rawCSV[0][0] !== "email" ||
                rawCSV[0][1] !== "first_name" ||
                rawCSV[0][2] !== "last_name"
              ) {
                toast.error("Wrong format Header CSV file");
              } else {
                let results = [];

                rawCSV.map((item, index) => {
                  if (index > 0 && item.length === 3) {
                    let obj = {};
                    obj.email = item[0];
                    obj.first_name = item[1];
                    obj.last_name = item[2];
                    results.push(obj);
                  }
                });
                setListUsers(results);
                // console.log("check results: ", results);
              }
            } else {
              toast.error("Wrong format CSV file");
            }
          } else {
            toast.error("Not found data on CSV file");
          }
          // console.log("Finished: ", results.data);
        },
      });
    }
  };

  return (
    <>
      <div className="my-3 fw-bold d-flex justify-content-between align-items-center">
        <span>List Users:</span>
        <div className="d-flex gap-2">
          <label className="btn btn-warning" htmlFor="test">
            <i className="fa-solid fa-file-import px-1"></i>Import
          </label>
          <input
            id="test"
            type="file"
            hidden
            onChange={(event) => handleImportCSV(event)}
          ></input>

          <CSVLink
            filename={"users.csv"}
            className="btn btn-primary"
            data={dataExport}
            asyncOnClick={true}
            onClick={getUsersExport}
          >
            <i className="fa-solid fa-download px-1"></i>Export
          </CSVLink>

          <button
            className="btn btn-success"
            onClick={() => setIsShowModalAddNew(true)}
          >
            <i className="fa-solid fa-circle-plus"></i> Add new
          </button>
        </div>
      </div>
      <div className="d-flex col-4 my-3">
        <input
          className="form-control"
          placeholder="Search user by email.."
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
        ></input>
        <button
          className="btn border btn-primary"
          onClick={() => handleSearch()}
        >
          <i className="fa-solid fa-magnifying-glass"></i>
        </button>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>
              <div className="sort-header">
                <span>ID</span>
                <span>
                  <i
                    className="fa-solid fa-arrow-down-long"
                    onClick={() => handleSort("desc", "id")}
                  ></i>
                  <i
                    className="fa-solid fa-arrow-up-long"
                    onClick={() => handleSort("asc", "id")}
                  ></i>
                </span>
              </div>
            </th>
            <th>Email</th>
            <th>
              <div className="sort-header">
                <span>First Name</span>
                <span>
                  <i
                    className="fa-solid fa-arrow-down-long"
                    onClick={() => handleSort("desc", "first_name")}
                  ></i>
                  <i
                    className="fa-solid fa-arrow-up-long"
                    onClick={() => handleSort("asc", "first_name")}
                  ></i>
                </span>
              </div>
            </th>
            <th>Last Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {listUsers &&
            listUsers.length > 0 &&
            listUsers.map((item, index) => {
              return (
                <tr key={`user-${index}`}>
                  <td>{item.id}</td>
                  <td>{item.email}</td>
                  <td>{item.first_name}</td>
                  <td>{item.last_name}</td>
                  <td>
                    <button
                      type="button"
                      class="btn btn-primary me-3"
                      onClick={() => handleEditUser(item)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      class="btn btn-danger"
                      onClick={() => handleDeleteUser(item)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </Table>
      <ReactPaginate
        breakLabel="..."
        nextLabel="next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={totalPages}
        previousLabel="< previous"
        renderOnZeroPageCount={null}
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item"
        previousLinkClassName="page-link"
        nextClassName="page-item"
        nextLinkClassName="page-link"
        containerClassName="pagination"
        activeClassName="active"
        breakClassName="page-item"
        breakLinkClassName="page-link"
      />
      <ModalAddNew
        show={isShowModalAddNew}
        handleClose={handleClose}
        handleUpdateUser={handleUpdateUser}
      />
      <ModalEditUser
        show={isShowModalEdit}
        dataUserEdit={dataUserEdit}
        handleClose={handleClose}
        handleEditUserFromModal={handleEditUserFromModal}
      />

      <ModalConfirm
        show={isShowModalDelete}
        dataUserDelete={dataUserDelete}
        handleClose={handleClose}
        handleDeleteUserFromModal={handleDeleteUserFromModal}
      />
    </>
  );
};
export default TableUsers;
