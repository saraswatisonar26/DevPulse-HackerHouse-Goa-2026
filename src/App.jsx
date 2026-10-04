import { useEffect, useState } from 'react'
import './App.css'

const navigation = [
  { label: 'Dashboards', icon: 'grid' },
  { label: 'Tasks', icon: 'check' },
  { label: 'Focus', icon: 'focus' },
  { label: 'Notes', icon: 'note' },
  { label: 'Goals', icon: 'target' },
]

const initialTasks = [
  { title: 'Review pull requests', detail: 'DevPulse · 30 min', color: 'purple', done: true },
  { title: 'Ship dashboard updates', detail: 'Personal project · 1 hr', color: 'blue', done: false },
  { title: 'Read about React Server Components', detail: 'Learning · 45 min', color: 'orange', done: false },
]

const tasksStorageKey = 'devpulse-tasks'
const notesStorageKey = 'devpulse-notes'
const goalsStorageKey = 'devpulse-goals'

function loadGoals() {
  try {
    const savedGoals = window.localStorage.getItem(goalsStorageKey)
    if (savedGoals === null) return []

    const parsedGoals = JSON.parse(savedGoals)
    if (
      Array.isArray(parsedGoals) &&
      parsedGoals.every((goal) =>
        goal &&
        typeof goal.id === 'string' &&
        typeof goal.title === 'string' &&
        typeof goal.target === 'string' &&
        typeof goal.completed === 'boolean'
      )
    ) {
      return parsedGoals
    }

    console.error('Saved DevPulse goals have an invalid format. Starting with an empty goals list.')
  } catch (error) {
    console.error('Unable to load saved DevPulse goals. Starting with an empty goals list.', error)
  }

  return []
}

function loadNotes() {
  try {
    const savedNotes = window.localStorage.getItem(notesStorageKey)
    if (savedNotes === null) return []

    const parsedNotes = JSON.parse(savedNotes)
    if (
      Array.isArray(parsedNotes) &&
      parsedNotes.every((note) =>
        note &&
        typeof note.id === 'string' &&
        typeof note.title === 'string' &&
        typeof note.content === 'string'
      )
    ) {
      return parsedNotes
    }

    console.error('Saved DevPulse notes have an invalid format. Starting with an empty notes list.')
  } catch (error) {
    console.error('Unable to load saved DevPulse notes. Starting with an empty notes list.', error)
  }

  return []
}

function loadTasks() {
  try {
    const savedTasks = window.localStorage.getItem(tasksStorageKey)
    if (savedTasks === null) return initialTasks

    const parsedTasks = JSON.parse(savedTasks)
    if (
      Array.isArray(parsedTasks) &&
      parsedTasks.every((task) =>
        task &&
        typeof task.title === 'string' &&
        typeof task.detail === 'string' &&
        typeof task.color === 'string' &&
        typeof task.done === 'boolean'
      )
    ) {
      return parsedTasks
    }

    console.error('Saved DevPulse tasks have an invalid format. Using the sample tasks instead.')
  } catch (error) {
    console.error('Unable to load saved DevPulse tasks. Using the sample tasks instead.', error)
  }

  return initialTasks
}

function Icon({ name, size = 18 }) {
  const paths = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>,
    check: <><path d="m5 12 4 4L19 6" /><path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h9" /></>,
    focus: <><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="4.5" /><circle cx="12" cy="12" r="1" /></>,
    note: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M8 13h8M8 17h6" /></>,
    target: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    arrow: <><path d="M7 17 17 7M7 7h10v10" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    more: <><circle cx="5" cy="12" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /></>,
    play: <path d="m8 5 12 7-12 7z" />,
    pause: <><path d="M8 5h3v14H8zM15 5h3v14h-3z" /></>,
    spark: <><path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3Z" /><path d="m19 14 1.2 2.3L22 17l-1.8.7L19 20l-.8-2.3L16 17l2.2-.7L19 14Z" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  )
}

