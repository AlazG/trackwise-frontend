import React, { useState, useEffect } from 'react';

function Task({ task, headerId, onDelete, onMoveLeft, onMoveRight, onSaveEdit, onArchive }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);

  const handleSave = () => {
    onSaveEdit(editText);
    setIsEditing(false);
  };

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "8px",
      background: "#fff",
      border: "1px solid #eaeaea",
      borderRadius: "8px",
      marginBottom: "4px",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <button onClick={onMoveLeft} title="Move Left">&lt;</button>
        {isEditing ? (
          <input
            style={{ width: 160 }}
            value={editText}
            onChange={e => setEditText(e.target.value)}
            onBlur={handleSave}
            onKeyDown={e => { if (e.key === 'Enter') handleSave(); }}
            autoFocus
          />
        ) : (
          <span
            style={{
              maxWidth: '8ch',
              cursor: 'pointer',
              wordBreak: 'break-word',
              margin: "0 8px"
            }}
            onDoubleClick={() => setIsEditing(true)}
            title="Double click to edit"
          >
            {task.text}
          </span>
        )}
        {headerId === 'done' && <span title="Completed" style={{ color: "green" }}>✓</span>}
        <button onClick={onMoveRight} title="Move Right">&gt;</button>
      </div>
      {headerId === 'done' ? (
        <span></span>
        // <button onClick={onArchive} title="Archive" style={{ color: "#805ad5", marginLeft: 4 }}>🗄️</button>
      ) : (
        <div style={{ display: "flex", gap: "4px" }}>
          <button onClick={() => setIsEditing(true)} title="Edit" style={{ color: "#3182ce" }}>✎</button>
          <button onClick={onDelete} title="Delete">🗑️</button>
        </div>
      )}
    </div>
  );
}

function TaskComplete({ task, headerId, onDelete, onMoveLeft, onMoveRight, onSaveEdit, onArchive }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);

  const handleSave = () => {
    onSaveEdit(editText);
    setIsEditing(false);
  };

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "8px",
      marginBottom: "4px",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {isEditing ? (
          <input
            style={{ width: 160 }}
            value={editText}
            onChange={e => setEditText(e.target.value)}
            onBlur={handleSave}
            onKeyDown={e => { if (e.key === 'Enter') handleSave(); }}
            autoFocus
          />
        ) : (
          <span
            style={{
              maxWidth: '16ch',
              cursor: 'pointer',
              wordBreak: 'break-word',
              margin: "0 8px"
            }}

          >
            {task.text}
          </span>
        )}
        {headerId === 'done' && <span title="Completed" style={{ color: "green" }}>✓</span>}
      </div>
      {headerId === 'done' ? (
        <button onClick={onArchive} title="Archive" style={{ color: "#805ad5", marginLeft: 4 }}>🗄️</button>
      ) : (
        <div> </div>
      )}
    </div>
  );
}

function InventoryItem({ item, onDelete, onSaveEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(item.text);

  const handleSave = () => {
    onSaveEdit(editText);
    setIsEditing(false);
  };

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "8px",
      background: "#fff",
      border: "1px solid #eaeaea",
      borderRadius: "8px",
      marginBottom: "4px",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {isEditing ? (
          <input
            style={{ width: 160 }}
            value={editText}
            onChange={e => setEditText(e.target.value)}
            onBlur={handleSave}
            onKeyDown={e => { if (e.key === 'Enter') handleSave(); }}
            autoFocus
          />
        ) : (
          <span
            style={{
              maxWidth: '8ch',
              cursor: 'pointer',
              wordBreak: 'break-word',
              margin: "0 8px"
            }}
            onDoubleClick={() => setIsEditing(true)}
            title="Double click to edit"
          >
            {item.quantity}
          </span>
        )}
         </div>

        <div style={{ display: "flex", gap: "4px" }}>
          <button onClick={() => setIsEditing(true)} title="Edit" style={{ color: "#3182ce" }}>✎</button>
        </div>

    </div>
  );
}



const TAB_LIST = [
  { title: 'Tasks', key: 'tasks' },
  { title: 'Inventory', key: 'inventory' },
  { title: 'Reports', key: 'reports' },
  { title: 'Users', key: 'users' },
];

