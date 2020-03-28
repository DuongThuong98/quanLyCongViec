import React, { Component } from 'react';
import "./App.css"
import TaskForm from "./components/TaskForm"
import TaskControl from "./components/TaskControl"
import TaskList from "./components/TaskList"
import { findIndex, filter } from 'lodash'

class App extends Component {



  constructor(props) {
    super(props);
    this.state = {
      tasks: [],// id, name , status
      isDisplayForm: false,
      taskEditing: null,
      // filter: {
      //   name : '',
      //   status : -1
      // },

      filterName: '',
      filterStatus: -1,
      keyword: '',
      sortBy: 'name',
      sortValue: -1
    }
  }

  //hàm gọi 1 lầhn khi vào
  componentWillMount() {
    if (localStorage && localStorage.getItem('tasks')) {
      var tasks = JSON.parse(localStorage.getItem('tasks'));
      this.setState({
        tasks: tasks
      });
    }
    console.log('god');
  }

  s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }

  generateID() {
    return this.s4() + this.s4() + '-' + this.s4() +
      this.s4() + this.s4() + '-' + this.s4() +
      this.s4() + this.s4() + '-' + this.s4() +
      this.s4() + this.s4() + '-' + this.s4();
  }

  onToggleForm = () => {
    if (this.state.isDisplayForm && this.state.taskEditing) {
      this.setState({
        taskEditing: null
      });

    }
    else {
      this.setState({
        isDisplayForm: !this.state.isDisplayForm,
        taskEditing: null
      });
    }
  }

  onCloseForm = () => {
    // console.log('god');
    this.setState({
      isDisplayForm: false,
    });
  }

  onSubmit = (data) => {
    // console.log(data);
    var { tasks } = this.state;
    if (data.id === '') {
      data.id = this.generateID();
      tasks.push(data);
    }
    else {
      //editing
      var index = this.findIndex(data.id);
      tasks[index] = data;
    }

    this.setState({
      tasks: tasks,
      taskEditing: null
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));

  }

  onUpdateStatus = (id) => {
    console.log(id);
    var { tasks } = this.state;
    // var index = this.findIndex(id);
    var index = findIndex(tasks, (task) => {
      return task.id === id;
    });

    if (index !== -1) {
      tasks[index].status = !tasks[index].status;
      this.setState({
        tasks: tasks
      });
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }

  }

  findIndex = (id) => {
    var { tasks } = this.state;
    var result = -1;
    tasks.forEach((tasks, index) => {
      if (tasks.id === id) {
        result = index;
      }
    })
    return result;
  }

  onDelete = (id) => {
    // console.log(id);
    var { tasks } = this.state;
    var index = this.findIndex(id);
    if (index !== -1) {
      tasks.splice(index, 1);
      this.setState({
        tasks: tasks
      });
      localStorage.setItem('tasks', JSON.stringify(tasks));
      this.onCloseForm();
    }

  }

  onUpdate = (id) => {
    // console.log(id);
    var { tasks } = this.state;
    var index = this.findIndex(id);
    var taskEdit = tasks[index];
    this.setState({
      taskEditing: taskEdit
    })
    this.onShowForm();
  }

  onShowForm = () => {
    this.setState({
      isDisplayForm: true,
    });
  }

  onFilter = (filterName, filterStatus) => {
    // console.log(filterStatus,filterName);
    filterStatus = parseInt(filterStatus, 10);
    this.setState({
      filterName: filterName.toLowerCase(),
      filterStatus: filterStatus
    })
  }

  onSearch = (keyw) => {
    // console.log(key)
    this.setState({
      keyword: keyw.toLowerCase()
    })
  }

  onSort = (sortBy, sortValue) => {
    this.setState({
      sortBy: sortBy,
      sortValue: sortValue
    })
  }



  render() {
    console.log('test');
    var { tasks, isDisplayForm,
      taskEditing, filterName, filterStatus,
      keyword, sortBy, sortValue } = this.state; // var tasks = this.state.tasks (ES6)
    // console.log(filter);

    
    //lọc name
    if (filterName) {
      // tasks = tasks.filter((task) =>{
      //   return task.name.toLowerCase().indexOf(filter.name) !== -1;
      // })
      tasks = filter(tasks, (task) => {
        return task.name.toLowerCase().indexOf(filterName) !== -1;
      })
    }

    //lọc status
      tasks = tasks.filter((task) => {
        if (filterStatus === -1) {
          return task;
        } else {
          return task.status === (filterStatus === 1 ? true : false);
        }
      })


    //lọc name trên thanh control
    if (keyword) {
      tasks = tasks.filter((task) => {
        return task.name.toLowerCase().indexOf(keyword) !== -1;
      })
    }

    //sort trên thanh control
    if (sortBy === 'name') {
      tasks.sort((a, b) => {
        if (a.name > b.name) return sortValue;//thay viết 2 th -1 và 1 thì viết vậy cho gọn
        else if (a.name < b.name) return -sortValue;
        else return 0;
      });
    } else {
      tasks.sort((a, b) => {
        if (a.status > b.status) return sortValue;//thay viết 2 th -1 và 1 thì viết vậy cho gọn
        else if (a.status < b.status) return -sortValue;
        else return 0;
      });

    }



    var elmTaskForm = isDisplayForm ?
      <TaskForm onSubmit={this.onSubmit}
        onCloseForm={this.onCloseForm}
        task={taskEditing}
      />
      : "";
    return (
      <div className="container">
        <div className="text-center">
          <h1>Quản Lý Công Việc</h1>
          <hr />
        </div>
        <div className="row">
          <div className={isDisplayForm ? "col-xs-4 col-sm-4 col-md-4 col-lg-4" : ""}>
            {/* form */}
            {elmTaskForm}

          </div>
          <div className={isDisplayForm ? "col-xs-8 col-sm-8 col-md-8 col-lg-8" : "col-xs-12 col-sm-12 col-md-12 col-lg-12"}>
            <button type="button"
              className="btn btn-primary"
              onClick={this.onToggleForm}>
              <span className="fa fa-plus mr-5"></span>Thêm Công Việc
            </button>



            <TaskControl onSearch={this.onSearch}
              onSort={this.onSort}
              sortBy={sortBy}
              sortValue={sortValue}
            />

            <div className="row mt-15">
              <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">

                <TaskList tasks={tasks}
                  onUpdateStatus={this.onUpdateStatus}
                  onDelete={this.onDelete}
                  onUpdate={this.onUpdate}
                  onFilter={this.onFilter}
                />

              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
