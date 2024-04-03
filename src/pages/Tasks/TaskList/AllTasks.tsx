import React, { useState, useEffect, useMemo, useCallback } from 'react';
import TableContainer from '../../../Components/Common/TableContainer';
import DeleteModal from "../../../Components/Common/DeleteModal";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { formatDateCreateProject } from "../../../helpers/format";
// Import Scroll Bar - SimpleBar
import SimpleBar from 'simplebar-react';

//Import Flatepicker
import Flatpickr from "react-flatpickr";
import * as moment from "moment";

//redux
import { useSelector, useDispatch } from "react-redux";
import { Col, Modal, ModalBody, Row, Label, Input, Button, ModalHeader, FormFeedback, Form } from 'reactstrap';

import {
  getTaskList,
  addNewTask,
  updateTask,
  deleteTask,
} from "../../../slices/thunks";

import {
  OrdersId,
  Project,
  CreateBy,
  DueDate,
  Status,
  Priority
} from "./TaskListCol";

// Formik
import * as Yup from "yup";
import { useFormik } from "formik";
import { isEmpty } from "lodash";
import { Link } from 'react-router-dom';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from "../../../Components/Common/Loader";
import { createSelector } from 'reselect';

import avatar1 from "../../../assets/images/users/avatar-1.jpg";
import avatar2 from "../../../assets/images/users/avatar-2.jpg";
import avatar3 from "../../../assets/images/users/avatar-3.jpg";
import avatar5 from "../../../assets/images/users/avatar-5.jpg";
import avatar6 from "../../../assets/images/users/avatar-6.jpg";
import avatar7 from "../../../assets/images/users/avatar-7.jpg";
import avatar8 from "../../../assets/images/users/avatar-8.jpg";
import avatar10 from "../../../assets/images/users/avatar-10.jpg";

const Assigned = [
  { id: 1, imgId: "anna-adame", img: avatar1, name: "Anna Adame" },
  { id: 2, imgId: "frank-hook", img: avatar3, name: "Frank Hook" },
  { id: 3, imgId: "alexis-clarke", img: avatar6, name: "Alexis Clarke" },
  { id: 4, imgId: "herbert-stokes", img: avatar2, name: "Herbert Stokes" },
  { id: 5, imgId: "michael-morris", img: avatar7, name: "Michael Morris" },
  { id: 6, imgId: "nancy-martino", img: avatar5, name: "Nancy Martino" },
  { id: 7, imgId: "thomas-taylor", img: avatar8, name: "Thomas Taylor" },
  { id: 8, imgId: "tonya-noble", img: avatar10, name: "Tonya Noble" },
];

