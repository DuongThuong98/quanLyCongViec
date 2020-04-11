import React, {Component} from 'react';
import Search from "./TaskSearchControl";
import Sort from "./TaskSortControl";


class TaskControl extends Component {
  render(){
  return (
    <div className="row mt-15">
    <Search />
    <Sort />
    
</div>
  );
  }
}

export default TaskControl;