function App() {
  const [activePage, setActivePage] = useState('Dashboards')
  const [tasks, setTasks] = useState(loadTasks)
  const [notes, setNotes] = useState(loadNotes)
  const [goals, setGoals] = useState(loadGoals)
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [taskTitle, setTaskTitle] = useState('')
  const [noteTitle, setNoteTitle] = useState('')
  const [noteContent, setNoteContent] = useState('')
  const [goalTitle, setGoalTitle] = useState('')
  const [goalTarget, setGoalTarget] = useState('')
  const [secondsLeft, setSecondsLeft] = useState(25 * 60)
  const [timerRunning, setTimerRunning] = useState(false)

  useEffect(() => {
    try {
      window.localStorage.setItem(tasksStorageKey, JSON.stringify(tasks))
    } catch (error) {
      console.error('Unable to save DevPulse tasks to local storage.', error)
    }
  }, [tasks])

  useEffect(() => {
    try {
      window.localStorage.setItem(notesStorageKey, JSON.stringify(notes))
    } catch (error) {
      console.error('Unable to save DevPulse notes to local storage.', error)
    }
  }, [notes])

  useEffect(() => {
    try {
      window.localStorage.setItem(goalsStorageKey, JSON.stringify(goals))
    } catch (error) {
      console.error('Unable to save DevPulse goals to local storage.', error)
    }
  }, [goals])

  useEffect(() => {
    if (!timerRunning || secondsLeft === 0) return undefined

    const intervalId = window.setInterval(() => {
      if (secondsLeft <= 1) {
        setSecondsLeft(0)
        setTimerRunning(false)
      } else {
        setSecondsLeft(secondsLeft - 1)
      }
    }, 1000)

    return () => window.clearInterval(intervalId)
  }, [timerRunning, secondsLeft])

  useEffect(() => {
    if (!isTaskModalOpen) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsTaskModalOpen(false)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isTaskModalOpen])

  const handleAddTask = (event) => {
    event.preventDefault()
    const title = taskTitle.trim()
    if (!title) return

    setTasks((currentTasks) => [
      ...currentTasks,
      { title, detail: 'Personal task · Today', color: 'purple', done: false },
    ])
    setTaskTitle('')
    setIsTaskModalOpen(false)
  }

  const handleAddNote = (event) => {
    event.preventDefault()
    const title = noteTitle.trim()
    const content = noteContent.trim()
    if (!title || !content) return

    setNotes((currentNotes) => [
      { id: `${Date.now()}-${Math.random()}`, title, content },
      ...currentNotes,
    ])
    setNoteTitle('')
    setNoteContent('')
  }

  const handleAddGoal = (event) => {
    event.preventDefault()
    const title = goalTitle.trim()
    const target = goalTarget.trim()
    if (!title || !target) return

    setGoals((currentGoals) => [
      { id: `${Date.now()}-${Math.random()}`, title, target, completed: false },
      ...currentGoals,
    ])
    setGoalTitle('')
    setGoalTarget('')
  }

  const timerMinutes = String(Math.floor(secondsLeft / 60)).padStart(2, '0')
  const timerSeconds = String(secondsLeft % 60).padStart(2, '0')

  return (
    <div className="dp-app">
      <style>{`
        .dp-app {
          --dp-bg: #0b0d12;
          --dp-panel: #11141b;
          --dp-panel-raised: #151923;
          --dp-line: #222631;
          --dp-muted: #858b9b;
          --dp-text: #f3f4f8;
          --dp-accent: #a78bfa;
          min-height: 100vh;
          width: 100%;
          display: flex;
          color: var(--dp-text);
          background: var(--dp-bg);
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          font-size: 14px;
          line-height: 1.5;
          box-sizing: border-box;
        }
        .dp-app *, .dp-app *::before, .dp-app *::after { box-sizing: border-box; }
        .dp-sidebar {
          width: 248px;
          min-height: 100vh;
          flex: 0 0 248px;
          padding: 27px 16px 20px;
          display: flex;
          flex-direction: column;
          background: #0e1016;
          border-right: 1px solid var(--dp-line);
        }
        .dp-brand { display: flex; align-items: center; gap: 11px; padding: 0 12px; margin-bottom: 43px; }
        .dp-brand-mark {
          width: 34px; height: 34px; border-radius: 11px; display: grid; place-items: center;
          color: #fff; background: linear-gradient(145deg, #a78bfa, #7759dc);
          box-shadow: 0 5px 18px #8d6cf333;
        }
        .dp-brand-name { font-size: 17px; font-weight: 700; letter-spacing: -.55px; }
        .dp-brand-name span { color: var(--dp-accent); }
        .dp-nav-label { padding: 0 12px; margin-bottom: 10px; color: #656b7a; font-size: 10px; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase; }
        .dp-nav { display: grid; gap: 5px; }
        .dp-nav-item {
          width: 100%; border: 0; border-radius: 9px; padding: 10px 12px; display: flex; align-items: center; gap: 12px;
          color: #9298a7; background: transparent; text-align: left; font: inherit; cursor: pointer; transition: color .18s, background .18s;
        }
        .dp-nav-item:hover { color: #e6e2f3; background: #171a23; }
        .dp-nav-item.active { color: #d7caff; background: #211b32; box-shadow: inset 2px 0 #a78bfa; }
        .dp-nav-item.active svg { color: var(--dp-accent); }
        .dp-sidebar-bottom { margin-top: auto; }
        .dp-upgrade {
          padding: 15px; margin: 0 3px 18px; border: 1px solid #2d2940; border-radius: 12px;
          background: linear-gradient(145deg, #1b1928, #14151c);
        }
        .dp-upgrade-icon { color: #c5adff; display: flex; margin-bottom: 10px; }
        .dp-upgrade strong { display: block; font-size: 12px; margin-bottom: 4px; }
        .dp-upgrade p { margin: 0 0 13px; color: var(--dp-muted); font-size: 11px; line-height: 1.55; }
        .dp-upgrade button { width: 100%; border: 1px solid #51446f; border-radius: 7px; padding: 7px; background: #29223b; color: #d7caff; font: inherit; font-size: 11px; font-weight: 600; cursor: pointer; }
        .dp-profile { display: flex; align-items: center; gap: 10px; padding: 14px 8px 0; border-top: 1px solid var(--dp-line); }
        .dp-avatar { width: 33px; height: 33px; border-radius: 50%; display: grid; place-items: center; color: #f1eaff; background: linear-gradient(145deg, #7259a8, #39365b); font-size: 11px; font-weight: 700; }
        .dp-profile-copy { min-width: 0; flex: 1; }
        .dp-profile-copy strong { display: block; font-size: 12px; font-weight: 600; }
        .dp-profile-copy span { color: var(--dp-muted); font-size: 10px; }
        .dp-profile-more { color: #73798a; }
        .dp-main { flex: 1; min-width: 0; padding: 0 42px 48px; }
        .dp-topbar { height: 75px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--dp-line); }
        .dp-breadcrumb { color: #707686; font-size: 12px; }
        .dp-breadcrumb span { color: #d8d9e0; }
        .dp-top-actions { display: flex; align-items: center; gap: 10px; }
        .dp-date { display: flex; align-items: center; gap: 8px; color: #a8adba; font-size: 11px; }
        .dp-icon-button { width: 34px; height: 34px; border: 1px solid var(--dp-line); border-radius: 9px; display: grid; place-items: center; color: #aab0be; background: var(--dp-panel); cursor: pointer; }
        .dp-content { max-width: 1170px; margin: 0 auto; }
        .dp-welcome { display: flex; justify-content: space-between; align-items: flex-end; gap: 20px; padding: 35px 0 26px; }
        .dp-eyebrow { display: flex; align-items: center; gap: 7px; margin-bottom: 8px; color: #ac97e5; font-size: 11px; font-weight: 600; }
        .dp-welcome h1 { margin: 0; color: #f3f2f7; font-size: clamp(25px, 3vw, 31px); line-height: 1.2; letter-spacing: -1.15px; font-weight: 650; }
        .dp-welcome p { margin: 8px 0 0; color: var(--dp-muted); font-size: 12px; }
        .dp-primary-button { display: flex; align-items: center; justify-content: center; gap: 8px; border: 0; border-radius: 8px; padding: 10px 14px; color: #15111f; background: #b59afa; font: inherit; font-size: 11px; font-weight: 700; white-space: nowrap; cursor: pointer; box-shadow: 0 4px 14px #a78bfa22; }
        .dp-primary-button:hover { background: #c3adff; }
        .dp-stats { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 15px; }
        .dp-stat-card { min-width: 0; position: relative; overflow: hidden; padding: 17px 18px 16px; border: 1px solid var(--dp-line); border-radius: 12px; background: var(--dp-panel); }
        .dp-stat-top { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
        .dp-stat-label { color: #a4a9b6; font-size: 11px; font-weight: 500; }
        .dp-stat-icon { width: 29px; height: 29px; display: grid; place-items: center; border-radius: 8px; }
        .dp-stat-icon.violet { color: #bda6ff; background: #29213d; }
        .dp-stat-icon.green { color: #78d7a2; background: #1b3029; }
        .dp-stat-icon.blue { color: #85b9ff; background: #1c2b40; }
        .dp-stat-icon.orange { color: #f5b879; background: #38291e; }
        .dp-stat-value { margin-top: 13px; color: #f0f0f5; font-size: 25px; line-height: 1.15; letter-spacing: -.8px; font-weight: 650; }
        .dp-stat-foot { display: flex; align-items: center; gap: 5px; margin-top: 8px; color: #858b99; font-size: 10px; }
        .dp-stat-foot .positive { color: #72d29b; font-weight: 600; }
        .dp-progress { height: 4px; margin-top: 10px; overflow: hidden; border-radius: 4px; background: #2a2d36; }
        .dp-progress span { display: block; width: 68%; height: 100%; border-radius: inherit; background: #edae70; }
        .dp-section-grid { display: grid; grid-template-columns: minmax(0, 1.56fr) minmax(290px, .94fr); gap: 16px; margin-top: 19px; }
        .dp-panel { min-width: 0; border: 1px solid var(--dp-line); border-radius: 12px; background: var(--dp-panel); }
        .dp-panel-header { min-height: 66px; padding: 16px 18px; display: flex; align-items: center; justify-content: space-between; gap: 12px; border-bottom: 1px solid var(--dp-line); }
        .dp-panel-title { margin: 0; color: #efeff4; font-size: 13px; font-weight: 600; letter-spacing: -.1px; }
        .dp-panel-subtitle { margin-top: 3px; color: #818796; font-size: 10px; }
        .dp-text-button { display: flex; align-items: center; gap: 5px; border: 0; padding: 5px 0 5px 5px; color: #b59afa; background: transparent; font: inherit; font-size: 10px; font-weight: 600; white-space: nowrap; cursor: pointer; }
        .dp-task-list { padding: 2px 18px 5px; }
        .dp-task { display: flex; align-items: center; gap: 12px; padding: 15px 0; border-bottom: 1px solid #20232c; }
        .dp-task:last-child { border-bottom: 0; }
        .dp-task-check { width: 17px; height: 17px; flex: 0 0 17px; display: grid; place-items: center; border: 1px solid #464b59; border-radius: 5px; color: #a994e6; }
        .dp-task-check.done { border-color: #7965ae; background: #28213b; }
        .dp-task-copy { flex: 1; min-width: 0; }
        .dp-task-title { color: #e1e2e9; font-size: 11px; font-weight: 500; }
        .dp-task.done .dp-task-title { color: #878c98; text-decoration: line-through; }
        .dp-task-meta { display: flex; align-items: center; gap: 7px; margin-top: 4px; color: #777e8d; font-size: 9px; }
        .dp-task-dot { width: 6px; height: 6px; border-radius: 50%; background: #a68af5; }
        .dp-task-dot.blue { background: #78aefa; }
        .dp-task-dot.orange { background: #f2ad70; }
        .dp-task-time { color: #828896; font-size: 9px; white-space: nowrap; }
        .dp-focus-panel { position: relative; overflow: hidden; padding-bottom: 19px; }
        .dp-focus-panel::before { content: ""; position: absolute; top: 52px; right: -55px; width: 180px; height: 180px; border-radius: 50%; background: #8b69d810; filter: blur(4px); pointer-events: none; }
        .dp-focus-panel .dp-panel-header { position: relative; border-bottom: 0; }
        .dp-focus-body { position: relative; display: flex; flex-direction: column; align-items: center; padding: 5px 16px 1px; }
        .dp-focus-caption { margin: 1px 0 13px; color: #969baa; font-size: 10px; }
        .dp-timer-ring { width: 166px; height: 166px; padding: 8px; display: grid; place-items: center; border-radius: 50%; background: conic-gradient(#ab8bf7 0deg 250deg, #292631 250deg 360deg); box-shadow: 0 0 35px #9b7bd51c; }
        .dp-timer-inner { width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; border: 1px solid #272731; border-radius: 50%; background: #11141b; }
        .dp-timer-time { color: #f2effa; font-variant-numeric: tabular-nums; font-size: 36px; font-weight: 600; letter-spacing: -1.8px; line-height: 1.15; }
        .dp-timer-label { margin-top: 5px; color: #888e9d; font-size: 9px; letter-spacing: .8px; text-transform: uppercase; }
        .dp-timer-controls { display: flex; align-items: center; gap: 8px; margin-top: 16px; }
        .dp-timer-button { width: 35px; height: 35px; display: grid; place-items: center; border: 1px solid #34313e; border-radius: 50%; color: #b7a0f4; background: #191720; cursor: pointer; }
        .dp-timer-button.main { width: 42px; height: 42px; border: 0; color: #181322; background: #b59afa; }
        .dp-focus-hint { margin-top: 11px; color: #7f8492; font-size: 9px; }
        .dp-bottom-grid { display: grid; grid-template-columns: minmax(0, 1.56fr) minmax(290px, .94fr); gap: 16px; margin-top: 16px; }
        .dp-week-panel { padding-bottom: 14px; }
        .dp-week-content { display: grid; grid-template-columns: 1fr auto; align-items: center; gap: 18px; padding: 17px 19px 4px; }
        .dp-week-copy strong { display: block; margin-bottom: 4px; color: #e5e6ec; font-size: 11px; font-weight: 600; }
        .dp-week-copy span { color: #868c9a; font-size: 10px; }
        .dp-week-value { color: #e8e7ee; font-size: 21px; font-weight: 650; letter-spacing: -.6px; text-align: right; }
        .dp-week-value span { color: #838997; font-size: 10px; font-weight: 400; }
        .dp-week-progress { height: 5px; margin: 13px 19px 0; border-radius: 8px; background: #292b34; }
        .dp-week-progress span { display: block; width: 68%; height: 100%; border-radius: inherit; background: linear-gradient(90deg, #9878e9, #bea1ff); }
        .dp-quote { display: flex; gap: 12px; padding: 17px; }
        .dp-quote-icon { width: 31px; height: 31px; flex: 0 0 31px; display: grid; place-items: center; border-radius: 9px; color: #a98df1; background: #29213b; }
        .dp-quote-copy strong { color: #e8e7ed; font-size: 11px; font-weight: 600; }
        .dp-quote-copy p { margin: 5px 0 0; color: #9298a6; font-size: 10px; line-height: 1.6; }
        .dp-modal-backdrop { position: fixed; inset: 0; z-index: 10; display: grid; place-items: center; padding: 20px; background: #05060bcc; backdrop-filter: blur(4px); }
        .dp-task-modal { width: min(100%, 400px); padding: 22px; border: 1px solid #303442; border-radius: 14px; background: #151821; box-shadow: 0 24px 80px #0009; }
        .dp-task-modal h2 { margin: 0; color: #f1f0f6; font-size: 17px; font-weight: 650; letter-spacing: -.3px; }
        .dp-task-modal p { margin: 5px 0 19px; color: #9298a6; font-size: 11px; }
        .dp-task-modal label { display: block; margin-bottom: 7px; color: #c2c5cf; font-size: 11px; font-weight: 600; }
        .dp-task-input { width: 100%; border: 1px solid #343846; border-radius: 8px; padding: 10px 11px; outline: none; color: #f1f0f6; background: #0f1219; font: inherit; font-size: 12px; }
        .dp-task-input::placeholder { color: #6f7584; }
        .dp-task-input:focus { border-color: #9b7ce7; box-shadow: 0 0 0 3px #a78bfa20; }
        .dp-modal-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 18px; }
        .dp-modal-cancel, .dp-modal-submit { border-radius: 7px; padding: 8px 12px; font: inherit; font-size: 11px; font-weight: 600; cursor: pointer; }
        .dp-modal-cancel { border: 1px solid #343846; color: #b4b8c4; background: #1a1d26; }
        .dp-modal-submit { border: 0; color: #171220; background: #b59afa; }
        .dp-modal-submit:disabled { color: #817a90; background: #393242; cursor: not-allowed; }
        .dp-notes-layout { display: grid; grid-template-columns: minmax(260px, .8fr) minmax(0, 1.2fr); gap: 16px; align-items: start; }
        .dp-note-form { padding: 18px; }
        .dp-note-form label { display: block; margin: 0 0 7px; color: #c2c5cf; font-size: 11px; font-weight: 600; }
        .dp-note-form .dp-task-input { margin-bottom: 15px; }
        .dp-note-content { min-height: 150px; resize: vertical; }
        .dp-notes-list { display: grid; gap: 12px; padding: 16px; }
        .dp-note-card { padding: 15px; border: 1px solid #252936; border-radius: 9px; background: #141720; }
        .dp-note-card-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
        .dp-note-card h3 { margin: 0; color: #efeff4; font-size: 13px; font-weight: 600; overflow-wrap: anywhere; }
        .dp-note-card p { margin: 10px 0 0; color: #a4a9b6; font-size: 12px; line-height: 1.6; white-space: pre-wrap; overflow-wrap: anywhere; }
        .dp-note-delete { flex: 0 0 auto; border: 1px solid #343846; border-radius: 6px; padding: 5px 8px; color: #b4b8c4; background: #1a1d26; font: inherit; font-size: 10px; cursor: pointer; }
        .dp-note-delete:hover { border-color: #8e5968; color: #ffc1cd; }
        .dp-notes-empty { padding: 24px 16px; color: #858b9b; text-align: center; font-size: 12px; }
        .dp-goals-layout { display: grid; grid-template-columns: minmax(260px, .8fr) minmax(0, 1.2fr); gap: 16px; align-items: start; }
        .dp-goal-form { padding: 18px; }
        .dp-goal-form label { display: block; margin: 0 0 7px; color: #c2c5cf; font-size: 11px; font-weight: 600; }
        .dp-goal-form .dp-task-input { margin-bottom: 15px; }
        .dp-goal-target { min-height: 100px; resize: vertical; }
        .dp-goals-list { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px; padding: 16px; }
        .dp-goal-card { padding: 15px; border: 1px solid #2b2e3a; border-radius: 10px; background: #141720; transition: border-color .18s, background .18s; }
        .dp-goal-card.completed { border-color: #315445; background: linear-gradient(145deg, #15211d, #141720); }
        .dp-goal-card-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; }
        .dp-goal-card h3 { margin: 0; color: #efeff4; font-size: 13px; font-weight: 600; overflow-wrap: anywhere; }
        .dp-goal-card.completed h3 { color: #9cceb1; }
        .dp-goal-status { flex: 0 0 auto; border-radius: 20px; padding: 3px 8px; color: #c1a8ff; background: #29213d; font-size: 9px; font-weight: 600; }
        .dp-goal-card.completed .dp-goal-status { color: #9cddb3; background: #1d382b; }
        .dp-goal-target-copy { margin: 9px 0 14px; color: #9298a6; font-size: 11px; line-height: 1.55; overflow-wrap: anywhere; }
        .dp-goal-progress-label { display: flex; justify-content: space-between; gap: 8px; color: #858b99; font-size: 9px; }
        .dp-goal-progress { height: 5px; margin-top: 6px; overflow: hidden; border-radius: 5px; background: #2a2d36; }
        .dp-goal-progress span { display: block; height: 100%; border-radius: inherit; background: linear-gradient(90deg, #9878e9, #bea1ff); transition: width .2s; }
        .dp-goal-card.completed .dp-goal-progress span { background: linear-gradient(90deg, #54ad7c, #89d8a6); }
        .dp-goal-complete { width: 100%; margin-top: 14px; border: 1px solid #51446f; border-radius: 7px; padding: 7px 10px; color: #d7caff; background: #29223b; font: inherit; font-size: 10px; font-weight: 600; cursor: pointer; }
        .dp-goal-complete:hover { background: #352b4b; }
        .dp-goal-card.completed .dp-goal-complete { border-color: #315445; color: #9cddb3; background: #1d382b; cursor: default; }
        .dp-goals-empty { padding: 24px 16px; color: #858b9b; text-align: center; font-size: 12px; }
        @media (max-width: 1100px) {
          .dp-main { padding-right: 25px; padding-left: 25px; }
          .dp-sidebar { width: 220px; flex-basis: 220px; }
          .dp-stats { gap: 10px; }
          .dp-stat-card { padding-right: 13px; padding-left: 13px; }
        }
        @media (max-width: 850px) {
          .dp-sidebar { width: 68px; flex-basis: 68px; padding-right: 9px; padding-left: 9px; }
          .dp-brand { justify-content: center; padding: 0; }
          .dp-brand-name, .dp-nav-label, .dp-nav-item span, .dp-upgrade, .dp-profile-copy, .dp-profile-more { display: none; }
          .dp-nav-item { justify-content: center; padding: 11px 8px; }
          .dp-profile { justify-content: center; padding-right: 0; padding-left: 0; }
          .dp-stats { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (max-width: 650px) {
          .dp-sidebar { display: none; }
          .dp-main { padding: 0 17px 30px; }
          .dp-topbar { height: 62px; }
          .dp-date { display: none; }
          .dp-welcome { align-items: flex-start; flex-direction: column; padding: 27px 0 20px; }
          .dp-primary-button { width: 100%; }
          .dp-section-grid, .dp-bottom-grid { grid-template-columns: minmax(0, 1fr); }
          .dp-notes-layout { grid-template-columns: minmax(0, 1fr); }
          .dp-goals-layout { grid-template-columns: minmax(0, 1fr); }
          .dp-focus-panel { grid-row: 1; }
          .dp-stat-card { padding: 14px; }
          .dp-stat-value { font-size: 23px; }
        }
        @media (max-width: 380px) {
          .dp-stats { gap: 8px; }
          .dp-stat-card { padding: 12px 10px; }
          .dp-stat-label { font-size: 10px; }
          .dp-stat-icon { width: 26px; height: 26px; }
          .dp-task-list { padding-right: 13px; padding-left: 13px; }
        }
      `}</style>

      <aside className="dp-sidebar">
        <div className="dp-brand">
          <div className="dp-brand-mark"><Icon name="spark" size={19} /></div>
          <div className="dp-brand-name">Dev<span>Pulse</span></div>
        </div>

        <div className="dp-nav-label">Workspace</div>
        <nav className="dp-nav" aria-label="Main navigation">
          {navigation.map((item) => (
            <button
              className={`dp-nav-item${activePage === item.label ? ' active' : ''}`}
              key={item.label}
              onClick={() => setActivePage(item.label)}
              type="button"
            >
              <Icon name={item.icon} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="dp-sidebar-bottom">
          <div className="dp-upgrade">
            <div className="dp-upgrade-icon"><Icon name="spark" size={17} /></div>
            <strong>Make space for deep work</strong>
            <p>Build a focus habit and make every session count.</p>
            <button type="button" onClick={() => setActivePage('Focus')}>Explore focus tools</button>
          </div>
          <div className="dp-profile">
            <div className="dp-avatar" aria-hidden="true">JD</div>
            <div className="dp-profile-copy">
              <strong>Jordan Davis</strong>
              <span>Developer</span>
            </div>
            <div className="dp-profile-more"><Icon name="more" /></div>
          </div>
        </div>
      </aside>

      <main className="dp-main">
        <header className="dp-topbar">
          <div className="dp-breadcrumb">Workspace&nbsp; / &nbsp;<span>{activePage}</span></div>
          <div className="dp-top-actions">
            <div className="dp-date"><Icon name="calendar" size={15} /> Monday, October 20</div>
            <button className="dp-icon-button" type="button" aria-label="More options"><Icon name="more" /></button>
          </div>
        </header>

        <div className="dp-content">
          <section className="dp-welcome">
            <div>
              <div className="dp-eyebrow"><Icon name="spark" size={14} /> YOUR PERSONAL WORKSPACE</div>
              <h1>
                {activePage === 'Notes'
                  ? 'Quick Notes'
                  : activePage === 'Goals'
                    ? 'Your Goals'
                    : <>Good morning, Jordan <span aria-hidden="true">☀️</span></>}
              </h1>
              <p>
                {activePage === 'Notes'
                  ? 'Capture ideas and keep them close at hand.'
                  : activePage === 'Goals'
                    ? 'Set meaningful targets and celebrate your progress.'
                    : 'Here’s your productivity at a glance. Keep the momentum going.'}
              </p>
            </div>
            {activePage !== 'Notes' && activePage !== 'Goals' && (
              <button className="dp-primary-button" type="button" onClick={() => setIsTaskModalOpen(true)}>
                <Icon name="plus" size={16} /> Add a task
              </button>
            )}
          </section>

          {activePage === 'Notes' ? (
            <section className="dp-notes-layout" aria-label="Quick Notes">
              <form className="dp-panel dp-note-form" onSubmit={handleAddNote}>
                <h2 className="dp-panel-title" style={{ marginBottom: 16 }}>Create a note</h2>
                <label htmlFor="dp-note-title">Title</label>
                <input
                  autoComplete="off"
                  className="dp-task-input"
                  id="dp-note-title"
                  onChange={(event) => setNoteTitle(event.target.value)}
                  placeholder="Give your note a title"
                  value={noteTitle}
                />
                <label htmlFor="dp-note-content">Content</label>
                <textarea
                  className="dp-task-input dp-note-content"
                  id="dp-note-content"
                  onChange={(event) => setNoteContent(event.target.value)}
                  placeholder="Write your thoughts..."
                  value={noteContent}
                />
                <div className="dp-modal-actions">
                  <button className="dp-modal-submit" type="submit" disabled={!noteTitle.trim() || !noteContent.trim()}>
                    Save note
                  </button>
                </div>
              </form>

              <div className="dp-panel">
                <div className="dp-panel-header">
                  <div>
                    <h2 className="dp-panel-title">Your notes</h2>
                    <div className="dp-panel-subtitle">{notes.length} {notes.length === 1 ? 'note' : 'notes'}</div>
                  </div>
                </div>
                {notes.length === 0 ? (
                  <div className="dp-notes-empty">No notes yet. Create one to get started.</div>
                ) : (
                  <div className="dp-notes-list">
                    {notes.map((note) => (
                      <article className="dp-note-card" key={note.id}>
                        <div className="dp-note-card-header">
                          <h3>{note.title}</h3>
                          <button
                            className="dp-note-delete"
                            type="button"
                            aria-label={`Delete note: ${note.title}`}
                            onClick={() => setNotes((currentNotes) => currentNotes.filter((item) => item.id !== note.id))}
                          >
                            Delete
                          </button>
                        </div>
                        <p>{note.content}</p>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            </section>
          ) : activePage === 'Goals' ? (
            <section className="dp-goals-layout" aria-label="Goals">
              <form className="dp-panel dp-goal-form" onSubmit={handleAddGoal}>
                <h2 className="dp-panel-title" style={{ marginBottom: 16 }}>Create a goal</h2>
                <label htmlFor="dp-goal-title">Goal title</label>
                <input
                  autoComplete="off"
                  className="dp-task-input"
                  id="dp-goal-title"
                  onChange={(event) => setGoalTitle(event.target.value)}
                  placeholder="What do you want to achieve?"
                  value={goalTitle}
                />
                <label htmlFor="dp-goal-target">Target description</label>
                <textarea
                  className="dp-task-input dp-goal-target"
                  id="dp-goal-target"
                  onChange={(event) => setGoalTarget(event.target.value)}
                  placeholder="Describe the target or outcome"
                  value={goalTarget}
                />
                <div className="dp-modal-actions">
                  <button className="dp-modal-submit" type="submit" disabled={!goalTitle.trim() || !goalTarget.trim()}>
                    Save goal
                  </button>
                </div>
              </form>

              <div className="dp-panel">
                <div className="dp-panel-header">
                  <div>
                    <h2 className="dp-panel-title">Your goals</h2>
                    <div className="dp-panel-subtitle">
                      {goals.filter((goal) => goal.completed).length} of {goals.length} completed
                    </div>
                  </div>
                </div>
                {goals.length === 0 ? (
                  <div className="dp-goals-empty">No goals yet. Create one to get started.</div>
                ) : (
                  <div className="dp-goals-list">
                    {goals.map((goal) => (
                      <article className={`dp-goal-card${goal.completed ? ' completed' : ''}`} key={goal.id}>
                        <div className="dp-goal-card-header">
                          <h3>{goal.title}</h3>
                          <span className="dp-goal-status">{goal.completed ? 'Completed' : 'In progress'}</span>
                        </div>
                        <p className="dp-goal-target-copy">{goal.target}</p>
                        <div className="dp-goal-progress-label">
                          <span>Progress</span>
                          <span>{goal.completed ? '100%' : '0%'}</span>
                        </div>
                        <div
                          className="dp-goal-progress"
                          role="progressbar"
                          aria-label={`${goal.title} progress`}
                          aria-valuemin="0"
                          aria-valuemax="100"
                          aria-valuenow={goal.completed ? 100 : 0}
                        >
                          <span style={{ width: goal.completed ? '100%' : '0%' }} />
                        </div>
                        <button
                          className="dp-goal-complete"
                          type="button"
                          disabled={goal.completed}
                          onClick={() => setGoals((currentGoals) =>
                            currentGoals.map((item) =>
                              item.id === goal.id ? { ...item, completed: true } : item
                            )
                          )}
                        >
                          {goal.completed ? 'Goal completed' : 'Mark as completed'}
                        </button>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            </section>
          ) : (
            <>
          <section className="dp-stats" aria-label="Productivity statistics">
            <article className="dp-stat-card">
              <div className="dp-stat-top">
                <span className="dp-stat-label">Task Completed</span>
                <span className="dp-stat-icon violet"><Icon name="check" size={16} /></span>
              </div>
              <div className="dp-stat-value">12</div>
              <div className="dp-stat-foot"><span className="positive">↑ 20%</span> <span>vs. last week</span></div>
            </article>
            <article className="dp-stat-card">
              <div className="dp-stat-top">
                <span className="dp-stat-label">Active Task</span>
                <span className="dp-stat-icon green"><Icon name="target" size={16} /></span>
              </div>
              <div className="dp-stat-value">3</div>
              <div className="dp-stat-foot"><span>Keep your focus sharp</span></div>
            </article>
            <article className="dp-stat-card">
              <div className="dp-stat-top">
                <span className="dp-stat-label">Focus Time</span>
                <span className="dp-stat-icon blue"><Icon name="clock" size={16} /></span>
              </div>
              <div className="dp-stat-value">4.5<span style={{ fontSize: 14, color: '#a3a8b5', letterSpacing: 0 }}> hrs</span></div>
              <div className="dp-stat-foot"><span className="positive">↑ 12%</span> <span>vs. last week</span></div>
            </article>
            <article className="dp-stat-card">
              <div className="dp-stat-top">
                <span className="dp-stat-label">Daily Goal</span>
                <span className="dp-stat-icon orange"><Icon name="spark" size={16} /></span>
              </div>
              <div className="dp-stat-value">68<span style={{ fontSize: 14, color: '#a3a8b5', letterSpacing: 0 }}>%</span></div>
              <div className="dp-progress" aria-label="Daily goal 68 percent complete"><span /></div>
            </article>
          </section>

          <section className="dp-section-grid">
            <div className="dp-panel">
              <div className="dp-panel-header">
                <div>
                  <h2 className="dp-panel-title">Today’s tasks</h2>
                  <div className="dp-panel-subtitle">You’ve got this — one step at a time</div>
                </div>
                <button className="dp-text-button" type="button" onClick={() => setActivePage('Tasks')}>View all <Icon name="arrow" size={13} /></button>
              </div>
              <div className="dp-task-list">
                {tasks.map((task) => (
                  <div className={`dp-task${task.done ? ' done' : ''}`} key={task.title}>
                    <div className={`dp-task-check${task.done ? ' done' : ''}`} aria-label={task.done ? 'Completed' : 'Not completed'}>
                      {task.done && <Icon name="check" size={12} />}
                    </div>
                    <div className="dp-task-copy">
                      <div className="dp-task-title">{task.title}</div>
                      <div className="dp-task-meta"><span className={`dp-task-dot ${task.color}`} />{task.detail}</div>
                    </div>
                    <div className="dp-task-time">{task.done ? 'Done' : task.detail.split('·')[1].trim()}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="dp-panel dp-focus-panel">
              <div className="dp-panel-header">
                <div>
                  <h2 className="dp-panel-title">Focus session</h2>
                  <div className="dp-panel-subtitle">A little focus goes a long way</div>
                </div>
                <button className="dp-icon-button" type="button" aria-label="Focus options"><Icon name="more" /></button>
              </div>
              <div className="dp-focus-body">
                <div className="dp-focus-caption">Time to focus</div>
                <div className="dp-timer-ring">
                  <div className="dp-timer-inner">
                    <div className="dp-timer-time">{timerMinutes}:{timerSeconds}</div>
                    <div className="dp-timer-label">Pomodoro</div>
                  </div>
                </div>
                <div className="dp-timer-controls">
                  <button
                    className="dp-timer-button"
                    type="button"
                    aria-label="Reset timer"
                    onClick={() => { setTimerRunning(false); setSecondsLeft(25 * 60) }}
                  >
                    <Icon name="clock" size={16} />
                  </button>
                  <button
                    className="dp-timer-button main"
                    type="button"
                    aria-label={timerRunning ? 'Pause focus timer' : 'Start focus timer'}
                    onClick={() => {
                      if (secondsLeft > 0) setTimerRunning((running) => !running)
                    }}
                  >
                    <Icon name={timerRunning ? 'pause' : 'play'} size={17} />
                  </button>
                  <button className="dp-timer-button" type="button" aria-label="Focus options"><Icon name="more" size={16} /></button>
                </div>
                <div className="dp-focus-hint">{timerRunning ? 'You’re in the zone — keep going' : 'Ready when you are · 25 min'}</div>
              </div>
            </div>
          </section>

          <section className="dp-bottom-grid">
            <div className="dp-panel dp-week-panel">
              <div className="dp-panel-header">
                <div>
                  <h2 className="dp-panel-title">Weekly goal</h2>
                  <div className="dp-panel-subtitle">You’re building a great rhythm</div>
                </div>
                <button className="dp-text-button" type="button" onClick={() => setActivePage('Goals')}>View goals <Icon name="arrow" size={13} /></button>
              </div>
              <div className="dp-week-content">
                <div className="dp-week-copy">
                  <strong>Complete 20 focus sessions</strong>
                  <span>12 of 20 sessions completed this week</span>
                </div>
                <div className="dp-week-value">12 <span>/ 20</span></div>
              </div>
              <div className="dp-week-progress" aria-label="Weekly goal 60 percent complete"><span style={{ width: '60%' }} /></div>
            </div>
            <div className="dp-panel dp-quote">
              <div className="dp-quote-icon"><Icon name="spark" size={16} /></div>
              <div className="dp-quote-copy">
                <strong>A moment of clarity</strong>
                <p>“Great things are done by a series of small things brought together.”</p>
              </div>
            </div>
          </section>
            </>
          )}
        </div>
      </main>
      {isTaskModalOpen && (
        <div
          className="dp-modal-backdrop"
          onClick={(event) => {
            if (event.target === event.currentTarget) setIsTaskModalOpen(false)
          }}
        >
          <form
            className="dp-task-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="dp-task-modal-title"
            onSubmit={handleAddTask}
          >
            <h2 id="dp-task-modal-title">Add a task</h2>
            <p>Add a task to your list for today.</p>
            <label htmlFor="dp-task-title">Task title</label>
            <input
              autoFocus
              className="dp-task-input"
              id="dp-task-title"
              onChange={(event) => setTaskTitle(event.target.value)}
              placeholder="What do you need to do?"
              value={taskTitle}
            />
            <div className="dp-modal-actions">
              <button className="dp-modal-cancel" type="button" onClick={() => setIsTaskModalOpen(false)}>Cancel</button>
              <button className="dp-modal-submit" type="submit" disabled={!taskTitle.trim()}>Add Task</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default App