// Generate a simple unique ID (since uuid isn't available)
function simpleId() {
  return Math.random().toString(36).substr(2, 9) + Date.now();
}

export default function TrackWiseApp() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loginUser, setLoginUser] = useState({ name: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  // const [taskHeaders, setTaskHeaders] = useState([
  //   { id: 'todo', title: 'To Do', tasks: [] },
  //   { id: 'doing', title: 'Doing', tasks: [] },
  //   { id: 'done', title: 'Done', tasks: [] },
  // ]);
  const [taskHeaders, setTaskHeaders] = useState([
    { id: 'todo', title: 'To Do', tasks: [] },
    { id: 'doing', title: 'Doing', tasks: [] },
    { id: 'done', title: 'Done', tasks: [] },
  ]);
  useEffect(() => {
    fetch('http://localhost:5000/api/tasks')
      .then(res => res.json())
      .then(data => {
        if (!Array.isArray(data)) return;
        setTaskHeaders([
          { id: 'todo', title: 'To Do', tasks: data.filter(task => task.status === 'todo') },
          { id: 'doing', title: 'Doing', tasks: data.filter(task => task.status === 'doing') },
          { id: 'done', title: 'Done', tasks: data.filter(task => task.status === 'done') },
        ]);
      })
      .catch(err => console.error(err));
  }, []);


  const [newTask, setNewTask] = useState('');
  // const [inventoryItems, setInventoryItems] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/inventory')
      .then(res => res.json())
      .then(data => setInventoryItems(data))
      .catch(err => console.error(err));
  }, []); // empty array means run once on mount

  const [newItem, setNewItem] = useState({ name: '', quantity: '' });
  const [archivedTasks, setArchivedTasks] = useState([]);
  useEffect(() => {
    fetch('http://localhost:5000/api/tasks/archived')
      .then(res => res.json())
      .then(data => setArchivedTasks(data))
      .catch(err => console.error(err));
  }, []); // empty array means run once on mount

  // const [users, setUsers] = useState([{ name: 'admin', password: 'admin123' }]);

  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/users')
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error(err));
  }, []); // empty array means run once on mount

  const [newUser, setNewUser] = useState({ name: '', password: '' });
  const [userMessage, setUserMessage] = useState('');

  const handleLogin = () => {
    const matched = users.find(
      u => u.name === loginUser.name && u.password === loginUser.password
    );
    if (matched) {
      setAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Username or password incorrect!');
    }
  };

  const moveTask = (headerId, index, direction) => {
    const i = taskHeaders.findIndex(h => h.id === headerId);
    const j = i + direction;
    if (j < 0 || j >= taskHeaders.length) return;
    const updated = [...taskHeaders];
    const [task] = updated[i].tasks.splice(index, 1);
    updated[j].tasks.push(task);
    setTaskHeaders(updated);
    // console.log(i,j, index, h.id, h, task);
    // j=0 todo, j=1 doing, j=2 done
    var statustext = "todo";
    if (j===0) {
      statustext = "todo";
    }
    if (j===1) {
      statustext = "doing";
    }
    if (j===2) {
      statustext = "done";
    }
    fetch('http://localhost:5000/api/tasks/' + task.id, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
          status: statustext,
      }),
    })
      .then(res => res.json())
      .then(data => {
        // Handle success
        console.log('Login response:', data);
      })
      .catch(error => {
        // Handle error
        console.error('Error:', error);
      });

  };

  const archiveTaskFn = (headerId, index) => {
    const updated = [...taskHeaders];
    const [task] = updated.find(h => h.id === headerId).tasks.splice(index, 1);
    setTaskHeaders(updated);
    setArchivedTasks(prev => [...prev, task]);

    fetch('http://localhost:5000/api/tasks/' + task.id + '/archive', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                      })
                        .then(res => res.json())
                        .then(data => {
                          // Handle success
                          console.log('Login response:', data);
                        })
                        .catch(error => {
                          // Handle error
                          console.error('Error:', error);
                        });

  };

  // const deleteItem = idx => {
  //   const arr = [...inventoryItems];
  //   arr.splice(idx, 1);
  //   setInventoryItems(arr);
  // };

  if (!authenticated) {
    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        gap: 24
      }}>
        <div style={{
          background: "#fff",
          borderRadius: "10px",
          boxShadow: "0 2px 8px #0001",
          padding: 32,
          minWidth: 320,
        }}>
          <h2>TrackWise Login</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <input
              placeholder="Username"
              value={loginUser.name}
              onChange={e => setLoginUser({ ...loginUser, name: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              value={loginUser.password}
              onChange={e => setLoginUser({ ...loginUser, password: e.target.value })}
            />
            <button onClick={handleLogin}>Login</button>
            {loginError && <span style={{ color: "#e53e3e" }}>{loginError}</span>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, fontFamily: "system-ui", position: "relative" }}>
      {/* Logout Button */}
      <button
        onClick={() => {
          setAuthenticated(false);
          setLoginUser({ name: '', password: '' });
          setLoginError('');
        }}
        style={{
          position: "absolute",
          top: 24,
          right: 24,
          padding: "6px 16px",
          background: "#eee",
          border: "1px solid #bbb",
          borderRadius: 6,
          cursor: "pointer",
          fontWeight: 500
        }}
      >
        Logout
      </button>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
        {TAB_LIST.map((tab, idx) => (
          <button
            key={tab.key}
            style={{
              padding: "8px 20px",
              border: "none",
              borderBottom: activeTabIndex === idx ? "3px solid #3182ce" : "3px solid transparent",
              background: "none",
              fontWeight: activeTabIndex === idx ? 700 : 400,
              cursor: "pointer",
              color: activeTabIndex === idx ? "#3182ce" : "#444",
              outline: "none",
              fontSize: 16,
            }}
            onClick={() => setActiveTabIndex(idx)}
          >{tab.title}</button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTabIndex === 0 && (
        <div>
          <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
            <input
              placeholder="New task"
              value={newTask}
              onChange={e => setNewTask(e.target.value)}
              style={{ flex: 1, padding: 8 }}
            />
            <button
              onClick={() => {
                if (!newTask.trim()) return;
                const arr = [...taskHeaders];
                // arr[0].tasks.push({ id: simpleId(), text: newTask });

                // database'e ekle
                fetch('http://localhost:5000/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  text: newTask,
                  status: 'todo'
                }),
              })
                .then(res => res.json())
                .then(data => {
                  // Handle success
                  console.log('Login response:', data);
                  arr[0].tasks.push({ id: data.id, text: newTask });
                  setTaskHeaders(arr);
                setNewTask('');
                })
                .catch(error => {
                  // Handle error
                  console.error('Error:', error);
                });




                // setTaskHeaders(arr);
                // setNewTask('');

              }}
              style={{ padding: "8px 16px" }}
            >Add Task</button>
          </div>
          <div style={{ display: "flex", gap: 20 }}>
            {taskHeaders.map(h => (
              <div key={h.id} style={{
                background: "#fafafa",
                borderRadius: 10,
                boxShadow: "0 1px 6px #0001",
                minWidth: 260,
                padding: 16,
                flex: 1
              }}>
                <h4>{h.title}</h4>
                {h.tasks.map((t, idx) => (
                  <Task
                    key={t.id}
                    task={t}
                    headerId={h.id}

                    // task'ler burada siliniyor
                    // onDelete={() => {
                    //   const arr = [...taskHeaders];
                    //   const i = taskHeaders.findIndex(x => x.id === h.id);
                    //   arr[i].tasks.splice(idx, 1);
                    //   setTaskHeaders(arr);
                    // }}
                    onDelete={() => {
                      const arr = [...taskHeaders]; const i = taskHeaders.findIndex(x => x.id === h.id); arr[i].tasks.splice(idx, 1); setTaskHeaders(arr);
  
                    // database'den sil
  
                      fetch('http://localhost:5000/api/tasks/' + t.id, {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' },
                      })
                        .then(res => res.json())
                        .then(data => {
                          // Handle success
                          console.log('Login response:', data);
                          console.log(arr);
                          console.log(idx);
                        })
                        .catch(error => {
                          // Handle error
                          console.error('Error:', error);
                        });
                    }
                  }





                    onMoveLeft={() => {
                       moveTask(h.id, idx, -1);
                    }
                    }
                    onMoveRight={() => {
                      moveTask(h.id, idx, 1);
                    }
                    }
                    onSaveEdit={text => {
                      const arr = [...taskHeaders];
                      const i = taskHeaders.findIndex(x => x.id === h.id);
                      arr[i].tasks[idx].text = text;
                      // ismi degistir
                      fetch('http://localhost:5000/api/tasks/' + t.id, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          text: text,
                        }),
                      })
                        .then(res => res.json())
                        .then(data => {
                          // Handle success
                          console.log('Login response:', data);
                        })
                        .catch(error => {
                          // Handle error
                          console.error('Error:', error);
                        });


                      setTaskHeaders(arr);
                    }}
                    // onArchive={() => archiveTaskFn(h.id, idx)}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTabIndex === 1 && (
        <div>
          <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
            <input
              placeholder="Item name"
              value={newItem.name}
              onChange={e => setNewItem({ ...newItem, name: e.target.value })}
              style={{ flex: 1, padding: 8 }}
            />
            <input
              type="number"
              placeholder="Quantity"
              value={newItem.quantity}
              onChange={e => setNewItem({ ...newItem, quantity: e.target.value })}
              style={{ width: 120, padding: 8 }}
            />
            <button
              onClick={() => {
                if (!newItem.name || !newItem.quantity) return;


                // database'e ekle
                fetch('http://localhost:5000/api/inventory', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  name: newItem.name,
                  quantity: newItem.quantity
                }),
              })
                .then(res => res.json())
                .then(data => {
                  // Handle success
                  console.log('Login response:', data);
                  setInventoryItems(prev => [
                    ...prev,
                    { id: data.id, name: newItem.name, quantity: parseInt(newItem.quantity) }
                  ]);
                })
                .catch(error => {
                  // Handle error
                  console.error('Error:', error);
                });


                setNewItem({ name: '', quantity: '' });
              }}
              style={{ padding: "8px 16px" }}
            >Add Item</button>
          </div>
          <div>
     



          {inventoryItems.map((item, idx) => (
  <div
    key={item.id}
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "8px",
      marginBottom: 8,
      background: "#fff",
      border: "1px solid #eaeaea",
      borderRadius: 6
    }}
  >
    <div>
      <div>{item.name}</div>
      <div style={{ color: item.quantity < 50 ? "#e53e3e" : "#38a169" }}>
        {item.quantity < 50 ? 'Low Stock' : 'On Stock'}
      </div>
    </div>
    <input
      type="number"
      value={item.quantity}
      min={0}
      style={{ width: 70 }}
      onChange={e => {
        const newQuantity = parseInt(e.target.value, 10);
        const arr = [...inventoryItems];
        arr[idx].quantity = newQuantity;
        setInventoryItems(arr);

        // Update in database
        fetch('http://localhost:5000/api/inventory/' + item.id, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ quantity: newQuantity }),
        })
          .then(res => res.json())
          .then(data => {
            console.log('Inventory update response:', data);
          })
          .catch(error => {
            console.error('Error:', error);
          });
      }}
    />
    <button
      onClick={() => {
        const arr = [...inventoryItems];
        arr.splice(idx, 1);
        setInventoryItems(arr);

        // Delete from database
        fetch('http://localhost:5000/api/inventory/' + item.id, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        })
          .then(res => res.json())
          .then(data => {
            console.log('Delete response:', data);
          })
          .catch(error => {
            console.error('Error:', error);
          });
      }}
      style={{ color: "#e53e3e", padding: "4px 8px" }}
    >Delete</button>
  </div>
))}




              </div>
     
   
        </div>
      )}

      {activeTabIndex === 2 && (
        <div style={{ display: "flex", gap: 32 }}>
          <div style={{
            background: "#fafafa",
            borderRadius: 10,
            boxShadow: "0 1px 6px #0001",
            padding: 16,
            minWidth: 260
          }}>
            <h4>Inventory Summary</h4>
            {inventoryItems.map(item => (
              <div key={item.id} style={{ display: "flex", justifyContent: "space-between" }}>
                <span>{item.name}</span>
                <span>{item.quantity}</span>
              </div>
            ))}
          </div>
          <div style={{
            background: "#fafafa",
            borderRadius: 10,
            boxShadow: "0 1px 6px #0001",
            padding: 16,
            minWidth: 260
          }}>
            <h4>Completed Tasks</h4>
            {/* sadece done olanlar filter'lanacak */}
            {/* tasks: data.filter(task => task.status === 'done') */}
            <div style={{ display: "flex", gap: 20 }}>
            {taskHeaders
            .filter(h => h.id === 'done')
            .map(h => (
              <div key={h.id}>
                {h.tasks.map((t, idx) => (
                  <TaskComplete
                    key={t.id}
                    task={t}
                    headerId={h.id}
                    onArchive={() => archiveTaskFn(h.id, idx)}
                  />
                ))}
              </div>

            ))}
          </div>




          </div>





            

         



          <div style={{
            background: "#fafafa",
            borderRadius: 10,
            boxShadow: "0 1px 6px #0001",
            padding: 16,
            minWidth: 260
          }}>
            <h4>Archived Tasks</h4>
            {archivedTasks.map(t => (
              <div key={t.id}>{t.text}</div>
            ))}
          </div>


        </div>
      )}

      {activeTabIndex === 3 && (
        <div>
          <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
            <input
              placeholder="Username"
              value={newUser.name}
              onChange={e => setNewUser({ ...newUser, name: e.target.value })}
              style={{ flex: 1, padding: 8 }}
            />
            <input
              type="password"
              placeholder="Password"
              value={newUser.password}
              onChange={e => setNewUser({ ...newUser, password: e.target.value })}
              style={{ flex: 1, padding: 8 }}
            />
            <button
              onClick={() => {
                const valid = /^(?=.*[a-zA-Z])(?=.*\d).{6,12}$/.test(newUser.password);
                if (!valid) return setUserMessage('Password must be 6–12 chars, include letters & numbers.');
                
                
                
                // database'e ekle
                fetch('http://localhost:5000/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  name: newUser.name,
                  password: newUser.password
                }),
              })
                .then(res => res.json())
                .then(data => {
                  // Handle success
                  console.log('Login response:', data);
                })
                .catch(error => {
                  // Handle error
                  console.error('Error:', error);
                });
                


                setUsers(prev => [...prev, newUser]);
                setNewUser({ name: '', password: '' });
                setUserMessage('User added successfully.');
              }}
              style={{ padding: "8px 16px" }}
            >Add User</button>
          </div>
          {userMessage && <div style={{ color: "#3182ce", marginBottom: 20 }}>{userMessage}</div>}
          <div>
            {users.map((u, idx) => (
              <div key={idx} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                <input
                  value={u.name}
                  onChange={e => {
                    const arr = [...users]; arr[idx].name = e.target.value; setUsers(arr);
                  }}
                  style={{ flex: 1, padding: 8 }}
                />
                <input
                  type="password"
                  value={u.password}
                  onChange={e => {
                    const arr = [...users]; arr[idx].password = e.target.value; setUsers(arr);
                  }}
                  style={{ flex: 1, padding: 8 }}
                />
                <button
                  onClick={() => {
                    const arr = [...users]; arr.splice(idx, 1); setUsers(arr);

                  // database'den sil

                    fetch('http://localhost:5000/api/users/' + u.id, {
                      method: 'DELETE',
                      headers: { 'Content-Type': 'application/json' },
                    })
                      .then(res => res.json())
                      .then(data => {
                        // Handle success
                        console.log('Login response:', data);
                        console.log(u);
                        console.log(u.id);
                        console.log(arr);
                        console.log(idx);
                      })
                      .catch(error => {
                        // Handle error
                        console.error('Error:', error);
                      });



                  }
                }

                  style={{ color: "#e53e3e", padding: "4px 8px" }}
                >Delete</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
