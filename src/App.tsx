import React, { useState, useEffect, useRef, type ReactNode, type FormEvent } from 'react';

// --- TYPES & INTERFACES ---
interface Task {
  id: number;
  text: string;
}

interface SectionProps {
  title: string;
  children: ReactNode;
}

interface TaskRowProps {
  task: Task;
  onRemove: (id: number) => void;
}

// 1. REUSABLE COMPONENT (Full Width)
const SectionWrapper: React.FC<SectionProps> = ({ title, children }) => (
  <div style={{ 
    border: '1px solid #ddd', 
    padding: '25px', 
    borderRadius: '12px', 
    marginBottom: '20px', 
    background: '#fff',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
    width: '100%' // Ensures the card takes full width of container
  }}>
    <h2 style={{ marginTop: 0, color: '#333', fontSize: '1.5rem' }}>{title}</h2>
    {children}
  </div>
);

const TaskRow: React.FC<TaskRowProps> = ({ task, onRemove }) => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'space-between', 
    padding: '12px 0', 
    borderBottom: '1px solid #eee',
    fontSize: '1.1rem'
  }}>
    <span>{task.text}</span>
    <button onClick={() => onRemove(task.id)} style={{ 
      color: '#ff4d4f', 
      border: 'none', 
      background: 'none', 
      cursor: 'pointer',
      fontWeight: 'bold' 
    }}>Delete</button>
  </div>
);

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [text, setText] = useState<string>("");
  const searchInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("tasks_list_ts");
    if (saved) setTasks(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks_list_ts", JSON.stringify(tasks));
  }, [tasks]);

  const handleAdd = (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setTasks([...tasks, { id: Date.now(), text }]);
    setText("");
  };

  const alertSearch = (): void => {
    alert("Searching for: " + searchInput.current?.value);
  };

  return (
    // MAIN CONTAINER: Uses 100% width and centered content
    <div style={{ 
      backgroundColor: '#f0f2f5', 
      minHeight: '100vh', 
      width: '100%', 
      padding: '40px 20px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      {/* WRAPPER: Increased maxWidth to 90% or 1000px for a "Fuller" look */}
      <div style={{ width: '100%', maxWidth: '1000px' }}>
        <h1 style={{ textAlign: 'left', fontSize: '2.5rem', marginBottom: '30px', color: '#1a1a1a' }}>Task Master</h1>

        {/* GRID LAYOUT: Using CSS Grid to fill the space */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '20px' 
        }}>
          
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <SectionWrapper title="Add Task">
              <form onSubmit={handleAdd} style={{ display: 'flex', gap: '10px' }}>
                <input 
                  style={{ flex: 1, padding: '12px', borderRadius: '6px', border: '1px solid #ccc' }}
                  value={text} 
                  onChange={(e) => setText(e.target.value)} 
                  placeholder="Enter task name..."
                />
                <button type="submit" style={{ padding: '0 20px', borderRadius: '6px', cursor: 'pointer', background: '#1890ff', color: 'white', border: 'none' }}>
                  Add Task
                </button>
              </form>
            </SectionWrapper>

            <SectionWrapper title="Quick Search">
              <div style={{ display: 'flex', gap: '10px' }}>
                <input ref={searchInput} style={{ flex: 1, padding: '12px', borderRadius: '6px', border: '1px solid #ccc' }} placeholder="Search..." />
                <button onClick={alertSearch} style={{ padding: '0 20px', borderRadius: '6px', cursor: 'pointer' }}>Search</button>
              </div>
            </SectionWrapper>
          </div>
          <SectionWrapper title="Your Tasks">
            {tasks.length === 0 ? <p>No tasks yet.</p> : 
              tasks.map(item => (
                <TaskRow key={item.id} task={item} onRemove={(id) => setTasks(tasks.filter(t => t.id !== id))} />
              ))
            }
          </SectionWrapper>

        </div>
      </div>
    </div>
  );
}

export default App;