const AllTasks = () => {
  const dispatch: any = useDispatch();
  const [modalCreateTask, setModalCreateTask] = useState<boolean>(false);
  const selectLayoutState = (state: any) => state.Tasks;
  const selectLayoutProperties = createSelector(
    selectLayoutState,
    (state) => ({
      taskList: state.taskList,
      isTaskSuccess: state.isTaskSuccess,
      error: state.error,
      isTaskAdd: state.isTaskAdd,
      isTaskAddFail: state.isTaskAddFail,
      isTaskDelete: state.isTaskDelete,
      isTaskDeleteFail: state.isTaskDeleteFail,
      isTaskUpdate: state.isTaskUpdate,
      isTaskUpdateFail: state.isTaskUpdateFail,
    })
  );
  // Inside your component
  const {
    taskList, isTaskSuccess, error
  } = useSelector(selectLayoutProperties);

  const [isEdit, setIsEdit] = useState<boolean>(false);

  const [task, setTask] = useState<any>([]);
  const [TaskList, setTaskList] = useState<any>([]);


  // Delete Task
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [deleteModalMulti, setDeleteModalMulti] = useState<boolean>(false);
  const [modal, setModal] = useState<boolean>(false);

  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      setTask(null);
    } else {
      setModal(true);
    }
  }, [modal]);
  const toggleCreate = useCallback(() => {

    if (modalCreateTask) {
      setModalCreateTask(false);
      setTask(null);
    } else {
      setModalCreateTask(true);
    }
  }, [modalCreateTask]);
  // Delete Data
  const onClickDelete = (task: any) => {
    setTask(task);
    setDeleteModal(true);
  };

  useEffect(() => {
    setTaskList(taskList);
  }, [taskList]);

  // Delete Data
  const handleDeleteTask = () => {
    if (task) {
      dispatch(deleteTask(task.id));
      setDeleteModal(false);
    }
  };

  // validation
  const validation: any = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      taskId: (task && task.id) || '',
      name: (task && task.name) || '',
      description: (task && task.description) || '',
      dueDate: (task && task.due_date) ? moment(task.due_date).format("YYYY-MM-DD") : '',
      status: (task && task.status) || '',
      priority: (task && task.priority) || '',
      assignees: (task && task.assignees) || [],
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Please Enter Task Name"),
     
    }),
    onSubmit: (values) => {
      var dataDate = formatDateCreateProject(new Date(values.dueDate))
      console.log(values.dueDate)
      const updatedTask = {
        // id: task ? task.id : 0,
        // taskId: values.taskId,
        // project: values.project,
        name: values.name,
        description: editorData,
        due_date: dataDate,
        status: parseInt(values.status),
        priority: parseInt(values.priority),
        // assignees: values.assignees,
      };
      // update customer
      var data = {
        id: task.id,
        task: updatedTask
      }
      console.log("khanh")

      dispatch(updateTask(data));
      // validation.resetForm();
      toggle();
      validation.resetForm();

    },
  });
  const [editorData, setEditorData] = useState("");
  const handleEditorChange = (event: any, editor: any) => {
    const data = editor.getData();
    setEditorData(data);
  };
  const [editorDataCreate, setEditorDataCreate] = useState("");
  const handleEditorCreateChange = (event: any, editor: any) => {
    const data = editor.getData();
    setEditorDataCreate(data);
  };  // Update Data
  
  const handleCustomerClick = useCallback((arg: any) => {
    const task = arg;
    console.log(task)
    setTask({
      id: task.id,
      name: task.name,
      description: task.description,
      status: task.status,
      priority: task.priority,
      due_date: task.due_date,
      assignees: task.assignees
    });
    setEditorData(task.description)
    console.log(task)
    toggle();
  }, [toggle]);

  // Add Data
  const handleTaskClicks = () => {
    setTask("");
    setIsEdit(false);
    toggle();
  };

  // Get Data

  useEffect(() => {
    if (!isEmpty(taskList)) setTaskList(taskList);
  }, []);

  useEffect(() => {
    if (taskList && !taskList.length) {
      dispatch(getTaskList());
    }
  }, [dispatch]);


  useEffect(() => {
    setTaskList(taskList);
  }, []);

  useEffect(() => {
    if (!isEmpty(taskList)) {
      setTaskList(taskList);
      setIsEdit(false);
    }
  }, []);


  // Checked All
  const checkedAll = useCallback(() => {
    const checkall: any = document.getElementById("checkBoxAll");
    const ele = document.querySelectorAll(".taskCheckBox");

    if (checkall.checked) {
      ele.forEach((ele: any) => {
        ele.checked = true;
      });
    } else {
      ele.forEach((ele: any) => {
        ele.checked = false;
      });
    }
    deleteCheckbox();
  }, []);

  // Delete Multiple
  const [selectedCheckBoxDelete, setSelectedCheckBoxDelete] = useState<any>([]);
  const [isMultiDeleteButton, setIsMultiDeleteButton] = useState<boolean>(false);

  const deleteMultiple = () => {
    const checkall: any = document.getElementById("checkBoxAll");
    selectedCheckBoxDelete.forEach((element: any) => {
      dispatch(deleteTask(element.value));
      setTimeout(() => { toast.clearWaitingQueue(); }, 3000);
    });
    setIsMultiDeleteButton(false);
    checkall.checked = false;
  };

  const deleteCheckbox = () => {
    const ele = document.querySelectorAll(".taskCheckBox:checked");
    ele.length > 0 ? setIsMultiDeleteButton(true) : setIsMultiDeleteButton(false);
    setSelectedCheckBoxDelete(ele);
  };

  const [filters, setFilters] = useState({});

    const handleFilterChange = (newFilters:any) => {
        setFilters(newFilters);
    };
  const columns = useMemo(
    () => [
      {
        Header: <input type="checkbox" id="checkBoxAll" className="form-check-input" onClick={() => checkedAll()} />,
        Cell: (cellProps: any) => {
          return <input type="checkbox" className="taskCheckBox form-check-input" value={cellProps.row.original.id} onChange={() => deleteCheckbox()} />;
        },
        id: '#',
      },
      {
        Header: "Order ID",
        accessor: "id",
        filterable: false,
        Cell: (cellProps: any) => {
          return <OrdersId {...cellProps} />;
        },
      },
      {
        Header: "Project",
        accessor: "project_id",
        filterable: false,
        Cell: (cellProps: any) => {
          return <Project {...cellProps} />;
        },
      },
      {
        Header: "Tasks",
        accessor: "name",
        filterable: false,
        Cell: (cellProps: any) => {
          return <React.Fragment>
            <div className="d-flex">
              <div className="flex-grow-1 tasks_name">{cellProps.value}</div>
              <div className="flex-shrink-0 ms-4">
                <ul className="list-inline tasks-list-menu mb-0">
                  <li className="list-inline-item">
                    <Link to="/apps-tasks-details">
                      <i className="ri-eye-fill align-bottom me-2 text-muted"></i>
                    </Link>
                  </li>
                  <li className="list-inline-item">
                    <Link to="#" onClick={() => { const taskData = cellProps.row.original; handleCustomerClick(taskData); }}>
                      <i className="ri-pencil-fill align-bottom me-2 text-muted"></i>
                    </Link>
                  </li>
                  <li className="list-inline-item">
                    <Link to="#" className="remove-item-btn" onClick={() => { const taskData = cellProps.row.original; onClickDelete(taskData); }}>
                      <i className="ri-delete-bin-fill align-bottom me-2 text-muted"></i>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </React.Fragment>;
        },
      },
      {
        Header: "Created By",
        accessor: "owner.full_name",
        filterable: false,
        Cell: (cellProps: any) => {
          return <CreateBy {...cellProps} />;
        },
      },
      // {
      //   Header: "Assigned To",
      //   accessor: "subItem",
      //   filterable: false,
      //   Cell: (cell: any) => {
      //     const assigned = cell.value.map((item: any) => item.img ? item.img : item);
      //     return (<React.Fragment>
      //       <div className="avatar-group">
      //         {assigned.map((item: any, index: any) => (
      //           <Link key={index} to="#" className="avatar-group-item">
      //             <img src={item} alt="" className="rounded-circle avatar-xxs" />
      //             {/* process.env.REACT_APP_API_URL + "/images/users/" + */}
      //           </Link>
      //         ))}

      //       </div>
      //     </React.Fragment>);
      //   },
      // },
      {
        Header: "Due Date",
        accessor: "due_date",
        filterable: true,
        Cell: (cellProps: any) => {
          return <DueDate {...cellProps} />;
        },
      },
      {
        Header: "Status",
        accessor: "status",
        filterable: true,
        Cell: (cellProps: any) => {
          return <Status {...cellProps} />;
        },
      },
      {
        Header: "Priority",
        accessor: "priority",
        filterable: false,
        Cell: (cellProps: any) => {
          return <Priority {...cellProps} />;
        },
      },
    ],
    [handleCustomerClick, checkedAll]
  );
