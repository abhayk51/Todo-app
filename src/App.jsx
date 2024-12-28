import React, {useState, useEffect} from 'react';
import List from './Components/List';
import Alert from './Components/Alert';

const getLocalStorage = () => {
  let list = localStorage.getItem("List");
  if(list){
    return (list = JSON.parse(localStorage.getItem("List")));
  }else {
    return [];
  }
}

const App = () => {
  const [name, setName] = useState("");
  const [list, setList] = useState(getLocalStorage());
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [alert, setAlert] = useState({show: false, msg: "", type: ""});

  useEffect(() => {
    localStorage.setItem("List", JSON.stringify(list));
  }, [list])

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!name){
      showAlert(true, "danger", "Please enter value");
    }else if(name && isEditing){
      console.log(name);
      setList(
        list.map((item)=>{
          if(item.id === editId){
            return {...item, title: name}
          }
          return item
        })
      );
      setName("");
      setEditId(null);
      setIsEditing(false);
      showAlert(true, "success","Value Changed");
    }else {
      showAlert(true, "success", "Item Added");
      const newItem = {id: new Date().getTime().toString(), title: name};
      setList([...list, newItem]);
      setName("");
    }
  };

  const showAlert = (show = false, type = "", msg = "") => {
    setAlert({show, type, msg});
  };

  const removeItem = (id) => {
    showAlert(true, "danger", "Item Removed");
    setList(list.filter((item) => item.id !== id));
  };
  const editItem = (id) => {
    const editItem = list.find((item) => item.id === id);
    setIsEditing(true);
    setEditId(id);
    setName(editItem.title);
  };
  const clearList = () => {
    showAlert(true, "danger", "Empty List");
    setList([]);
  };

  return (
    <section className='section-center'>
        {alert.show && <Alert {...alert} removeAlert={showAlert} list={list}/>}
      <form onSubmit={handleSubmit}>
        <h3 style={{marginBottom: "1.5rem", textAlign: "center"}}>
          Todo using LocalStorage
        </h3>
        <div className="mb-3 form">
          <input
          type="text"
          className="form-control"
          placeholder='e.g. walk'
          onChange={(e)=> setName(e.target.value)}
          value={name}
          />
          <button type="submit" className='btn btn-success'>
            {isEditing ? "Update" : "Add"}
          </button>
        </div>
      </form>
      {list.length > 0 && (
        <div style = {{marginTop: "2rem"}}>
          <List items={list} removeItem={removeItem} editItem={editItem}/>
          <div className="text-center">
            <button className="btn btn-warning" onClick={clearList}>
              Clear Items
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default App;