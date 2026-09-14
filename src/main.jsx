import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const initialTasks = [
  { id: 1, title: 'Explore ideas for the new homepage', project: 'Website redesign', priority: 'High', done: false },
  { id: 2, title: 'Put together the moodboard', project: 'Brand identity', priority: 'Medium', done: true },
  { id: 3, title: 'Review the first round of wireframes', project: 'Website redesign', priority: 'High', done: false },
  { id: 4, title: 'Write a little something for launch', project: 'Product launch', priority: 'Low', done: false },
  { id: 5, title: 'Collect inspiration for social templates', project: 'Brand identity', priority: 'Medium', done: false },
];
function readTasks() {
  try {
    const data = JSON.parse(localStorage.getItem('daylight-tasks'));
    if (Array.isArray(data) && data.every(t => t && typeof t.title === 'string' && typeof t.done === 'boolean' && ['High', 'Medium', 'Low'].includes(t.priority) && typeof t.project === 'string' && (typeof t.id === 'string' || typeof t.id === 'number'))) return data;
  } catch {}
  return initialTasks;
}
function Icon({ name, size = 20 }) {
  const paths = { grid: 'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z', check: 'm5 12 4 4L19 6', search: 'M21 21l-5-5 M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0', plus: 'M12 5v14 M5 12h14', folder: 'M3 7V4h6l3 3h9v13H3z', arrow: 'M5 12h14 m-5-5 5 5-5 5', sun: 'M12 2v2 M12 20v2 M2 12h2 M20 12h2 M5 5l1 1 M18 18l1 1 M5 19l1-1 M18 6l1-1 M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0', clock: 'M12 7v5l3 2 M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0' };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name] || paths.grid} /></svg>;
}
function App() {
  const [tasks, setTasks] = useState(readTasks);
  const [filter, setFilter] = useState('All tasks');
  const [query, setQuery] = useState('');
  const [project, setProject] = useState('All projects');
  const [adding, setAdding] = useState(false);
  const [storageError, setStorageError] = useState(false);
  useEffect(() => { try { localStorage.setItem('daylight-tasks', JSON.stringify(tasks)); setStorageError(false); } catch { setStorageError(true); } }, [tasks]);
  useEffect(() => {
    if (!adding) return;
    const close = e => { if (e.key === 'Escape') setAdding(false); };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [adding]);
  const completed = tasks.filter(t => t.done).length;
  const visible = tasks.filter(t => (filter !== 'Completed' || t.done) && (filter !== 'In progress' || !t.done) && (project === 'All projects' || t.project === project) && `${t.title} ${t.project}`.toLowerCase().includes(query.toLowerCase()));
  const progress = tasks.length ? Math.round(completed / tasks.length * 100) : 0;
  function addTask(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const title = data.get('title').trim();
    if (!title) return;
    setTasks(current => [...current, { id: crypto.randomUUID(), title, project: data.get('project'), priority: data.get('priority'), done: false }]);
    setAdding(false); setFilter('All tasks'); setProject('All projects'); setQuery('');
  }
  return <div className="app">
    <aside className="sidebar">
      <a className="brand" href="./"><span className="brand-icon"><Icon name="sun" size={25} /></span>daylight<span className="brand-dot">.</span></a>
      <div className="workspace"><span className="workspace-avatar">S</span><div>Studio workspace<small>Personal space</small></div><span className="workspace-spark">✦</span></div>
      <p className="nav-label">WORKSPACE</p>
      <nav aria-label="Workspace">
        <button className={filter === 'All tasks' ? 'nav-item active' : 'nav-item'} onClick={() => { setFilter('All tasks'); setProject('All projects'); }}><Icon name="grid" />Overview</button>
        <button className={filter === 'In progress' ? 'nav-item active' : 'nav-item'} onClick={() => setFilter('In progress')}><Icon name="clock" />In progress<span className="count">{tasks.length - completed}</span></button>
        <button className={filter === 'Completed' ? 'nav-item active' : 'nav-item'} onClick={() => setFilter('Completed')}><Icon name="check" />Completed</button>
      </nav>
      <p className="nav-label project-label">YOUR PROJECTS</p>
      {['Website redesign', 'Brand identity', 'Product launch'].map((p, i) => <button key={p} className={`nav-item project-nav ${project === p ? 'selected' : ''}`} onClick={() => { setProject(project === p ? 'All projects' : p); setFilter('All tasks'); }}><span className={`project-dot dot-${i}`} />{p}</button>)}
      <div className="sidebar-note"><span>✧ A little more focus.</span><p>Make room for the work<br />that matters to you.</p><div className="note-line" /></div>
      <div className="profile"><span className="avatar">JD</span><div>Jamie Davis<small>Personal account</small></div><span className="online" /></div>
    </aside>
    <div className="main-shell">
      <header className="topbar"><span>Workspace <span className="crumb">/</span> <strong>Overview</strong></span><span className="demo-badge"><span />React demo</span></header>
      <main>
        <div className="heading"><div><div className="eyebrow">A LITTLE CLARITY, EVERY DAY</div><h1>Your space to make things happen<span>.</span></h1><p>Big ideas start with small steps. Let’s take the next one.</p></div><button className="primary" onClick={() => setAdding(true)}><Icon name="plus" size={18} />New task</button></div>
        <section className="welcome" aria-label="Daily inspiration"><div className="welcome-copy"><span className="welcome-tag"><Icon name="sun" size={16} /> A fresh perspective</span><h2>Less busy.<br />More meaningful.</h2><p>A clear mind. A little momentum.<br />Everything you need to do your best work.</p><button onClick={() => { setFilter('In progress'); document.getElementById('tasks').scrollIntoView({ behavior: 'smooth' }); }}>Find your focus <Icon name="arrow" size={17} /></button></div><div className="art" aria-hidden="true"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><span className="spark spark-one">✦</span><span className="spark spark-two">✧</span><div className="arch arch-back" /><div className="arch arch-front" /><div className="sphere" /><div className="art-base" /><span className="art-caption">GOOD THINGS TAKE A LITTLE SPACE</span></div></section>
        <section className="stats" aria-label="Task statistics">{[{ label: 'Total tasks', value: tasks.length, caption: 'A little structure for your day', icon: 'folder', color: 'purple' }, { label: 'In progress', value: tasks.length - completed, caption: 'One step at a time', icon: 'clock', color: 'orange' }, { label: 'Completed', value: completed, caption: 'Look at you making progress', icon: 'check', color: 'green' }].map(s => <article className="stat" key={s.label}><div><span className="stat-label">{s.label}</span><strong>{String(s.value).padStart(2, '0')}</strong><small>{s.caption}</small></div><span className={`stat-icon ${s.color}`}><Icon name={s.icon} /></span></article>)}</section>
        <section id="tasks" className="tasks"><div className="section-heading"><div><h2>Your tasks <span>{tasks.length}</span></h2><p>A plan for what’s next.</p></div><label className="search"><Icon name="search" size={17} /><input aria-label="Search tasks" placeholder="Search tasks..." value={query} onChange={e => setQuery(e.target.value)} /></label></div><div className="task-toolbar"><div className="tabs">{['All tasks', 'In progress', 'Completed'].map(f => <button key={f} className={filter === f ? 'tab chosen' : 'tab'} onClick={() => setFilter(f)}>{f}</button>)}</div><select aria-label="Filter by project" value={project} onChange={e => setProject(e.target.value)}>{['All projects', 'Website redesign', 'Brand identity', 'Product launch'].map(p => <option key={p}>{p}</option>)}</select></div><div className="task-table"><div className="table-head"><span>Task name</span><span>Project</span><span>Priority</span><span>Status</span></div>{visible.map(t => <div className={`task-row ${t.done ? 'done' : ''}`} key={t.id}><label className="task-name"><input type="checkbox" checked={t.done} onChange={() => setTasks(current => current.map(item => item.id === t.id ? { ...item, done: !item.done } : item))} /><span>{t.title}</span></label><span className="project-cell"><span className={`project-dot dot-${['Website redesign', 'Brand identity', 'Product launch'].indexOf(t.project)}`} />{t.project}</span><span><span className={`priority ${t.priority.toLowerCase()}`}>{t.priority}</span></span><span className={`status ${t.done ? 'complete' : ''}`}><span />{t.done ? 'Completed' : 'In progress'}</span></div>)}{!visible.length && <div className="empty"><Icon name="sun" size={30} /><h3>A little breathing room.</h3><p>No tasks match this view. Try another filter or add something new.</p></div>}</div><button className="add-row" onClick={() => setAdding(true)}><Icon name="plus" size={17} />Add a new task</button></section>
        <footer><span><span className="footer-spark">✧</span> A little progress is still progress.</span><span>{progress}% complete <span className="progress-track"><span style={{ width: `${progress}%` }} /></span></span></footer>
        {storageError && <p role="status">Your browser couldn’t save changes. Tasks will be kept for this session.</p>}
      </main>
    </div>
    {adding && <dialog open ref={node => { if (node && !node.dataset.modal) { node.close(); node.showModal(); node.dataset.modal = 'true'; } }} onCancel={() => setAdding(false)}><form onSubmit={addTask}><div className="dialog-heading"><h2>Make a little progress.</h2><button type="button" aria-label="Close new task" onClick={() => setAdding(false)}>×</button></div><p>Give your next step a name.</p><label>Task name<input name="title" placeholder="What would you like to work on?" required maxLength={140} autoFocus /></label><label>Project<select name="project">{['Website redesign', 'Brand identity', 'Product launch'].map(p => <option key={p}>{p}</option>)}</select></label><label>Priority<select name="priority" defaultValue="Medium"><option>Low</option><option>Medium</option><option>High</option></select></label><button className="primary" type="submit"><Icon name="plus" size={18} />Create task</button></form></dialog>}
  </div>;
}
createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