console.log(TaskList);
const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('');

  // Handler for date change
  const handleDateChange = (selectedDates: Date[]) => {
    if (selectedDates.length === 2) {
      setStartDate(selectedDates[0].toISOString()); // Convert Date to ISO string
      setEndDate(selectedDates[1].toISOString());
      console.log(selectedDates[0].toISOString());
    }
  };

  // Handler for status change
  const handleStatusChange = (value:any) => {
    setStatus(value);
  };
  const handleFilterClick = () => {
 setTaskList(filteredData)
  };
  const filteredData = useMemo(() => {
    let filtered= taskList;
console.log(taskList)
    // Filter by date range
    if (startDate && endDate) {
      console.log(startDate)
      console.log(endDate)
      filtered = filtered.filter((item:any) => {
        const itemDate = new Date(item.due_date);
        console.log(itemDate >= new Date(startDate))
        return itemDate >= new Date(startDate) && itemDate <= new Date(endDate);
      });
    }

    // Filter by status
    if (status!="") {
      
      console.log("2")

      filtered = filtered.filter((item: any) => item.status == status);
      console.log(filtered)

    }

    return filtered;
  }, [taskList, startDate, endDate, status]);
  return (
    <React.Fragment>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteTask}
        onCloseClick={() => setDeleteModal(false)}
      />
      <DeleteModal
        show={deleteModalMulti}
        onDeleteClick={() => {
          deleteMultiple();
          setDeleteModalMulti(false);
        }}
        onCloseClick={() => setDeleteModalMulti(false)}
      />
      <div className="row">
        <Col lg={12}>
          <div className="card" id="tasksList">
            <div className="card-header border-0">
              <div className="d-flex align-items-center">
                <h5 className="card-title mb-0 flex-grow-1">All Tasks</h5>
                <div className="flex-shrink-0">
                  <div className="d-flex flex-wrap gap-2">
                    <button className="btn btn-primary add-btn me-1" onClick={() => { setIsEdit(false); toggle(); }}><i className="ri-add-line align-bottom me-1"></i> Create Task</button>
                    {isMultiDeleteButton && <button className="btn btn-soft-danger" onClick={() => setDeleteModalMulti(true)} ><i className="ri-delete-bin-2-line"></i></button>}
                  </div>
                </div>
              </div>
            </div>

            <div className="card-body pt-0">
              {isTaskSuccess && TaskList.length ? (
                <TableContainer
                  columns={columns}
                  data={(TaskList || [])}
                  isGlobalFilter={true}
                  isAddUserList={false}
                  customPageSize={8}
                  className="custom-header-css"
                  divClass="table-responsive table-card mb-3"
                  tableClass="align-middle table-nowrap mb-0"
                  theadClass="table-light text-muted"
                  thClass="table-light text-muted"
                  handleTaskClick={handleTaskClicks}
                  isTaskListFilter={true}
                  SearchPlaceholder="Search for tasks or something..."
                  handleStatusChange={handleStatusChange}
                  handleDateChange={handleDateChange}
                  handleFilterClick={handleFilterClick}
                />
              ) : (<Loader error={error} />)
              }
              <ToastContainer closeButton={false} limit={1} />
            </div>
          </div>
        </Col>
      </div>


      <Modal
        isOpen={modal}
        toggle={toggle}
        centered
        size="lg"
        className="border-0"
        modalClassName='modal fade zoomIn'
      >
        <ModalHeader className="p-3 bg-info-subtle" toggle={toggle}>
          Edit Task
        </ModalHeader>
        <Form className="tablelist-form" onSubmit={(e: any) => {
          e.preventDefault();
          validation.handleSubmit();
          return false;
        }}>
          <ModalBody className="modal-body">
            <Row className="g-3">



              <Col lg={12}>
                <div>
                  <Label for="tasksTitle-field" className="form-label">Task name</Label>
                  <Input
                    name="name"
                    id="tasksTitle-field"
                    className="form-control"
                    placeholder="Task name"
                    type="text"
                    validate={{
                      required: { value: true },
                    }}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.name || ""}
                    invalid={
                      validation.touched.name && validation.errors.name ? true : false
                    }
                  />
                  {validation.touched.name && validation.errors.name ? (
                    <FormFeedback type="invalid">{validation.errors.name}</FormFeedback>
                  ) : null}
                </div>
              </Col>
              <Col lg={12}>
                <div className="mb-3">
                  <Label className="form-label">Project Description</Label>
                  <CKEditor
                    editor={ClassicEditor}
                    data={editorData}
                    onChange={handleEditorChange}
                    onReady={(editor) => {
                    }}
                  />
                </div>
              </Col>

              <Col lg={12}>
                <Label className="form-label">Assigned To</Label>
                {/* <SimpleBar style={{ maxHeight: "95px" }}>
                  <ul className="list-unstyled vstack gap-2 mb-0">
                    {Assigned.map((item, key) => (<li key={key}>
                      <div className="form-check d-flex align-items-center">
                        <Input name="subItem" className="form-check-input me-3" type="checkbox"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={item.img}
                          invalid={validation.touched.subItem && validation.errors.subItem ? true : false}
                          id={item.imgId} />

                        <Label className="form-check-label d-flex align-items-center" htmlFor={item.imgId}>
                          <span className="flex-shrink-0">
                            <img src={item.img} alt="" className="avatar-xxs rounded-circle" />
                          </span>
                          <span className="flex-grow-1 ms-2">
                            {item.name}
                          </span>
                        </Label>
                        {validation.touched.subItem && validation.errors.subItem ? (
                          <FormFeedback type="invalid">{validation.errors.subItem}</FormFeedback>
                        ) : null}
                      </div>
                    </li>))}
                  </ul>
                </SimpleBar> */}
              </Col>

              <Col lg={6}>
                <Label for="duedate-field" className="form-label">Due Date</Label>
                <Flatpickr
                  name="dueDate"
                  id="duedate-field"
                  className="form-control"
                  placeholder="Select a date"
                  options={{
                    altInput: true,
                    altFormat: "d M, Y",
                    dateFormat: "d M, Y",
                  }}
                  onChange={(dueDate: any) => validation.setFieldValue("dueDate", moment(dueDate[0]).format("DD MMMM ,YYYY"))}
                  value={validation.values.dueDate || ''}
                />
                {validation.errors.dueDate && validation.touched.dueDate ? (
                  <FormFeedback type="invalid" className='d-block'>{validation.errors.dueDate}</FormFeedback>
                ) : null}
              </Col>
              <Col lg={6}>
                <Label for="ticket-status" className="form-label">Status</Label>
                <Input
                  name="status"
                  type="select"
                  className="form-select"
                  id="ticket-field"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.status || ""}
                  invalid={
                    validation.touched.status && validation.errors.status ? true : false
                  }
                >
                  <option value="1">Pending</option>
                  <option value="2">In-progress</option>
                  <option value="3">Completed</option>
                </Input>
                {validation.touched.status && validation.errors.status ? (
                  <FormFeedback type="invalid">{validation.errors.status}</FormFeedback>
                ) : null}
              </Col>
              <Col lg={12}>
                <Label for="priority-field" className="form-label">Priority</Label>
                <Input
                  name="priority"
                  type="select"
                  className="form-select"
                  id="priority-field"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.priority || ""}
                  invalid={
                    validation.touched.priority && validation.errors.priority ? true : false
                  }
                >
                  <option value="1">High</option>
                  <option value="2">Medium</option>
                  <option value="3">Low</option>
                </Input>
                {validation.touched.priority && validation.errors.priority ? (
                  <FormFeedback type="invalid">{validation.errors.priority}</FormFeedback>
                ) : null}
              </Col>
            </Row>
          </ModalBody>
          <div className="modal-footer">
            <div className="hstack gap-2 justify-content-end">
              <Button
                type="button"
                onClick={() => {
                  setModal(false);
                }}
                className="btn-light"
              >Close</Button>
              <button type="submit" className="btn btn-success" id="add-btn">Update Task</button>
            </div>
          </div>
        </Form>
      </Modal>
    </React.Fragment>
  );
};

export default AllTasks;