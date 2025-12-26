import React, { useState, useEffect, useRef, type ReactNode, type FormEvent, type ChangeEvent } from 'react';

// --- 1. TYPES & INTERFACES (TypeScript Core) ---
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

// --- 2. COMPONENT REUSABILITY & COMPOSITION ---
const SectionWrapper: React.FC<SectionProps> = ({ title, children }) => (
  <div style={{ 
    border: '1px solid #ddd', 
    padding: '25px', 
    borderRadius: '12px', 
    marginBottom: '20px', 
    background: '#fff',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
  }}>
    <h2 style={{ marginTop: 0, color: '#333', fontSize: '1.4rem' }}>{title}</h2>
    {children}
  </div>
);

// --- 3. FUNCTIONAL COMPONENT (Using Props) ---
const TaskRow: React.FC<TaskRowProps> = ({ task, onRemove }) => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'space-between', 
    padding: '12px 10px', 
    borderBottom: '1px solid #eee',
    alignItems: 'center'
  }}>
    <span style={{ fontSize: '1.1rem' }}>{task.text}</span>
    <button 
      onClick={() => onRemove(task.id)} 
      style={{ color: '#ff4d4f', border: '1px solid #ff4d4f', background: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
    >
      Delete
    </button>
  </div>
);

const App: React.FC = () => {
  // --- 4. STATE MANAGEMENT (useState) ---
  const [tasks, setTasks] = useState<Task[]>([]);
  const [inputText, setInputText] = useState<string>(""); // Controlled Input
  const [searchQuery, setSearchQuery] = useState<string>(""); // For filtering

  // --- 5. UNCONTROLLED COMPONENT (useRef) ---
  const searchInputRef = useRef<HTMLInputElement>(null);

  // --- 6. SIDE EFFECTS (useEffect) ---
  useEffect(() => {
    const saved = localStorage.getItem("tasks_list_ts");
    if (saved) setTasks(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks_list_ts", JSON.stringify(tasks));
  }, [tasks]);

  // --- HANDLERS ---
  const handleAddTask = (e: FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    setTasks([...tasks, { id: Date.now(), text: inputText }]);
    setInputText("");
  };

  const handleSearchClick = () => {
    // Reading value from Uncontrolled component
    const value = searchInputRef.current?.value || "";
    setSearchQuery(value.toLowerCase());
  };

  // Logic for filtering tasks based on search
  const filteredTasks = tasks.filter(t => t.text.toLowerCase().includes(searchQuery));

  return (
    <div style={{ 
      backgroundColor: '#f8f9fa', 
      minHeight: '100vh', 
      width: '100vw', 
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* FULL WIDTH HEADER */}
      <header style={{ padding: '20px 50px', background: '#2c3e50', color: 'white' }}>
        <h1 style={{ margin: 0 }}>Task Master</h1>
      </header>

      {/* FULL SCREEN MAIN LAYOUT */}
      <main style={{ 
        display: 'grid', 
        gridTemplateColumns: '350px 1fr', // 350px Sidebar, rest is main content
        gap: '40px',
        padding: '40px 50px',
        flex: 1
      }}>
        
        {/* SIDEBAR (Controls) */}
        <aside>
          <SectionWrapper title="Add New Task">
            <form onSubmit={handleAddTask} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input 
                style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc' }}
                value={inputText} 
                onChange={(e: ChangeEvent<HTMLInputElement>) => setInputText(e.target.value)} 
                placeholder="What needs to be done?"
              />
              <button type="submit" style={{ padding: '12px', borderRadius: '6px', cursor: 'pointer', background: '#1890ff', color: 'white', border: 'none', fontWeight: 'bold' }}>
                Create Task
              </button>
            </form>
          </SectionWrapper>

          <SectionWrapper title="Filter Search">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {/* UNCONTROLLED INPUT */}
              <input 
                ref={searchInputRef} 
                style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc' }} 
                placeholder="Type and click search..." 
              />
              <button onClick={handleSearchClick} style={{ padding: '10px', borderRadius: '6px', cursor: 'pointer' }}>
                Search Tasks
              </button>
              {searchQuery && <button onClick={() => setSearchQuery("")} style={{ color: 'blue', border: 'none', background: 'none', cursor: 'pointer' }}>Clear Filter</button>}
            </div>
          </SectionWrapper>
        </aside>

        {/* MAIN CONTENT (Results) */}
        <section>
          <SectionWrapper title={searchQuery ? `Results for "${searchQuery}"` : "All Tasks"}>
            {filteredTasks.length === 0 ? (
              <p style={{ color: '#888', textAlign: 'center', padding: '20px' }}>No tasks found.</p>
            ) : (
              filteredTasks.map(item => (
                <TaskRow 
                  key={item.id} 
                  task={item} 
                  onRemove={(id) => setTasks(tasks.filter(t => t.id !== id))} 
                />
              ))
            )}
          </SectionWrapper>
        </section>

      </main>
    </div>
  );
}

export default App;