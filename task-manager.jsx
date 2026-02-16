import React, { useState, useEffect } from 'react';
import { Calendar, Plus, X, Check, ExternalLink, Bell, BookOpen, LogOut, ChevronDown, ChevronRight, Trash2 } from 'lucide-react';

export default function TaskManagerApp() {
  // Color palette for subjects
  const subjectColors = [
    { bg: 'bg-red-500', light: 'bg-red-100', text: 'text-red-700', border: 'border-red-500' },
    { bg: 'bg-blue-500', light: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-500' },
    { bg: 'bg-green-500', light: 'bg-green-100', text: 'text-green-700', border: 'border-green-500' },
    { bg: 'bg-purple-500', light: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-500' },
    { bg: 'bg-pink-500', light: 'bg-pink-100', text: 'text-pink-700', border: 'border-pink-500' },
    { bg: 'bg-indigo-500', light: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-500' },
    { bg: 'bg-orange-500', light: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-500' },
    { bg: 'bg-teal-500', light: 'bg-teal-100', text: 'text-teal-700', border: 'border-teal-500' },
    { bg: 'bg-cyan-500', light: 'bg-cyan-100', text: 'text-cyan-700', border: 'border-cyan-500' },
    { bg: 'bg-emerald-500', light: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-500' },
  ];

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [expandedSubjects, setExpandedSubjects] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [editingSubjects, setEditingSubjects] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const [newTask, setNewTask] = useState({
    title: '',
    dueDate: '',
    links: [''],
    subjectId: null
  });

  // Load data from persistent storage
  useEffect(() => {
    const loadData = async () => {
      try {
        const [userResult, subjectsResult] = await Promise.all([
          window.storage.get('user-session', false),
          window.storage.get('subjects-data', false)
        ]);
        
        if (userResult?.value) {
          const userData = JSON.parse(userResult.value);
          setIsLoggedIn(true);
          setUserEmail(userData.email);
        }
        
        if (subjectsResult?.value) {
          setSubjects(JSON.parse(subjectsResult.value));
        }
      } catch (error) {
        console.log('First time user or storage unavailable');
      }
    };
    
    loadData();
  }, []);

  // Save subjects whenever they change
  useEffect(() => {
    if (subjects.length > 0 && isLoggedIn) {
      saveData();
    }
  }, [subjects, isLoggedIn]);

  const saveData = async () => {
    try {
      await window.storage.set('subjects-data', JSON.stringify(subjects), false);
    } catch (error) {
      console.error('Failed to save data:', error);
    }
  };

  const handleLogin = async (email) => {
    setUserEmail(email);
    setIsLoggedIn(true);
    try {
      await window.storage.set('user-session', JSON.stringify({ email }), false);
    } catch (error) {
      console.error('Failed to save session:', error);
    }
  };

  const handleLogout = async () => {
    setIsLoggedIn(false);
    setUserEmail('');
    setSubjects([]);
    setCurrentView('dashboard');
    try {
      await Promise.all([
        window.storage.delete('user-session', false),
        window.storage.delete('subjects-data', false)
      ]);
    } catch (error) {
      console.error('Failed to clear session:', error);
    }
  };

  const addSubject = () => {
    if (newSubjectName.trim()) {
      const colorIndex = subjects.length % subjectColors.length;
      const newSubject = {
        id: Date.now(),
        name: newSubjectName,
        color: subjectColors[colorIndex],
        tasks: []
      };
      setSubjects([...subjects, newSubject]);
      setNewSubjectName('');
      setShowAddSubject(false);
    }
  };

  const deleteSubject = (subjectId) => {
    setSubjects(subjects.filter(s => s.id !== subjectId));
  };

  const deleteTask = (subjectId, taskId) => {
    const updatedSubjects = subjects.map(subject => {
      if (subject.id === subjectId) {
        return {
          ...subject,
          tasks: subject.tasks.filter(task => task.id !== taskId)
        };
      }
      return subject;
    });
    setSubjects(updatedSubjects);
  };

  const addTask = () => {
    if (newTask.title.trim() && newTask.dueDate && newTask.subjectId) {
      const updatedSubjects = subjects.map(subject => {
        if (subject.id === newTask.subjectId) {
          const task = {
            id: Date.now(),
            title: newTask.title,
            dueDate: newTask.dueDate,
            links: newTask.links.filter(link => link.trim() !== ''),
            completed: false,
            createdAt: new Date().toISOString()
          };
          return { ...subject, tasks: [...subject.tasks, task] };
        }
        return subject;
      });
      
      setSubjects(updatedSubjects);
      setNewTask({ title: '', dueDate: '', links: [''], subjectId: null });
      setShowAddTask(false);
    }
  };

  const toggleTaskCompletion = (subjectId, taskId) => {
    const updatedSubjects = subjects.map(subject => {
      if (subject.id === subjectId) {
        return {
          ...subject,
          tasks: subject.tasks.map(task =>
            task.id === taskId ? { ...task, completed: !task.completed } : task
          )
        };
      }
      return subject;
    });
    setSubjects(updatedSubjects);
  };

  const addLinkField = () => {
    setNewTask({ ...newTask, links: [...newTask.links, ''] });
  };

  const updateLink = (index, value) => {
    const updatedLinks = [...newTask.links];
    updatedLinks[index] = value;
    setNewTask({ ...newTask, links: updatedLinks });
  };

  const removeLinkField = (index) => {
    const updatedLinks = newTask.links.filter((_, i) => i !== index);
    setNewTask({ ...newTask, links: updatedLinks.length ? updatedLinks : [''] });
  };

  const getDaysUntilDue = (dueDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getTaskStatus = (task) => {
    if (task.completed) return 'completed';
    const daysUntil = getDaysUntilDue(task.dueDate);
    if (daysUntil < 0) return 'overdue';
    if (daysUntil <= 1) return 'urgent';
    if (daysUntil <= 3) return 'soon';
    return 'normal';
  };

  const getAllTasks = () => {
    const allTasks = [];
    subjects.forEach(subject => {
      subject.tasks.forEach(task => {
        allTasks.push({ ...task, subjectName: subject.name, subjectId: subject.id });
      });
    });
    return allTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  };

  const getCompletedTasks = () => {
    return getAllTasks().filter(task => task.completed);
  };

  const getIncompleteTasks = () => {
    return getAllTasks().filter(task => !task.completed);
  };

  const toggleSubjectExpansion = (subjectId) => {
    setExpandedSubjects(prev => ({
      ...prev,
      [subjectId]: !prev[subjectId]
    }));
  };

  // Calendar functions
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const getTasksForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return getAllTasks().filter(task => task.dueDate === dateStr);
  };

  const hasTasksOnDate = (date) => {
    return getTasksForDate(date).length > 0;
  };

  const getTaskCountColor = (count) => {
    if (count >= 5) return 'bg-red-100 border-red-400 hover:border-red-500';
    if (count >= 3) return 'bg-yellow-100 border-yellow-400 hover:border-yellow-500';
    if (count > 0) return 'bg-green-100 border-green-400 hover:border-green-500';
    return 'border-gray-200 hover:border-gray-300 hover:bg-gray-50';
  };

  const changeMonth = (direction) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + direction, 1));
  };

  // Login Screen
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="bg-gradient-to-br from-yellow-400 to-amber-500 w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">TaskFlow</h1>
            <p className="text-gray-600">Your Junior College Companion</p>
          </div>
          
          <div className="space-y-4">
            <button
              onClick={() => handleLogin('student@example.com')}
              className="w-full bg-white border-2 border-gray-200 rounded-xl p-4 flex items-center justify-center gap-3 hover:border-yellow-400 hover:bg-yellow-50 transition-all"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="font-semibold text-gray-700">Continue with Gmail</span>
            </button>
            <p className="text-xs text-center text-gray-500">
              Demo mode: Click to sign in with a sample account
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Main App
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-100">
      {/* Header */}
      <div className="bg-white shadow-md border-b-4 border-yellow-400">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-yellow-400 to-amber-500 w-12 h-12 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">TaskFlow</h1>
                <p className="text-sm text-gray-600">{userEmail}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto py-2">
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`px-6 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                currentView === 'dashboard'
                  ? 'bg-yellow-400 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setCurrentView('calendar')}
              className={`px-6 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                currentView === 'calendar'
                  ? 'bg-yellow-400 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Calendar
            </button>
            <button
              onClick={() => setCurrentView('subjects')}
              className={`px-6 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                currentView === 'subjects'
                  ? 'bg-yellow-400 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Subjects
            </button>
            <button
              onClick={() => setCurrentView('completed')}
              className={`px-6 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                currentView === 'completed'
                  ? 'bg-yellow-400 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Completed
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Dashboard View */}
        {currentView === 'dashboard' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Upcoming Tasks</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowAddSubject(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-white rounded-lg font-medium transition-colors shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Subject</span>
                </button>
                <button
                  onClick={() => setShowAddTask(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-white rounded-lg font-medium transition-colors shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Task</span>
                </button>
              </div>
            </div>

            {getIncompleteTasks().length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center shadow-md">
                <div className="bg-yellow-100 w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Check className="w-10 h-10 text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">All caught up!</h3>
                <p className="text-gray-600">No pending tasks. Add a new subject or task to get started.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {getIncompleteTasks().map(task => {
                  const status = getTaskStatus(task);
                  const daysUntil = getDaysUntilDue(task.dueDate);
                  const subject = subjects.find(s => s.id === task.subjectId);
                  
                  return (
                    <div
                      key={task.id}
                      className={`bg-white rounded-xl p-4 shadow-md border-l-4 ${subject?.color?.border || 'border-gray-500'}`}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => toggleTaskCompletion(task.subjectId, task.id)}
                          className={`mt-1 w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                            task.completed
                              ? 'bg-green-500 border-green-500'
                              : 'border-gray-300 hover:border-yellow-400'
                          }`}
                        >
                          {task.completed && <Check className="w-4 h-4 text-white" />}
                        </button>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-800 mb-1">{task.title}</h3>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className={`px-3 py-1 ${subject?.color?.light || 'bg-gray-100'} ${subject?.color?.text || 'text-gray-800'} rounded-full text-xs font-medium`}>
                                  {task.subjectName}
                                </span>
                                {status === 'overdue' && (
                                  <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">
                                    OVERDUE
                                  </span>
                                )}
                                {status === 'urgent' && (
                                  <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium flex items-center gap-1">
                                    <Bell className="w-3 h-3" />
                                    Due {daysUntil === 0 ? 'today' : 'tomorrow'}
                                  </span>
                                )}
                                {status === 'soon' && (
                                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                                    Due in {daysUntil} days
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <div className="flex items-center gap-1 text-gray-600 text-sm">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(task.dueDate).toLocaleDateString('en-SG', { day: 'numeric', month: 'short' })}</span>
                              </div>
                            </div>
                          </div>
                          
                          {task.links.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {task.links.map((link, idx) => (
                                <a
                                  key={idx}
                                  href={link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-medium transition-colors"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                  <span>Link {idx + 1}</span>
                                </a>
                              ))}
                            </div>
                          )}
                          
                          <button
                            onClick={() => {
                              if (window.confirm('Delete this task?')) {
                                deleteTask(task.subjectId, task.id);
                              }
                            }}
                            className="mt-3 flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-medium transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Delete Task</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Calendar View */}
        {currentView === 'calendar' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Calendar</h2>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">
                  {currentMonth.toLocaleDateString('en-SG', { month: 'long', year: 'numeric' })}
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => changeMonth(-1)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 rotate-180" />
                  </button>
                  <button
                    onClick={() => {
                      setCurrentMonth(new Date());
                      setSelectedDate(null);
                    }}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                  >
                    Today
                  </button>
                  <button
                    onClick={() => changeMonth(1)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">
                {/* Day headers */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center font-semibold text-gray-600 text-sm py-2">
                    {day}
                  </div>
                ))}

                {/* Calendar days */}
                {(() => {
                  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth);
                  const days = [];
                  
                  // Empty cells before first day
                  for (let i = 0; i < startingDayOfWeek; i++) {
                    days.push(<div key={`empty-${i}`} className="aspect-square" />);
                  }
                  
                  // Days of the month
                  for (let day = 1; day <= daysInMonth; day++) {
                    const date = new Date(year, month, day);
                    const dateStr = date.toISOString().split('T')[0];
                    const tasksOnDay = getTasksForDate(date);
                    const isSelected = selectedDate === dateStr;
                    const isToday = new Date().toDateString() === date.toDateString();
                    
                    days.push(
                      <button
                        key={day}
                        onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                        className={`aspect-square p-2 rounded-lg border-2 transition-all relative ${
                          isSelected
                            ? 'border-yellow-400 bg-yellow-50 shadow-md'
                            : getTaskCountColor(tasksOnDay.length)
                        } ${isToday ? 'ring-2 ring-blue-400' : ''}`}
                      >
                        <span className={`text-sm font-medium ${
                          isToday ? 'text-blue-600 font-bold' : 'text-gray-800'
                        }`}>
                          {day}
                        </span>
                        {tasksOnDay.length > 0 && (
                          <div className="absolute bottom-1 left-0 right-0 flex justify-center gap-0.5">
                            {tasksOnDay.slice(0, 3).map((task, idx) => {
                              const subject = subjects.find(s => s.id === task.subjectId);
                              return (
                                <div
                                  key={idx}
                                  className={`w-1.5 h-1.5 rounded-full ${subject?.color?.bg || 'bg-gray-400'}`}
                                />
                              );
                            })}
                          </div>
                        )}
                      </button>
                    );
                  }
                  
                  return days;
                })()}
              </div>
            </div>

            {/* Selected Date Details */}
            {selectedDate && (
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Tasks for {new Date(selectedDate).toLocaleDateString('en-SG', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    timeZone: 'UTC'
                  })}
                </h3>
                
                {(() => {
                  const tasksForDate = getTasksForDate(new Date(selectedDate));
                  
                  if (tasksForDate.length === 0) {
                    return (
                      <div className="text-center py-8 text-gray-600">
                        <p>No tasks due on this day</p>
                      </div>
                    );
                  }
                  
                  return (
                    <div className="space-y-3">
                      {tasksForDate.map(task => {
                        const subject = subjects.find(s => s.id === task.subjectId);
                        const status = getTaskStatus(task);
                        
                        return (
                          <div
                            key={task.id}
                            className={`bg-white rounded-xl p-4 shadow-md border-l-4 ${subject?.color?.border || 'border-gray-500'}`}
                          >
                            <div className="flex items-start gap-3">
                              <button
                                onClick={() => toggleTaskCompletion(task.subjectId, task.id)}
                                className={`mt-1 w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                                  task.completed
                                    ? 'bg-green-500 border-green-500'
                                    : 'border-gray-300 hover:border-yellow-400'
                                }`}
                              >
                                {task.completed && <Check className="w-4 h-4 text-white" />}
                              </button>
                              
                              <div className="flex-1">
                                <h4 className={`font-semibold ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'} mb-2`}>
                                  {task.title}
                                </h4>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className={`px-3 py-1 ${subject?.color?.light || 'bg-gray-100'} ${subject?.color?.text || 'text-gray-800'} rounded-full text-xs font-medium`}>
                                    {task.subjectName}
                                  </span>
                                  {!task.completed && status === 'overdue' && (
                                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">
                                      OVERDUE
                                    </span>
                                  )}
                                </div>
                                {task.links.length > 0 && (
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {task.links.map((link, idx) => (
                                      <a
                                        key={idx}
                                        href={link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-medium transition-colors"
                                      >
                                        <ExternalLink className="w-3 h-3" />
                                        <span>Link {idx + 1}</span>
                                      </a>
                                    ))}
                                  </div>
                                )}
                                
                                <button
                                  onClick={() => {
                                    if (window.confirm('Delete this task?')) {
                                      deleteTask(task.subjectId, task.id);
                                    }
                                  }}
                                  className="mt-3 flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-medium transition-colors"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  <span>Delete Task</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        )}

        {/* Subjects View */}
        {currentView === 'subjects' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">My Subjects</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingSubjects(!editingSubjects)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors shadow-md ${
                    editingSubjects
                      ? 'bg-red-400 hover:bg-red-500 text-white'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                  }`}
                >
                  {editingSubjects ? (
                    <>
                      <X className="w-4 h-4" />
                      <span>Done</span>
                    </>
                  ) : (
                    <>
                      <span>Edit Subjects</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowAddSubject(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-white rounded-lg font-medium transition-colors shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Subject</span>
                </button>
              </div>
            </div>

            {subjects.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center shadow-md">
                <div className="bg-yellow-100 w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <BookOpen className="w-10 h-10 text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No subjects yet</h3>
                <p className="text-gray-600 mb-4">Start by adding your first subject</p>
                <button
                  onClick={() => setShowAddSubject(true)}
                  className="px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-white rounded-lg font-medium transition-colors"
                >
                  Add Subject
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {subjects.map(subject => {
                  const incompleteTasks = subject.tasks.filter(t => !t.completed);
                  const isExpanded = expandedSubjects[subject.id];
                  
                  return (
                    <div key={subject.id} className={`bg-white rounded-xl shadow-md overflow-hidden border-l-4 ${subject.color.border}`}>
                      <button
                        onClick={() => !editingSubjects && toggleSubjectExpansion(subject.id)}
                        className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          {!editingSubjects && (
                            <>
                              {isExpanded ? (
                                <ChevronDown className="w-5 h-5 text-gray-600" />
                              ) : (
                                <ChevronRight className="w-5 h-5 text-gray-600" />
                              )}
                            </>
                          )}
                          <div className={`w-3 h-3 rounded-full ${subject.color.bg}`}></div>
                          <div className="text-left">
                            <h3 className="font-semibold text-gray-800 text-lg">{subject.name}</h3>
                            <p className="text-sm text-gray-600">
                              {incompleteTasks.length} pending task{incompleteTasks.length !== 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>
                        {editingSubjects ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (window.confirm(`Delete "${subject.name}" and all its tasks?`)) {
                                deleteSubject(subject.id);
                              }
                            }}
                            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors text-sm flex items-center gap-2"
                          >
                            <X className="w-4 h-4" />
                            Delete
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setNewTask({ ...newTask, subjectId: subject.id });
                              setShowAddTask(true);
                            }}
                            className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-white rounded-lg font-medium transition-colors text-sm"
                          >
                            Add Task
                          </button>
                        )}
                      </button>
                      
                      {isExpanded && !editingSubjects && (
                        <div className="border-t border-gray-200 p-4 bg-gray-50">
                          {subject.tasks.length === 0 ? (
                            <p className="text-gray-600 text-center py-4">No tasks yet</p>
                          ) : (
                            <div className="space-y-2">
                              {subject.tasks.map(task => {
                                const status = getTaskStatus(task);
                                const daysUntil = getDaysUntilDue(task.dueDate);
                                
                                return (
                                  <div
                                    key={task.id}
                                    className={`bg-white rounded-lg p-3 border-l-4 ${subject.color.border}`}
                                  >
                                    <div className="flex items-start gap-3">
                                      <button
                                        onClick={() => toggleTaskCompletion(subject.id, task.id)}
                                        className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                                          task.completed
                                            ? 'bg-green-500 border-green-500'
                                            : 'border-gray-300 hover:border-yellow-400'
                                        }`}
                                      >
                                        {task.completed && <Check className="w-3 h-3 text-white" />}
                                      </button>
                                      
                                      <div className="flex-1">
                                        <h4 className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                                          {task.title}
                                        </h4>
                                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                                          <span className="text-xs text-gray-600 flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(task.dueDate).toLocaleDateString('en-SG')}
                                          </span>
                                          {!task.completed && status === 'overdue' && (
                                            <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs font-bold">
                                              OVERDUE
                                            </span>
                                          )}
                                        </div>
                                        {task.links.length > 0 && (
                                          <div className="flex flex-wrap gap-1 mt-2">
                                            {task.links.map((link, idx) => (
                                              <a
                                                key={idx}
                                                href={link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded text-xs font-medium transition-colors"
                                              >
                                                <ExternalLink className="w-3 h-3" />
                                                Link {idx + 1}
                                              </a>
                                            ))}
                                          </div>
                                        )}
                                        
                                        <button
                                          onClick={() => {
                                            if (window.confirm('Delete this task?')) {
                                              deleteTask(subject.id, task.id);
                                            }
                                          }}
                                          className="mt-2 flex items-center gap-1 px-2 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded text-xs font-medium transition-colors"
                                        >
                                          <Trash2 className="w-3 h-3" />
                                          Delete
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Completed View */}
        {currentView === 'completed' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Completed Tasks</h2>

            {getCompletedTasks().length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center shadow-md">
                <div className="bg-gray-100 w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Check className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No completed tasks</h3>
                <p className="text-gray-600">Completed tasks will appear here</p>
              </div>
            ) : (
              <div>
                {subjects.map(subject => {
                  const completedTasks = subject.tasks.filter(t => t.completed);
                  if (completedTasks.length === 0) return null;
                  
                  return (
                    <div key={subject.id} className="mb-6">
                      <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <div className={`w-3 h-3 ${subject.color.bg} rounded-full`}></div>
                        {subject.name}
                      </h3>
                      <div className="space-y-2">
                        {completedTasks.map(task => (
                          <div
                            key={task.id}
                            className={`bg-white rounded-xl p-4 shadow-md border-l-4 ${subject.color.border}`}
                          >
                            <div className="flex items-start gap-3">
                              <button
                                onClick={() => toggleTaskCompletion(subject.id, task.id)}
                                className="mt-1 w-6 h-6 rounded-lg border-2 bg-green-500 border-green-500 flex items-center justify-center flex-shrink-0"
                              >
                                <Check className="w-4 h-4 text-white" />
                              </button>
                              
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-500 line-through mb-1">{task.title}</h4>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Calendar className="w-4 h-4" />
                                  <span>Completed on {new Date(task.dueDate).toLocaleDateString('en-SG')}</span>
                                </div>
                                {task.links.length > 0 && (
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {task.links.map((link, idx) => (
                                      <a
                                        key={idx}
                                        href={link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-medium transition-colors"
                                      >
                                        <ExternalLink className="w-3 h-3" />
                                        Link {idx + 1}
                                      </a>
                                    ))}
                                  </div>
                                )}
                                
                                <button
                                  onClick={() => {
                                    if (window.confirm('Delete this completed task?')) {
                                      deleteTask(subject.id, task.id);
                                    }
                                  }}
                                  className="mt-3 flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-medium transition-colors"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  <span>Delete Task</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Subject Modal */}
      {showAddSubject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">Add New Subject</h3>
              <button
                onClick={() => {
                  setShowAddSubject(false);
                  setNewSubjectName('');
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject Name</label>
                <input
                  type="text"
                  value={newSubjectName}
                  onChange={(e) => setNewSubjectName(e.target.value)}
                  placeholder="e.g., Mathematics, Physics, Chemistry"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-400 focus:outline-none"
                  onKeyPress={(e) => e.key === 'Enter' && addSubject()}
                />
              </div>
              
              <button
                onClick={addSubject}
                disabled={!newSubjectName.trim()}
                className="w-full py-3 bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors"
              >
                Add Subject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      {showAddTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl my-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">Add New Task</h3>
              <button
                onClick={() => {
                  setShowAddTask(false);
                  setNewTask({ title: '', dueDate: '', links: [''], subjectId: null });
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <select
                  value={newTask.subjectId || ''}
                  onChange={(e) => setNewTask({ ...newTask, subjectId: Number(e.target.value) })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-400 focus:outline-none"
                >
                  <option value="">Select a subject</option>
                  {subjects.map(subject => (
                    <option key={subject.id} value={subject.id}>{subject.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Task Title</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="e.g., Watch Lecture 5: Calculus"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-400 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-400 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tutorial Links (Optional)</label>
                <div className="space-y-2">
                  {newTask.links.map((link, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="url"
                        value={link}
                        onChange={(e) => updateLink(index, e.target.value)}
                        placeholder="https://example.com/lecture"
                        className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-400 focus:outline-none"
                      />
                      {newTask.links.length > 1 && (
                        <button
                          onClick={() => removeLinkField(index)}
                          className="p-3 bg-red-100 hover:bg-red-200 text-red-600 rounded-xl transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={addLinkField}
                    className="w-full py-2 border-2 border-dashed border-gray-300 hover:border-yellow-400 text-gray-600 hover:text-yellow-600 rounded-xl font-medium transition-colors"
                  >
                    + Add Another Link
                  </button>
                </div>
              </div>
              
              <button
                onClick={addTask}
                disabled={!newTask.title.trim() || !newTask.dueDate || !newTask.subjectId}
                className="w-full py-3 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors shadow-md"
              >
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
