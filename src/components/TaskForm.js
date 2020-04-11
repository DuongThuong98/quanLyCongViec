import React, { Component } from 'react';
// import { EventEmitter } from 'events';
import { connect } from 'react-redux';
import * as actions from './../actions/index';

class TaskForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id:'',
            name: '',
            status: false
        }
    }

    //LIFE CYCLE
    componentWillMount() {
        if(this.props.itemEditing && this.props.itemEditing.id !== null){
            this.setState({
                id : this.props.itemEditing.id,
                name : this.props.itemEditing.name,
                status : this.props.itemEditing.status
            });
        }else{
            this.onClear();
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps && nextProps.itemEditing){
            this.setState({
                id : nextProps.itemEditing.id,
                name : nextProps.itemEditing.name,
                status : nextProps.itemEditing.status
            });
        }else{
            this.onClear();
        }
    }

    onExitForm = () => {
        this.props.onCloseForm();
    }

    onChange = (event) => {
        var target = event.target;
        var name = target.name;
        var value  = target.value;
        //ép kiểu boolean
        if(name === 'status')
        {
            value =target.value === 'true' ? true :false;
        }

        this.setState({
            [name]: value
        })
    }

    onSubmit = (event) => {
        event.preventDefault();
        this.props.onSaveTask(this.state)
        
        //Cancel and close form
        this.onClear();
        this.onExitForm();
    }

    onClear = () => {
      
        this.setState({
          
            name : '',
            status : false
        });
    }

    render() {
        var { id } = this.state;
        if(!this.props.isDisplayForm) return null;
        return (
            <div className="panel panel-warning">
                <div className="panel-heading">
                    <h3 className="panel-title">
                    { id !== '' ? 'Cập nhật công việc' : 'Thêm công việc'}
                    <span
                        className="fa fa-times-circle text-right"
                         onClick={this.onExitForm}
                    ></span>
                    </h3>
                </div>
                <div className="panel-body">
                    <form onSubmit = {this.onSubmit}>
                        <div className="form-group">
                            <label>Tên :</label>
                            <input type="text" 
                                className="form-control"
                                name="name"
                                value = {this.state.name}
                                onChange = {this.onChange} />
                        </div>
                        <label>Trạng Thái :</label>
                        <select className="form-control" 
                                required="required"
                                name="status"
                                value = {this.state.status}
                                onChange = {this.onChange}>
                            <option value={true}>Kích Hoạt</option>
                            <option value={false}>Ẩn</option>
                        </select>
                        <br />
                        <div className="text-center">
                            <button type="submit" className="btn btn-warning">Thêm</button>&nbsp;
                <button type="button"
                        className="btn btn-danger"
                        onClick={this.onClear}>Hủy Bỏ</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        isDisplayForm : state.isDisplayForm,
        itemEditing : state.itemEditing
    }
};

const mapDispatchToProps = (dispatch, props) => {
    return {
        onSaveTask : (task) => {
            dispatch(actions.saveTask(task));
        },
        onCloseForm : () => {
            dispatch(actions.closeForm());
        }
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(TaskForm);
